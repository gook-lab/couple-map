import {
  collection, addDoc, query, where, orderBy, onSnapshot, updateDoc, doc, serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export interface AppNotification {
  id: string;
  userId: string;
  type: "memory" | "anniversary" | "comment" | "like" | "location";
  icon: string;
  title: string;
  body: string;
  read: boolean;
  data?: Record<string, string>;
  createdAt: Date;
}

export async function createNotification(data: Omit<AppNotification, "id" | "createdAt" | "read">): Promise<string> {
  const ref = await addDoc(collection(db, "notifications"), {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function markAsRead(notificationId: string): Promise<void> {
  await updateDoc(doc(db, "notifications", notificationId), { read: true });
}

export function subscribeNotifications(userId: string, callback: (notifications: AppNotification[]) => void): Unsubscribe {
  const q = query(collection(db, "notifications"), where("userId", "==", userId), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
    })) as AppNotification[]);
  });
}
