import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { motion, AnimatePresence } from "framer-motion";
import { Tiny } from "@/components/ui/typography";
import { PanZoomContainer } from "./PanZoomContainer";

interface JejuGeoMapProps {
  areaCounts: Record<string, number>;
  selectedArea?: string | null;
  onAreaClick?: (name: string, city: string) => void;
}

const JejuGeoMap: React.FC<JejuGeoMapProps> = ({ areaCounts, selectedArea, onAreaClick }) => {
  const [mapData, setMapData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch("/maps/jeju-simple.json").then((r) => r.json()).then((data) => { setMapData(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const getColor = (name: string) => {
    const count = areaCounts[name] || 0;
    if (selectedArea === name) return "rgb(var(--accent-060))";
    if (hovered === name && count > 0) return "rgb(var(--accent-040))";
    if (hovered === name) return "rgb(var(--accent-010))";
    if (count >= 1) return "rgb(var(--accent-020))";
    return "var(--app-card)";
  };

  const getStroke = (name: string) => {
    if (selectedArea === name) return "var(--app-ink)";
    if (hovered === name) return "rgb(var(--accent-050))";
    return "var(--app-line-soft)";
  };

  if (loading) return <div className="w-full flex items-center justify-center" style={{ height: 300 }}><div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "rgb(var(--accent-030))", borderTopColor: "rgb(var(--accent-070))" }} /></div>;
  if (!mapData) return null;

  return (
    <div className="relative">
      <PanZoomContainer height={300}>
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 27000, center: [126.55, 33.38] }} width={460} height={300} className="w-full h-full" style={{ background: "transparent" }}>
          <Geographies geography={mapData}>
            {({ geographies }: { geographies: { properties: { name: string; city: string }; rsmKey: string }[] }) =>
              geographies.map((geo) => {
                const name = geo.properties.name;
                return (
                  <Geography key={geo.rsmKey} geography={geo}
                    onClick={() => onAreaClick?.(name, geo.properties.city)}
                    onMouseEnter={() => setHovered(name)} onMouseLeave={() => setHovered(null)}
                    style={{
                      default: { fill: getColor(name), stroke: getStroke(name), strokeWidth: 0.4, cursor: "pointer", transition: "fill 0.2s", outline: "none" },
                      hover: { fill: getColor(name), stroke: getStroke(name), strokeWidth: 0.8, outline: "none" },
                      pressed: { fill: "rgb(var(--accent-060))", outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
          <Geographies geography={mapData}>
            {({ geographies }: { geographies: { properties: { name: string }; rsmKey: string }[] }) =>
              geographies.map((geo) => {
                const name = geo.properties.name;
                const centroid = geoCentroid(geo as unknown as GeoJSON.Feature);
                if (!centroid[0] || !centroid[1]) return null;
                const isMain = name.endsWith("읍") || name.endsWith("면") || name.includes("도심");
                const shortName = name.replace(/[읍면]$/, "").replace(/ 도심$/, "");
                return (
                  <Marker key={`l-${geo.rsmKey}`} coordinates={centroid}>
                    <text textAnchor="middle" dominantBaseline="central" fontSize={isMain ? 7 : 5}
                      fontWeight={selectedArea === name ? 700 : isMain ? 500 : 400}
                      fill={selectedArea === name ? "white" : areaCounts[name] ? "rgb(var(--accent-090))" : "var(--app-ink-3)"}
                      className="pointer-events-none select-none"
                      style={{ textShadow: "0 0 2px var(--app-card)" }}>{shortName}</text>
                  </Marker>
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </PanZoomContainer>
      <div className="absolute top-2 left-3 text-[10px] font-bold opacity-60 z-10" style={{ color: "var(--app-ink-2)" }}>제주시</div>
      <div className="absolute bottom-2 left-3 text-[10px] font-bold opacity-60 z-10" style={{ color: "var(--app-ink-2)" }}>서귀포시</div>
      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full glass-pill flex items-center gap-2 z-10">
            <span className="text-[13px] font-bold" style={{ color: "var(--app-ink)" }}>{hovered}</span>
            {(areaCounts[hovered] || 0) > 0 && <Tiny style={{ color: "rgb(var(--accent-070))" }}>{areaCounts[hovered]}곳</Tiny>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JejuGeoMap;
