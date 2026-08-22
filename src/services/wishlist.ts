import {
  collection, addDoc, deleteDoc, updateDoc, doc,
  query, where, orderBy, onSnapshot, serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export interface WishlistItem {
  id: string;
  coupleId: string;
  authorId: string;
  title: string;
  price?: string;
  url?: string;
  photo?: string;
  purchased: boolean;
  createdAt: Date;
}

export async function addWishlistItem(data: Omit<WishlistItem, "id" | "createdAt" | "purchased">): Promise<string> {
  const ref = await addDoc(collection(db, "wishlists"), { ...data, purchased: false, createdAt: serverTimestamp() });
  return ref.id;
}

export async function togglePurchased(id: string, purchased: boolean): Promise<void> {
  await updateDoc(doc(db, "wishlists", id), { purchased });
}

export async function deleteWishlistItem(id: string): Promise<void> {
  await deleteDoc(doc(db, "wishlists", id));
}

export function subscribeWishlist(coupleId: string, callback: (items: WishlistItem[]) => void): Unsubscribe {
  const q = query(collection(db, "wishlists"), where("coupleId", "==", coupleId), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
    })) as WishlistItem[]);
  });
}
