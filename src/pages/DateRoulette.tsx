import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { H2, Meta, Tiny } from "@/components/ui/typography";
import AppButton from "@/components/ui/app-button";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { subscribePlaces } from "@/services/places";
import { useAuthStore } from "@/store/use-auth-store";
import type { Place } from "@/types/place";

const CATEGORIES = [
  { id: "all", label: "전체", emoji: "🎲" },
  { id: "음식점", label: "맛집", emoji: "🍜" },
  { id: "카페", label: "카페", emoji: "☕" },
  { id: "관광명소", label: "관광", emoji: "🏖️" },
];

const DateRoulette: React.FC = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState<Place[]>([]);
  const [category, setCategory] = useState("all");
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Place | null>(null);
  const coupleId = useAuthStore((s) => s.state.coupleId);

  useEffect(() => {
    if (!coupleId) return;
    try { return subscribePlaces(coupleId, setPlaces); } catch { /* */ }
  }, [coupleId]);

  const filtered = category === "all" ? places : places.filter((p) => p.category?.includes(category));

  const spin = () => {
    if (filtered.length === 0) return;
    setSpinning(true);
    setResult(null);
    let count = 0;
    const interval = setInterval(() => {
      setResult(filtered[Math.floor(Math.random() * filtered.length)]);
      count++;
      if (count > 15) {
        clearInterval(interval);
        setSpinning(false);
      }
    }, 100 + count * 20);
  };

  return (
    <PageContainer withBottomNav>
      <PageHeader title="오늘 뭐 하지? 🎲" />

      <div className="px-5 pt-4">
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((c) => {
            const isActive = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => { setCategory(c.id); setResult(null); }}
                className="px-3.5 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap"
                style={
                  isActive
                    ? { background: "var(--app-ink)", color: "var(--app-bg)", border: "1.5px solid var(--app-line)" }
                    : { background: "var(--app-card)", color: "var(--app-ink-2)", border: "1.5px solid var(--app-line-soft)" }
                }
              >
                {c.emoji} {c.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center py-8">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key={result.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-[300px] glass-card p-5 text-center">
                <span className="text-5xl block mb-3">🎯</span>
                <H2>{result.name}</H2>
                <Meta className="mt-1 block">{result.category} · {result.region}</Meta>
                {result.memo && <Tiny className="mt-2 block">{result.memo.slice(0, 50)}</Tiny>}
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center py-8">
                <span className="text-[80px] block">{spinning ? "🎰" : "🎲"}</span>
                <Meta className="mt-4 block">{filtered.length > 0 ? `${filtered.length}개 장소에서 추천` : "저장된 장소가 없어요"}</Meta>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 mt-6 w-full max-w-[300px]">
            <AppButton onClick={spin} disabled={filtered.length === 0 || spinning} icon={<RefreshCw className={`w-4 h-4 ${spinning ? "animate-spin" : ""}`} />}>
              {spinning ? "돌리는 중..." : "룰렛 돌리기"}
            </AppButton>
          </div>

          {result && !spinning && (
            <button onClick={() => navigate(`/memory/${result.id}`)}
              className="mt-3 text-[13px] font-medium" style={{ color: "rgb(var(--accent-070))" }}>
              상세 보기 →
            </button>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default DateRoulette;
