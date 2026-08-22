import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import KakaoMapView from "@/components/maps/KakaoMapView";
import KoreaGeoMap from "@/components/maps/KoreaGeoMap";
import SeoulGeoMap from "@/components/maps/SeoulGeoMap";
import JejuGeoMap from "@/components/maps/JejuGeoMap";
import { subscribePlaces } from "@/services/places";
import { useAuthStore } from "@/store/use-auth-store";
import { H2, H3, Meta, Tiny } from "@/components/ui/typography";
import StatCard from "@/components/ui/stat-card";
import GlassList from "@/components/ui/glass-list";
import ListRow from "@/components/ui/list-row";
import Pill from "@/components/ui/pill";
import PageTransition from "@/components/ui/page-transition";
import { pageSlide, spring } from "@/lib/animations";
import { KOREA_REGIONS } from "@/lib/countries";
import type { Place } from "@/types/place";

type MainTab = "color" | "explore";

const CATEGORY_EMOJI: Record<string, string> = { 음식점: "🍜", 카페: "☕", 관광명소: "🏖️", 숙박: "🏨", 기타: "📍" };

const ENG_TO_ID: Record<string, string> = {
  Seoul: "seoul", Busan: "busan", Daegu: "daegu", Incheon: "incheon",
  Gwangju: "gwangju", Daejeon: "daejeon", Ulsan: "ulsan",
  "Gyeonggi-do": "gyeonggi", "Gangwon-do": "gangwon",
  "Chungcheongbuk-do": "chungbuk", "Chungcheongnam-do": "chungnam",
  "Jeollabuk-do": "jeonbuk", "Jeollanam-do": "jeonnam",
  "Gyeongsangbuk-do": "gyeongbuk", "Gyeongsangnam-do": "gyeongnam",
  Jeju: "jeju",
};

