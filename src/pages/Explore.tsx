import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Bookmark, Flag, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { H2, H3, Body, Meta, Tiny } from "@/components/ui/typography";
import EmptyState from "@/components/ui/empty-state";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { CandyCard } from "@/components/ui/sticker";
import { stagger, staggerItem } from "@/lib/animations";
import toast from "@/lib/toast";

type SubView = "feed" | "safety" | "detail" | "clone" | "report";

const REGIONS = ["전체", "제주", "강릉", "부산", "서울", "경주"];

const SAMPLE_FEEDS = [
  { id: "1", title: "봄제주, 둘이서 🌸", region: "제주", pins: 5, saves: 847, hearts: 124, author: "🐻🐰", days: "3박 4일" },
  { id: "2", title: "부산 먹방 로드 🍜", region: "부산", pins: 8, saves: 312, hearts: 89, author: "🦊🐥", days: "2박 3일" },
  { id: "3", title: "서울 카페 투어 ☕", region: "서울", pins: 6, saves: 156, hearts: 45, author: "🐶🐱", days: "당일치기" },
];

const CLONE_PINS = [
  { emoji: "🏖️", name: "함덕 해수욕장", type: "풍경" },
  { emoji: "🍲", name: "갈치조림 맛집", type: "맛집" },
  { emoji: "☕", name: "협재 카페", type: "카페" },
  { emoji: "🌅", name: "성산일출봉", type: "풍경" },
  { emoji: "🍊", name: "감귤 체험 농장", type: "체험" },
];

