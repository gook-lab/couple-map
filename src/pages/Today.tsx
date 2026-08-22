import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import { H1, H3, Meta, Tiny, Emphasis } from "@/components/ui/typography";
import GlassList from "@/components/ui/glass-list";
import ListRow from "@/components/ui/list-row";
import PageTransition from "@/components/ui/page-transition";
import PageContainer from "@/components/layout/PageContainer";
import { Sticker, Badge, CandyCard, type CandyColor } from "@/components/ui/sticker";
import { staggerItem, spring } from "@/lib/animations";
import { subscribePlaces } from "@/services/places";
import { KOREA_REGIONS } from "@/lib/countries";
import KoreaGeoMap from "@/components/maps/KoreaGeoMap";
import { useAuthStore } from "@/store/use-auth-store";
import SoloModeBanner from "@/components/shared/SoloModeBanner";
import type { Place } from "@/types/place";

type HomeTab = "feed" | "map" | "cards";
const MOODS = ["😊", "🥰", "😴", "😭", "🔥"];
const CATEGORY_EMOJI: Record<string, string> = { 음식점: "🍜", 카페: "☕", 관광명소: "🏖️", 숙박: "🏨", 기타: "📍" };

const QUICK_ACTIONS: { emoji: string; label: string; to: string; color: CandyColor }[] = [
  { emoji: "🎲", label: "데이트 룰렛", to: "/roulette", color: "butter" },
  { emoji: "💬", label: "오늘의 질문", to: "/daily-question", color: "sky" },
  { emoji: "📊", label: "통계", to: "/stats", color: "mint" },
  { emoji: "💸", label: "데이트 비용", to: "/expenses", color: "peach" },
  { emoji: "🔮", label: "타임캡슐", to: "/time-capsule", color: "lilac" },
  { emoji: "🏆", label: "챌린지", to: "/challenge", color: "pink" },
  { emoji: "🏷️", label: "스티커북", to: "/stickers", color: "butter" },
  { emoji: "📖", label: "여행기", to: "/travelogue", color: "sky" },
  { emoji: "🔍", label: "탐색", to: "/explore", color: "mint" },
  { emoji: "🖨️", label: "굿즈", to: "/print", color: "peach" },
];

