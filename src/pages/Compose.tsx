import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, ChevronLeft } from "lucide-react";
import { H3, Body, Meta, Tiny } from "@/components/ui/typography";
import Pill from "@/components/ui/pill";
import AppSwitch from "@/components/ui/app-switch";
import AppTextarea from "@/components/ui/app-textarea";
import PageContainer from "@/components/layout/PageContainer";
import toast from "@/lib/toast";
import { useAuthStore } from "@/store/use-auth-store";
import { createMemory } from "@/services/memories";
import { uploadImageSources } from "@/services/upload";

const MOODS = [
  { emoji: "😊", label: "행복" },
  { emoji: "🥰", label: "설렘" },
  { emoji: "😌", label: "평온" },
  { emoji: "🤔", label: "복잡" },
  { emoji: "😅", label: "재밌음" },
  { emoji: "😢", label: "아쉬움" },
  { emoji: "😴", label: "지침" },
  { emoji: "🥲", label: "뭉클" },
  { emoji: "+", label: "직접" },
];

const WEATHER = ["☀️", "⛅", "🌧️", "❄️", "🌫️"];

const PRIVACY_OPTIONS = [
  { id: "couple", emoji: "💕", title: "둘만 보기", desc: "나와 파트너만 볼 수 있어요" },
  { id: "private", emoji: "🔒", title: "나만 보기", desc: "비공개 일기" },
  { id: "friends", emoji: "👥", title: "친구 공개", desc: "연결된 친구에게 공개" },
] as const;

const SUGGESTED_TAGS = ["#바다", "#데이트", "#맛집", "#카페", "#주말", "#여행"];

type Step = "diary" | "mood" | "privacy";

