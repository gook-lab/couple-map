import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus, Heart } from "lucide-react";
import { H2, H3, Body, Meta, Tiny } from "@/components/ui/typography";
import GlassList from "@/components/ui/glass-list";
import ListRow from "@/components/ui/list-row";
import StatCard from "@/components/ui/stat-card";
import PageTransition from "@/components/ui/page-transition";
import PageContainer from "@/components/layout/PageContainer";
import { spring } from "@/lib/animations";
import { useAuthStore } from "@/store/use-auth-store";
import { YearReviewScreen } from "@/components/shared/MissingScreens";

type CalendarTab = "calendar" | "anniversary" | "prepare" | "planner";
type PrepSub = null | "wishlist" | "letter";

const DAYS_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"];
const EVENTS: Record<number, string[]> = { 4: ["💖"], 7: ["🍜"], 11: ["🎂"], 17: ["🏖️", "✈️"], 24: ["💖"] };

const UPCOMING = [
  { date: "5/11", title: "파트너 생일", tag: "D-7", accent: true },
  { date: "5/17", title: "도쿄 여행 시작", tag: "✈️ 4박 5일", accent: false },
  { date: "5/24", title: "500일 기념일", tag: "D-20", accent: true },
];

const ANNIVERSARIES = [
  { day: "11", title: "파트너 생일", sub: "🎂 D-7" },
  { day: "24", title: "만난 지 500일", sub: "💖 D-20" },
  { day: "27", title: "첫 데이트 기념", sub: "☕ D-23" },
];

const PREP_MENU = [
  { emoji: "🎁", title: "선물 위시리스트 보기", sub: "파트너가 좋아할 만한 것들", action: "wishlist" as const },
  { emoji: "💌", title: "편지 쓰기", sub: "기념일 자정에 자동 전달", action: "letter" as const },
  { emoji: "📍", title: "데이트 코스 짜기", sub: "둘이 가본 곳 / 새로운 곳", action: null },
  { emoji: "📖", title: "추억 되돌아보기", sub: "이번 한 해를 영상으로", action: null },
  { emoji: "🍰", title: "서프라이즈 예약", sub: "레스토랑 · 케이크 · 꽃", action: null },
];

