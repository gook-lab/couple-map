import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Copy, Check, Camera } from "lucide-react";
import { H1, H2, H3, Body, Meta, Tiny } from "@/components/ui/typography";
import AppInput from "@/components/ui/app-input";
import DatePicker from "@/components/ui/date-picker";
import PageContainer from "@/components/layout/PageContainer";
import { useAuthStore } from "@/store/use-auth-store";
import { createInviteCode, joinCouple, getCoupleId } from "@/services/couple";
import toast from "@/lib/toast";

type Step = "profile" | "partner-choose" | "code-share" | "code-enter" | "connecting" | "fail" | "region" | "done";

const REGIONS = [
  { name: "제주도", sub: "돌담 · 바다", emoji: "🏝️" },
  { name: "도쿄", sub: "음식 · 골목", emoji: "🗼" },
  { name: "오사카", sub: "맛집 · 야경", emoji: "🍜" },
  { name: "서울", sub: "카페 · 동네", emoji: "☕" },
  { name: "교토", sub: "사찰 · 단풍", emoji: "🍁" },
];

const slide = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const accentBg = { background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)" } as React.CSSProperties;
const dashedBorder = { border: "1.6px dashed var(--app-line-soft)" } as React.CSSProperties;

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.state.user);
  const setCoupleId = useAuthStore((s) => s.setCoupleId);
  const coupleId = useAuthStore((s) => s.state.coupleId);

  const [step, setStep] = useState<Step>("profile");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [birthday, setBirthday] = useState(new Date(1996, 0, 1));
  const [inviteCode, setInviteCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failMessage, setFailMessage] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    getCoupleId(user.uid).then((id) => {
      if (id) {
        setCoupleId(id);
        setStep("region");
      }
    });
  }, [user]);

  const totalSteps = 6;
  const stepNumber = (() => {
    switch (step) {
      case "profile": return 1;
      case "partner-choose": case "code-share": case "code-enter": case "connecting": case "fail": return 2;
      case "region": return 3;
      case "done": return 4;
      default: return 1;
    }
  })();

  const handleCreateCode = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const code = await createInviteCode(user.uid);
      setGeneratedCode(code);
      setStep("code-share");
    } catch {
      toast.error({ message: "코드 생성에 실패했어요" });
    }
    setLoading(false);
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success({ message: "코드가 복사되었어요" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = async () => {
    if (!user || inviteCode.length < 6) return;
    setStep("connecting");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1500));

    try {
      const id = await joinCouple(inviteCode.toUpperCase(), user.uid);
      setCoupleId(id);
      toast.success({ message: "커플 연결 완료! 💕" });
      setStep("region");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "연결에 실패했어요";
      setFailMessage(msg);
      setStep("fail");
    }
    setLoading(false);
  };

  const handleComplete = () => navigate("/today", { replace: true });

  const ProgressDots = () => (
    <div className="flex justify-center gap-1.5 mt-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full transition-colors"
          style={{ background: i + 1 <= stepNumber ? "var(--app-ink)" : "var(--app-line)" }}
        />
      ))}
    </div>
  );

  return (
    <PageContainer flex>
      <AnimatePresence mode="wait">
        {/* ── OB_06: Profile Setup ── */}
        {step === "profile" && (
          <motion.div key="profile" {...slide} className="flex-1 flex flex-col px-7 pt-14 pb-10">
            <Tiny>{stepNumber} / {totalSteps} 단계</Tiny>
            <H2 className="mt-2">당신은 누구인가요?</H2>
            <Meta className="mt-1">파트너에게 보일 프로필이에요</Meta>

            <div className="flex justify-center mt-7 mb-6">
              <div className="relative">
                <div
                  className="w-[110px] h-[110px] rounded-full flex items-center justify-center text-4xl"
                  style={{ background: "var(--app-line-soft)", border: "1.6px solid var(--app-line-soft)", color: "var(--app-ink-3)" }}
                >
                  {displayName ? displayName[0] : "+"}
                </div>
                <div
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgb(var(--accent-070))" }}
                >
                  <Camera className="w-4 h-4" style={{ color: "var(--app-ink-on-accent)" }} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <AppInput label="이름" value={displayName} onChange={setDisplayName} placeholder="이름을 입력하세요" clearable />
              <DatePicker label="생일" value={birthday} onChange={setBirthday} />
            </div>

            <div className="flex-1" />

            <button
              onClick={() => setStep("partner-choose")}
              disabled={!displayName.trim()}
              className="w-full py-3.5 rounded-full text-[16px] font-semibold disabled:opacity-40"
              style={accentBg}
            >
              다음
            </button>
            <ProgressDots />
          </motion.div>
        )}

        {/* ── OB_07: Partner Choose ── */}
        {step === "partner-choose" && (
          <motion.div key="partner-choose" {...slide} className="flex-1 flex flex-col px-7 pt-14 pb-10">
            <Tiny>{stepNumber} / {totalSteps} 단계</Tiny>
            <H2 className="mt-2">파트너 연결</H2>
            <Meta className="mt-1">둘 사이는 둘이 함께 써요</Meta>

            <div className="flex flex-col gap-3 mt-7">
              <button
                onClick={handleCreateCode}
                disabled={loading}
                className="p-4 rounded-2xl text-left"
                style={{ border: "1.6px solid rgb(var(--accent-070))", background: "rgb(var(--accent-010))" }}
              >
                <H3>초대 코드 만들기</H3>
                <Meta className="mt-1 block">파트너에게 코드를 보낼게요</Meta>
              </button>

              <button
                onClick={() => setStep("code-enter")}
                className="p-4 rounded-2xl text-left"
                style={dashedBorder}
              >
                <H3>초대 코드 입력하기</H3>
                <Meta className="mt-1 block">파트너가 보낸 6자리 코드</Meta>
              </button>

              <button
                onClick={() => setStep("region")}
                className="p-3.5 rounded-2xl text-center opacity-60"
                style={dashedBorder}
              >
                <Body style={{ color: "var(--app-ink-2)" }}>
                  나중에 연결할게요 · 혼자 둘러보기
                </Body>
              </button>
            </div>

            <div className="flex-1" />
            <ProgressDots />
          </motion.div>
        )}

        {/* ── OB_08: Code Share ── */}
        {step === "code-share" && (
          <motion.div key="code-share" {...slide} className="flex-1 flex flex-col px-7 pt-14 pb-10">
            <Tiny>{stepNumber} / {totalSteps} 단계 · 코드 만들기</Tiny>
            <H2 className="mt-2">이 코드를 보내세요</H2>
            <Meta className="mt-1">파트너가 입력하면 자동 연결돼요</Meta>

            <div
              className="mt-8 rounded-2xl p-8 text-center"
              style={{ background: "rgb(var(--accent-010))", border: "1px solid var(--app-line-soft)" }}
            >
              <div className="text-[44px] font-bold tracking-[8px]">
                {generatedCode}
              </div>
              <Meta className="mt-3 block">23:42 후 만료</Meta>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCopyCode}
                className="flex-1 py-3 rounded-full glass-pill text-[15px] font-medium flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "복사됨" : "📋 복사"}
              </button>
              <button
                className="flex-1 py-3 rounded-full text-[15px] font-semibold"
                style={accentBg}
              >
                ↗ 공유하기
              </button>
            </div>

            <div className="flex flex-col items-center gap-2 mt-8">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "rgb(var(--accent-070))" }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
              <Meta>파트너 입력 대기 중...</Meta>
            </div>

            <div className="flex-1" />

            <button
              onClick={() => { setGeneratedCode(""); setStep("code-enter"); }}
              className="w-full py-3 rounded-full glass-pill text-[15px] font-medium"
              style={{ color: "var(--app-ink-2)" }}
            >
              코드 입력으로 전환
            </button>
            <ProgressDots />
          </motion.div>
        )}

        {/* ── OB_09: Code Enter ── */}
        {step === "code-enter" && (
          <motion.div key="code-enter" {...slide} className="flex-1 flex flex-col px-7 pt-14 pb-10">
            <Tiny>{stepNumber} / {totalSteps} 단계 · 코드 입력</Tiny>
            <H2 className="mt-2">받은 코드를 입력하세요</H2>
            <Meta className="mt-1">파트너가 만든 6자리 코드</Meta>

            <div className="flex gap-2 mt-7 justify-between">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-14 rounded-xl flex items-center justify-center text-[24px] font-bold"
                  style={{
                    background: "var(--app-card)",
                    border: inviteCode[i]
                      ? "1.6px solid rgb(var(--accent-070))"
                      : "1.6px solid var(--app-line-soft)",
                  }}
                >
                  {inviteCode[i] || ""}
                </div>
              ))}
            </div>

            <input
              type="text"
              maxLength={6}
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="코드 입력"
              autoFocus
              className="mt-4 w-full text-center py-3 rounded-xl text-[17px] font-semibold outline-none"
              style={{ background: "var(--app-card)", border: "1px solid var(--app-line)", color: "var(--app-ink)" }}
            />

            <div className="flex-1" />

            <button
              onClick={handleJoin}
              disabled={loading || inviteCode.length < 6}
              className="w-full py-3.5 rounded-full text-[16px] font-semibold disabled:opacity-40"
              style={accentBg}
            >
              {loading ? "연결 중..." : "연결하기"}
            </button>
            <button
              onClick={() => setStep("partner-choose")}
              className="w-full py-3 rounded-full glass-pill text-[15px] font-medium mt-2"
              style={{ color: "var(--app-ink-2)" }}
            >
              새 코드 만들기
            </button>
            <ProgressDots />
          </motion.div>
        )}

        {/* ── OB_10: Connecting ── */}
        {step === "connecting" && (
          <motion.div key="connecting" {...slide} className="flex-1 flex flex-col items-center justify-center gap-6 px-7 pb-10">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-[20px] font-semibold"
                style={accentBg}
              >
                {displayName?.[0] || "나"}
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "rgb(var(--accent-070))" }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
                <Heart className="w-3.5 h-3.5" style={{ color: "rgb(var(--accent-070))" }} fill="currentColor" />
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "rgb(var(--accent-070))" }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 + 0.5 }}
                    />
                  ))}
                </div>
              </div>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-[20px] font-semibold"
                style={{ background: "rgb(var(--accent-010))", color: "rgb(var(--accent-070))" }}
              >
                ?
              </div>
            </div>
            <H2>연결 중...</H2>
            <Meta>잠시만요, 둘을 이어드릴게요</Meta>
            <motion.div
              className="w-9 h-9 border-2 rounded-full"
              style={{ borderColor: "rgb(var(--accent-030))", borderTopColor: "rgb(var(--accent-070))" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}

        {/* ── OB_11: Connection Failed ── */}
        {step === "fail" && (
          <motion.div key="fail" {...slide} className="flex-1 flex flex-col items-center justify-center gap-3.5 px-7 pb-10">
            <div
              className="w-[76px] h-[76px] rounded-full flex items-center justify-center"
              style={{ background: "rgb(var(--color-couple-status-red) / 0.12)", border: "1.6px solid rgb(var(--color-couple-status-red))" }}
            >
              <span className="text-[38px] font-bold" style={{ color: "rgb(var(--color-couple-status-red))" }}>×</span>
            </div>
            <H2 className="mt-2">연결할 수 없어요</H2>
            <Body className="text-center leading-relaxed max-w-[280px]" style={{ color: "var(--app-ink-2)" }}>
              {failMessage || "이 코드는 만료되었거나 이미 사용된 코드예요. 파트너에게 새 코드를 받아주세요."}
            </Body>
            <button
              onClick={() => { setInviteCode(""); setStep("code-enter"); }}
              className="mt-4 w-60 py-3.5 rounded-full text-[16px] font-semibold"
              style={accentBg}
            >
              다시 입력하기
            </button>
            <button
              onClick={() => setStep("region")}
              className="text-[13px] mt-1"
              style={{ color: "var(--app-ink-3)" }}
            >
              나중에 할게요
            </button>
          </motion.div>
        )}

        {/* ── OB Region Select ── */}
        {step === "region" && (
          <motion.div key="region" {...slide} className="flex-1 flex flex-col px-7 pt-14 pb-10">
            <Tiny>3 / {totalSteps} 단계</Tiny>
            <H1 className="mt-3">
              어디부터
              <br />
              시작할까요?
            </H1>
            <Meta className="mt-2">관심있는 지역을 골라주세요. 나중에 더 추가할 수 있어요.</Meta>

            {coupleId && (
              <div className="glass-card p-3 mt-4 flex items-center gap-2">
                <Heart className="w-4 h-4" style={{ color: "rgb(var(--accent-070))" }} fill="currentColor" />
                <Meta style={{ color: "rgb(var(--accent-070))" }}>커플 연결 완료!</Meta>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-5">
              {REGIONS.map((region) => {
                const selected = selectedRegions.includes(region.name);
                return (
                  <button
                    key={region.name}
                    onClick={() =>
                      setSelectedRegions((prev) =>
                        prev.includes(region.name) ? prev.filter((r) => r !== region.name) : [...prev, region.name]
                      )
                    }
                    className={`p-4 rounded-2xl text-left min-h-[100px] flex flex-col justify-between transition-all ${selected ? "glass-card" : ""}`}
                    style={
                      selected
                        ? { border: "2px solid rgb(var(--accent-070))", background: "rgb(var(--accent-010))" }
                        : { border: "2px dashed var(--app-line-soft)" }
                    }
                  >
                    <span className="text-2xl">{region.emoji}</span>
                    <div>
                      <H3>{region.name}</H3>
                      <Meta>{region.sub}</Meta>
                    </div>
                  </button>
                );
              })}
              <button
                className="p-4 rounded-2xl text-left min-h-[100px] flex flex-col justify-between"
                style={{ border: "2px dashed var(--app-line-soft)" }}
              >
                <span className="text-2xl">📍</span>
                <div>
                  <H3>+ 직접 추가</H3>
                  <Meta>도시명</Meta>
                </div>
              </button>
            </div>

            <div className="flex-1" />

            <button
              onClick={() => setStep("done")}
              className="w-full py-3.5 rounded-full text-[16px] font-semibold"
              style={accentBg}
            >
              {selectedRegions.length > 0 ? `${selectedRegions.length}개 선택하고 다음` : "바로 다음"}
            </button>
            <ProgressDots />
          </motion.div>
        )}

        {/* ── OB_12: Done ── */}
        {step === "done" && (
          <motion.div key="done" {...slide} className="flex-1 flex flex-col px-7 pt-14 pb-10">
            <Tiny>4 / {totalSteps} 단계 · 완료</Tiny>
            <H1 className="mt-2">준비됐어요!</H1>
            <Meta className="mt-1">
              {coupleId ? `${displayName || "파트너"}님과 연결되었어요 💕` : "혼자서도 시작할 수 있어요"}
            </Meta>

            {coupleId && (
              <div
                className="mt-6 rounded-2xl p-5 text-center"
                style={{ background: "rgb(var(--accent-010))", border: "1px solid var(--app-line-soft)" }}
              >
                <div className="flex items-center justify-center gap-3.5">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-semibold"
                    style={accentBg}
                  >
                    {displayName?.[0] || "나"}
                  </div>
                  <Heart className="w-6 h-6" style={{ color: "rgb(var(--accent-070))" }} fill="currentColor" />
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-semibold"
                    style={{ background: "rgb(var(--accent-020))", color: "rgb(var(--accent-070))" }}
                  >
                    ♥
                  </div>
                </div>
                <H3 className="mt-3">{displayName} ♥ 파트너</H3>
                <Meta className="mt-1 block">오늘부터 함께한 1일</Meta>
              </div>
            )}

            <div className="mt-5 space-y-2 leading-[1.7]">
              <Body style={{ color: "var(--app-ink-2)" }}>✓ 첫 추억 추가 가이드 보기</Body>
              <Body style={{ color: "var(--app-ink-2)" }}>✓ 우리 만난 날 설정하기</Body>
              <Body style={{ color: "var(--app-ink-2)" }}>✓ 알림 권한 켜기</Body>
            </div>

            <div className="flex-1" />

            <button
              onClick={handleComplete}
              className="w-full py-3.5 rounded-full text-[16px] font-semibold"
              style={accentBg}
            >
              둘 사이 시작하기
            </button>
            <ProgressDots />
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default Onboarding;
