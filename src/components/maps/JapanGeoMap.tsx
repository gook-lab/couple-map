import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { motion, AnimatePresence } from "framer-motion";
import { Tiny } from "@/components/ui/typography";
import { PanZoomContainer } from "./PanZoomContainer";

interface GeoProps {
  nam?: string;
  nam_ja?: string;
  nam_kr?: string;
  id?: string;
}

interface JapanGeoMapProps {
  visitedPrefectures: Set<string>;
  prefectureCounts: Record<string, number>;
  onPrefectureClick: (nameKr: string, nameJa: string) => void;
  selectedPrefecture?: string | null;
}

const JapanGeoMap: React.FC<JapanGeoMapProps> = ({
  visitedPrefectures, prefectureCounts, onPrefectureClick, selectedPrefecture,
}) => {
  const [mapData, setMapData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch("/maps/japan-simple.json")
      .then((r) => r.json())
      .then((data) => { setMapData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getColor = (name: string) => {
    if (selectedPrefecture === name) return "rgb(var(--accent-060))";
    if (hovered === name && visitedPrefectures.has(name)) return "rgb(var(--accent-040))";
    if (hovered === name) return "rgb(var(--accent-010))";
    if (visitedPrefectures.has(name)) return "rgb(var(--accent-020))";
    return "var(--app-card)";
  };

  const getStroke = (name: string) => {
    if (selectedPrefecture === name) return "var(--app-ink)";
    if (hovered === name) return "rgb(var(--accent-050))";
    return "var(--app-line-soft)";
  };

  if (loading) return (
    <div className="w-full flex items-center justify-center" style={{ height: 460 }}>
      <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "rgb(var(--accent-030))", borderTopColor: "rgb(var(--accent-070))" }} />
    </div>
  );
  if (!mapData) return null;

  return (
    <div className="relative">
      <PanZoomContainer height={560}>
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 900, center: [137.5, 36.5] }} width={460} height={560} className="w-full h-full" style={{ background: "transparent" }}>
          <Geographies geography={mapData}>
            {({ geographies }: { geographies: { properties?: GeoProps; rsmKey: string }[] }) =>
              geographies.map((geo) => {
                const nameKr = geo.properties?.nam_kr ?? "";
                if (!nameKr) return null;
                return (
                  <Geography key={geo.rsmKey} geography={geo}
                    onClick={() => onPrefectureClick(nameKr, geo.properties?.nam_ja ?? "")}
                    onMouseEnter={() => setHovered(nameKr)} onMouseLeave={() => setHovered(null)}
                    style={{
                      default: { fill: getColor(nameKr), stroke: getStroke(nameKr), strokeWidth: 0.4, cursor: "pointer", transition: "fill 0.2s", outline: "none" },
                      hover: { fill: getColor(nameKr), stroke: getStroke(nameKr), strokeWidth: 0.8, outline: "none" },
                      pressed: { fill: "rgb(var(--accent-060))", outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
          <Geographies geography={mapData}>
            {({ geographies }: { geographies: { properties?: GeoProps; rsmKey: string }[] }) =>
              geographies.map((geo) => {
                const nameKr = geo.properties?.nam_kr;
                if (!nameKr) return null;
                let centroid: [number, number] | undefined;
                try { centroid = geoCentroid(geo as unknown as GeoJSON.Feature) as [number, number]; } catch { return null; }
                if (!centroid?.[0] || !centroid?.[1]) return null;
                return (
                  <Marker key={`l-${geo.rsmKey}`} coordinates={centroid}>
                    <text textAnchor="middle" dominantBaseline="central" fontSize={4.5}
                      fontWeight={selectedPrefecture === nameKr ? 700 : visitedPrefectures.has(nameKr) ? 600 : 400}
                      fill={selectedPrefecture === nameKr ? "white" : visitedPrefectures.has(nameKr) ? "rgb(var(--accent-090))" : "var(--app-ink-3)"}
                      className="pointer-events-none select-none"
                      style={{ textShadow: "0 0 3px var(--app-card), 0 0 3px var(--app-card)" }}
                    >{nameKr}</text>
                  </Marker>
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </PanZoomContainer>
      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full glass-pill flex items-center gap-2 z-10">
            <span className="text-[13px] font-bold" style={{ color: "var(--app-ink)" }}>{hovered}</span>
            {(prefectureCounts[hovered] || 0) > 0 && <Tiny style={{ color: "rgb(var(--accent-070))" }}>{prefectureCounts[hovered]}곳</Tiny>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JapanGeoMap;
