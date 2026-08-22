import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Body, Meta, Tiny } from "@/components/ui/typography";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { Sticker } from "@/components/ui/sticker";
import { COUNTRIES, type Country } from "@/lib/countries";
import { subscribePlaces } from "@/services/places";
import { useAuthStore } from "@/store/use-auth-store";
import type { Place } from "@/types/place";
import { stagger, staggerItem } from "@/lib/animations";

const CountrySelect: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const coupleId = useAuthStore((s) => s.state.coupleId);

  useEffect(() => {
    if (!coupleId) return;
    try {
      return subscribePlaces(coupleId, setPlaces);
    } catch {
      // Firestore not configured
    }
  }, [coupleId]);

  const getVisitedCount = (countryId: string): number => {
    if (countryId === "korea") {
      const regions = new Set(places.map((p) => p.region).filter(Boolean));
      return regions.size;
    }
    return 0;
  };

  const filtered = searchQuery
    ? COUNTRIES.filter((c) => c.name.includes(searchQuery))
    : COUNTRIES;

  const handleSelect = (country: Country) => {
    if (country.id === "korea" || country.id === "japan") {
      navigate(`/add/region/${country.id}`);
    } else {
      navigate(`/add/search/${country.id}`, { state: { regionName: country.name } });
    }
  };

  return (
    <PageContainer>
      <PageHeader title="어느 나라 추억인가요?" />

      <div className="px-5 pt-3 pb-2">
        <div
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
          style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)" }}
        >
          <Search className="w-4 h-4" style={{ color: "var(--app-ink-3)" }} />
          <input
            type="text"
            placeholder="나라 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[15px] outline-none"
            style={{ color: "var(--app-ink)" }}
          />
        </div>
      </div>

      <motion.div
        className="px-5 pt-2 pb-8 flex flex-col gap-2.5"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        {filtered.map((country) => {
          const visited = getVisitedCount(country.id);
          const progress = visited / country.totalSubdivisions;
          const hasVisits = visited > 0;

          return (
            <motion.button
              key={country.id}
              variants={staggerItem}
              onClick={() => handleSelect(country)}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl text-left transition-all"
              style={{
                background: "var(--app-card)",
                border: "1.5px solid var(--app-line)",
                boxShadow: hasVisits ? "var(--app-shadow)" : undefined,
                opacity: hasVisits ? 1 : 0.7,
              }}
            >
              <span className="text-[28px] flex-shrink-0">{country.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Body className="font-bold">{country.name}</Body>
                  {hasVisits && <Sticker color="pink">HOT</Sticker>}
                </div>
                <Meta className="mt-0.5 block">
                  {hasVisits
                    ? `${visited} / ${country.totalSubdivisions} ${country.subdivisionLabel}`
                    : "미방문"}
                </Meta>
                {hasVisits && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--app-line-soft)" }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.max(progress * 100, 2)}%`,
                          background: "rgb(var(--accent-070))",
                        }}
                      />
                    </div>
                    <Tiny>{Math.round(progress * 100)}%</Tiny>
                  </div>
                )}
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--app-ink-3)" }} />
            </motion.button>
          );
        })}

        <button
          className="flex items-center gap-3.5 p-3.5 rounded-2xl text-left opacity-60"
          style={{ border: "1.6px dashed var(--app-line)" }}
        >
          <span className="text-[28px]">🌏</span>
          <div className="flex-1">
            <Body className="font-bold">다른 나라 추가</Body>
            <Meta className="mt-0.5 block">검색해서 추가하기</Meta>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: "var(--app-ink-3)" }} />
        </button>
      </motion.div>
    </PageContainer>
  );
};

export default CountrySelect;