const REPORT_REASONS = ["부적절한 사진", "실명·얼굴 노출", "광고·스팸", "저작권 침해", "기타"];

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<SubView>("feed");
  const [activeRegion, setActiveRegion] = useState("전체");
  const [selectedFeed, setSelectedFeed] = useState(SAMPLE_FEEDS[0]);
  const [showSafety, setShowSafety] = useState(true);

  const filtered = activeRegion === "전체" ? SAMPLE_FEEDS : SAMPLE_FEEDS.filter((f) => f.region === activeRegion);

  const titleFor = (v: SubView) =>
    v === "feed" ? "탐색" : v === "safety" ? "안전 안내" : v === "detail" ? selectedFeed.title : v === "clone" ? "코스 복제" : "신고하기";

  const accentBtn = { background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)" } as React.CSSProperties;
  const cardSurface = { background: "var(--app-card)", border: "1.5px solid var(--app-line)" } as React.CSSProperties;

  return (
    <PageContainer withBottomNav>
      <PageHeader title={titleFor(view)} onBack={() => { if (view !== "feed") setView("feed"); else navigate(-1); }} />

      <AnimatePresence mode="wait">
        {/* ── Feed ── */}
        {view === "feed" && (
          <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pt-2">
            {showSafety && (
              <CandyCard color="sky" onClick={() => { setShowSafety(false); setView("safety"); }} className="w-full mb-4 p-3 flex items-center gap-3">
                <span className="text-xl">🔒</span>
                <div className="flex-1">
                  <Body className="font-bold block">익명 · 안전한 탐색</Body>
                  <Tiny className="block mt-0.5">프로필은 이모지로만 표시돼요</Tiny>
                </div>
              </CandyCard>
            )}

            {/* Region filter */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3">
              {REGIONS.map((r) => {
                const isActive = activeRegion === r;
                return (
                  <button
                    key={r}
                    onClick={() => setActiveRegion(r)}
                    className="px-3.5 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap"
                    style={
                      isActive
                        ? { background: "var(--app-ink)", color: "var(--app-bg)", border: "1.5px solid var(--app-line)" }
                        : { background: "var(--app-card)", color: "var(--app-ink-2)", border: "1.5px solid var(--app-line-soft)" }
                    }
                  >
                    {r}
                  </button>
                );
              })}
            </div>

            {/* Feed cards */}
            <motion.div className="flex flex-col gap-3 mt-1" variants={stagger} initial="initial" animate="animate">
              {filtered.map((feed) => (
                <motion.button
                  key={feed.id}
                  variants={staggerItem}
                  onClick={() => { setSelectedFeed(feed); setView("detail"); }}
                  className="w-full p-4 rounded-2xl text-left"
                  style={{ ...cardSurface, boxShadow: "var(--app-shadow)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{feed.author}</span>
                    <Tiny>익명 커플</Tiny>
                    <Tiny className="ml-auto">{feed.days}</Tiny>
                  </div>
                  <div className="h-[140px] rounded-xl mb-3 flex items-center justify-center" style={{ background: "var(--app-line-soft)" }}>
                    <span className="text-4xl opacity-20">🗺️</span>
                  </div>
                  <H3>{feed.title}</H3>
                  <div className="flex items-center gap-3 mt-2">
                    <Tiny>📍 {feed.pins}곳</Tiny>
                    <Tiny>❤️ {feed.hearts}</Tiny>
                    <Tiny>📥 {feed.saves}</Tiny>
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {filtered.length === 0 && (
              <EmptyState icon="🔍" title="관심 지역을 골라주세요" description="다른 커플의 여행기를 둘러보세요" actionLabel="지역 선택" onAction={() => setActiveRegion("전체")} />
            )}
          </motion.div>
        )}

        {/* ── Safety ── */}
        {view === "safety" && (
          <motion.div key="safety" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pt-4">
            <div className="text-center mb-6">
              <span className="text-5xl">🔒</span>
              <H2 className="mt-3">안전한 탐색</H2>
              <Meta className="mt-2 block">둘 사이는 모든 탐색을 안전하게 보호해요</Meta>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { emoji: "🎭", title: "익명 아바타", desc: "모든 프로필은 이모지로만 표시돼요" },
                { emoji: "📍", title: "위치 흐림", desc: "정확한 주소 대신 지역 단위로만 공개" },
                { emoji: "🚨", title: "1탭 신고", desc: "부적절한 콘텐츠는 즉시 신고할 수 있어요" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-3.5 rounded-xl" style={cardSurface}>
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <Body className="font-bold block">{item.title}</Body>
                    <Meta className="block mt-0.5">{item.desc}</Meta>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setView("feed")} className="w-full mt-6 py-3.5 rounded-full text-[16px] font-bold" style={accentBtn}>
              알겠어요
            </button>
          </motion.div>
        )}

        {/* ── Detail ── */}
        {view === "detail" && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="h-[200px] flex items-center justify-center" style={{ background: "var(--app-line-soft)" }}>
              <span className="text-5xl opacity-20">🗺️</span>
            </div>
            <div className="px-5 pt-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{selectedFeed.author}</span>
                <Tiny>익명 커플 · {selectedFeed.region} · {selectedFeed.days}</Tiny>
              </div>
              <H2>{selectedFeed.title}</H2>
              <div className="flex items-center gap-4 mt-3 text-[14px]" style={{ color: "var(--app-ink-2)" }}>
                <span>📥 {selectedFeed.saves}</span>
                <span>❤️ {selectedFeed.hearts}</span>
                <span>📍 {selectedFeed.pins}곳</span>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2.5 rounded-full glass-pill text-[14px] font-bold flex items-center justify-center gap-1.5">
                  <Heart className="w-4 h-4" /> 좋아요
                </button>
                <button className="flex-1 py-2.5 rounded-full glass-pill text-[14px] font-bold flex items-center justify-center gap-1.5">
                  <Bookmark className="w-4 h-4" /> 저장
                </button>
              </div>

              <button
                onClick={() => setView("clone")}
                className="w-full mt-3 py-3 rounded-full text-[15px] font-bold flex items-center justify-center gap-2"
                style={accentBtn}
              >
                <Copy className="w-4 h-4" /> 내 지도에 복제
              </button>

              <button onClick={() => setView("report")} className="w-full mt-2 text-center py-2 text-[12px] flex items-center justify-center gap-1" style={{ color: "var(--app-ink-3)" }}>
                <Flag className="w-3 h-3" /> 신고
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Clone Sheet ── */}
        {view === "clone" && (
          <motion.div key="clone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pt-4">
            <Meta className="mb-4 block">이 코스의 {CLONE_PINS.length}개 핀이 내 지도에 추가돼요</Meta>
            <div className="flex flex-col gap-2">
              {CLONE_PINS.map((pin, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={cardSurface}>
                  <span className="text-xl">{pin.emoji}</span>
                  <div className="flex-1">
                    <Body className="font-bold block">{pin.name}</Body>
                    <Tiny className="block mt-0.5">{pin.type}</Tiny>
                  </div>
                  <span className="text-[12px] font-bold" style={{ color: "rgb(var(--accent-070))" }}>+ 추가</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => { toast.success({ message: `${CLONE_PINS.length}개 핀이 복제됐어요!` }); setView("feed"); }}
              className="w-full mt-5 py-3.5 rounded-full text-[16px] font-bold"
              style={accentBtn}
            >
              {CLONE_PINS.length}개 복제
            </button>
          </motion.div>
        )}

        {/* ── Report ── */}
        {view === "report" && (
          <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pt-4">
            <Meta className="mb-4 block">신고 사유를 선택해주세요</Meta>
            <div className="flex flex-col gap-2">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => { toast.success({ message: "신고가 접수됐어요" }); setView("feed"); }}
                  className="w-full p-3.5 rounded-xl text-left text-[15px] font-medium"
                  style={cardSurface}
                >
                  {reason}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default Explore;