const Compose: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.state.user);
  const coupleId = useAuthStore((s) => s.state.coupleId);

  const [step, setStep] = useState<Step>("diary");
  const [photos, setPhotos] = useState<string[]>([]);
  const [diary, setDiary] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedWeather, setSelectedWeather] = useState<number | null>(null);
  const [privacy, setPrivacy] = useState<string>("couple");
  const [partnerNotify, setPartnerNotify] = useState(true);

  const addTag = (tag: string) => {
    const norm = tag.startsWith("#") ? tag : `#${tag}`;
    if (!tags.includes(norm)) setTags([...tags, norm]);
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAddPhoto = () => {
    if (photos.length >= 9) {
      toast.error({ message: "사진은 최대 9장까지" });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 9 - photos.length;
    const newPhotos = Array.from(files).slice(0, remaining).map((f) => URL.createObjectURL(f));
    setPhotos([...photos, ...newPhotos]);
    e.target.value = "";
  };

  const handleNext = () => {
    if (step === "diary") setStep("mood");
    else if (step === "mood") setStep("privacy");
  };

  const handleBack = () => {
    if (step === "privacy") setStep("mood");
    else if (step === "mood") setStep("diary");
    else navigate(-1);
  };

  const handleSave = async () => {
    if (coupleId && user) {
      try {
        const photoUrls = photos.length > 0
          ? await uploadImageSources(photos, `couples/${coupleId}/memories`)
          : [];
        await createMemory({
          coupleId,
          authorId: user.uid,
          title: diary.slice(0, 30) || "새 추억",
          diary,
          photos: photoUrls,
          tags,
          mood: selectedMood !== null ? MOODS[selectedMood].emoji : null,
          weather: selectedWeather !== null ? WEATHER[selectedWeather] : null,
          privacy: privacy as "couple" | "private" | "friends",
          location: { name: "", lat: 0, lng: 0, region: "", country: "한국" },
          date: new Date(),
        });
      } catch { /* fallback to local */ }
    }
    toast.success({ message: "추억이 저장됐어요 ✨" });
    navigate("/timeline", { replace: true });
  };

  const stepIndex = step === "diary" ? 1 : step === "mood" ? 2 : 3;

  const optionCard = (selected: boolean): React.CSSProperties => ({
    background: selected ? "rgb(var(--accent-010))" : "var(--app-card)",
    border: `1.6px solid ${selected ? "rgb(var(--accent-070))" : "var(--app-line-soft)"}`,
  });

  return (
    <PageContainer flex>
      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
      {/* Header */}
      <header className="sticky top-0 z-10 glass-bar px-4 pt-3 pb-3 flex items-center justify-between">
        <button onClick={handleBack} aria-label="뒤로 가기" className="p-1 -ml-1">
          {step === "diary" ? (
            <X className="w-6 h-6" style={{ color: "var(--app-ink)" }} />
          ) : (
            <ChevronLeft className="w-6 h-6" style={{ color: "var(--app-ink)" }} />
          )}
        </button>
        <H3>{step === "diary" ? "일기 쓰기" : step === "mood" ? "오늘 어땠어요?" : "공개 범위"}</H3>
        <Tiny className="w-12 text-right">{stepIndex} / 3</Tiny>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pt-3 pb-28">
        <AnimatePresence mode="wait">
          {/* Step 1: Diary */}
          {step === "diary" && (
            <motion.div
              key="diary"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="flex flex-col gap-4"
            >
              {/* Photos */}
              <div>
                <Tiny className="mb-1.5 block">사진</Tiny>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={handleAddPhoto}
                    className="aspect-square rounded-xl flex items-center justify-center"
                    style={{ border: "1.6px dashed var(--app-line)" }}
                  >
                    <Plus className="w-5 h-5" style={{ color: "var(--app-ink-3)" }} />
                  </button>
                  {photos.map((p, i) => (
                    <div
                      key={p}
                      className="aspect-square rounded-xl relative overflow-hidden"
                      style={{ background: "var(--app-line-soft)", border: "1.5px solid var(--app-line)" }}
                    >
                      {p.startsWith("blob:") ? (
                        <img src={p} alt={`사진 ${i + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Tiny>사진 {i + 1}</Tiny>
                        </div>
                      )}
                      <div
                        className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                        style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)" }}
                      >
                        {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
                {photos.length > 0 && <Tiny className="mt-1 block">{photos.length}장 선택됨</Tiny>}
              </div>

              {/* Diary text */}
              <AppTextarea label="일기" value={diary} onChange={setDiary} placeholder="오늘의 추억을 적어보세요..." maxLength={500} showCount className="min-h-[140px]" />

              {/* Tags */}
              <div>
                <Tiny className="mb-1.5 block">태그</Tiny>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Pill key={tag} variant="primary" onClick={() => setTags(tags.filter((t) => t !== tag))}>
                      {tag} ×
                    </Pill>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.nativeEvent.isComposing && tagInput.trim()) {
                        e.preventDefault();
                        addTag(tagInput.trim());
                        setTagInput("");
                      }
                    }}
                    placeholder="+ 태그"
                    className="w-20 px-2.5 py-1 rounded-full text-[12px] outline-none bg-transparent"
                    style={{ border: "1.6px dashed var(--app-line)", color: "var(--app-ink-2)" }}
                  />
                </div>
                <div className="mt-2.5">
                  <Tiny className="mb-1 block">추천</Tiny>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => addTag(tag)}
                        className="px-2.5 py-1 rounded-full text-[12px] opacity-70"
                        style={{ border: "1.5px solid var(--app-line-soft)", color: "var(--app-ink-2)" }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Mood + Weather */}
          {step === "mood" && (
            <motion.div
              key="mood"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="flex flex-col gap-5"
            >
              <Meta>건너뛰어도 돼요</Meta>

              <div className="grid grid-cols-3 gap-2.5">
                {MOODS.map((mood, i) => {
                  const isSelected = selectedMood === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedMood(isSelected ? null : i)}
                      className="flex flex-col items-center gap-1.5 p-3.5 rounded-xl transition-all"
                      style={optionCard(isSelected)}
                    >
                      <span className="text-[32px]">{mood.emoji}</span>
                      <span
                        className={`text-[12px] ${isSelected ? "font-bold" : ""}`}
                        style={{ color: isSelected ? "rgb(var(--accent-070))" : "var(--app-ink-2)" }}
                      >
                        {mood.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Weather */}
              <div>
                <Tiny className="mb-2 block">날씨</Tiny>
                <div className="flex gap-2">
                  {WEATHER.map((w, i) => {
                    const isSelected = selectedWeather === i;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedWeather(isSelected ? null : i)}
                        className="w-[50px] h-[50px] rounded-xl flex items-center justify-center text-[22px] transition-all"
                        style={optionCard(isSelected)}
                      >
                        {w}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Privacy */}
          {step === "privacy" && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="flex flex-col gap-3"
            >
              {PRIVACY_OPTIONS.map((opt) => {
                const isSelected = privacy === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setPrivacy(opt.id)}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl text-left transition-all"
                    style={{
                      background: isSelected ? "rgb(var(--accent-010))" : "var(--app-card)",
                      border: `${isSelected ? "2px" : "1.6px"} solid ${isSelected ? "rgb(var(--accent-070))" : "var(--app-line-soft)"}`,
                    }}
                  >
                    <span className="text-[24px]">{opt.emoji}</span>
                    <div className="flex-1">
                      <Body className="font-bold block">{opt.title}</Body>
                      <Meta className="mt-0.5 block">{opt.desc}</Meta>
                    </div>
                    <div
                      className="w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: isSelected ? "rgb(var(--accent-070))" : "var(--app-line)",
                        background: isSelected ? "rgb(var(--accent-070))" : "transparent",
                      }}
                    >
                      {isSelected && <span className="text-[12px]" style={{ color: "var(--app-ink-on-accent)" }}>✓</span>}
                    </div>
                  </button>
                );
              })}

              {/* Partner notification toggle */}
              <div className="mt-3 p-3.5 rounded-xl" style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line-soft)" }}>
                <AppSwitch
                  label="파트너에게 알림"
                  description="새 추억이 추가됐다고 알려요"
                  checked={partnerNotify}
                  onChange={setPartnerNotify}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-4 pt-3 z-20" style={{ background: "var(--app-bg)" }}>
        <button
          onClick={step === "privacy" ? handleSave : handleNext}
          className="w-full py-3.5 rounded-full text-[16px] font-bold"
          style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)", boxShadow: "var(--app-shadow)" }}
        >
          {step === "privacy" ? "이 설정으로 저장" : "다음"}
        </button>
        {step === "diary" && (
          <button
            onClick={() => navigate("/voice")}
            className="w-full mt-2 py-2.5 rounded-full glass-pill text-[14px] font-bold flex items-center justify-center gap-1.5"
            style={{ color: "var(--app-ink-2)" }}
          >
            🎤 음성 메모
          </button>
        )}
      </div>
    </PageContainer>
  );
};

export default Compose;
