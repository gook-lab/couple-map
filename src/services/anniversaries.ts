import {
  collection, addDoc, deleteDoc, updateDoc, doc,
  query, where, orderBy, onSnapshot, serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Anniversary {
  id: string;
  coupleId: string;
  title: string;
  date: Date;
  type: "anniversary" | "birthday" | "custom";
  emoji: string;
}

export async function createAnniversary(data: Omit<Anniversary, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "anniversaries"), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateAnniversary(id: string, updates: Partial<Anniversary>): Promise<void> {
  await updateDoc(doc(db, "anniversaries", id), updates);
}

export async function deleteAnniversary(id: string): Promise<void> {
  await deleteDoc(doc(db, "anniversaries", id));
}

export function subscribeAnniversaries(coupleId: string, callback: (items: Anniversary[]) => void): Unsubscribe {
  const q = query(collection(db, "anniversaries"), where("coupleId", "==", coupleId), orderBy("date", "asc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      date: d.data().date?.toDate?.() ?? new Date(),
    })) as Anniversary[]);
  });
}
