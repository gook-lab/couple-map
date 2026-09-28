import { describe, it, expect } from "vitest";
import {
  calcNetBalance,
  getSettlement,
  calculateSettlement,
} from "@/lib/expense-split";
import type { Expense } from "@/services/expenses";

const userA = "user-a-uid";
const userB = "user-b-uid";
const coupleId = "couple-id";

describe("calcNetBalance", () => {
  it("한쪽만 낸 경우: userA가 100원, userB가 0원", () => {
    const expenses: Expense[] = [
      {
        id: "1",
        coupleId,
        date: new Date(),
        amount: 100,
        paidBy: userA,
        createdAt: new Date(),
      },
    ];
    const result = calcNetBalance(expenses, [userA, userB]);
    expect(result.userA).toBe(50); // 100 - 50
    expect(result.userB).toBe(-50); // 0 - 50
  });

  it("양쪽이 낸 경우: 각각 반반 낸 상황", () => {
    const expenses: Expense[] = [
      {
        id: "1",
        coupleId,
        date: new Date(),
        amount: 100,
        paidBy: userA,
        createdAt: new Date(),
      },
      {
        id: "2",
        coupleId,
        date: new Date(),
        amount: 100,
        paidBy: userB,
        createdAt: new Date(),
      },
    ];
    const result = calcNetBalance(expenses, [userA, userB]);
    expect(result.userA).toBe(0);
    expect(result.userB).toBe(0);
  });

  it("홀수 원 나눗셈: 1원 나눗셈 시 floor 적용", () => {
    const expenses: Expense[] = [
      {
        id: "1",
        coupleId,
        date: new Date(),
        amount: 1,
        paidBy: userA,
        createdAt: new Date(),
      },
    ];
    const result = calcNetBalance(expenses, [userA, userB]);
    expect(result.userA).toBe(1); // 1 - 0 (floor(1/2) = 0)
    expect(result.userB).toBe(0); // 0 - 0
  });

  it("0원 경우", () => {
    const expenses: Expense[] = [];
    const result = calcNetBalance(expenses, [userA, userB]);
    expect(result.userA).toBe(0);
    expect(result.userB).toBe(0);
  });

  it("복잡한 경우: 총 5개 지출 혼합", () => {
    const expenses: Expense[] = [
      {
        id: "1",
        coupleId,
        date: new Date(),
        amount: 50000,
        paidBy: userA,
        createdAt: new Date(),
      },
      {
        id: "2",
        coupleId,
        date: new Date(),
        amount: 30000,
        paidBy: userB,
        createdAt: new Date(),
      },
      {
        id: "3",
        coupleId,
        date: new Date(),
        amount: 20000,
        paidBy: userA,
        createdAt: new Date(),
      },
      {
        id: "4",
        coupleId,
        date: new Date(),
        amount: 40000,
        paidBy: userB,
        createdAt: new Date(),
      },
      {
        id: "5",
        coupleId,
        date: new Date(),
        amount: 10000,
        paidBy: userA,
        createdAt: new Date(),
      },
    ];
    // 총: 150000, 반: 75000
    // A: 80000, B: 70000
    // A의 순 정산액: 80000 - 75000 = 5000
    // B의 순 정산액: 70000 - 75000 = -5000
    const result = calcNetBalance(expenses, [userA, userB]);
    expect(result.userA).toBe(5000);
    expect(result.userB).toBe(-5000);
  });
});

describe("getSettlement", () => {
  it("정산 필요 없음 (0원)", () => {
    const balance = { userA: 0, userB: 0 };
    const result = getSettlement(balance, [userA, userB]);
    expect(result).toBeNull();
  });

  it("userA가 userB에게 보내야 함", () => {
    const balance = { userA: 12000, userB: -12000 };
    const result = getSettlement(balance, [userA, userB]);
    expect(result).toEqual({
      from: userA,
      to: userB,
      amount: 12000,
    });
  });

  it("userB가 userA에게 보내야 함", () => {
    const balance = { userA: -12000, userB: 12000 };
    const result = getSettlement(balance, [userA, userB]);
    expect(result).toEqual({
      from: userB,
      to: userA,
      amount: 12000,
    });
  });
});

describe("calculateSettlement (통합)", () => {
  it("한쪽만 낸 경우에서 정산 한 줄 추출", () => {
    const expenses: Expense[] = [
      {
        id: "1",
        coupleId,
        date: new Date(),
        amount: 100000,
        paidBy: userA,
        createdAt: new Date(),
      },
    ];
    const result = calculateSettlement(expenses, [userA, userB]);
    expect(result).toEqual({
      from: userA,
      to: userB,
      amount: 50000,
    });
  });

  it("반반 낸 경우 정산 필요 없음", () => {
    const expenses: Expense[] = [
      {
        id: "1",
        coupleId,
        date: new Date(),
        amount: 100000,
        paidBy: userA,
        createdAt: new Date(),
      },
      {
        id: "2",
        coupleId,
        date: new Date(),
        amount: 100000,
        paidBy: userB,
        createdAt: new Date(),
      },
    ];
    const result = calculateSettlement(expenses, [userA, userB]);
    expect(result).toBeNull();
  });
});
