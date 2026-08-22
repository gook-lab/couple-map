import {
  collection, addDoc, doc, getDoc, updateDoc, query, where, orderBy, onSnapshot, serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Letter {
  id: string;
  coupleId: string;
  authorId: string;
  recipientId: string;
  content: string;
  attachments: string[];
  scheduledAt: Date;
  deliveredAt: Date | null;
  read: boolean;
  createdAt: Date;
}

export async function createLetter(data: Omit<Letter, "id" | "createdAt" | "deliveredAt" | "read">): Promise<string> {
  const ref = await addDoc(collection(db, "letters"), {
    ...data,
    deliveredAt: null,
    read: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function markLetterRead(id: string): Promise<void> {
  await updateDoc(doc(db, "letters", id), { read: true });
}

export async function getLetter(id: string): Promise<Letter | null> {
  const snap = await getDoc(doc(db, "letters", id));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    ...data,
    scheduledAt: data.scheduledAt?.toDate?.() ?? new Date(),
    deliveredAt: data.deliveredAt?.toDate?.() ?? null,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
  } as Letter;
}

export function subscribeLetters(coupleId: string, callback: (letters: Letter[]) => void): Unsubscribe {
  const q = query(collection(db, "letters"), where("coupleId", "==", coupleId), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      scheduledAt: d.data().scheduledAt?.toDate?.() ?? new Date(),
      deliveredAt: d.data().deliveredAt?.toDate?.() ?? null,
      createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
    })) as Letter[]);
  });
}
