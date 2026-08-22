import {
  collection, doc, setDoc, onSnapshot, query, where, serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export interface ChallengeCompletion {
  challengeIndex: number;
  completedAt: Date;
}

// 문서 ID = `${coupleId}_${challengeIndex}` — 챌린지당 1회 완료(멱등)
export async function markChallengeDone(coupleId: string, challengeIndex: number): Promise<void> {
  await setDoc(doc(db, "challengeCompletions", `${coupleId}_${challengeIndex}`), {
    coupleId,
    challengeIndex,
    completedAt: serverTimestamp(),
  });
}

export function subscribeChallengeProgress(
  coupleId: string,
  callback: (completed: ChallengeCompletion[]) => void
): Unsubscribe {
  const q = query(collection(db, "challengeCompletions"), where("coupleId", "==", coupleId));
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({
        challengeIndex: d.data().challengeIndex as number,
        completedAt: d.data().completedAt?.toDate?.() ?? new Date(),
      }))
    );
  });
}
