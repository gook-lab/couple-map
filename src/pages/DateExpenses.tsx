import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { format, isSameMonth } from "date-fns";
import { ko } from "date-fns/locale";
import { doc, getDoc } from "firebase/firestore";
import { Body, Meta, Tiny } from "@/components/ui/typography";
import GlassList from "@/components/ui/glass-list";
import AppInput from "@/components/ui/app-input";
import AppButton from "@/components/ui/app-button";
import EmptyState from "@/components/ui/empty-state";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { useAuthStore } from "@/store/use-auth-store";
import { db } from "@/services/firebase";
import { subscribeExpenses, addExpense, deleteExpense, type Expense } from "@/services/expenses";
import { calculateSettlement } from "@/lib/expense-split";
import toast from "@/lib/toast";

const DateExpenses: React.FC = () => {
  const user = useAuthStore((s) => s.state.user);
  const coupleId = useAuthStore((s) => s.state.coupleId);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newMemo, setNewMemo] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDate, setNewDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string | null>(null);

  useEffect(() => {
    if (!coupleId || !user) return;

    // 파트너 정보 가져오기
    const fetchPartnerName = async () => {
      try {
        const coupleDoc = await getDoc(doc(db, "couples", coupleId));
        const coupleData = coupleDoc.data();
        if (coupleData?.users) {
          const partnerUid = coupleData.users.find((uid: string) => uid !== user.uid);
          if (partnerUid) {
            const userDoc = await getDoc(doc(db, "users", partnerUid));
            const userData = userDoc.data();
            setPartnerName(userData?.displayName || "파트너");
          }
        }
      } catch {
        setPartnerName("파트너");
      }
    };

    fetchPartnerName();
  }, [coupleId, user]);

  useEffect(() => {
    if (!coupleId) return;
    try {
      return subscribeExpenses(coupleId, (items) => {
        setExpenses(items);
      });
    } catch { /* keep empty */ }
  }, [coupleId]);

  // 현재 달 지출만 필터링
  const currentMonth = useMemo(() => {
    const now = new Date();
    return expenses.filter((e) => isSameMonth(e.date, now));
  }, [expenses]);

  // 정산 계산 — 커플 두 uid를 expenses에서 추출
  const settlement = useMemo(() => {
    if (!user || currentMonth.length === 0) return null;

    // 지출 배열에서 모든 고유한 paidBy uid 찾기
    const payers = new Set(currentMonth.map((e) => e.paidBy));
    const uids = Array.from(payers);

    // 자신의 uid와 상대방의 uid 결정
    const myUid = user.uid;
    const partnerUid = uids.find((uid) => uid !== myUid);

    if (!partnerUid) return null; // 상대가 한 번도 내지 않은 경우

    return calculateSettlement(currentMonth, [myUid, partnerUid]);
  }, [currentMonth, user]);

  const total = currentMonth.reduce((s, e) => s + e.amount, 0);

  const handleAdd = async () => {
    if (!newMemo || !newAmount || !newDate) return;
    const amount = parseInt(newAmount, 10);
    if (Number.isNaN(amount) || amount <= 0) return;

    if (coupleId && user) {
      setSaving(true);
      try {
        await addExpense({
          coupleId,
          date: new Date(newDate),
          amount,
          paidBy: user.uid,
          memo: newMemo,
        });
        toast.success({ message: "지출을 기록했어요" });
      } catch {
        toast.error({ message: "저장에 실패했어요" });
      }
      setSaving(false);
    }
    setNewMemo("");
    setNewAmount("");
    setNewDate(format(new Date(), "yyyy-MM-dd"));
    setShowAdd(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await deleteExpense(id);
      toast.success({ message: "지출을 삭제했어요" });
    } catch {
      toast.error({ message: "삭제에 실패했어요" });
    }
    setDeleting(null);
  };

  return (
    <PageContainer withBottomNav>
      <PageHeader
        title="데이트 비용"
        right={
          <button onClick={() => setShowAdd(!showAdd)} aria-label="추가" className="p-1">
            <Plus className="w-5 h-5" style={{ color: "var(--app-ink)" }} />
          </button>
        }
      />

      <div className="px-5 pt-4 space-y-4">
        {/* 총액 헤더 */}
        <div className="text-center">
          <div
            className="text-3xl font-bold"
            style={{ color: "var(--app-ink)" }}
          >
            ₩{total.toLocaleString()}
          </div>
          <Meta className="mt-1">
            {format(new Date(), "MMMM", { locale: ko })} 총액
          </Meta>
        </div>

        {/* 정산 메시지 */}
        {settlement && user ? (
          <div
            className="p-3 rounded-xl text-center text-[14px]"
            style={{
              background: "rgb(var(--accent-010))",
              border: "1.5px solid var(--app-line-soft)",
              color: "var(--app-ink)",
            }}
          >
            {settlement.from === user.uid ? (
              <Body>
                내가{" "}
                <strong style={{ color: "rgb(var(--accent-070))" }}>
                  ₩{settlement.amount.toLocaleString()}
                </strong>
                {" "}보내면 반반이에요
              </Body>
            ) : (
              <Body>
                {partnerName || "파트너"}가{" "}
                <strong style={{ color: "rgb(var(--accent-070))" }}>
                  ₩{settlement.amount.toLocaleString()}
                </strong>
                {" "}보내면 반반이에요
              </Body>
            )}
          </div>
        ) : null}

        {/* 지출 추가 폼 */}
        {showAdd && (
          <div className="glass-card p-4 space-y-3">
            <AppInput
              label="메모"
              value={newMemo}
              onChange={setNewMemo}
              placeholder="카페, 식사, 택시..."
              clearable
            />
            <AppInput
              label="금액"
              type="number"
              value={newAmount}
              onChange={setNewAmount}
              placeholder="0"
              suffix={<Tiny>원</Tiny>}
            />
            <AppInput
              label="날짜"
              type="date"
              value={newDate}
              onChange={setNewDate}
            />
            <AppButton onClick={handleAdd} size="md" loading={saving}>
              저장
            </AppButton>
          </div>
        )}

        {/* 지출 목록 */}
        {currentMonth.length > 0 ? (
          <GlassList header={`${currentMonth.length}개 항목`}>
            {currentMonth
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map((e) => (
                <div key={e.id} className="flex items-center gap-2 px-4 py-3 border-b border-[var(--app-line-soft)] last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <Body className="truncate">{e.memo || "지출"}</Body>
                    <Meta className="text-xs mt-0.5">
                      {format(e.date, "M월 d일 (E)", { locale: ko })} ·{" "}
                      {e.paidBy === user?.uid ? "내가" : (partnerName || "파트너") + "가"} 결제
                    </Meta>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Body className="font-semibold">
                      ₩{e.amount.toLocaleString()}
                    </Body>
                  </div>
                  <button
                    onClick={() => handleDelete(e.id)}
                    disabled={deleting === e.id}
                    className="flex-shrink-0 p-1 rounded-full hover:bg-red-100 transition-colors"
                    aria-label="삭제"
                  >
                    <Trash2
                      className="w-4 h-4"
                      style={{ color: deleting === e.id ? "#ccc" : "#999" }}
                    />
                  </button>
                </div>
              ))}
          </GlassList>
        ) : (
          <EmptyState
            icon="💸"
            title="아직 기록한 지출이 없어요"
            description="함께 쓴 비용을 기록해서 정산하기 쉽게 해봐요"
            actionLabel="지출 기록하기"
            onAction={() => setShowAdd(true)}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default DateExpenses;
