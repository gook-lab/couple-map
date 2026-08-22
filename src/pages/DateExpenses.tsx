import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Tiny } from "@/components/ui/typography";
import StatCard from "@/components/ui/stat-card";
import GlassList from "@/components/ui/glass-list";
import ListRow from "@/components/ui/list-row";
import AppInput from "@/components/ui/app-input";
import AppButton from "@/components/ui/app-button";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { useAuthStore } from "@/store/use-auth-store";
import { subscribeExpenses, addExpense, type Expense } from "@/services/expenses";
import toast from "@/lib/toast";

interface DemoExpense { id: string; title: string; amount: number; payerId: string; emoji: string; }

const SAMPLE: DemoExpense[] = [
  { id: "1", title: "카페 도토리", amount: 12000, payerId: "me", emoji: "☕" },
  { id: "2", title: "점심 파스타", amount: 32000, payerId: "partner", emoji: "🍝" },
  { id: "3", title: "영화 관람", amount: 28000, payerId: "me", emoji: "🎬" },
  { id: "4", title: "택시비", amount: 8000, payerId: "partner", emoji: "🚕" },
];

const DateExpenses: React.FC = () => {
  const user = useAuthStore((s) => s.state.user);
  const coupleId = useAuthStore((s) => s.state.coupleId);

  const [expenses, setExpenses] = useState<(Expense | DemoExpense)[]>(SAMPLE);
  const [live, setLive] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!coupleId) return;
    try {
      return subscribeExpenses(coupleId, (items) => {
        setExpenses(items);
        setLive(true);
      });
    } catch { /* keep samples */ }
  }, [coupleId]);

  // 본인 결제 여부 — 연동 시 payerId 비교, 데모 시 "me" 문자열 비교
  const isMine = (e: Expense | DemoExpense) => (live ? e.payerId === user?.uid : e.payerId === "me");

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const myTotal = expenses.filter(isMine).reduce((s, e) => s + e.amount, 0);
  const partnerTotal = total - myTotal;
  const diff = myTotal - partnerTotal;

  const handleAdd = async () => {
    if (!newTitle || !newAmount) return;
    const amount = parseInt(newAmount, 10);
    if (Number.isNaN(amount)) return;

    if (coupleId && user) {
      setSaving(true);
      try {
        await addExpense({ coupleId, title: newTitle, amount, payerId: user.uid, emoji: "💰" });
      } catch {
        toast.error({ message: "저장에 실패했어요" });
      }
      setSaving(false);
    } else {
      setExpenses([{ id: `e-${Date.now()}`, title: newTitle, amount, payerId: "me", emoji: "💰" }, ...expenses]);
    }
    setNewTitle("");
    setNewAmount("");
    setShowAdd(false);
  };

  return (
    <PageContainer withBottomNav>
      <PageHeader
        title="데이트 비용 💸"
        right={
          <button onClick={() => setShowAdd(!showAdd)} aria-label="추가" className="p-1">
            <Plus className="w-5 h-5" style={{ color: "var(--app-ink)" }} />
          </button>
        }
      />

      <div className="px-5 pt-4">
        <div className="grid grid-cols-3 gap-2">
          <StatCard value={`${(total / 10000).toFixed(1)}만`} label="이번 달 총액" />
          <StatCard value={`${Math.round((myTotal / total) * 100 || 0)}%`} label="나" />
          <StatCard value={`${Math.round((partnerTotal / total) * 100 || 0)}%`} label="파트너" />
        </div>

        {diff !== 0 && (
          <div
            className="mt-3 p-3 rounded-xl text-center text-[13px]"
            style={{ background: "rgb(var(--accent-010))", border: "1.5px solid var(--app-line-soft)", color: "var(--app-ink)" }}
          >
            {diff > 0
              ? <span>파트너가 <strong style={{ color: "rgb(var(--accent-070))" }}>{diff.toLocaleString()}원</strong> 더 내면 공평</span>
              : <span>내가 <strong style={{ color: "rgb(var(--accent-070))" }}>{Math.abs(diff).toLocaleString()}원</strong> 더 내면 공평</span>}
          </div>
        )}

        {showAdd && (
          <div className="mt-4 glass-card p-4 space-y-3">
            <AppInput label="항목" value={newTitle} onChange={setNewTitle} placeholder="카페, 식사, 택시..." clearable />
            <AppInput label="금액" type="number" value={newAmount} onChange={setNewAmount} placeholder="0" suffix={<Tiny>원</Tiny>} />
            <AppButton onClick={handleAdd} size="md" loading={saving}>추가</AppButton>
          </div>
        )}

        <GlassList header="이번 달 내역" className="mt-4">
          {expenses.map((e, i) => (
            <ListRow
              key={e.id}
              emoji={e.emoji}
              title={e.title}
              detail={`${e.amount.toLocaleString()}원 · ${isMine(e) ? "내가" : "파트너가"} 결제`}
              isLast={i === expenses.length - 1}
              chevron={false}
            />
          ))}
        </GlassList>
      </div>
    </PageContainer>
  );
};

export default DateExpenses;
