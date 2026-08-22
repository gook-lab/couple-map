/**
 * Firestore 보안규칙 에뮬레이터 테스트.
 *
 * 실행: npm run test:rules
 * (firebase emulators:exec가 FIRESTORE_EMULATOR_HOST를 설정해줌 —
 *  에뮬레이터 없이 vitest 전체 실행 시에는 자동 스킵)
 */
import { describe, it, beforeAll, afterAll, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";

const hasEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;

const ALICE = "alice-uid";
const BOB = "bob-uid";
const EVE = "eve-uid";
const COUPLE = "couple-ab";
const EVE_COUPLE = "couple-ee";

let testEnv: RulesTestEnvironment;

const db = (uid: string) => testEnv.authenticatedContext(uid).firestore();

describe.skipIf(!hasEmulator)("firestore.rules — 커플 스코프", () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "couple-rules-test",
      firestore: {
        rules: readFileSync(resolve(__dirname, "../../../firestore.rules"), "utf8"),
      },
    });
  });

  afterAll(async () => {
    await testEnv?.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const admin = ctx.firestore();
      await setDoc(doc(admin, "couples", COUPLE), { users: [ALICE, BOB] });
      await setDoc(doc(admin, "couples", EVE_COUPLE), { users: [EVE, "someone-else"] });
      await setDoc(doc(admin, "savedPlaces", "p1"), {
        coupleId: COUPLE, name: "성수 카페", savedAt: new Date(),
      });
      await setDoc(doc(admin, "memories", "m1"), {
        coupleId: COUPLE, authorId: ALICE, title: "첫 데이트",
      });
      await setDoc(doc(admin, "inviteCodes", "CODE1"), {
        creatorId: ALICE, used: false, expiresAt: new Date(Date.now() + 86400000),
      });
      await setDoc(doc(admin, "letters", "l1"), { coupleId: COUPLE, body: "편지" });
      await setDoc(doc(admin, "anniversaries", "a1"), { coupleId: COUPLE, title: "100일" });
      await setDoc(doc(admin, "wishlists", "w1"), { coupleId: COUPLE, title: "제주" });
      await setDoc(doc(admin, "chat", COUPLE, "messages", "msg1"), {
        coupleId: COUPLE, authorId: ALICE, text: "안녕",
      });
    });
  });

  // ── savedPlaces ──
  it("커플 멤버는 자기 커플 장소를 쿼리할 수 있다", async () => {
    await assertSucceeds(
      getDocs(query(collection(db(BOB), "savedPlaces"), where("coupleId", "==", COUPLE), orderBy("savedAt", "desc")))
    );
  });

  it("제3자는 타 커플 장소 쿼리/단건 읽기가 거부된다", async () => {
    await assertFails(
      getDocs(query(collection(db(EVE), "savedPlaces"), where("coupleId", "==", COUPLE), orderBy("savedAt", "desc")))
    );
    await assertFails(getDoc(doc(db(EVE), "savedPlaces", "p1")));
  });

  it("커플 멤버는 자기 coupleId로 장소를 생성할 수 있다", async () => {
    await assertSucceeds(
      setDoc(doc(db(ALICE), "savedPlaces", "p2"), { coupleId: COUPLE, name: "새 장소", savedAt: new Date() })
    );
  });

  it("제3자는 타 커플 coupleId로 장소 생성이 거부된다", async () => {
    await assertFails(
      setDoc(doc(db(EVE), "savedPlaces", "p3"), { coupleId: COUPLE, name: "위조", savedAt: new Date() })
    );
  });

  it("장소의 coupleId 변경은 거부된다", async () => {
    await assertFails(updateDoc(doc(db(ALICE), "savedPlaces", "p1"), { coupleId: EVE_COUPLE }));
  });

  // ── memories ──
  it("커플 멤버는 추억을 읽고, 제3자는 거부된다", async () => {
    await assertSucceeds(getDoc(doc(db(BOB), "memories", "m1")));
    await assertFails(getDoc(doc(db(EVE), "memories", "m1")));
  });

  it("작성자만 추억을 수정할 수 있다", async () => {
    await assertSucceeds(updateDoc(doc(db(ALICE), "memories", "m1"), { title: "수정" }));
    await assertFails(updateDoc(doc(db(BOB), "memories", "m1"), { title: "남의 글 수정" }));
  });

  // ── inviteCodes ──
  it("본인 uid로만 초대코드를 생성할 수 있다", async () => {
    await assertSucceeds(
      setDoc(doc(db(ALICE), "inviteCodes", "NEW1"), { creatorId: ALICE, used: false, expiresAt: new Date() })
    );
    await assertFails(
      setDoc(doc(db(EVE), "inviteCodes", "FAKE1"), { creatorId: ALICE, used: false, expiresAt: new Date() })
    );
  });

  it("상대방은 소비 전이(used:false→true + coupleId)만 할 수 있다", async () => {
    // 정상 소비: bob이 자신이 속한 커플 문서를 가리키며 소비
    await assertSucceeds(updateDoc(doc(db(BOB), "inviteCodes", "CODE1"), { used: true, coupleId: COUPLE }));
  });

  it("본인 코드 소비, 타 필드 변조, 남의 커플 지정은 거부된다", async () => {
    await assertFails(updateDoc(doc(db(ALICE), "inviteCodes", "CODE1"), { used: true, coupleId: COUPLE }));
    await assertFails(updateDoc(doc(db(EVE), "inviteCodes", "CODE1"), { creatorId: EVE }));
    await assertFails(updateDoc(doc(db(EVE), "inviteCodes", "CODE1"), { used: true, coupleId: COUPLE }));
  });

  it("초대코드 삭제는 작성자만 가능하다", async () => {
    await assertFails(deleteDoc(doc(db(EVE), "inviteCodes", "CODE1")));
    await assertSucceeds(deleteDoc(doc(db(ALICE), "inviteCodes", "CODE1")));
  });

  // ── couples ──
  it("본인이 포함된 2인 커플만 생성할 수 있다", async () => {
    await assertSucceeds(setDoc(doc(db(ALICE), "couples", "c-new"), { users: [ALICE, EVE] }));
    await assertFails(setDoc(doc(db(EVE), "couples", "c-forged"), { users: [ALICE, BOB] }));
    await assertFails(setDoc(doc(db(EVE), "couples", "c-solo"), { users: [EVE] }));
  });

  // ── 구세대 컬렉션 (letters/anniversaries/wishlists/chat) ──
  it("letters/anniversaries/wishlists: 멤버는 읽고 제3자는 거부된다", async () => {
    await assertSucceeds(getDoc(doc(db(BOB), "letters", "l1")));
    await assertFails(getDoc(doc(db(EVE), "letters", "l1")));
    await assertSucceeds(getDoc(doc(db(ALICE), "anniversaries", "a1")));
    await assertFails(getDoc(doc(db(EVE), "anniversaries", "a1")));
    await assertSucceeds(getDoc(doc(db(BOB), "wishlists", "w1")));
    await assertFails(getDoc(doc(db(EVE), "wishlists", "w1")));
  });

  it("chat: 경로 coupleId 멤버만 읽고 쓸 수 있다", async () => {
    await assertSucceeds(getDoc(doc(db(ALICE), "chat", COUPLE, "messages", "msg1")));
    await assertSucceeds(
      setDoc(doc(db(BOB), "chat", COUPLE, "messages", "msg2"), { coupleId: COUPLE, authorId: BOB, text: "답장" })
    );
    await assertFails(getDoc(doc(db(EVE), "chat", COUPLE, "messages", "msg1")));
    await assertFails(
      setDoc(doc(db(EVE), "chat", COUPLE, "messages", "msg3"), { coupleId: COUPLE, authorId: EVE, text: "침입" })
    );
  });
});
