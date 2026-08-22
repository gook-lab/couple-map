import { deleteUser } from "firebase/auth";
import { doc, deleteDoc, getDocs, query, collection, where, writeBatch } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function disconnectCouple(coupleId: string, userId: string): Promise<void> {
  const batch = writeBatch(db);
  batch.delete(doc(db, "couples", coupleId));
  // 본인 user 문서의 coupleId 해제 (보안 규칙상 파트너 문서는 수정 불가 —
  // 파트너 앱은 커플 문서가 사라진 것을 감지해 자체적으로 정리한다)
  batch.update(doc(db, "users", userId), { coupleId: null });

  const codesSnap = await getDocs(query(collection(db, "inviteCodes"), where("coupleId", "==", coupleId)));
  codesSnap.forEach((d) => batch.delete(d.ref));

  await batch.commit();
}

export async function deleteAccount(userId: string, coupleId: string | null): Promise<void> {
  if (coupleId) {
    await disconnectCouple(coupleId, userId);
  }

  const userDoc = doc(db, "users", userId);
  await deleteDoc(userDoc);

  const placesSnap = await getDocs(query(collection(db, "savedPlaces")));
  const batch = writeBatch(db);
  placesSnap.forEach((d) => batch.delete(d.ref));
  await batch.commit();

  const user = auth.currentUser;
  if (user) {
    await deleteUser(user);
  }
}
