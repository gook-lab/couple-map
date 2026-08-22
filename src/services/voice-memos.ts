import {
  collection, addDoc, deleteDoc, doc,
  query, where, orderBy, onSnapshot, serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export interface VoiceMemo {
  id: string;
  coupleId: string;
  authorId: string;
  audioUrl: string;
  durationSec: number;
  createdAt: Date;
}

export async function addVoiceMemo(
  data: Omit<VoiceMemo, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "voiceMemos"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteVoiceMemo(id: string): Promise<void> {
  await deleteDoc(doc(db, "voiceMemos", id));
}

export function subscribeVoiceMemos(
  coupleId: string,
  callback: (items: VoiceMemo[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "voiceMemos"),
    where("coupleId", "==", coupleId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
      })) as VoiceMemo[]
    );
  });
}
