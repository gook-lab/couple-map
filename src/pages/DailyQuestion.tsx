import React, { useState, useEffect } from "react";
import { RefreshCw, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { H2, Body, Tiny } from "@/components/ui/typography";
import AppButton from "@/components/ui/app-button";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { useAuthStore } from "@/store/use-auth-store";
import { submitDailyAnswer, subscribeDailyAnswers, type DailyAnswer } from "@/services/daily-question";
import toast from "@/lib/toast";

const QUESTIONS = [
  "오늘 가장 감사한 것은?",
  "요즘 가장 가고 싶은 곳은?",
  "파트너의 가장 좋은 점 3가지?",
  "우리가 처음 만났던 날 기억나?",
  "이번 주말에 뭐 하고 싶어?",
  "가장 기억에 남는 데이트는?",
  "파트너에게 감추고 있는 것?",
  "10년 후 우리는 어떨까?",
  "요즘 파트너에게 하고 싶은 말?",
  "파트너의 음식 중 가장 좋아하는 것?",
  "같이 도전해보고 싶은 것?",
  "파트너를 동물로 표현하면?",
];

const DailyQuestion: React.FC = () => {
  const user = useAuthStore((s) => s.state.user);
  const coupleId = useAuthStore((s) => s.state.coupleId);

  const todayIndex = new Date().getDate() % QUESTIONS.length;
  const [questionIndex, setQuestionIndex] = useState(todayIndex);
  const [myAnswer, setMyAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<DailyAnswer[]>([]);
  const [saving, setSaving] = useState(false);

  const question = QUESTIONS[questionIndex];

  // 현재 질문의 양쪽 답변 실시간 구독
  useEffect(() => {
    setSubmitted(false);
    setMyAnswer("");
    setAnswers([]);
    if (!coupleId) return;
    try {
      return subscribeDailyAnswers(coupleId, questionIndex, setAnswers);
    } catch { /* offline */ }
  }, [coupleId, questionIndex]);

  const myStored = answers.find((a) => a.authorId === user?.uid);
  const partnerStored = answers.find((a) => a.authorId !== user?.uid);
  const isSubmitted = submitted || !!myStored;
  const displayedMyAnswer = myStored?.answer ?? myAnswer;
  const partnerAnswer = partnerStored?.answer ?? null;

  const handleSubmit = async () => {
    if (!myAnswer.trim()) return;
    if (coupleId && user) {
      setSaving(true);
      try {
        await submitDailyAnswer({ coupleId, questionIndex, authorId: user.uid, answer: myAnswer.trim() });
      } catch {
        toast.error({ message: "전송에 실패했어요" });
        setSaving(false);
        return;
      }
      setSaving(false);
    }
    setSubmitted(true);
    toast.success({ message: "답변이 전송됐어요 💌" });
  };

  const nextQuestion = () => {
    setQuestionIndex((i) => (i + 1) % QUESTIONS.length);
  };

  return (
    <PageContainer withBottomNav>
      <PageHeader title="오늘의 질문 💬" />

      <div className="px-5 pt-6">
        <div className="text-center mb-6">
          <Tiny>Q{questionIndex + 1}</Tiny>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={questionIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 text-center mb-6">
            <H2 className="leading-relaxed">{question}</H2>
          </motion.div>
        </AnimatePresence>

        {!isSubmitted ? (
          <div>
            <textarea value={myAnswer} onChange={(e) => setMyAnswer(e.target.value)}
              placeholder="나의 답변을 적어보세요..."
              className="w-full min-h-[120px] px-4 py-3 rounded-xl text-[15px] outline-none resize-none leading-relaxed"
              style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)", color: "var(--app-ink)" }} />
            <AppButton onClick={handleSubmit} disabled={!myAnswer.trim()} loading={saving} className="mt-4" icon={<Send className="w-4 h-4" />}>
              답변 보내기
            </AppButton>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]" style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)" }}>나</div>
                <Tiny className="font-extrabold">나의 답변</Tiny>
              </div>
              <Body className="text-[14px] leading-relaxed">{displayedMyAnswer}</Body>
            </div>

            <div className="glass-card p-4 opacity-50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]" style={{ background: "rgb(var(--accent-020))", color: "rgb(var(--accent-070))", border: "1.5px solid var(--app-line)" }}>♥</div>
                <Tiny className="font-extrabold">파트너의 답변</Tiny>
              </div>
              <Body className="text-[14px]" style={{ color: "var(--app-ink-2)" }}>{partnerAnswer || "파트너가 아직 답변하지 않았어요..."}</Body>
            </div>

            <button onClick={nextQuestion} className="w-full flex items-center justify-center gap-2 py-3 text-[14px] font-bold" style={{ color: "var(--app-ink-2)" }}>
              <RefreshCw className="w-4 h-4" /> 다른 질문 보기
            </button>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default DailyQuestion;