const WISHLIST = [
  { name: "향수", price: "89,000원", hot: true },
  { name: "운동화", price: "149,000원", hot: false },
  { name: "책", price: "18,000원", hot: false },
  { name: "키링", price: "32,000원", hot: true },
];

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.state.user);
  const [tab, setTab] = useState<CalendarTab>("calendar");
  const [prepSub, setPrepSub] = useState<PrepSub>(null);
  const [letterText, setLetterText] = useState("");
  const [showYearReview, setShowYearReview] = useState(false);
  const [month] = useState({ year: 2026, month: 5 });

  const daysInMonth = new Date(month.year, month.month, 0).getDate();
  const firstDayOfWeek = new Date(month.year, month.month - 1, 1).getDay();
  const today = new Date().getDate();
  const calendarDays = Array.from({ length: 42 }, (_, i) => i - firstDayOfWeek + 1);

  if (showYearReview) {
    return <YearReviewScreen onClose={() => setShowYearReview(false)} />;
  }

  const accentBg = { background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)" } as React.CSSProperties;
  const placeholderTile = { background: "var(--app-line-soft)" } as React.CSSProperties;
  const cardSurface = { background: "var(--app-card)", border: "1px solid var(--app-line-soft)" } as React.CSSProperties;
  const ghostText = { color: "var(--app-ink-2)" } as React.CSSProperties;

  return (
    <PageContainer withBottomNav>
      <header className="glass-bar px-4 pt-3 pb-0 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => {
              if (prepSub) { setPrepSub(null); return; }
              if (tab === "prepare") { setTab("anniversary"); return; }
              navigate(-1);
            }}
            aria-label="뒤로 가기"
            className="p-1"
          >
            <ChevronLeft className="w-5 h-5" style={{ color: "var(--app-ink)" }} />
          </button>
          <H2>{prepSub === "wishlist" ? "파트너 위시리스트" : prepSub === "letter" ? "편지 쓰기" : tab === "prepare" ? "기념일 준비" : "캘린더"}</H2>
        </div>
        {!prepSub && tab !== "prepare" && (
          <div className="flex glass rounded-full p-0.5">
            {([
              { key: "calendar" as CalendarTab, label: "캘린더" },
              { key: "anniversary" as CalendarTab, label: "기념일" },
              { key: "planner" as CalendarTab, label: "플래너" },
            ]).map((t) => {
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="flex-1 py-2 rounded-full text-[14px] font-semibold transition-all"
                  style={
                    isActive
                      ? { background: "var(--app-card)", color: "rgb(var(--accent-070))", boxShadow: "var(--app-shadow)" }
                      : { color: "var(--app-ink-2)" }
                  }
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      <PageTransition>
        <div className="px-5 pt-4">
          {/* ── Calendar Tab ── */}
          {tab === "calendar" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <button className="p-2 glass-card" style={{ borderRadius: 12 }} aria-label="이전 달">
                  <ChevronLeft className="w-4 h-4" style={ghostText} />
                </button>
                <H3>{month.year}년 {month.month}월</H3>
                <button className="p-2 glass-card" style={{ borderRadius: 12 }} aria-label="다음 달">
                  <ChevronRight className="w-4 h-4" style={ghostText} />
                </button>
              </div>
              <div className="grid grid-cols-7 mb-1">
                {DAYS_OF_WEEK.map((d, i) => (
                  <div
                    key={d}
                    className="text-center py-1.5 text-[12px] font-medium"
                    style={{ color: i === 0 ? "rgb(var(--accent-070))" : "var(--app-ink-2)" }}
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {calendarDays.slice(0, 35).map((d, i) => {
                  const isInMonth = d > 0 && d <= daysInMonth;
                  const isToday = d === today;
                  const events = EVENTS[d];
                  return (
                    <div
                      key={i}
                      className={`flex flex-col items-center py-1.5 rounded-xl ${isInMonth ? "" : "opacity-30"} ${events && !isToday ? "glass-card" : ""}`}
                      style={isToday ? { background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", borderRadius: 12 } : undefined}
                    >
                      <span className={`text-[13px] ${isToday ? "font-bold" : "font-medium"}`}>{isInMonth ? d : ""}</span>
                      {events && <span className="text-[10px] mt-0.5">{events.join("")}</span>}
                    </div>
                  );
                })}
              </div>
              <GlassList header="다가오는 일정" className="mt-6">
                {UPCOMING.map((event, i) => (
                  <ListRow
                    key={i}
                    emoji={event.accent ? "💖" : "📅"}
                    title={event.title}
                    detail={event.tag}
                    isLast={i === UPCOMING.length - 1}
                  />
                ))}
              </GlassList>
            </div>
          )}

          {/* ── Anniversary Tab ── */}
          {tab === "anniversary" && !prepSub && (
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={spring}
                className="glass-card p-6 text-center"
                style={{ background: "rgb(var(--accent-070))", color: "#ffffff" }}
              >
                <Meta style={{ color: "rgba(255,255,255,0.8)" }}>500일까지</Meta>
                <div className="text-[56px] font-extrabold leading-none mt-1">D-18</div>
                <Meta style={{ color: "rgba(255,255,255,0.8)" }} className="mt-2 block">2026.05.24 토요일</Meta>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-[16px] font-semibold">
                    {user?.displayName?.[0] || "나"}
                  </div>
                  <Heart className="w-5 h-5" style={{ color: "rgba(255,255,255,0.8)" }} fill="currentColor" />
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-[16px] font-semibold">♥</div>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <StatCard value="482일" label="함께한 날" />
                <StatCard value="11,568h" label="함께한 시간" />
              </div>

              <GlassList header="이번 달 기념일" className="mt-5">
                {ANNIVERSARIES.map((ann, i) => (
                  <ListRow
                    key={i}
                    emoji={ann.sub.includes("🎂") ? "🎂" : ann.sub.includes("💖") ? "💖" : "☕"}
                    title={ann.title}
                    detail={ann.sub}
                    isLast={i === ANNIVERSARIES.length - 1}
                  />
                ))}
              </GlassList>

              <button
                onClick={() => setTab("prepare")}
                className="w-full mt-4 py-3.5 rounded-full text-[16px] font-semibold"
                style={accentBg}
              >
                특별한 하루 준비하기
              </button>
              <button
                onClick={() => setShowYearReview(true)}
                className="w-full mt-2 py-3 rounded-full glass-pill text-[15px] font-medium flex items-center justify-center gap-1.5"
                style={ghostText}
              >
                📖 1년 추억 보기
              </button>
              <button
                onClick={() => navigate("/anniversary/add")}
                className="w-full mt-2 py-3 rounded-full glass-pill text-[15px] font-medium flex items-center justify-center gap-1.5"
                style={ghostText}
              >
                <Plus className="w-4 h-4" /> 기념일 추가
              </button>
            </div>
          )}

          {/* ── Prepare Menu ── */}
          {tab === "prepare" && !prepSub && (
            <div>
              <Meta className="mb-4 block">파트너 모르게 준비할 수 있어요 🤫</Meta>
              <div className="flex flex-col gap-2.5">
                {PREP_MENU.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => { if (item.action) setPrepSub(item.action); }}
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl text-left transition-all"
                    style={
                      i === 0
                        ? { background: "rgb(var(--accent-010))", border: "1.6px solid rgb(var(--accent-070))" }
                        : { background: "var(--app-card)", border: "1.6px solid var(--app-line-soft)" }
                    }
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1">
                      <Body className="font-semibold block">{item.title}</Body>
                      <Meta className="mt-0.5 block">{item.sub}</Meta>
                    </div>
                    <ChevronRight className="w-4 h-4" style={{ color: "var(--app-ink-3)" }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Wishlist Sub ── */}
          {prepSub === "wishlist" && (
            <div>
              <Meta className="mb-3 block">파트너가 ♥ 한 것들 · {WISHLIST.length}개</Meta>
              <div className="flex gap-2 mb-4">
                {["전체", "구매한 것", "받고 싶어요"].map((f, i) => (
                  <button
                    key={f}
                    className="px-3.5 py-1.5 rounded-full text-[13px] font-medium"
                    style={
                      i === 0
                        ? { background: "var(--app-ink)", color: "var(--app-bg)" }
                        : { background: "var(--app-card)", border: "1px solid var(--app-line-soft)", color: "var(--app-ink-2)" }
                    }
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {WISHLIST.map((item, i) => (
                  <div key={i} className="rounded-xl overflow-hidden" style={cardSurface}>
                    <div className="aspect-square flex items-center justify-center" style={placeholderTile}>
                      <span className="text-3xl opacity-30">🎁</span>
                    </div>
                    <div className="p-2.5">
                      <Body className="font-semibold block">{item.name}</Body>
                      <Tiny className="mt-0.5 block">{item.price}</Tiny>
                      {item.hot && (
                        <span className="text-[10px] font-bold mt-1 inline-block" style={{ color: "rgb(var(--accent-070))" }}>♥ ♥ ♥</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Letter Sub ── */}
          {prepSub === "letter" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <Meta>기념일 자정에 자동 발송</Meta>
                <button className="text-[14px] font-semibold" style={{ color: "rgb(var(--accent-070))" }}>예약</button>
              </div>
              {/* 노란 편지지: 다크모드에서도 종이는 노란색 유지 → 글자는 fixed 다크 */}
              <div className="rounded-2xl p-5" style={{ background: "rgb(var(--color-couple-yellow))", color: "#1c1917" }}>
                <Tiny style={{ color: "rgba(28,25,23,0.6)" }}>2026.05.24 · 새벽 0시 자동 발송</Tiny>
                <p className="mt-3 text-[15px] font-semibold">파트너에게,</p>
                <textarea
                  value={letterText}
                  onChange={(e) => setLetterText(e.target.value)}
                  placeholder="마음을 담아 편지를 써보세요..."
                  className="w-full mt-2 min-h-[160px] bg-transparent text-[15px] outline-none resize-none leading-[1.85] placeholder:opacity-50"
                  style={{ color: "#1c1917" }}
                />
              </div>
              <div className="flex gap-2 mt-3">
                {["📷 사진 첨부", "🎵 노래 첨부", "🎤 음성"].map((label) => (
                  <button
                    key={label}
                    className="px-3 py-1.5 rounded-full text-[13px]"
                    style={{ border: "1px solid var(--app-line-soft)", color: "var(--app-ink-2)" }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Tiny className="mt-3 block">지금 작성하면 기념일 자정에 도착해요</Tiny>
            </div>
          )}

          {/* ── Planner Tab ── */}
          {tab === "planner" && (
            <div>
              <Tiny className="block mb-1">DATE PLAN</Tiny>
              <H3>도쿄 여행 ✈️</H3>
              <Meta className="block mt-1">5/17 토 → 5/21 수 · 4박 5일</Meta>

              <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
                {["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"].map((day, i) => (
                  <button
                    key={day}
                    className="px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap"
                    style={
                      i === 0
                        ? { background: "var(--app-ink)", color: "var(--app-bg)" }
                        : { background: "var(--app-card)", border: "1px solid var(--app-line-soft)" }
                    }
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <Tiny className="block mb-2">5월 17일 토요일</Tiny>
                <div className="relative pl-8">
                  <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: "var(--app-line-soft)" }} />
                  {[
                    { time: "10:00", emoji: "✈️", title: "GMP → NRT", sub: "JL091 · 인천공항" },
                    { time: "14:30", emoji: "🏨", title: "시부야 호텔 체크인", sub: "Shibuya Tobu" },
                    { time: "17:00", emoji: "🌆", title: "시부야 스카이", sub: "예약완료 · 결제 완료" },
                    { time: "20:00", emoji: "🍣", title: "저녁 - 우오베이", sub: "회전초밥 · 추천" },
                  ].map((item, i) => (
                    <div key={i} className="relative flex gap-3 pb-4">
                      <div
                        className="absolute left-[-22px] top-1 w-3 h-3 rounded-full border-2"
                        style={{ background: "rgb(var(--accent-070))", borderColor: "var(--app-card)" }}
                      />
                      <Tiny className="w-10 text-right flex-shrink-0 pt-0.5">{item.time}</Tiny>
                      <div className="flex-1 rounded-xl p-3" style={cardSurface}>
                        <div className="flex items-center gap-2">
                          <span>{item.emoji}</span>
                          <Body className="font-semibold">{item.title}</Body>
                        </div>
                        <Tiny className="mt-0.5 block">{item.sub}</Tiny>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="w-full py-3 rounded-full glass-pill text-[15px] font-medium flex items-center justify-center gap-1.5 mt-2"
                  style={ghostText}
                >
                  + 일정 추가
                </button>
              </div>
            </div>
          )}
        </div>
      </PageTransition>
    </PageContainer>
  );
};

export default Calendar;
