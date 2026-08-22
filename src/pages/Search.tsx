import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search as SearchIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Body, Meta, Tiny } from "@/components/ui/typography";
import PageContainer from "@/components/layout/PageContainer";
import { subscribePlaces } from "@/services/places";
import { useAuthStore } from "@/store/use-auth-store";
import { stagger, staggerItem } from "@/lib/animations";
import type { Place } from "@/types/place";

const CATEGORY_EMOJI: Record<string, string> = { 음식점: "🍜", 카페: "☕", 관광명소: "🏖️", 숙박: "🏨", 기타: "📍" };

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const coupleId = useAuthStore((s) => s.state.coupleId);

  useEffect(() => {
    if (!coupleId) return;
    try { return subscribePlaces(coupleId, setPlaces); } catch { /* */ }
  }, [coupleId]);

  const results = query.trim()
    ? places.filter((p) =>
        p.name.includes(query) || p.memo?.includes(query) || p.tags?.some((t) => t.includes(query)) || p.region?.includes(query)
      )
    : [];

  const recentTags = [...new Set(places.flatMap((p) => p.tags || []))].slice(0, 8);

  return (
    <PageContainer withBottomNav>
      <header className="sticky top-0 z-10 glass-bar px-4 pt-3 pb-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} aria-label="뒤로 가기" className="p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" style={{ color: "var(--app-ink)" }} />
        </button>
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--app-ink-3)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            placeholder="장소, 태그, 일기 검색..."
            className="w-full h-10 pl-9 pr-3 rounded-full text-[14px] outline-none"
            style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)", color: "var(--app-ink)" }}
          />
        </div>
      </header>

      <div className="px-5 pt-3">
        {!query.trim() && (
          <div>
            <Tiny className="block mb-2">최근 태그</Tiny>
            <div className="flex flex-wrap gap-1.5">
              {recentTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1 rounded-full glass-pill text-[12px] font-bold"
                  style={{ color: "var(--app-ink-2)" }}
                >
                  {tag}
                </button>
              ))}
            </div>
            {recentTags.length === 0 && <Meta>아직 태그가 없어요</Meta>}
          </div>
        )}

        {query.trim() && results.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl">🔍</span>
            <Meta className="mt-3 block">"{query}" 검색 결과가 없어요</Meta>
          </div>
        )}

        {results.length > 0 && (
          <motion.div className="flex flex-col gap-2" variants={stagger} initial="initial" animate="animate">
            <Tiny className="mb-1 block">{results.length}개 결과</Tiny>
            {results.map((place) => (
              <motion.button
                key={place.id}
                variants={staggerItem}
                onClick={() => navigate(`/memory/${place.id}`)}
                className="flex items-center gap-3 p-3 rounded-xl text-left"
                style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)" }}
              >
                <span className="text-xl">{CATEGORY_EMOJI[place.category] || "📍"}</span>
                <div className="flex-1 min-w-0">
                  <Body className="font-bold block truncate">{place.name}</Body>
                  {place.memo && <Tiny className="block truncate mt-0.5">{place.memo.slice(0, 40)}</Tiny>}
                </div>
                <Tiny>{place.region}</Tiny>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </PageContainer>
  );
};

export default Search;
