import {
  collection, addDoc, query, where, onSnapshot, serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export interface DailyAnswer {
  id: string;
  coupleId: string;
  questionIndex: number;
  authorId: string;
  answer: string;
  createdAt: Date;
}

export async function submitDailyAnswer(
  data: Omit<DailyAnswer, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "dailyAnswers"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export function subscribeDailyAnswers(
  coupleId: string,
  questionIndex: number,
  callback: (answers: DailyAnswer[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "dailyAnswers"),
    where("coupleId", "==", coupleId),
    where("questionIndex", "==", questionIndex)
  );
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
      })) as DailyAnswer[]
    );
  });
}
