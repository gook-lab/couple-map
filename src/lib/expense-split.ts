import type { Expense } from "@/services/expenses";

/**
 * 커플 두 사람 간 정산 결과
 * - positive: amount 만큼 보내는 사람이 이겨야 함
 * - negative: 그 반대
 */
export interface NetBalance {
  userA: number;
  userB: number;
}

/**
 * 한 줄 정산 항목
 */
export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

/**
 * 지출 목록에서 두 사람 간 순 정산액 계산
 * @param expenses 지출 배열
 * @returns { userA, userB } — userA의 순 지출액과 userB의 순 지출액
 *
 * 예:
 * - userA가 100,000원 냈으면 userA = 100000, userB = 0
 * - userB가 50,000원 냈으면 userA = 100000, userB = 50000
 * - 반반 분담 후 userA는 -25000, userB는 25000
 */
export function calcNetBalance(
  expenses: Expense[],
  userIds: [string, string]
): NetBalance {
  const [userA] = userIds;
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const share = Math.floor(total / 2);

  const paidByA = expenses
    .filter((exp) => exp.paidBy === userA)
    .reduce((sum, exp) => sum + exp.amount, 0);

  const paidByB = total - paidByA;

  return {
    userA: paidByA - share,
    userB: paidByB - share,
  };
}

/**
 * 순 정산액에서 한 줄 정산 항목 추출
 * @param balance calcNetBalance() 결과
 * @returns Settlement 또는 null (정산 필요 없을 때)
 *
 * 예: { userA: 12000, userB: -12000 } → { from: userA, to: userB, amount: 12000 }
 */
export function getSettlement(
  balance: NetBalance,
  userIds: [string, string]
): Settlement | null {
  const [userA, userB] = userIds;

  if (balance.userA === 0) return null;

  if (balance.userA > 0) {
    return {
      from: userA,
      to: userB,
      amount: balance.userA,
    };
  } else {
    return {
      from: userB,
      to: userA,
      amount: -balance.userA,
    };
  }
}

/**
 * 지출 배열에서 정산 한 줄 추출 (편의 함수)
 */
export function calculateSettlement(
  expenses: Expense[],
  userIds: [string, string]
): Settlement | null {
  const balance = calcNetBalance(expenses, userIds);
  return getSettlement(balance, userIds);
}
