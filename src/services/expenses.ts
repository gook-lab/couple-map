import {
  collection, addDoc, deleteDoc, doc,
  query, where, orderBy, onSnapshot, serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Expense {
  id: string;
  coupleId: string;
  title: string;
  amount: number;
  payerId: string;
  emoji: string;
  createdAt: Date;
}

export async function addExpense(
  data: Omit<Expense, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "expenses"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteExpense(id: string): Promise<void> {
  await deleteDoc(doc(db, "expenses", id));
}

export function subscribeExpenses(
  coupleId: string,
  callback: (items: Expense[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "expenses"),
    where("coupleId", "==", coupleId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
      })) as Expense[]
    );
  });
}
