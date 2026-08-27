import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Minus, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { H3, Body, Meta, Tiny } from "@/components/ui/typography";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { useAuthStore } from "@/store/use-auth-store";

type Step = "intro" | "sharing" | "onway" | "geofence" | "together" | "pause";

const GEOFENCE_OPTIONS = [
  { id: "500m", label: "500m 전", desc: "천천히 마중나가기 좋은 거리" },
  { id: "arrive", label: "도착 시", desc: "정확히 도착했을 때" },
  { id: "5min", label: "5분 후 도착", desc: "미리 준비할 시간 확보" },
];

const PAUSE_OPTIONS = [
  { id: "1h", label: "1시간", desc: "잠깐 사라지기" },
  { id: "today", label: "오늘 하루", desc: "내일 아침 자동 재시작" },
  { id: "manual", label: "내가 다시 켤 때까지", desc: "무기한" },
];

const STEP_TITLE: Record<Step, string> = {
  intro: "위치 공유",
  sharing: "위치 공유 중",
  onway: "가는 중",
  geofence: "도착 알림 설정",
  together: "📍 같은 장소",
  pause: "위치 공유 끄기",
};

const LocationShare: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.state.user);
  const [step, setStep] = useState<Step>("intro");
  const [geofence, setGeofence] = useState("500m");
  const [pauseOption, setPauseOption] = useState("manual");

  const myInitial = user?.displayName?.[0] || "나";

  const slide = { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 } };

  const handleBack = () => {
    if (step === "intro" || step === "sharing") navigate(-1);
    else setStep("sharing");
  };

  const accentBg = { background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)" } as React.CSSProperties;
  const accentSoftBg = { background: "rgb(var(--accent-020))", color: "rgb(var(--accent-070))" } as React.CSSProperties;
  const placeholderTile = { background: "var(--app-line-soft)" } as React.CSSProperties;
  const cardSurface = { background: "var(--app-card)", border: "1px solid var(--app-line-soft)" } as React.CSSProperties;

  return (
    <PageContainer flex>
      <PageHeader title={STEP_TITLE[step]} onBack={handleBack} />

      <AnimatePresence mode="wait">
        {/* ── LO_01: Intro ── */}
        {step === "intro" && (
          <motion.div key="intro" {...slide} className="flex-1 flex flex-col px-5 pt-4 pb-8">
            <Meta>둘 사이를 더 가깝게</Meta>

            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full h-[220px] rounded-2xl overflow-hidden" style={placeholderTile}>
                <div className="absolute left-[30%] top-[50%] -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-[14px] font-semibold" style={accentBg}>{myInitial}</div>
                </div>
                <div className="absolute right-[30%] top-[30%] -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-[14px] font-semibold" style={accentSoftBg}>♥</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { emoji: "🏃", text: "서로의 위치 실시간 확인" },
                { emoji: "⏰", text: "도착하면 자동 알림" },
                { emoji: "🔒", text: "둘만 볼 수 있어요" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="text-xl">{item.emoji}</span>
                  <Body>{item.text}</Body>
                </div>
              ))}
            </div>

            <button onClick={() => setStep("sharing")} className="w-full py-3.5 rounded-full text-[16px] font-semibold" style={accentBg}>
              위치 공유 시작
            </button>
            <button onClick={() => navigate(-1)} className="w-full py-3 mt-2 text-[13px]" style={{ color: "var(--app-ink-2)" }}>나중에 할게요</button>
          </motion.div>
        )}

        {/* ── LO_03: Sharing Map ── */}
        {step === "sharing" && (
          <motion.div key="sharing" {...slide} className="flex-1 flex flex-col">
            {/* Partner card */}
            <div className="mx-5 mt-3 p-3 rounded-2xl flex items-center gap-3" style={cardSurface}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-semibold" style={accentSoftBg}>♥</div>
              <div className="flex-1">
                <Body className="font-semibold">파트너 · 2.4km · 도보 32분</Body>
                <Tiny>강남구</Tiny>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ background: "#22c55e", color: "#ffffff" }}>● LIVE</span>
            </div>

            {/* Map area */}
            <div className="flex-1 mx-5 mt-3 mb-3 rounded-2xl relative overflow-hidden" style={placeholderTile}>
              {/* My pin */}
              <div className="absolute left-[40%] top-[55%]">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-semibold shadow-lg" style={accentBg}>{myInitial}</div>
                <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "rgb(var(--accent-070))" }} />
              </div>
              {/* Partner pin */}
              <div className="absolute right-[25%] top-[30%]">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-semibold shadow-lg" style={accentSoftBg}>♥</div>
                <Tiny className="text-center mt-1 block" style={{ color: "var(--app-ink-2)" }}>2.4km</Tiny>
              </div>
              {/* Dotted line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="42%" y1="57%" x2="72%" y2="33%" stroke="rgb(var(--accent-070))" strokeWidth="2" strokeDasharray="6 4" opacity="0.5" />
              </svg>

              {/* Controls */}
              <div className="absolute right-3 bottom-20 flex flex-col gap-2">
                {[Plus, Minus, MapPin].map((Icon, i) => (
                  <button key={i} className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm" style={cardSurface}>
                    <Icon className="w-4 h-4" style={{ color: "var(--app-ink-2)" }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom actions */}
            <div className="px-5 pb-6 flex gap-2">
              <button onClick={() => setStep("onway")} className="flex-1 py-3 rounded-full glass-pill text-[14px] font-medium" style={{ color: "var(--app-ink-2)" }}>경로 안내</button>
              <button onClick={() => setStep("geofence")} className="flex-1 py-3 rounded-full text-[14px] font-semibold" style={accentBg}>도착하면 알림</button>
            </div>
          </motion.div>
        )}

        {/* ── LO_04: On The Way ── */}
        {step === "onway" && (
          <motion.div key="onway" {...slide} className="flex-1 flex flex-col">
            <div className="flex-1 mx-5 mt-3 rounded-2xl relative overflow-hidden" style={placeholderTile}>
              <div className="absolute left-[50%] top-[40%] -translate-x-1/2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-semibold" style={accentBg}>{myInitial}</div>
              </div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path d="M 50% 42% Q 60% 20% 75% 15%" fill="none" stroke="rgb(var(--accent-070))" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.6" />
              </svg>
            </div>

            {/* ETA card */}
            <div className="mx-5 mt-3 p-4 rounded-2xl text-center" style={cardSurface}>
              <Tiny>파트너에게 가는 중</Tiny>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <span className="text-[28px] font-bold" style={{ color: "var(--app-ink)" }}>13분</span>
                <Meta>남았어요 · 850m</Meta>
              </div>
              <div className="h-1 rounded-full mt-3 overflow-hidden" style={placeholderTile}>
                {/* width 대신 transform (레이아웃 재계산 회피, 시각 동일) */}
                <motion.div className="h-full w-full rounded-full" style={{ background: "rgb(var(--accent-070))" }} initial={{ x: "-100%" }} animate={{ x: "-36%" }} transition={{ duration: 1.5 }} />
              </div>
            </div>

            {/* Partner message */}
            <div className="mx-5 mt-3 mb-6 p-3 rounded-2xl flex items-center gap-3" style={cardSurface}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold" style={accentSoftBg}>♥</div>
              <div className="flex-1">
                <Body>"천천히 와! 카페 자리 잡았어 ☕"</Body>
                <Tiny className="block mt-0.5">3분 전 · 파트너</Tiny>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── LO_05: Geofence ── */}
        {step === "geofence" && (
          <motion.div key="geofence" {...slide} className="flex-1 flex flex-col px-5 pt-3 pb-8">
            {/* Place card */}
            <div className="p-3.5 rounded-2xl" style={cardSurface}>
              <Tiny>장소</Tiny>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4" style={{ color: "rgb(var(--accent-070))" }} />
                <Body className="font-semibold">커피브레이크 강남점</Body>
              </div>
              <Tiny className="mt-0.5 ml-6 block">서울 강남구 테헤란로 132</Tiny>
            </div>

            <div className="flex flex-col gap-2.5 mt-5">
              {GEOFENCE_OPTIONS.map((opt) => {
                const isSelected = geofence === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setGeofence(opt.id)}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl text-left transition-all"
                    style={{
                      background: isSelected ? "rgb(var(--accent-010))" : "var(--app-card)",
                      border: `1.6px solid ${isSelected ? "rgb(var(--accent-070))" : "var(--app-line-soft)"}`,
                    }}
                  >
                    <div className="flex-1">
                      <Body className="font-semibold">{opt.label}</Body>
                      <Meta className="mt-0.5 block">{opt.desc}</Meta>
                    </div>
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: isSelected ? "rgb(var(--accent-070))" : "var(--app-line)",
                        background: isSelected ? "rgb(var(--accent-070))" : "transparent",
                      }}
                    >
                      {isSelected && <span className="text-[10px]" style={{ color: "var(--app-ink-on-accent)" }}>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex-1" />
            <button onClick={() => setStep("sharing")} className="w-full py-3.5 rounded-full text-[16px] font-semibold" style={accentBg}>
              알림 켜기
            </button>
          </motion.div>
        )}

        {/* ── LO_07: Together ── */}
        {step === "together" && (
          <motion.div key="together" {...slide} className="flex-1 flex flex-col px-5 pt-3 pb-8">
            <div
              className="rounded-2xl p-5 text-center"
              style={{ background: "rgb(var(--accent-010))", border: "1.6px solid rgb(var(--accent-070))" }}
            >
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-[14px] font-semibold" style={{ ...accentBg, border: "2px solid var(--app-card)" }}>{myInitial}</div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-[14px] font-semibold -ml-2" style={{ ...accentSoftBg, border: "2px solid var(--app-card)" }}>♥</div>
              </div>
              <H3 className="mt-3">지금 함께!</H3>
              <Meta>커피브레이크 강남점</Meta>
              <Tiny className="mt-1 block" style={{ color: "rgb(var(--accent-070))" }}>● 14분째 같은 장소</Tiny>
            </div>

            <div className="mt-5 p-4 rounded-2xl" style={cardSurface}>
              <Meta className="mb-3 block">이 순간 추억으로 만들기</Meta>
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 rounded-full glass-pill text-[13px] font-medium">📷 사진</button>
                <button className="flex-1 py-2.5 rounded-full glass-pill text-[13px] font-medium">📍 핀 추가</button>
                <button className="flex-1 py-2.5 rounded-full text-[13px] font-semibold" style={accentBg}>🤳 셀카</button>
              </div>
            </div>

            <div className="mt-5">
              <Tiny className="mb-2 block">이전에 같이 왔던 곳</Tiny>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-1 h-[70px] rounded-xl flex items-center justify-center" style={placeholderTile}>
                    <Tiny>📸</Tiny>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── LO_08: Pause ── */}
        {step === "pause" && (
          <motion.div key="pause" {...slide} className="flex-1 flex flex-col px-5 pt-3 pb-8">
            <Meta className="mb-4 block">언제든 다시 켤 수 있어요</Meta>

            <div className="flex flex-col gap-2.5">
              {PAUSE_OPTIONS.map((opt) => {
                const isSelected = pauseOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setPauseOption(opt.id)}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl text-left transition-all"
                    style={{
                      background: isSelected ? "rgb(var(--accent-010))" : "var(--app-card)",
                      border: `1.6px solid ${isSelected ? "rgb(var(--accent-070))" : "var(--app-line-soft)"}`,
                    }}
                  >
                    <div className="flex-1">
                      <Body className="font-semibold">{opt.label}</Body>
                      <Meta className="mt-0.5 block">{opt.desc}</Meta>
                    </div>
                    <div
                      className="w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: isSelected ? "rgb(var(--accent-070))" : "var(--app-line)",
                        background: isSelected ? "rgb(var(--accent-070))" : "transparent",
                      }}
                    >
                      {isSelected && <span className="text-[10px]" style={{ color: "var(--app-ink-on-accent)" }}>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            <div
              className="mt-4 p-3 rounded-xl text-[12px] leading-relaxed"
              style={{ background: "rgb(var(--color-couple-status-red) / 0.08)", color: "rgb(var(--color-couple-status-red))" }}
            >
              ⚠️ 파트너가 알림을 받지 않아요. 끄는 동안 표시는 "위치 끔"이에요.
            </div>

            <div className="flex-1" />
            <button onClick={() => navigate(-1)} className="w-full py-3.5 rounded-full text-[16px] font-semibold" style={accentBg}>
              위치 공유 끄기
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default LocationShare;
