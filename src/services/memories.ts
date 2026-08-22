import {
  collection, addDoc, deleteDoc, updateDoc, doc,
  query, where, orderBy, onSnapshot, serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Memory {
  id: string;
  coupleId: string;
  authorId: string;
  title: string;
  diary: string;
  photos: string[];
  tags: string[];
  mood: string | null;
  weather: string | null;
  privacy: "couple" | "private" | "friends";
  location: { name: string; lat: number; lng: number; region: string; country: string };
  date: Date;
  createdAt: Date;
  reactions: Record<string, string>;
  commentCount: number;
}

const COL = "memories";

export async function createMemory(data: Omit<Memory, "id" | "createdAt" | "reactions" | "commentCount">): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    reactions: {},
    commentCount: 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateMemory(id: string, updates: Partial<Memory>): Promise<void> {
  await updateDoc(doc(db, COL, id), updates);
}

export async function deleteMemory(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

export function subscribeMemories(coupleId: string, callback: (memories: Memory[]) => void): Unsubscribe {
  const q = query(collection(db, COL), where("coupleId", "==", coupleId), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      date: d.data().date?.toDate?.() ?? new Date(),
      createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
    })) as Memory[]);
  });
}
