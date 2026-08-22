import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { H1, H2, Body, Tiny } from "@/components/ui/typography";
import EmptyState from "@/components/ui/empty-state";
import PageTransition from "@/components/ui/page-transition";
import PageContainer from "@/components/layout/PageContainer";
import { Sticker } from "@/components/ui/sticker";
import { stagger, staggerItem } from "@/lib/animations";
import { subscribePlaces } from "@/services/places";
import { useAuthStore } from "@/store/use-auth-store";
import type { Place } from "@/types/place";

type ViewMode = "diary" | "polaroid" | "dual";
const FILTER_OPTIONS = ["전체", "사진", "일기", "핀"];
const TAPE_COLORS = ["var(--c-pink)", "var(--c-butter)", "var(--c-mint)", "var(--c-sky)", "var(--c-lilac)", "var(--c-peach)"];

const Timeline: React.FC = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState<Place[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("diary");
  const [activeFilter, setActiveFilter] = useState("전체");
  const coupleId = useAuthStore((s) => s.state.coupleId);

  useEffect(() => {
    if (!coupleId) return;
    try {
      return subscribePlaces(coupleId, setPlaces);
    } catch {
      // Firestore not configured
    }
  }, [coupleId]);

  const filtered = places.filter((p) => {
    if (activeFilter === "사진") return (p.photos?.length || 0) > 0;
    if (activeFilter === "일기") return !!p.memo;
    if (activeFilter === "핀") return true;
    return true;
  });

  const formatDate = (d: Date | undefined) => {
    if (!d) return { month: "", day: "" };
    const date = new Date(d);
    return {
      month: `${date.getMonth() + 1}월`,
      day: String(date.getDate()).padStart(2, "0"),
    };
  };

  const groupByMonth = (items: Place[]) => {
    const groups: Record<string, Place[]> = {};
    items.forEach((p) => {
      const d = p.visitedAt?.[0] ? new Date(p.visitedAt[0]) : new Date(p.savedAt);
      const key = `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });
    return Object.entries(groups);
  };

  const cardSurface = { background: "var(--app-card)", border: "1.5px solid var(--app-line)" } as React.CSSProperties;

  return (
    <PageContainer withBottomNav>
      <PageTransition>
        {/* Header */}
        <div className="px-5 pt-5 pb-2 flex items-baseline justify-between">
          <H1>추억 보관함</H1>
          <Sticker color="butter">{places.length}개</Sticker>
        </div>

        {/* View mode tabs */}
        <div className="px-5 pb-2 flex gap-1.5">
          {([
            { id: "diary" as const, label: "📚 다이어리" },
            { id: "polaroid" as const, label: "🎨 폴라로이드" },
            { id: "dual" as const, label: "📍 둘의 시점" },
          ]).map((t) => {
            const isActive = viewMode === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setViewMode(t.id)}
                className="flex-1 py-2 rounded-xl text-[12px] font-bold transition-all"
                style={
                  isActive
                    ? { background: "var(--app-ink)", color: "var(--app-bg)", border: "1.5px solid var(--app-line)", boxShadow: "var(--app-shadow)" }
                    : { background: "var(--app-card)", color: "var(--app-ink-2)", border: "1.5px solid var(--app-line)" }
                }
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Filter pills */}
        <div className="px-5 pb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-min">
            {FILTER_OPTIONS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className="px-3.5 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all"
                  style={
                    isActive
                      ? { background: "var(--app-ink)", color: "var(--app-bg)", border: "1.5px solid var(--app-line)" }
                      : { background: "var(--app-card)", color: "var(--app-ink-2)", border: "1.5px solid var(--app-line-soft)" }
                  }
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <EmptyState
            icon="📔"
            title="아직 추억이 없어요"
            description="첫 추억을 만들고 둘만의 지도를 색칠해보세요"
            actionLabel="+ 첫 추억 추가"
            onAction={() => navigate("/add/country")}
          />
        )}

        {/* Diary View */}
        {viewMode === "diary" && filtered.length > 0 && (
          <motion.div className="px-5" variants={stagger} initial="initial" animate="animate">
            <div className="relative pl-8">
              <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: "var(--app-line-soft)" }} />

              {filtered.map((place) => {
                const { month, day } = formatDate(place.visitedAt?.[0] || place.savedAt);
                return (
                  <motion.button
                    key={place.id}
                    variants={staggerItem}
                    onClick={() => navigate(`/memory/${place.id}`)}
                    className="relative flex gap-3 pb-5 text-left w-full"
                  >
                    <div
                      className="absolute left-[-22px] top-1 w-3 h-3 rounded-full border-2"
                      style={{ background: "rgb(var(--accent-070))", borderColor: "var(--app-card)" }}
                    />

                    <div className="flex-shrink-0 w-10 text-right">
                      <Tiny className="block">{month}</Tiny>
                      <span className="text-[18px] font-extrabold">{day}</span>
                    </div>

                    <div className="flex-1 min-w-0 rounded-xl p-3" style={{ ...cardSurface, boxShadow: "var(--app-shadow)" }}>
                      <Body className="font-bold block truncate">{place.name}</Body>
                      {place.memo && (
                        <p className="text-[13px] mt-1 line-clamp-2 leading-relaxed" style={{ color: "var(--app-ink-2)" }}>
                          {place.memo}
                        </p>
                      )}
                      <Tiny className="mt-1.5 block">
                        {place.region} · {place.photos?.length ? `사진 ${place.photos.length}장` : "메모"}
                      </Tiny>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Polaroid View */}
        {viewMode === "polaroid" && filtered.length > 0 && (
          <div className="px-5">
            {groupByMonth(filtered).map(([month, items]) => (
              <div key={month} className="mb-6">
                <Tiny className="mb-3 block">{month}</Tiny>
                <div className="grid grid-cols-2 gap-4">
                  {items.map((place, i) => {
                    const rotation = i % 2 === 0 ? -1.8 : 1.8;
                    const tape = TAPE_COLORS[i % TAPE_COLORS.length];
                    return (
                      <motion.button
                        key={place.id}
                        onClick={() => navigate(`/memory/${place.id}`)}
                        className="relative rounded-md overflow-visible text-left p-2 pb-5"
                        style={{
                          background: "var(--app-card)",
                          border: "1.5px solid var(--app-line)",
                          boxShadow: "var(--app-shadow)",
                          transform: `rotate(${rotation}deg)`,
                        }}
                        whileHover={{ scale: 1.04, rotate: 0 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {/* Washi tape */}
                        <div
                          className="absolute left-1/2 -top-2 w-10 h-4"
                          style={{
                            background: tape,
                            border: "1.5px solid var(--app-line)",
                            transform: "translateX(-50%) rotate(-4deg)",
                          }}
                        />
                        {/* Photo area */}
                        <div className="aspect-square rounded-sm overflow-hidden flex items-center justify-center" style={{ background: "var(--app-line-soft)" }}>
                          {place.photos?.[0] ? (
                            <img src={place.photos[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl opacity-30">{place.memo ? "✍️" : "📍"}</span>
                          )}
                        </div>
                        {/* Caption */}
                        <div className="pt-2 px-0.5">
                          <span className="text-[13px] font-bold block truncate">{place.name}</span>
                          <Tiny className="mt-0.5 block">
                            {formatDate(place.visitedAt?.[0]).month} {formatDate(place.visitedAt?.[0]).day}
                          </Tiny>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dual Lane View */}
        {viewMode === "dual" && filtered.length > 0 && (
          <div className="px-5">
            <div className="flex items-center justify-between mb-3">
              <H2>둘의 시점</H2>
              <Tiny>같은 날, 다른 기억</Tiny>
            </div>
            {groupByMonth(filtered).map(([month, items]) => (
              <div key={month} className="mb-6">
                <Tiny className="mb-2 block">{month}</Tiny>
                {items.map((place) => (
                  <div key={place.id} className="flex gap-2 mb-3">
                    {/* Left (나) */}
                    <button
                      onClick={() => navigate(`/memory/${place.id}`)}
                      className="flex-1 rounded-xl p-2.5 text-left"
                      style={cardSurface}
                    >
                      <div className="h-[80px] rounded-lg mb-2 flex items-center justify-center overflow-hidden" style={{ background: "var(--app-line-soft)" }}>
                        {place.photos?.[0] ? (
                          <img src={place.photos[0]} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="text-2xl opacity-20">📸</span>
                        )}
                      </div>
                      <span className="text-[13px] font-bold block truncate">{place.memo?.slice(0, 20) || place.name}</span>
                      <Tiny>{formatDate(place.visitedAt?.[0]).month} {formatDate(place.visitedAt?.[0]).day}</Tiny>
                    </button>
                    {/* Right (파트너) */}
                    <div className="flex-1 rounded-xl p-2.5 text-left opacity-40" style={cardSurface}>
                      <div className="h-[80px] rounded-lg mb-2 flex items-center justify-center" style={{ background: "var(--app-line-soft)" }}>
                        <span className="text-2xl opacity-20">💕</span>
                      </div>
                      <span className="text-[13px] font-bold block">파트너의 시점</span>
                      <Tiny>연결 후 표시</Tiny>
                    </div>
                  </div>
                ))}
                {items.length > 0 && (
                  <div
                    className="flex items-center gap-2 p-2.5 rounded-xl mb-2"
                    style={{ background: "rgb(var(--accent-010))", border: "1.5px solid var(--app-line-soft)" }}
                  >
                    <span className="text-sm">💞</span>
                    <Tiny style={{ color: "rgb(var(--accent-070))" }}>같은 순간 — 함께 기록한 추억이 여기에</Tiny>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </PageTransition>
    </PageContainer>
  );
};

export default Timeline;
