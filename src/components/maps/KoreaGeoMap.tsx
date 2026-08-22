import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { Tiny } from "@/components/ui/typography";
import { PanZoomContainer } from "./PanZoomContainer";

interface KoreaGeoMapProps {
  visitedRegions: Set<string>;
  regionCounts: Record<string, number>;
  onRegionClick: (engName: string, korName: string) => void;
  selectedRegion?: string | null;
  compact?: boolean;
}

const ENG_TO_KOR: Record<string, string> = {
  Seoul: "서울", Busan: "부산", Daegu: "대구", Incheon: "인천",
  Gwangju: "광주", Daejeon: "대전", Ulsan: "울산",
  "Gyeonggi-do": "경기", "Gangwon-do": "강원",
  "Chungcheongbuk-do": "충북", "Chungcheongnam-do": "충남",
  "Jeollabuk-do": "전북", "Jeollanam-do": "전남",
  "Gyeongsangbuk-do": "경북", "Gyeongsangnam-do": "경남",
  Jeju: "제주",
};

const ENG_TO_ID: Record<string, string> = {
  Seoul: "seoul", Busan: "busan", Daegu: "daegu", Incheon: "incheon",
  Gwangju: "gwangju", Daejeon: "daejeon", Ulsan: "울산",
  "Gyeonggi-do": "gyeonggi", "Gangwon-do": "gangwon",
  "Chungcheongbuk-do": "chungbuk", "Chungcheongnam-do": "chungnam",
  "Jeollabuk-do": "jeonbuk", "Jeollanam-do": "jeonnam",
  "Gyeongsangbuk-do": "gyeongbuk", "Gyeongsangnam-do": "gyeongnam",
  Jeju: "jeju",
};

const LABEL_COORDS: Record<string, [number, number]> = {
  Seoul: [126.98, 37.56], Busan: [129.07, 35.18], Daegu: [128.6, 35.87],
  Incheon: [126.63, 37.46], Gwangju: [126.85, 35.16], Daejeon: [127.38, 36.35],
  Ulsan: [129.31, 35.54], "Gyeonggi-do": [127.05, 37.28], "Gangwon-do": [128.3, 37.75],
  "Chungcheongbuk-do": [127.93, 36.63], "Chungcheongnam-do": [126.67, 36.52],
  "Jeollabuk-do": [127.1, 35.72], "Jeollanam-do": [126.96, 34.82],
  "Gyeongsangbuk-do": [128.73, 36.25], "Gyeongsangnam-do": [128.24, 35.28],
  Jeju: [126.53, 33.38],
};

const SMALL_CITIES = new Set(["Seoul", "Busan", "Daegu", "Incheon", "Gwangju", "Daejeon", "Ulsan"]);

const KoreaGeoMap: React.FC<KoreaGeoMapProps> = ({
  visitedRegions, regionCounts, onRegionClick, selectedRegion, compact = false,
}) => {
  const [mapData, setMapData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch("/maps/korea-simple.json")
      .then((r) => r.json())
      .then((data) => { setMapData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getColor = (engName: string) => {
    const id = ENG_TO_ID[engName];
    const isVisited = visitedRegions.has(id);
    const isSelected = selectedRegion === id || selectedRegion === engName;
    const isHovered = hovered === engName;
    if (isSelected) return "rgb(var(--accent-060))";
    if (isHovered && isVisited) return "rgb(var(--accent-040))";
    if (isHovered) return "rgb(var(--accent-010))";
    if (isVisited) return "rgb(var(--accent-020))";
    return "var(--app-card)";
  };

  const getStroke = (engName: string) => {
    const id = ENG_TO_ID[engName];
    const isSelected = selectedRegion === id || selectedRegion === engName;
    if (isSelected) return "var(--app-ink)";
    if (hovered === engName) return "rgb(var(--accent-050))";
    return "var(--app-line-soft)";
  };

  const mapHeight = compact ? 380 : 460;

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: mapHeight }}>
        <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "rgb(var(--accent-030))", borderTopColor: "rgb(var(--accent-070))" }} />
      </div>
    );
  }

  if (!mapData) return null;

  const hoveredKor = hovered ? ENG_TO_KOR[hovered] : null;
  const hoveredId = hovered ? ENG_TO_ID[hovered] : null;
  const hoveredCount = hoveredId ? (regionCounts[hoveredId] || 0) : 0;

  return (
    <div className="relative">
      <PanZoomContainer height={mapHeight}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: compact ? 3600 : 4000, center: [127.7, 35.85] }}
          width={460} height={mapHeight}
          className="w-full h-full" style={{ background: "transparent" }}
        >
          <Geographies geography={mapData}>
            {({ geographies }: { geographies: { properties: { NAME_1: string }; rsmKey: string }[] }) =>
              geographies.map((geo) => {
                const engName = geo.properties.NAME_1;
                return (
                  <Geography key={geo.rsmKey} geography={geo}
                    onClick={() => onRegionClick(engName, ENG_TO_KOR[engName] || engName)}
                    onMouseEnter={() => setHovered(engName)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      default: { fill: getColor(engName), stroke: getStroke(engName), strokeWidth: 0.6, cursor: "pointer", transition: "fill 0.2s", outline: "none" },
                      hover: { fill: getColor(engName), stroke: getStroke(engName), strokeWidth: 1, outline: "none" },
                      pressed: { fill: "rgb(var(--accent-060))", outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
          {Object.entries(LABEL_COORDS).map(([engName, coords]) => {
            const id = ENG_TO_ID[engName];
            const isVisited = visitedRegions.has(id);
            const isSelected = selectedRegion === id;
            const isSmall = SMALL_CITIES.has(engName);
            const count = regionCounts[id] || 0;
            return (
              <Marker key={engName} coordinates={coords}>
                <text textAnchor="middle" y={count > 0 && !isSmall ? -4 : 0} dominantBaseline="central"
                  fontSize={isSmall ? 7 : 8.5} fontWeight={isSelected ? 700 : isVisited ? 600 : 400}
                  fill={isSelected ? "rgb(var(--accent-090))" : isVisited ? "rgb(var(--accent-090))" : "var(--app-ink-3)"}
                  className="pointer-events-none select-none"
                  style={{ textShadow: "0 0 4px var(--app-card), 0 0 4px var(--app-card)" }}
                >{ENG_TO_KOR[engName]}</text>
                {count > 0 && !isSmall && (
                  <text textAnchor="middle" y={7} dominantBaseline="central" fontSize={6} fontWeight={500}
                    fill="rgb(var(--accent-070))" className="pointer-events-none select-none"
                  >{count}곳</text>
                )}
              </Marker>
            );
          })}
        </ComposableMap>
      </PanZoomContainer>

      <AnimatePresence>
        {hoveredKor && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full flex items-center gap-2 z-10"
            style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)", boxShadow: "var(--app-shadow)" }}
          >
            <span className="text-[13px] font-bold" style={{ color: "var(--app-ink)" }}>{hoveredKor}</span>
            {hoveredCount > 0 && <Tiny style={{ color: "rgb(var(--accent-070))" }}>{hoveredCount}곳</Tiny>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KoreaGeoMap;
