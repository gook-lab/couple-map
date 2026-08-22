import React, { useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Body, Meta, Tiny } from "@/components/ui/typography";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import type { KakaoPlace } from "@/types/place";
import { stagger, staggerItem } from "@/lib/animations";

const PlaceSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { regionId } = useParams<{ regionId: string }>();
  const location = useLocation();
  const regionName = (location.state as { regionName?: string })?.regionName || regionId;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<KakaoPlace[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setSearching(true);

    try {
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(
        `${regionName} ${query}`,
        (data: KakaoPlace[], status: string) => {
          if (status === window.kakao.maps.services.Status.OK) {
            setResults(data.slice(0, 10));
          } else {
            setResults([]);
          }
          setSearching(false);
        }
      );
    } catch {
      setSearching(false);
    }
  }, [query, regionName]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleConfirm = () => {
    const place = results.find((r) => r.id === selectedId);
    if (place) {
      navigate("/add/form", {
        state: {
          regionId,
          regionName,
          place: {
            kakaoPlaceId: place.id,
            name: place.place_name,
            address: place.road_address_name || place.address_name,
            category: place.category_group_name,
            lat: parseFloat(place.y),
            lng: parseFloat(place.x),
          },
        },
      });
    }
  };

  const selectedPlace = results.find((r) => r.id === selectedId);

  return (
    <PageContainer flex>
      <PageHeader title={`${regionName} · 어디였어요?`} />

      {/* Search bar */}
      <div className="px-5 pt-3 pb-2">
        <div
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
          style={{ background: "var(--app-card)", border: `1.6px solid ${query ? "rgb(var(--accent-070))" : "var(--app-line)"}` }}
        >
          <Search className="w-4 h-4" style={{ color: "var(--app-ink-3)" }} />
          <input
            type="text"
            placeholder="장소 이름으로 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 bg-transparent text-[15px] outline-none"
            style={{ color: "var(--app-ink)" }}
          />
          {query && (
            <button onClick={handleSearch} className="text-[13px] font-bold" style={{ color: "rgb(var(--accent-070))" }}>
              검색
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 px-5 pt-1 pb-24 overflow-y-auto">
        {searching && (
          <div className="py-8 text-center">
            <Meta>검색 중...</Meta>
          </div>
        )}

        {!searching && results.length === 0 && query && (
          <div className="py-8 text-center">
            <Meta className="block">검색 결과가 없어요</Meta>
            <Tiny className="mt-1 block">다른 키워드로 검색해보세요</Tiny>
          </div>
        )}

        {!searching && results.length === 0 && !query && (
          <div className="py-8 text-center">
            <span className="text-4xl">📍</span>
            <Meta className="mt-3 block">
              {regionName}에서 방문한 곳을
              <br />
              검색해보세요
            </Meta>
          </div>
        )}

        {results.length > 0 && (
          <motion.div className="flex flex-col gap-2" variants={stagger} initial="initial" animate="animate">
            {results.map((place) => {
              const isSelected = selectedId === place.id;
              return (
                <motion.button
                  key={place.id}
                  variants={staggerItem}
                  onClick={() => {
                    setSelectedId(place.id);
                    navigate("/add/form", {
                      state: {
                        regionId,
                        regionName,
                        place: {
                          kakaoPlaceId: place.id,
                          name: place.place_name,
                          address: place.road_address_name || place.address_name,
                          category: place.category_group_name,
                          lat: parseFloat(place.y),
                          lng: parseFloat(place.x),
                        },
                      },
                    });
                  }}
                  className="flex items-start gap-3 px-3 py-3 text-left rounded-xl transition-all"
                  style={{
                    background: isSelected ? "rgb(var(--accent-010))" : "var(--app-card)",
                    border: `1.5px solid ${isSelected ? "rgb(var(--accent-070))" : "var(--app-line-soft)"}`,
                  }}
                >
                  <MapPin
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: isSelected ? "rgb(var(--accent-070))" : "var(--app-ink-3)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <Body className="font-bold block truncate">{place.place_name}</Body>
                    <Tiny className="mt-0.5 truncate block">{place.road_address_name || place.address_name}</Tiny>
                  </div>
                  {place.category_group_name && (
                    <Tiny className="flex-shrink-0 mt-0.5">{place.category_group_name}</Tiny>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* CTA */}
      {selectedPlace && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-6 pt-3" style={{ background: "var(--app-bg)" }}>
          <button
            onClick={handleConfirm}
            className="w-full py-3.5 rounded-full text-[16px] font-bold"
            style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)", boxShadow: "var(--app-shadow)" }}
          >
            {selectedPlace.place_name} 선택 →
          </button>
        </div>
      )}
    </PageContainer>
  );
};

export default PlaceSearchPage;
