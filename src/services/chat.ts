import {
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export interface ChatMessage {
  id: string;
  coupleId: string;
  authorId: string;
  text: string;
  photo?: string;
  reaction?: string;
  createdAt: Date;
}

export async function sendMessage(coupleId: string, authorId: string, text: string, photo?: string): Promise<string> {
  const ref = await addDoc(collection(db, "chat", coupleId, "messages"), {
    coupleId,
    authorId,
    text,
    ...(photo ? { photo } : {}),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function addReactionToMessage(coupleId: string, messageId: string, emoji: string): Promise<void> {
  const { updateDoc, doc } = await import("firebase/firestore");
  await updateDoc(doc(db, "chat", coupleId, "messages", messageId), { reaction: emoji });
}

export function subscribeChat(coupleId: string, callback: (messages: ChatMessage[]) => void, messageLimit = 50): Unsubscribe {
  const q = query(
    collection(db, "chat", coupleId, "messages"),
    orderBy("createdAt", "asc"),
    limit(messageLimit)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
    })) as ChatMessage[]);
  });
}
