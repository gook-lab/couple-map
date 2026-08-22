import { doc, setDoc, deleteDoc, onSnapshot, collection, type Unsubscribe } from "firebase/firestore";
import { db } from "./firebase";

export interface Reaction {
  userId: string;
  emoji: string;
  createdAt: Date;
}

export async function setReaction(memoryId: string, userId: string, emoji: string): Promise<void> {
  await setDoc(doc(db, "memories", memoryId, "reactions", userId), {
    userId,
    emoji,
    createdAt: new Date(),
  });
}

export async function removeReaction(memoryId: string, userId: string): Promise<void> {
  await deleteDoc(doc(db, "memories", memoryId, "reactions", userId));
}

export function subscribeReactions(memoryId: string, callback: (reactions: Reaction[]) => void): Unsubscribe {
  return onSnapshot(collection(db, "memories", memoryId, "reactions"), (snap) => {
    callback(snap.docs.map((d) => ({
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
    })) as Reaction[]);
  });
}