const Travel: React.FC = () => {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState<MainTab>("color");
  const [places, setPlaces] = useState<Place[]>([]);
  const [drillSeoul, setDrillSeoul] = useState(false);
  const [drillJeju, setDrillJeju] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedJejuArea, setSelectedJejuArea] = useState<string | null>(null);
  const coupleId = useAuthStore((s) => s.state.coupleId);

  useEffect(() => {
    if (!coupleId) return;
    try { return subscribePlaces(coupleId, setPlaces); } catch { /* */ }
  }, [coupleId]);

  const visitedRegions = new Set(
    places
      .map((p) => KOREA_REGIONS.find((r) => p.region?.includes(r.name))?.id)
      .filter(Boolean) as string[]
  );

  const regionCounts: Record<string, number> = {};
  places.forEach((p) => {
    const region = KOREA_REGIONS.find((r) => p.region?.includes(r.name));
    if (region) regionCounts[region.id] = (regionCounts[region.id] || 0) + 1;
  });

  const seoulDistrictCounts: Record<string, number> = {};
  places.forEach((p) => {
    if (p.address) {
      const match = p.address.match(/(강남|강동|강북|강서|관악|광진|구로|금천|노원|도봉|동대문|동작|마포|서대문|서초|성동|성북|송파|양천|영등포|용산|은평|종로|중구|중랑)구/);
      if (match) {
        const name = `${match[1]}구`;
        seoulDistrictCounts[name] = (seoulDistrictCounts[name] || 0) + 1;
      }
    }
  });

  const jejuAreaCounts: Record<string, number> = {};
  places.forEach((p) => {
    if (p.region?.includes("제주") || p.address?.includes("제주")) {
      const addr = p.address || "";
      const match = addr.match(/([가-힣]+[읍면동])/);
      if (match) {
        jejuAreaCounts[match[1]] = (jejuAreaCounts[match[1]] || 0) + 1;
      }
    }
  });

  const stats = {
    totalPlaces: places.length,
    visited: places.filter((p) => p.status === "visited").length,
    regions: visitedRegions.size,
  };

  const drillActive = drillSeoul || drillJeju;
  const drillLabel = drillSeoul ? "서울" : drillJeju ? "제주" : "";

  const handleRegionClick = (engName: string) => {
    if (engName === "Seoul") { setDrillSeoul(true); return; }
    if (engName === "Jeju") { setDrillJeju(true); return; }
    const id = ENG_TO_ID[engName];
    if (id) navigate(`/region/${id}`);
  };

  const placeRow = {
    background: "var(--app-card)",
    border: "1.5px solid var(--app-line)",
  } as React.CSSProperties;

  return (
    <div
      className="h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] flex flex-col"
      style={{ background: "var(--app-bg)", color: "var(--app-ink)" }}
    >
      <motion.header
        className="glass-bar px-4 pt-3 pb-0 flex-shrink-0"
        variants={pageSlide}
        initial="initial"
        animate="animate"
        transition={spring}
      >
        <div className="flex items-center justify-between mb-3">
          {drillActive ? (
            <>
              <button onClick={() => { setDrillSeoul(false); setDrillJeju(false); setSelectedDistrict(null); setSelectedJejuArea(null); }} aria-label="뒤로 가기" className="p-1 -ml-1">
                <ChevronLeft className="w-6 h-6" style={{ color: "var(--app-ink)" }} />
              </button>
              <H2 className="flex-1 ml-2">{drillLabel}</H2>
            </>
          ) : (
            <H2>우리의 지도</H2>
          )}
          <Pill variant="secondary">
            {drillSeoul ? `${Object.keys(seoulDistrictCounts).length} / 25 구`
              : drillJeju ? `${Object.keys(jejuAreaCounts).length} / 14 지역`
              : `${stats.regions} / 17 시도`}
          </Pill>
        </div>

        {!drillActive && (
          <div className="flex gap-1.5 pb-3">
            {([
              { key: "color" as MainTab, label: "지도색칠" },
              { key: "explore" as MainTab, label: "탐색" },
            ]).map((tab) => {
              const isActive = mainTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setMainTab(tab.key)}
                  className="flex-1 py-2 rounded-full font-bold text-sm transition-all"
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
        )}
      </motion.header>

      {mainTab === "explore" && !drillActive ? (
        <KakaoMapView places={places} />
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pt-3 pb-4">
            <PageTransition>
              {/* Seoul drill-down */}
              {drillSeoul ? (
                <>
                  <Meta className="mb-2 block">
                    서울 방문한 구{" "}
                    <span style={{ color: "rgb(var(--accent-070))", fontWeight: 700 }}>
                      {Object.keys(seoulDistrictCounts).length}
                    </span>{" "}
                    / 25
                  </Meta>
                  <div className="glass-card overflow-hidden">
                    <SeoulGeoMap
                      districtCounts={seoulDistrictCounts}
                      selectedDistrict={selectedDistrict}
                      onDistrictClick={(name) => setSelectedDistrict(selectedDistrict === name ? null : name)}
                    />
                  </div>

                  {/* Selected district places */}
                  {selectedDistrict && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <H3>서울 {selectedDistrict}</H3>
                        <Tiny style={{ color: "rgb(var(--accent-070))" }}>{seoulDistrictCounts[selectedDistrict] || 0}곳</Tiny>
                      </div>
                      {places
                        .filter((p) => p.address?.includes(selectedDistrict))
                        .map((place) => (
                          <motion.button
                            key={place.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => navigate(`/memory/${place.id}`)}
                            className="w-full flex items-center gap-3 p-3 mb-2 rounded-xl text-left"
                            style={placeRow}
                          >
                            <span className="text-xl">{CATEGORY_EMOJI[place.category] || "📍"}</span>
                            <div className="flex-1 min-w-0">
                              <span className="text-[14px] font-bold block truncate">{place.name}</span>
                              <Tiny className="block truncate">{place.address}</Tiny>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--app-ink-3)" }} />
                          </motion.button>
                        ))}
                      {!places.some((p) => p.address?.includes(selectedDistrict)) && (
                        <div className="py-6 text-center">
                          <Meta>아직 {selectedDistrict}에 저장한 장소가 없어요</Meta>
                          <button onClick={() => navigate("/add/search/seoul", { state: { regionName: `서울 ${selectedDistrict}` } })}
                            className="mt-3 px-5 py-2 rounded-full text-[14px] font-bold"
                            style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)" }}
                          >
                            + 추억 추가
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* All visited districts */}
                  {!selectedDistrict && Object.keys(seoulDistrictCounts).length > 0 && (
                    <GlassList header="방문한 구" className="mt-4">
                      {Object.entries(seoulDistrictCounts).map(([name, count], i, arr) => (
                        <ListRow
                          key={name}
                          emoji={name[0]}
                          title={name}
                          detail={`${count}곳`}
                          isLast={i === arr.length - 1}
                          onClick={() => setSelectedDistrict(name)}
                        />
                      ))}
                    </GlassList>
                  )}
                </>
              ) : drillJeju ? (
                <>
                  <Meta className="mb-2 block">
                    제주 방문한 읍면동{" "}
                    <span style={{ color: "rgb(var(--accent-070))", fontWeight: 700 }}>
                      {Object.keys(jejuAreaCounts).length}
                    </span>{" "}/ 43
                  </Meta>
                  <div className="glass-card overflow-hidden">
                    <JejuGeoMap
                      areaCounts={jejuAreaCounts}
                      selectedArea={selectedJejuArea}
                      onAreaClick={(name) => setSelectedJejuArea(selectedJejuArea === name ? null : name)}
                    />
                  </div>

                  {selectedJejuArea && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <H3>제주 {selectedJejuArea}</H3>
                        <Tiny style={{ color: "rgb(var(--accent-070))" }}>{jejuAreaCounts[selectedJejuArea] || 0}곳</Tiny>
                      </div>
                      {places
                        .filter((p) => p.address?.includes(selectedJejuArea!))
                        .map((place) => (
                          <motion.button
                            key={place.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => navigate(`/memory/${place.id}`)}
                            className="w-full flex items-center gap-3 p-3 mb-2 rounded-xl text-left"
                            style={placeRow}
                          >
                            <span className="text-xl">{CATEGORY_EMOJI[place.category] || "📍"}</span>
                            <div className="flex-1 min-w-0">
                              <span className="text-[14px] font-bold block truncate">{place.name}</span>
                              <Tiny className="block truncate">{place.address}</Tiny>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--app-ink-3)" }} />
                          </motion.button>
                        ))}
                      {!places.some((p) => p.address?.includes(selectedJejuArea!)) && (
                        <div className="py-6 text-center">
                          <Meta>아직 {selectedJejuArea}에 저장한 장소가 없어요</Meta>
                          <button onClick={() => navigate("/add/search/jeju", { state: { regionName: `제주 ${selectedJejuArea}` } })}
                            className="mt-3 px-5 py-2 rounded-full text-[14px] font-bold"
                            style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)" }}
                          >+ 추억 추가</button>
                        </div>
                      )}
                    </div>
                  )}

                  {!selectedJejuArea && Object.keys(jejuAreaCounts).length > 0 && (
                    <GlassList header="방문한 지역" className="mt-4">
                      {Object.entries(jejuAreaCounts).map(([name, count], i, arr) => (
                        <ListRow key={name} emoji={name === "제주시" ? "🏝️" : "🌊"} title={name} detail={`${count}곳`}
                          isLast={i === arr.length - 1} onClick={() => setSelectedJejuArea(name)} />
                      ))}
                    </GlassList>
                  )}
                </>
              ) : (
                <>
                  {/* Korea map stats */}
                  <Meta className="mb-2 block">
                    방문한 곳{" "}
                    <span style={{ color: "rgb(var(--accent-070))", fontWeight: 700 }}>
                      {stats.regions}
                    </span>{" "}
                    / 17 시도 · {Math.round((stats.regions / 17) * 100)}%
                  </Meta>

                  {/* Geographic Korea Map */}
                  <div className="glass-card overflow-hidden">
                    <KoreaGeoMap
                      visitedRegions={visitedRegions}
                      regionCounts={regionCounts}
                      onRegionClick={(engName) => handleRegionClick(engName)}
                    />
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm" style={{ background: "rgb(var(--accent-030))" }} />
                      <Tiny>방문</Tiny>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm" style={{ background: "var(--app-line-soft)", border: "1px solid var(--app-line-soft)" }} />
                      <Tiny>아직</Tiny>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <StatCard value={stats.totalPlaces} label="추억" />
                    <StatCard value={stats.regions} label="시·도" />
                    <StatCard value={stats.visited} label="다녀온 곳" />
                  </div>

                  {/* Visited regions */}
                  {visitedRegions.size > 0 && (
                    <GlassList header="방문한 지역" className="mt-5">
                      {KOREA_REGIONS.filter((r) => visitedRegions.has(r.id)).map((region, i, arr) => {
                        const count = regionCounts[region.id] || 0;
                        return (
                          <ListRow
                            key={region.id}
                            emoji={region.name[0]}
                            title={(region.id === "seoul" || region.id === "jeju") ? `${region.name} →` : region.name}
                            detail={`${count}곳`}
                            isLast={i === arr.length - 1}
                            onClick={() => {
                              if (region.id === "seoul") setDrillSeoul(true);
                              else if (region.id === "jeju") setDrillJeju(true);
                              else navigate(`/region/${region.id}`);
                            }}
                          />
                        );
                      })}
                    </GlassList>
                  )}

                  <button
                    onClick={() => navigate("/add/country")}
                    className="w-full mt-4 py-3 rounded-full glass-pill text-[15px] font-bold flex items-center justify-center gap-1.5"
                    style={{ color: "var(--app-ink-2)" }}
                  >
                    🌏 다른 나라 추가
                  </button>
                </>
              )}
            </PageTransition>
          </div>
        </div>
      )}
    </div>
  );
};

export default Travel;
