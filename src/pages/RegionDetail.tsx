import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Star } from "lucide-react";
import { motion } from "framer-motion";
import { H2, H3, Body, Meta, Tiny } from "@/components/ui/typography";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { CandyCard } from "@/components/ui/sticker";
import { KOREA_REGIONS } from "@/lib/countries";
import { subscribePlaces } from "@/services/places";
import { useAuthStore } from "@/store/use-auth-store";
import type { Place } from "@/types/place";
import { stagger, staggerItem } from "@/lib/animations";

const CATEGORY_EMOJI: Record<string, string> = {
  음식점: "🍖",
  카페: "☕",
  관광명소: "🏖️",
  숙박: "🏨",
  기타: "📍",
};

const FILTERS = ["전체", "맛집", "카페", "풍경", "숙소"];

const RegionDetail: React.FC = () => {
  const navigate = useNavigate();
  const { regionId } = useParams<{ regionId: string }>();
  const [places, setPlaces] = useState<Place[]>([]);
  const [activeFilter, setActiveFilter] = useState("전체");

  const region = KOREA_REGIONS.find((r) => r.id === regionId);
  const regionName = region?.name || regionId || "";
  const coupleId = useAuthStore((s) => s.state.coupleId);

  useEffect(() => {
    if (!coupleId) return;
    try {
      return subscribePlaces(coupleId, setPlaces);
    } catch {
      // Firestore not configured
    }
  }, [coupleId]);

  const regionPlaces = places.filter((p) => p.region?.includes(regionName));

  const filtered = activeFilter === "전체"
    ? regionPlaces
    : regionPlaces.filter((p) => {
        if (activeFilter === "맛집") return p.category?.includes("음식");
        if (activeFilter === "카페") return p.category?.includes("카페");
        if (activeFilter === "풍경") return p.category?.includes("관광");
        if (activeFilter === "숙소") return p.category?.includes("숙");
        return true;
      });

  const totalPhotos = regionPlaces.reduce((s, p) => s + (p.photos?.length || 0), 0);
  const totalDiaries = regionPlaces.filter((p) => p.memo).length;

  const formatDate = (d: Date | undefined) => {
    if (!d) return "";
    const date = new Date(d);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const cardSurface = { background: "var(--app-card)", border: "1.5px solid var(--app-line)" } as React.CSSProperties;

  return (
    <PageContainer withBottomNav>
      <PageHeader
        title={regionName}
        right={
          <button onClick={() => navigate(`/add/search/${regionId}`, { state: { regionName } })} aria-label="추가" className="p-1">
            <Plus className="w-5 h-5" style={{ color: "var(--app-ink)" }} />
          </button>
        }
      />

      {/* Hero Card */}
      <div className="px-5 pt-3">
        <CandyCard color="peach" className="flex items-center gap-4 p-4">
          <div
            className="w-20 h-20 rounded-xl flex items-center justify-center text-[32px]"
            style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)" }}
          >
            {regionName[0]}
          </div>
          <div className="flex-1">
            <H2>{regionName}</H2>
            <Meta className="mt-1 block">
              {regionPlaces.length > 0 ? `${regionPlaces.length}번 방문` : "아직 방문 기록이 없어요"}
            </Meta>
            <div className="flex gap-4 mt-2">
              <Tiny><span className="font-extrabold">{regionPlaces.length}</span> 핀</Tiny>
              <Tiny><span className="font-extrabold">{totalPhotos}</span> 사진</Tiny>
              <Tiny><span className="font-extrabold">{totalDiaries}</span> 일기</Tiny>
            </div>
          </div>
        </CandyCard>
      </div>

      {/* Filter pills */}
      <div className="px-5 pt-4 pb-2 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-min">
          {FILTERS.map((f) => {
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-3.5 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all"
                style={
                  isActive
                    ? { background: "var(--app-ink)", color: "var(--app-bg)", border: "1.5px solid var(--app-line)" }
                    : { background: "var(--app-card)", color: "var(--app-ink-2)", border: "1.5px solid var(--app-line-soft)" }
                }
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pin List */}
      {filtered.length > 0 && (
        <div className="px-5 pt-3">
          <Tiny className="mb-2 block">📍 우리가 찍은 핀</Tiny>
          <motion.div className="flex flex-col gap-2" variants={stagger} initial="initial" animate="animate">
            {filtered.map((place) => (
              <motion.button
                key={place.id}
                variants={staggerItem}
                onClick={() => navigate(`/memory/${place.id}`)}
                className="flex items-center gap-3 p-3 rounded-xl text-left"
                style={cardSurface}
              >
                <span className="text-[24px]">{CATEGORY_EMOJI[place.category] || "📍"}</span>
                <div className="flex-1 min-w-0">
                  <Body className="font-bold block truncate">{place.name}</Body>
                  <Tiny className="mt-0.5 block">
                    {place.category || "기타"} · {formatDate(place.visitedAt?.[0])}
                    {place.photos?.length ? ` · 사진 ${place.photos.length}` : ""}
                  </Tiny>
                </div>
                {place.rating > 0 && (
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3"
                        fill={i < place.rating ? "rgb(var(--accent-070))" : "none"}
                        style={{ color: i < place.rating ? "rgb(var(--accent-070))" : "var(--app-line)" }}
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>
      )}

      {/* Memory Grid */}
      {totalPhotos > 0 && (
        <div className="px-5 pt-5">
          <div className="flex items-center justify-between mb-2">
            <Tiny>📷 추억 그리드</Tiny>
            <Tiny>전체 {totalPhotos}장 ›</Tiny>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {regionPlaces
              .flatMap((p) => (p.photos || []).map((photo, i) => ({ photo, place: p, i })))
              .slice(0, 9)
              .map(({ photo, place, i }) => (
                <div
                  key={`${place.id}-${i}`}
                  className="aspect-square rounded-lg overflow-hidden"
                  style={{ background: "var(--app-line-soft)", border: "1.5px solid var(--app-line)" }}
                >
                  {photo ? (
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tiny>📸</Tiny>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Diary entries */}
      {totalDiaries > 0 && (
        <div className="px-5 pt-5">
          <Tiny className="mb-2 block">✍️ 일기</Tiny>
          <div className="flex flex-col gap-2">
            {regionPlaces
              .filter((p) => p.memo)
              .slice(0, 3)
              .map((place) => (
                <button
                  key={place.id}
                  onClick={() => navigate(`/memory/${place.id}`)}
                  className="flex items-start gap-3 p-3 rounded-xl text-left"
                  style={cardSurface}
                >
                  <div
                    className="px-2 py-1 rounded-md text-[12px] font-extrabold"
                    style={{ background: "rgb(var(--color-couple-yellow))", color: "#1c1917", border: "1.5px solid var(--app-line)" }}
                  >
                    {formatDate(place.visitedAt?.[0])?.split("월")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Body className="font-bold block truncate">
                      {place.memo?.slice(0, 30)}
                      {(place.memo?.length || 0) > 30 ? "..." : ""}
                    </Body>
                    <Tiny className="mt-0.5 block">{place.name}에서</Tiny>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Quick actions for region */}
      {regionPlaces.length > 0 && (
        <div className="px-5 pt-4 flex gap-2">
          <CandyCard color="mint" onClick={() => navigate("/travelogue")} className="flex-1 py-2.5 text-center text-[13px] font-bold">
            📖 여행기 만들기
          </CandyCard>
          <CandyCard color="sky" onClick={() => navigate("/stickers")} className="flex-1 py-2.5 text-center text-[13px] font-bold">
            🏷️ 스티커 만들기
          </CandyCard>
        </div>
      )}

      {/* Empty state */}
      {regionPlaces.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-5">
          <span className="text-5xl mb-4">📍</span>
          <H3 className="text-center">아직 추억이 없어요</H3>
          <Meta className="text-center mt-1 block">첫 추억을 만들어보세요</Meta>
          <button
            onClick={() => navigate(`/add/search/${regionId}`, { state: { regionName } })}
            className="mt-4 px-6 py-2.5 rounded-full text-[15px] font-bold"
            style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)" }}
          >
            + 첫 추억 추가
          </button>
        </div>
      )}
    </PageContainer>
  );
};

export default RegionDetail;
