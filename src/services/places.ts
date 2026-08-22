import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  type QueryDocumentSnapshot,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Place } from "@/types/place";

const COLLECTION = "savedPlaces";

function mapPlaceDoc(snapshot: QueryDocumentSnapshot<DocumentData>): Place {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    savedAt: data.savedAt?.toDate() ?? new Date(),
    visitedAt: (data.visitedAt ?? []).map((d: { toDate?: () => Date }) =>
      d?.toDate ? d.toDate() : new Date(d as unknown as string)
    ),
  } as Place;
}

function placesQuery(coupleId: string) {
  return query(
    collection(db, COLLECTION),
    where("coupleId", "==", coupleId),
    orderBy("savedAt", "desc")
  );
}

export async function savePlace(
  place: Omit<Place, "id" | "savedAt">
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...place,
    savedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function deletePlace(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function updatePlace(
  id: string,
  updates: Partial<Omit<Place, "id">>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), updates);
}

export async function getPlaces(coupleId: string): Promise<Place[]> {
  const snapshot = await getDocs(placesQuery(coupleId));
  return snapshot.docs.map(mapPlaceDoc);
}

export function subscribePlaces(
  coupleId: string,
  callback: (places: Place[]) => void
): Unsubscribe {
  return onSnapshot(placesQuery(coupleId), (snapshot) => {
    callback(snapshot.docs.map(mapPlaceDoc));
  });
}
