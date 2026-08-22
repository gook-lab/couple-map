import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { H3, Meta, Tiny } from "@/components/ui/typography";
import AppInput from "@/components/ui/app-input";
import AppButton from "@/components/ui/app-button";
import AppSwitch from "@/components/ui/app-switch";
import DatePicker from "@/components/ui/date-picker";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { useAuthStore } from "@/store/use-auth-store";
import { createAnniversary } from "@/services/anniversaries";
import toast from "@/lib/toast";

type Step = "type" | "date" | "title" | "notify" | "preview" | "saving" | "done";

const TYPES = [
  { icon: "💕", title: "처음 만난 날", sub: "매년 자동 카운트", tag: "커플" },
  { icon: "🎂", title: "생일", sub: "둘 중 한 명", tag: "개인" },
  { icon: "💯", title: "100일·1000일", sub: "자동 계산", tag: "커플" },
  { icon: "💍", title: "결혼 / 약혼", sub: "평생 카운트", tag: "커플" },
  { icon: "✈️", title: "첫 여행", sub: "추억 핀과 연결", tag: "추억" },
  { icon: "⭐", title: "직접 입력", sub: "자유롭게", tag: "맞춤" },
];

const ICONS = ["💕", "🎂", "💯", "💍", "✈️", "⭐", "🎉", "🌹", "🏠", "👶", "🎓", "🐾"];

