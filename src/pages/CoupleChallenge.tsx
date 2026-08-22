import React, { useState, useEffect } from "react";
import { Check, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { H2, H3, Meta, Tiny } from "@/components/ui/typography";
import AppButton from "@/components/ui/app-button";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { useAuthStore } from "@/store/use-auth-store";
import { markChallengeDone, subscribeChallengeProgress } from "@/services/challenges";
import toast from "@/lib/toast";

const CHALLENGES = [
  { emoji: "📸", title: "함께 셀카 찍기", desc: "오늘 하루 중 함께 찍은 사진 1장" },
  { emoji: "☕", title: "새 카페 방문하기", desc: "한 번도 안 가본 카페에 가보기" },
  { emoji: "💌", title: "손편지 쓰기", desc: "파트너에게 3줄 이상 편지 쓰기" },
  { emoji: "🍳", title: "함께 요리하기", desc: "둘이서 한 가지 요리 만들어보기" },
  { emoji: "🚶", title: "30분 산책하기", desc: "핸드폰 없이 함께 걸어보기" },
  { emoji: "🎬", title: "추천 영화 보기", desc: "파트너가 좋아하는 영화 함께 보기" },
  { emoji: "🧹", title: "함께 정리하기", desc: "서로의 사진첩 추억 정리하기" },
  { emoji: "🌅", title: "노을 보러 가기", desc: "오늘 일몰 시간에 함께 보기" },
];

const CoupleChallenge: React.FC = () => {
  const coupleId = useAuthStore((s) => s.state.coupleId);
  const todayIndex = new Date().getDate() % CHALLENGES.length;
  const [challengeIndex, setChallengeIndex] = useState(todayIndex);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);

  const challenge = CHALLENGES[challengeIndex];
  const streak = completed.size;

  // 커플 챌린지 완료 현황 실시간 구독
  useEffect(() => {
    if (!coupleId) return;
    try {
      return subscribeChallengeProgress(coupleId, (items) => {
        setCompleted(new Set(items.map((c) => c.challengeIndex)));
      });
    } catch { /* offline */ }
  }, [coupleId]);

  const handleComplete = async () => {
    // 낙관적 업데이트
    setCompleted((prev) => new Set(prev).add(challengeIndex));
    if (coupleId) {
      setSaving(true);
      try {
        await markChallengeDone(coupleId, challengeIndex);
      } catch {
        toast.error({ message: "저장에 실패했어요" });
      }
      setSaving(false);
    }
    toast.success({ message: "챌린지 완료! 🎉" });
  };

  const handleNext = () => {
    setChallengeIndex((i) => (i + 1) % CHALLENGES.length);
  };

  return (
    <PageContainer withBottomNav>
      <PageHeader title="커플 챌린지 🏆" />

      <div className="px-5 pt-4">
        <div className="text-center mb-4">
          <Tiny>🔥 {streak}일 연속 달성 중</Tiny>
        </div>

        <motion.div key={challengeIndex} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-6 text-center mb-5">
          <Tiny>이번 주 미션</Tiny>
          <span className="text-[64px] block mt-3">{challenge.emoji}</span>
          <H2 className="mt-3">{challenge.title}</H2>
          <Meta className="mt-2 block">{challenge.desc}</Meta>
        </motion.div>

        {completed.has(challengeIndex) ? (
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: "rgb(var(--accent-070))", border: "1.5px solid var(--app-line)" }}
            >
              <Check className="w-8 h-8" style={{ color: "var(--app-ink-on-accent)" }} />
            </div>
            <H3>완료했어요! 🎉</H3>
            <button onClick={handleNext} className="mt-4 flex items-center gap-2 mx-auto text-[14px] font-bold" style={{ color: "var(--app-ink-2)" }}>
              <RefreshCw className="w-4 h-4" /> 다음 챌린지
            </button>
          </div>
        ) : (
          <AppButton onClick={handleComplete} loading={saving} icon={<Check className="w-4 h-4" />}>챌린지 완료!</AppButton>
        )}

        <div className="mt-6">
          <Tiny className="block mb-2">전체 챌린지</Tiny>
          <div className="grid grid-cols-4 gap-2">
            {CHALLENGES.map((c, i) => (
              <button
                key={i}
                onClick={() => setChallengeIndex(i)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 text-center ${completed.has(i) ? "opacity-40" : ""}`}
                style={{
                  background: challengeIndex === i ? "rgb(var(--accent-010))" : "var(--app-card)",
                  border: `1.5px solid ${challengeIndex === i ? "rgb(var(--accent-070))" : "var(--app-line-soft)"}`,
                }}
              >
                <span className="text-xl">{c.emoji}</span>
                <Tiny className="text-[9px] leading-tight">{c.title.slice(0, 6)}</Tiny>
                {completed.has(i) && <Check className="w-3 h-3" style={{ color: "rgb(var(--accent-070))" }} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default CoupleChallenge;
