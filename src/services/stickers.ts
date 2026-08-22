import {
  collection, addDoc, deleteDoc, doc,
  query, where, orderBy, onSnapshot, serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Sticker {
  id: string;
  coupleId: string;
  emoji: string;
  region: string;
  shape: string;
  color: string;
  createdAt: Date;
}

export async function addSticker(
  data: Omit<Sticker, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "stickers"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteSticker(id: string): Promise<void> {
  await deleteDoc(doc(db, "stickers", id));
}

export function subscribeStickers(
  coupleId: string,
  callback: (items: Sticker[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "stickers"),
    where("coupleId", "==", coupleId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
      })) as Sticker[]
    );
  });
}