const Today: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.state.user);
  const coupleId = useAuthStore((s) => s.state.coupleId);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [homeTab, setHomeTab] = useState<HomeTab>("feed");
  const dDay = 482;

  const today = new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" });

  useEffect(() => {
    if (!coupleId) return;
    try { return subscribePlaces(coupleId, setPlaces); } catch { /* */ }
  }, [coupleId]);

  const recentPlaces = places.slice(0, 3);
  const visitedRegions = new Set<string>(
    places
      .map((p) => KOREA_REGIONS.find((r) => p.region?.includes(r.name))?.id)
      .filter((id): id is NonNullable<typeof id> => id != null)
  );
  const regionPills = KOREA_REGIONS.filter((r) => visitedRegions.has(r.id));
  const regionCounts: Record<string, number> = {};
  places.forEach((p) => {
    const region = KOREA_REGIONS.find((r) => p.region?.includes(r.name));
    if (region) regionCounts[region.id] = (regionCounts[region.id] || 0) + 1;
  });

  const iconSq = {
    background: "rgb(var(--accent-010))",
    border: "1.5px solid var(--app-line)",
  } as React.CSSProperties;

  const progressTrack = {
    background: "rgba(255,255,255,0.55)",
    border: "1.5px solid var(--app-line)",
  } as React.CSSProperties;

  return (
    <PageContainer withBottomNav>
      <PageTransition>
        <div className="px-5 pt-5 pb-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <Sticker color="butter">{today}</Sticker>
              <H1 className="mt-2">안녕, {user?.displayName || "우리"} 👋</H1>
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label="검색"
                onClick={() => navigate("/search")}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={iconSq}
              >
                <Search className="w-4 h-4" style={{ color: "var(--app-ink)" }} />
              </button>
              <div className="relative">
                <button
                  aria-label="알림"
                  onClick={() => navigate("/notifications")}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={iconSq}
                >
                  <Bell className="w-4 h-4" style={{ color: "var(--app-ink)" }} />
                </button>
                <Badge color="pink" className="absolute -top-2 -right-2" style={{ minWidth: 20, height: 20 }}>3</Badge>
              </div>
            </div>
          </div>

          {/* Tab selector */}
          <div className="flex gap-1.5 mt-4">
            {([
              { id: "feed", label: "피드" },
              { id: "map", label: "지도" },
              { id: "cards", label: "카드" },
            ] as const).map((tab) => {
              const isActive = homeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setHomeTab(tab.id)}
                  className="px-4 py-1.5 rounded-full text-[13px] font-bold transition-all"
                  style={
                    isActive
                      ? { background: "var(--app-ink)", color: "var(--app-bg)", border: "1.5px solid var(--app-line)" }
                      : { background: "var(--app-card)", color: "var(--app-ink-2)", border: "1.5px solid var(--app-line-soft)" }
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Feed View ── */}
        {homeTab === "feed" && (
          <div className="px-5">
            {!coupleId && <div className="mb-4"><SoloModeBanner /></div>}
            {/* D-Day Card */}
            <motion.div variants={staggerItem} initial="initial" animate="animate" transition={spring}>
              <CandyCard color="peach" className="p-5" style={{ borderRadius: "var(--app-radius-lg)" }}>
                <Sticker color="paper">🔥 D-DAY</Sticker>
                <div className="mt-2 flex items-baseline gap-1">
                  <H1><Emphasis>D+{dDay}</Emphasis></H1>
                  <Meta>일째 함께</Meta>
                </div>
                <Meta className="mt-1 block">500일까지 {500 - dDay}일 남았어요 🎉</Meta>
                <div className="h-2 rounded-full mt-3 overflow-hidden" style={progressTrack}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "var(--app-ink)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(dDay / 500) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </CandyCard>
            </motion.div>

            {/* Anniversary quick add */}
            <CandyCard color="mint" onClick={() => navigate("/anniversary/add")} className="w-full mt-3 p-3.5 flex items-center gap-3">
              <span className="text-xl">🎉</span>
              <div className="flex-1">
                <H3>기념일 등록하기</H3>
                <Meta className="block mt-0.5">특별한 날을 기록해요</Meta>
              </div>
              <span className="text-[15px] font-bold">›</span>
            </CandyCard>

            {/* Mood Check-in */}
            <div className="mt-5">
              <Tiny className="block mb-2">오늘의 기분</Tiny>
              <div className="flex gap-2">
                {MOODS.map((emoji, i) => {
                  const isActive = selectedMood === i;
                  return (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedMood(i)}
                      className="flex-1 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all"
                      style={{
                        background: isActive ? "rgb(var(--accent-010))" : "var(--app-card)",
                        border: `1.5px solid ${isActive ? "rgb(var(--accent-070))" : "var(--app-line-soft)"}`,
                        boxShadow: isActive ? "var(--app-shadow)" : undefined,
                      }}
                    >
                      {emoji}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Recent places */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <Tiny>최근 핀</Tiny>
                <button onClick={() => navigate("/travel")} className="text-[12px] font-bold" style={{ color: "rgb(var(--accent-070))" }}>
                  전체보기 ›
                </button>
              </div>
              {recentPlaces.length > 0 ? (
                <GlassList>
                  {recentPlaces.map((place, i) => (
                    <ListRow
                      key={place.id}
                      emoji={CATEGORY_EMOJI[place.category] || "📍"}
                      title={place.name}
                      detail={place.region}
                      isLast={i === recentPlaces.length - 1}
                      onClick={() => navigate(`/memory/${place.id}`)}
                    />
                  ))}
                </GlassList>
              ) : (
                <div className="glass-card p-5 text-center">
                  <div className="text-3xl mb-2">📍</div>
                  <H3>아직 핀이 없어요</H3>
                  <Meta className="mt-1 block">지도에서 첫 추억을 남겨보세요</Meta>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Map View ── */}
        {homeTab === "map" && (
          <div className="px-5">
            {/* Couple header */}
            <CandyCard color="peach" className="p-3.5 flex items-center justify-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold"
                style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)" }}
              >
                {user?.displayName?.[0] || "나"}
              </div>
              <div className="text-center">
                <Tiny>함께한 지</Tiny>
                <span className="text-[18px] font-extrabold block">D+{dDay}</span>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold"
                style={{ background: "var(--c-lilac)", color: "var(--app-ink)", border: "1.5px solid var(--app-line)" }}
              >
                ♥
              </div>
            </CandyCard>

            {/* Geographic map */}
            <div className="rounded-2xl overflow-hidden mt-3 glass-card">
              <KoreaGeoMap
                visitedRegions={visitedRegions}
                regionCounts={regionCounts}
                onRegionClick={() => navigate("/travel")}
              />
              <div className="text-center pb-2">
                <Meta>우리의 지도 · {places.length} spots</Meta>
              </div>
            </div>

            {/* Region pills */}
            {regionPills.length > 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
                {regionPills.map((r) => {
                  const count = places.filter((p) => p.region?.includes(r.name)).length;
                  return (
                    <button
                      key={r.id}
                      onClick={() => navigate(`/region/${r.id}`)}
                      className="px-3 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap flex-none"
                      style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)" }}
                    >
                      {r.name} {count}
                    </button>
                  );
                })}
                <button
                  onClick={() => navigate("/add/country")}
                  className="px-3 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap flex-none"
                  style={{ border: "1.5px dashed var(--app-line)", color: "var(--app-ink-2)" }}
                >
                  + 추가
                </button>
              </div>
            )}

            {/* Recent pins */}
            {recentPlaces.length > 0 && (
              <GlassList header="최근 핀" className="mt-4">
                {recentPlaces.map((place, i) => (
                  <ListRow
                    key={place.id}
                    emoji={CATEGORY_EMOJI[place.category] || "📍"}
                    title={place.name}
                    detail={place.region}
                    isLast={i === recentPlaces.length - 1}
                    onClick={() => navigate(`/memory/${place.id}`)}
                  />
                ))}
              </GlassList>
            )}
          </div>
        )}

        {/* ── Cards View ── */}
        {homeTab === "cards" && (
          <div className="px-5">
            {/* Main stat card */}
            <CandyCard color="peach" className="p-5" style={{ borderRadius: "var(--app-radius-lg)" }}>
              <Sticker color="paper">함께한 시간</Sticker>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-[32px] font-extrabold">{dDay}일</span>
                <Meta>째</Meta>
              </div>
              <Meta className="mt-1 block">500일까지 {500 - dDay}일 남았어요 🎉</Meta>
              <div className="h-2 rounded-full mt-3 overflow-hidden" style={progressTrack}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "var(--app-ink)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(dDay / 500) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </CandyCard>

            {/* Widget grid */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <CandyCard color="sky" className="p-4">
                <Tiny>다음 데이트</Tiny>
                <H3 className="mt-1">토요일 7시</H3>
                <Meta>을지로 · 도토리</Meta>
              </CandyCard>
              <CandyCard color="butter" className="p-4">
                <Tiny>이번달 데이트비</Tiny>
                <H3 className="mt-1">318,400원</H3>
                <Meta>52% · 48%</Meta>
              </CandyCard>
              <CandyCard color="lilac" className="p-4">
                <Tiny>파트너 기분</Tiny>
                <H3 className="mt-1">피곤해 😴</H3>
                <Meta>2시간 전</Meta>
              </CandyCard>
              <CandyCard color="pink" onClick={() => navigate("/add/country")} className="p-4">
                <Tiny>새 추억</Tiny>
                <H3 className="mt-1">+ 오늘은</H3>
                <Meta>사진 · 일기 · 핀</Meta>
              </CandyCard>
            </div>

            {/* Quick actions */}
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
              {QUICK_ACTIONS.map((a) => (
                <CandyCard
                  key={a.to}
                  color={a.color}
                  onClick={() => navigate(a.to)}
                  className="flex-shrink-0 px-3 py-2 text-center"
                >
                  <span className="text-lg block">{a.emoji}</span>
                  <Tiny className="mt-0.5 block whitespace-nowrap">{a.label}</Tiny>
                </CandyCard>
              ))}
            </div>

            {/* Recent memories */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <Tiny>최근 추억</Tiny>
                <button onClick={() => navigate("/timeline")} className="text-[12px] font-bold" style={{ color: "rgb(var(--accent-070))" }}>전체보기 ›</button>
              </div>
              <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide">
                {places.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/memory/${p.id}`)}
                    className="flex-shrink-0 w-28 rounded-xl overflow-hidden"
                    style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)" }}
                  >
                    <div className="aspect-square flex items-center justify-center" style={{ background: "var(--app-line-soft)" }}>
                      <span className="text-2xl opacity-30">📸</span>
                    </div>
                    <div className="p-2">
                      <Tiny className="truncate block">{p.name}</Tiny>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </PageTransition>
    </PageContainer>
  );
};

export default Today;
