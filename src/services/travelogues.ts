import {
  collection, addDoc, deleteDoc, doc,
  query, where, orderBy, onSnapshot, serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export interface TraveloguePage {
  title: string;
  date: string;
}

export interface Travelogue {
  id: string;
  coupleId: string;
  title: string;
  coverStyle: string;
  pages: TraveloguePage[];
  createdAt: Date;
}

export async function publishTravelogue(
  data: Omit<Travelogue, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "travelogues"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteTravelogue(id: string): Promise<void> {
  await deleteDoc(doc(db, "travelogues", id));
}

export function subscribeTravelogues(
  coupleId: string,
  callback: (items: Travelogue[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "travelogues"),
    where("coupleId", "==", coupleId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
      })) as Travelogue[]
    );
  });
}
