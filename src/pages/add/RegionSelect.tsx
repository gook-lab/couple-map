import React, { useState, useEffect, Component, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Body, Meta, Tiny } from "@/components/ui/typography";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import KoreaGeoMap from "@/components/maps/KoreaGeoMap";
import JapanGeoMap from "@/components/maps/JapanGeoMap";
import { KOREA_REGIONS } from "@/lib/countries";
import { subscribePlaces } from "@/services/places";
import { useAuthStore } from "@/store/use-auth-store";
import type { Place } from "@/types/place";

class MapErrorCatcher extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error) { console.error("[MapErrorCatcher]", error); }
  render() {
    if (this.state.error) {
      return (
        <div className="p-6 text-center">
          <p className="text-sm font-mono" style={{ color: "rgb(var(--color-couple-status-red))" }}>{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const ENG_TO_ID: Record<string, string> = {
  Seoul: "seoul", Busan: "busan", Daegu: "daegu", Incheon: "incheon",
  Gwangju: "gwangju", Daejeon: "daejeon", Ulsan: "ulsan",
  "Gyeonggi-do": "gyeonggi", "Gangwon-do": "gangwon",
  "Chungcheongbuk-do": "chungbuk", "Chungcheongnam-do": "chungnam",
  "Jeollabuk-do": "jeonbuk", "Jeollanam-do": "jeonnam",
  "Gyeongsangbuk-do": "gyeongbuk", "Gyeongsangnam-do": "gyeongnam",
  Jeju: "jeju",
};

const ENG_TO_KOR: Record<string, string> = {
  Seoul: "서울", Busan: "부산", Daegu: "대구", Incheon: "인천",
  Gwangju: "광주", Daejeon: "대전", Ulsan: "울산",
  "Gyeonggi-do": "경기", "Gangwon-do": "강원",
  "Chungcheongbuk-do": "충북", "Chungcheongnam-do": "충남",
  "Jeollabuk-do": "전북", "Jeollanam-do": "전남",
  "Gyeongsangbuk-do": "경북", "Gyeongsangnam-do": "경남",
  Jeju: "제주",
};

const RegionSelect: React.FC = () => {
  const navigate = useNavigate();
  const { countryId } = useParams<{ countryId: string }>();
  const isJapan = countryId === "japan";

  const [selectedEngName, setSelectedEngName] = useState<string | null>(null);
  const [selectedJpName, setSelectedJpName] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const coupleId = useAuthStore((s) => s.state.coupleId);

  useEffect(() => {
    if (!coupleId) return;
    try { return subscribePlaces(coupleId, setPlaces); } catch { /* */ }
  }, [coupleId]);

  const visitedRegions = new Set(
    places.map((p) => KOREA_REGIONS.find((r) => p.region?.includes(r.name))?.id).filter(Boolean) as string[]
  );
  const regionCounts: Record<string, number> = {};
  places.forEach((p) => {
    const region = KOREA_REGIONS.find((r) => p.region?.includes(r.name));
    if (region) regionCounts[region.id] = (regionCounts[region.id] || 0) + 1;
  });
  const visitedCount = visitedRegions.size;
  const selectedId = selectedEngName ? ENG_TO_ID[selectedEngName] : null;
  const selectedKor = selectedEngName ? ENG_TO_KOR[selectedEngName] : null;

  const handleConfirmKorea = () => {
    if (selectedId && selectedKor) {
      navigate(`/add/search/${selectedId}`, { state: { regionName: selectedKor } });
    }
  };

  const handleConfirmJapan = () => {
    if (selectedJpName) {
      navigate(`/add/search/japan-${selectedJpName}`, { state: { regionName: selectedJpName } });
    }
  };

  const accentBtn = { background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)" } as React.CSSProperties;

  if (isJapan) {
    return (
      <PageContainer flex>
        <PageHeader title="🇯🇵 일본" />
        <div className="px-5 pt-2">
          <Body className="font-bold">일본 지도</Body>
          <Meta className="mt-1 block">도도부현을 선택하세요 · 0 / 47</Meta>
        </div>
        <div className="flex-1 px-4 pt-2 pb-2">
          <div className="glass-card overflow-hidden">
            <MapErrorCatcher>
              <JapanGeoMap
                visitedPrefectures={new Set()}
                prefectureCounts={{}}
                selectedPrefecture={selectedJpName}
                onPrefectureClick={(nameKr) => setSelectedJpName(nameKr)}
              />
            </MapErrorCatcher>
          </div>
        </div>
        <div className="px-5 pb-6 pt-2">
          <button
            onClick={handleConfirmJapan}
            disabled={!selectedJpName}
            className="w-full py-3.5 rounded-full text-[16px] font-bold disabled:opacity-40"
            style={accentBtn}
          >
            {selectedJpName ? `${selectedJpName} 선택 →` : "지역을 선택하세요"}
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer flex>
      <PageHeader
        title="🇰🇷 한국"
        right={
          <button aria-label="더보기" className="p-1">
            <MoreHorizontal className="w-5 h-5" style={{ color: "var(--app-ink-2)" }} />
          </button>
        }
      />
      <div className="px-5 pt-2">
        <Body className="font-bold">우리의 한국 지도</Body>
        <Meta className="mt-1 block">
          방문한 곳 <span style={{ color: "rgb(var(--accent-070))", fontWeight: 700 }}>{visitedCount}</span> / 17 시도 · {Math.round((visitedCount / 17) * 100)}%
        </Meta>
      </div>
      <div className="flex-1 px-4 pt-2 pb-2">
        <div className="glass-card overflow-hidden">
          <KoreaGeoMap
            visitedRegions={visitedRegions}
            regionCounts={regionCounts}
            selectedRegion={selectedId}
            onRegionClick={(engName) => setSelectedEngName(engName)}
          />
        </div>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: "rgb(var(--accent-070))" }} /><Tiny>선택</Tiny>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: "rgb(var(--accent-030))" }} /><Tiny>방문</Tiny>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: "var(--app-line-soft)", border: "1px solid var(--app-line-soft)" }} /><Tiny>아직</Tiny>
          </div>
        </div>
      </div>
      <div className="px-5 pb-6 pt-2">
        <button
          onClick={handleConfirmKorea}
          disabled={!selectedEngName}
          className="w-full py-3.5 rounded-full text-[16px] font-bold disabled:opacity-40"
          style={accentBtn}
        >
          {selectedKor ? `${selectedKor} 선택 →` : "지역을 선택하세요"}
        </button>
      </div>
    </PageContainer>
  );
};

export default RegionSelect;
