import React, { useState, useEffect } from "react";
import { H2, H3, Meta, Tiny } from "@/components/ui/typography";
import StatCard from "@/components/ui/stat-card";
import GlassList from "@/components/ui/glass-list";
import ListRow from "@/components/ui/list-row";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { subscribePlaces } from "@/services/places";
import { useAuthStore } from "@/store/use-auth-store";
import { KOREA_REGIONS } from "@/lib/countries";
import type { Place } from "@/types/place";

const CATEGORY_EMOJI: Record<string, string> = { 음식점: "🍜", 카페: "☕", 관광명소: "🏖️", 숙박: "🏨", 기타: "📍" };

const Stats: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const coupleId = useAuthStore((s) => s.state.coupleId);

  useEffect(() => {
    if (!coupleId) return;
    try { return subscribePlaces(coupleId, setPlaces); } catch { /* */ }
  }, [coupleId]);

  const totalPhotos = places.reduce((s, p) => s + (p.photos?.length || 0), 0);
  const totalDiaries = places.filter((p) => p.memo).length;
  const visitedRegions = new Set(places.map((p) => KOREA_REGIONS.find((r) => p.region?.includes(r.name))?.id).filter(Boolean));

  const categoryCounts: Record<string, number> = {};
  places.forEach((p) => { categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1; });
  const topCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const monthCounts: Record<string, number> = {};
  places.forEach((p) => {
    const d = p.visitedAt?.[0] ? new Date(p.visitedAt[0]) : new Date(p.savedAt);
    const key = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthCounts[key] = (monthCounts[key] || 0) + 1;
  });
  const months = Object.entries(monthCounts).sort((a, b) => a[0].localeCompare(b[0])).slice(-6);
  const maxMonth = Math.max(...months.map(([, v]) => v), 1);

  return (
    <PageContainer withBottomNav>
      <PageHeader title="우리의 통계 📊" />

      <div className="px-5 pt-4">
        <H2>우리의 1년</H2>
        <Meta className="mt-1 block">함께 만든 추억을 숫자로</Meta>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <StatCard value={places.length} label="총 추억" />
          <StatCard value={visitedRegions.size} label="방문 시도" />
          <StatCard value={totalPhotos} label="사진" />
          <StatCard value={totalDiaries} label="일기" />
        </div>

        {/* Monthly chart */}
        {months.length > 0 && (
          <div className="mt-6">
            <H3 className="mb-3">월별 추억</H3>
            <div className="glass-card p-4">
              <div className="flex items-end gap-2 h-[120px]">
                {months.map(([month, count]) => (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1">
                    <Tiny className="font-semibold" style={{ color: "rgb(var(--accent-070))" }}>{count}</Tiny>
                    <div className="w-full rounded-t-md transition-all" style={{
                      height: `${(count / maxMonth) * 80}px`,
                      background: "rgb(var(--accent-030))",
                      minHeight: 4,
                    }} />
                    <Tiny>{month.split(".")[1]}월</Tiny>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Top categories */}
        {topCategories.length > 0 && (
          <GlassList header="자주 가는 카테고리" className="mt-5">
            {topCategories.map(([cat, count], i) => (
              <ListRow key={cat} emoji={CATEGORY_EMOJI[cat] || "📍"} title={cat} detail={`${count}곳`} isLast={i === topCategories.length - 1} chevron={false} />
            ))}
          </GlassList>
        )}
      </div>
    </PageContainer>
  );
};

export default Stats;