const AnniversaryAdd: React.FC = () => {
  const navigate = useNavigate();
  const coupleId = useAuthStore((s) => s.state.coupleId);

  const [step, setStep] = useState<Step>("type");
  const [selectedType, setSelectedType] = useState(2);
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("💯");
  const [notifyDays, setNotifyDays] = useState(7);
  const [notifyPartner, setNotifyPartner] = useState(true);
  const [repeat, setRepeat] = useState(true);

  const stepNumber = { type: 1, date: 2, title: 3, notify: 4, preview: 5, saving: 5, done: 5 }[step];

  const handleSave = async () => {
    setStep("saving");
    if (coupleId) {
      try {
        await createAnniversary({
          coupleId,
          title: title || TYPES[selectedType].title,
          date,
          type: selectedType <= 3 ? "anniversary" : selectedType === 1 ? "birthday" : "custom",
          emoji: selectedIcon,
        });
      } catch { /* */ }
    }
    await new Promise((r) => setTimeout(r, 1000));
    setStep("done");
    toast.success({ message: "기념일이 등록됐어요! 🎉" });
  };

  const slide = { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 } };

  const handleHeaderBack = () => {
    if (step === "type") navigate(-1);
    else if (step === "date") setStep("type");
    else if (step === "title") setStep("date");
    else if (step === "notify") setStep("title");
    else if (step === "preview") setStep("notify");
    else if (step === "done") navigate("/calendar");
  };

  return (
    <PageContainer flex withBottomNav>
      <PageHeader
        title={step === "done" ? "등록 완료" : "새 기념일"}
        onBack={handleHeaderBack}
        right={step !== "done" && step !== "saving" ? <Tiny>{stepNumber}/5단계</Tiny> : undefined}
      />

      <div className="flex-1 px-5 pt-3">
        <AnimatePresence mode="wait">
          {/* Step 1: Type */}
          {step === "type" && (
            <motion.div key="type" {...slide} className="space-y-2">
              <Meta className="mb-3 block">어떤 기념일을 등록할까요?</Meta>
              {TYPES.map((t, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedType(i); setSelectedIcon(t.icon); }}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-left transition-all"
                  style={{
                    background: selectedType === i ? "rgb(var(--accent-010))" : "var(--app-card)",
                    border: `1.5px solid ${selectedType === i ? "rgb(var(--accent-070))" : "var(--app-line-soft)"}`,
                  }}
                >
                  <div className="w-[42px] h-[42px] rounded-xl flex items-center justify-center text-xl" style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)" }}>{t.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-bold">{t.title}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md font-bold" style={{ background: "var(--app-line-soft)", color: "var(--app-ink-2)" }}>{t.tag}</span>
                    </div>
                    <Tiny className="mt-0.5 block">{t.sub}</Tiny>
                  </div>
                  {selectedType === i && <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[13px] font-bold" style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)" }}>✓</div>}
                </button>
              ))}
              <AppButton onClick={() => setStep("date")} className="mt-4">다음</AppButton>
            </motion.div>
          )}

          {/* Step 2: Date */}
          {step === "date" && (
            <motion.div key="date" {...slide}>
              <Meta className="mb-3 block">날짜를 선택해주세요</Meta>
              <DatePicker label="기념일 날짜" value={date} onChange={setDate} />
              <AppButton onClick={() => setStep("title")} className="mt-6">다음</AppButton>
            </motion.div>
          )}

          {/* Step 3: Title & Icon */}
          {step === "title" && (
            <motion.div key="title" {...slide}>
              <Meta className="mb-3 block">이름과 아이콘을 정해주세요</Meta>
              <AppInput label="기념일 이름" value={title} onChange={setTitle} placeholder={TYPES[selectedType].title} clearable />
              <div className="mt-4">
                <Tiny className="block mb-2">아이콘</Tiny>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setSelectedIcon(icon)}
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                      style={{
                        background: selectedIcon === icon ? "rgb(var(--accent-010))" : "var(--app-card)",
                        border: `1.5px solid ${selectedIcon === icon ? "rgb(var(--accent-070))" : "var(--app-line-soft)"}`,
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <AppButton onClick={() => setStep("notify")} className="mt-6">다음</AppButton>
            </motion.div>
          )}

          {/* Step 4: Notification */}
          {step === "notify" && (
            <motion.div key="notify" {...slide}>
              <Meta className="mb-3 block">알림 설정</Meta>
              <div className="space-y-1">
                <Tiny className="block mb-2">며칠 전부터 알림?</Tiny>
                <div className="flex gap-2">
                  {[1, 3, 7, 14, 30].map((d) => (
                    <button
                      key={d}
                      onClick={() => setNotifyDays(d)}
                      className="flex-1 py-2.5 rounded-xl text-[13px] font-bold"
                      style={{
                        background: notifyDays === d ? "rgb(var(--accent-010))" : "var(--app-card)",
                        border: `1.5px solid ${notifyDays === d ? "rgb(var(--accent-070))" : "var(--app-line-soft)"}`,
                      }}
                    >
                      D-{d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <AppSwitch label="파트너에게도 알림" description="같은 알림을 파트너에게 전송" checked={notifyPartner} onChange={setNotifyPartner} />
                <AppSwitch label="매년 반복" description="매년 같은 날 알림" checked={repeat} onChange={setRepeat} />
              </div>
              <AppButton onClick={() => setStep("preview")} className="mt-6">미리보기</AppButton>
            </motion.div>
          )}

          {/* Step 5: Preview */}
          {step === "preview" && (
            <motion.div key="preview" {...slide}>
              <Meta className="mb-3 block">이렇게 등록할까요?</Meta>
              <div className="glass-card p-5 text-center">
                <span className="text-[48px] block">{selectedIcon}</span>
                <H3 className="mt-3">{title || TYPES[selectedType].title}</H3>
                <Meta className="mt-1 block">{date.getFullYear()}년 {date.getMonth()+1}월 {date.getDate()}일</Meta>
                <div className="flex items-center justify-center gap-3 mt-3">
                  <Tiny>알림: D-{notifyDays}</Tiny>
                  <Tiny>반복: {repeat ? "매년" : "1회"}</Tiny>
                  <Tiny>파트너 알림: {notifyPartner ? "ON" : "OFF"}</Tiny>
                </div>
              </div>
              <AppButton onClick={handleSave} className="mt-5">등록하기</AppButton>
              <AppButton variant="secondary" onClick={() => setStep("notify")} className="mt-2">수정</AppButton>
            </motion.div>
          )}

          {/* Saving */}
          {step === "saving" && (
            <motion.div key="saving" {...slide} className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: "rgb(var(--accent-030))", borderTopColor: "rgb(var(--accent-070))" }} />
              <Meta className="mt-4 block">등록 중...</Meta>
            </motion.div>
          )}

          {/* Done */}
          {step === "done" && (
            <motion.div key="done" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-12">
              <div
                className="w-[90px] h-[90px] rounded-full flex items-center justify-center"
                style={{ background: "rgb(var(--accent-070))", border: "1.5px solid var(--app-line)" }}
              >
                <span className="text-[40px]" style={{ color: "var(--app-ink-on-accent)" }}>✓</span>
              </div>
              <H3 className="mt-4">{title || TYPES[selectedType].title}</H3>
              <Meta className="mt-1 block">기념일이 캘린더에 추가됐어요!</Meta>
              <span className="text-[64px] mt-4">{selectedIcon}</span>
              <AppButton onClick={() => navigate("/calendar")} className="mt-6">캘린더 보기</AppButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageContainer>
  );
};

export default AnniversaryAdd;
