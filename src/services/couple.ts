import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createInviteCode(userId: string): Promise<string> {
  const existing = await getDocs(
    query(collection(db, "inviteCodes"), where("creatorId", "==", userId))
  );
  existing.forEach((d) => deleteDoc(d.ref));

  const code = generateCode();
  await setDoc(doc(db, "inviteCodes", code), {
    creatorId: userId,
    createdAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    used: false,
  });
  return code;
}

export async function joinCouple(
  code: string,
  userId: string
): Promise<string> {
  const codeDoc = await getDoc(doc(db, "inviteCodes", code.toUpperCase()));

  if (!codeDoc.exists()) throw new Error("존재하지 않는 코드에요");
  const data = codeDoc.data();
  if (data.used) throw new Error("이미 사용된 코드에요");
  if (data.expiresAt.toDate() < new Date()) throw new Error("만료된 코드에요");
  if (data.creatorId === userId) throw new Error("본인이 만든 코드에요");

  const coupleId = `couple_${Date.now()}`;
  await setDoc(doc(db, "couples", coupleId), {
    users: [data.creatorId, userId],
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "inviteCodes", code.toUpperCase()), {
    used: true,
    coupleId,
  });

  return coupleId;
}

export async function getCoupleId(userId: string): Promise<string | null> {
  const q = query(
    collection(db, "couples"),
    where("users", "array-contains", userId)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return snapshot.docs[0].id;
}

export async function getPartnerInfo(
  coupleId: string,
  myUserId: string
): Promise<string | null> {
  const coupleDoc = await getDoc(doc(db, "couples", coupleId));
  if (!coupleDoc.exists()) return null;
  const users = coupleDoc.data().users as string[];
  return users.find((id) => id !== myUserId) || null;
}
