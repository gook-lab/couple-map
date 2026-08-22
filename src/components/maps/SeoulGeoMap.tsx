import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { motion, AnimatePresence } from "framer-motion";
import { Tiny } from "@/components/ui/typography";
import { PanZoomContainer } from "./PanZoomContainer";

interface SeoulGeoMapProps {
  districtCounts: Record<string, number>;
  selectedDistrict?: string | null;
  onDistrictClick?: (name: string) => void;
}

const SeoulGeoMap: React.FC<SeoulGeoMapProps> = ({ districtCounts, selectedDistrict, onDistrictClick }) => {
  const [mapData, setMapData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch("/maps/seoul-simple.json").then((r) => r.json()).then((data) => { setMapData(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const getColor = (name: string) => {
    const count = districtCounts[name] || 0;
    if (selectedDistrict === name) return "rgb(var(--accent-060))";
    if (hovered === name && count > 0) return "rgb(var(--accent-040))";
    if (hovered === name) return "rgb(var(--accent-010))";
    if (count >= 3) return "rgb(var(--accent-040))";
    if (count >= 1) return "rgb(var(--accent-020))";
    return "var(--app-card)";
  };

  const getStroke = (name: string) => {
    if (selectedDistrict === name) return "var(--app-ink)";
    if (hovered === name) return "rgb(var(--accent-050))";
    return "var(--app-line-soft)";
  };

  if (loading) return <div className="w-full flex items-center justify-center" style={{ height: 380 }}><div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "rgb(var(--accent-030))", borderTopColor: "rgb(var(--accent-070))" }} /></div>;
  if (!mapData) return null;

  return (
    <div className="relative">
      <PanZoomContainer height={380}>
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 58000, center: [126.97, 37.55] }} width={460} height={380} className="w-full h-full" style={{ background: "transparent" }}>
          <Geographies geography={mapData}>
            {({ geographies }: { geographies: { properties: { name: string }; rsmKey: string }[] }) =>
              geographies.map((geo) => {
                const name = geo.properties.name;
                return (
                  <Geography key={geo.rsmKey} geography={geo}
                    onClick={() => onDistrictClick?.(name)}
                    onMouseEnter={() => setHovered(name)} onMouseLeave={() => setHovered(null)}
                    style={{
                      default: { fill: getColor(name), stroke: getStroke(name), strokeWidth: 0.5, cursor: "pointer", transition: "fill 0.2s", outline: "none" },
                      hover: { fill: getColor(name), stroke: getStroke(name), strokeWidth: 1, outline: "none" },
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
                const shortName = name.replace("구", "");
                const count = districtCounts[name] || 0;
                return (
                  <Marker key={`l-${geo.rsmKey}`} coordinates={centroid}>
                    <text textAnchor="middle" y={count > 0 ? -3 : 0} dominantBaseline="central" fontSize={7.5}
                      fontWeight={selectedDistrict === name ? 700 : 500}
                      fill={selectedDistrict === name ? "white" : count > 0 ? "rgb(var(--accent-090))" : "var(--app-ink-3)"}
                      className="pointer-events-none select-none" style={{ textShadow: "0 0 3px var(--app-card)" }}>{shortName}</text>
                    {count > 0 && <text textAnchor="middle" y={6} dominantBaseline="central" fontSize={5.5} fontWeight={500} fill="rgb(var(--accent-070))" className="pointer-events-none select-none">{count}곳</text>}
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
            {(districtCounts[hovered] || 0) > 0 && <Tiny style={{ color: "rgb(var(--accent-070))" }}>{districtCounts[hovered]}곳</Tiny>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeoulGeoMap;
