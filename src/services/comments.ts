import {
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp,
  doc, updateDoc, increment,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Comment {
  id: string;
  memoryId: string;
  authorId: string;
  authorName: string;
  text: string;
  photo?: string;
  createdAt: Date;
}

export async function addComment(memoryId: string, data: Omit<Comment, "id" | "createdAt">): Promise<string> {
  const ref = await addDoc(collection(db, "memories", memoryId, "comments"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "memories", memoryId), { commentCount: increment(1) });
  return ref.id;
}

export function subscribeComments(memoryId: string, callback: (comments: Comment[]) => void): Unsubscribe {
  const q = query(collection(db, "memories", memoryId, "comments"), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
    })) as Comment[]);
  });
}
