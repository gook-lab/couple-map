import {
  collection, addDoc, deleteDoc, doc,
  query, where, orderBy, onSnapshot, serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Expense {
  id: string;
  coupleId: string;
  date: Date; // 지출 날짜 (사용자가 선택)
  amount: number; // 양의 정수, 원 단위
  paidBy: string; // 지출한 사람의 uid
  memo?: string; // 선택 사항
  visitId?: string; // 장소 방문 참조 (선택)
  createdAt: Date; // 작성 시간
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
