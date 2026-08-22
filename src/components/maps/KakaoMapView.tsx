import React, { useState, useEffect } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import type { Place, KakaoPlace } from "@/types/place";
import PlaceDetailModal from "./PlaceDetailModal";
import { savePlace, deletePlace } from "@/services/places";
import { useAuthStore } from "@/store/use-auth-store";
import { MapPin, Search, X } from "lucide-react";
import { Meta, Tiny } from "@/components/ui/typography";

interface KakaoMapViewProps {
  places: Place[];
}

const KakaoMapView: React.FC<KakaoMapViewProps> = ({ places }) => {
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState(false);

  useEffect(() => {
    if (window.kakao?.maps) { setSdkReady(true); return; }
    const timer = setInterval(() => {
      if (window.kakao?.maps) { setSdkReady(true); clearInterval(timer); }
    }, 200);
    const timeout = setTimeout(() => { clearInterval(timer); if (!window.kakao?.maps) setSdkError(true); }, 10000);
    return () => { clearInterval(timer); clearTimeout(timeout); };
  }, []);

  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<KakaoPlace[]>([]);
  const [, setIsSearching] = useState(false);
  const [sheetMode, setSheetMode] = useState<"saved" | "search">("saved");
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  const handleSearch = () => {
    if (!keyword.trim() || !window.kakao?.maps?.services) return;
    const ps = new window.kakao.maps.services.Places();
    setIsSearching(true);
    setSheetMode("search");
    ps.keywordSearch(keyword, (data: KakaoPlace[], status: string) => {
      setIsSearching(false);
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchResults(data.slice(0, 10));
        if (data.length > 0) setCenter({ lat: parseFloat(data[0].y), lng: parseFloat(data[0].x) });
      } else {
        setSearchResults([]);
      }
    });
  };

  const coupleId = useAuthStore((s) => s.state.coupleId);

  const handleSave = async (kakaoPlace: KakaoPlace) => {
    if (!coupleId) return;
    await savePlace({
      coupleId,
      kakaoPlaceId: kakaoPlace.id, name: kakaoPlace.place_name,
      address: kakaoPlace.road_address_name || kakaoPlace.address_name,
      category: kakaoPlace.category_group_name || "기타",
      lat: parseFloat(kakaoPlace.y), lng: parseFloat(kakaoPlace.x),
      region: "", status: "wanted", memo: "", rating: 0, photos: [], visitedAt: [], tags: [],
    });
  };

  const isSaved = (kakaoPlaceId: string) => places.some((p) => p.kakaoPlaceId === kakaoPlaceId);

  if (!sdkReady && !sdkError) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--app-line-soft)" }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "rgb(var(--accent-070))", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (sdkError) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-center" style={{ background: "var(--app-line-soft)" }}>
        <div>
          <MapPin className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--app-ink-3)" }} />
          <Meta className="block">지도를 불러올 수 없어요</Meta>
          <Tiny className="block mt-1">네트워크 연결을 확인해주세요</Tiny>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="relative" style={{ height: "55%" }}>
        {/* Inline search bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="absolute top-3 left-3 right-3 z-10">
          <div className="relative">
            <input
              type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)}
              placeholder="맛집, 카페, 데이트 장소 검색"
              className="w-full h-11 pl-10 pr-10 glass-pill text-[14px] outline-none"
              style={{ color: "var(--app-ink)" }}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--app-ink-3)" }} />
            {keyword && (
              <button type="button" onClick={() => { setKeyword(""); setSearchResults([]); setSheetMode("saved"); }}
                className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4" style={{ color: "var(--app-ink-3)" }} />
              </button>
            )}
          </div>
        </form>

        <Map center={center} style={{ width: "100%", height: "100%" }} level={5}>
          {places.map((place) => (
            <MapMarker key={place.id} position={{ lat: place.lat, lng: place.lng }}
              image={{ src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", size: { width: 24, height: 35 } }}
              title={place.name} />
          ))}
          {searchResults.map((result) =>
            !isSaved(result.id) ? (
              <MapMarker key={`s-${result.id}`} position={{ lat: parseFloat(result.y), lng: parseFloat(result.x) }} title={result.place_name} />
            ) : null
          )}
        </Map>
      </div>

      <div className="flex-1 glass-bar overflow-y-auto">
        <div className="px-4 pt-3 pb-4">
          {sheetMode === "search" && searchResults.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <Meta className="font-bold">검색 결과 ({searchResults.length})</Meta>
                <button onClick={() => { setSheetMode("saved"); setSearchResults([]); }} className="text-[12px] font-bold" style={{ color: "var(--app-ink-2)" }}>저장 목록 보기</button>
              </div>
              <div className="flex flex-col gap-2">
                {searchResults.map((result) => {
                  const saved = places.find((p) => p.kakaoPlaceId === result.id);
                  return (
                    <div key={result.id} className="flex items-center gap-3 p-3 glass-card cursor-pointer"
                      onClick={() => setCenter({ lat: parseFloat(result.y), lng: parseFloat(result.x) })}>
                      <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: "var(--app-ink-2)" }} />
                      <div className="flex-1 min-w-0">
                        <span className="text-[14px] font-bold block truncate" style={{ color: "var(--app-ink)" }}>{result.place_name}</span>
                        <Tiny className="block truncate">{result.category_group_name} · {result.road_address_name?.split(" ").slice(0, 2).join(" ")}</Tiny>
                      </div>
                      {saved ? (
                        <button onClick={(e) => { e.stopPropagation(); deletePlace(saved.id); }} className="px-3 py-1.5 rounded-full glass-pill text-[12px] font-bold">저장됨 ✓</button>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); handleSave(result); }}
                          className="px-3 py-1.5 rounded-full text-[12px] font-bold" style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)" }}>저장</button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : places.length > 0 ? (
            <div>
              <Meta className="font-bold mb-3 block">저장된 장소 ({places.length})</Meta>
              <div className="flex flex-col gap-2">
                {places.map((place) => (
                  <div key={place.id} className="flex items-center gap-3 p-3 glass-card cursor-pointer"
                    onClick={() => setCenter({ lat: place.lat, lng: place.lng })}>
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{
                        background: place.status === "visited" ? "rgb(var(--accent-070))" : "var(--app-line-soft)",
                        border: "1.5px solid var(--app-line)",
                      }}
                    >
                      <MapPin className="w-4 h-4" style={{ color: place.status === "visited" ? "var(--app-ink-on-accent)" : "var(--app-ink-2)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[14px] font-bold block truncate" style={{ color: "var(--app-ink)" }}>{place.name}</span>
                      <Tiny className="block truncate">{place.category}{place.rating > 0 ? ` · ${"★".repeat(place.rating)}` : ""}</Tiny>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setEditingPlace(place); }}
                      className="text-[12px] font-bold" style={{ color: "var(--app-ink-3)" }}>편집</button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Search className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--app-ink-3)" }} />
              <Meta className="block font-bold">우리만의 맛집 지도를 만들어봐요!</Meta>
              <Tiny className="block mt-1">검색해서 가고 싶은 곳을 저장해보세요</Tiny>
            </div>
          )}
        </div>
      </div>

      {editingPlace && <PlaceDetailModal place={editingPlace} onClose={() => setEditingPlace(null)} />}
    </div>
  );
};

export default KakaoMapView;
