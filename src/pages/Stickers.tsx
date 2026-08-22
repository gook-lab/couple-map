import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { H2, Body, Meta, Tiny } from "@/components/ui/typography";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { useAuthStore } from "@/store/use-auth-store";
import { addSticker, subscribeStickers } from "@/services/stickers";
import toast from "@/lib/toast";

type SubView = "book" | "new-start" | "photo-pick" | "design" | "saved" | "browse";

interface DisplaySticker { id: string; emoji: string; region: string; dateLabel: string }

const DEMO_STICKERS: DisplaySticker[] = [
  { id: "d0", emoji: "🌊", region: "제주", dateLabel: "24.03" },
  { id: "d1", emoji: "🌃", region: "부산", dateLabel: "24.05" },
  { id: "d2", emoji: "☕", region: "서울", dateLabel: "24.06" },
  { id: "d3", emoji: "🏯", region: "경주", dateLabel: "24.07" },
  { id: "d4", emoji: "🌲", region: "강원", dateLabel: "24.08" },
  { id: "d5", emoji: "🍜", region: "전주", dateLabel: "24.09" },
  { id: "d6", emoji: "🌅", region: "속초", dateLabel: "24.10" },
  { id: "d7", emoji: "🎨", region: "대구", dateLabel: "24.11" },
  { id: "d8", emoji: "🦀", region: "여수", dateLabel: "24.12" },
];

const LOCKED_COUNT = 8;

const SHAPES = ["원형", "사각", "꽃", "스탬프"];
const COLORS = ["#f97863", "#4A7DE0", "#6b8c66", "#c084fc", "#fbbf24", "#000"];

const fmtStickerDate = (d: Date) =>
  `${String(d.getFullYear()).slice(2)}.${String(d.getMonth() + 1).padStart(2, "0")}`;

const Stickers: React.FC = () => {
  const navigate = useNavigate();
  const coupleId = useAuthStore((s) => s.state.coupleId);
  const [view, setView] = useState<SubView>("book");
  const [activeFilter, setActiveFilter] = useState("전체");
  const [selectedShape, setSelectedShape] = useState("원형");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [browseIndex, setBrowseIndex] = useState(0);
  const [stickers, setStickers] = useState<DisplaySticker[]>(DEMO_STICKERS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!coupleId) return;
    try {
      return subscribeStickers(coupleId, (items) => {
        setStickers(
          items.map((s) => ({ id: s.id, emoji: s.emoji, region: s.region, dateLabel: fmtStickerDate(s.createdAt) }))
        );
      });
    } catch { /* keep demo */ }
  }, [coupleId]);

  const handleSaveSticker = async () => {
    if (coupleId) {
      setSaving(true);
      try {
        await addSticker({ coupleId, emoji: "🏝️", region: "거제", shape: selectedShape, color: selectedColor });
      } catch {
        toast.error({ message: "저장에 실패했어요" });
      }
      setSaving(false);
    }
    setView("saved");
  };

  const titleFor = (v: SubView) =>
    v === "book" ? "스티커북"
      : v === "new-start" ? "새 스티커"
      : v === "photo-pick" ? "사진 선택"
      : v === "design" ? "스티커 디자인"
      : v === "saved" ? "저장 완료"
      : `${browseIndex + 1}/${stickers.length}`;

  const accentBtn = { background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)" } as React.CSSProperties;

  return (
    <PageContainer withBottomNav>
      <PageHeader
        title={titleFor(view)}
        onBack={() => { if (view === "book") navigate(-1); else setView("book"); }}
        right={
          view === "browse" ? (
            <button aria-label="공유" className="p-1"><Share2 className="w-5 h-5" style={{ color: "var(--app-ink-2)" }} /></button>
          ) : undefined
        }
      />

      <AnimatePresence mode="wait">
        {/* ── Sticker Grid ── */}
        {view === "book" && (
          <motion.div key="book" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pt-3">
            <Meta className="mb-3 block">{stickers.length}개 획득 · {LOCKED_COUNT}개 잠김</Meta>

            <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
              {["전체", "획득", "잠김"].map((f) => {
                const isActive = activeFilter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className="px-3.5 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap"
                    style={
                      isActive
                        ? { background: "var(--app-ink)", color: "var(--app-bg)", border: "1.5px solid var(--app-line)" }
                        : { background: "var(--app-card)", color: "var(--app-ink-2)", border: "1.5px solid var(--app-line-soft)" }
                    }
                  >
                    {f}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(activeFilter !== "잠김" ? stickers : []).map((sticker, i) => (
                <button
                  key={sticker.id}
                  onClick={() => { setBrowseIndex(i); setView("browse"); }}
                  className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 p-2"
                  style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)", boxShadow: "var(--app-shadow)" }}
                >
                  <span className="text-3xl">{sticker.emoji}</span>
                  <Tiny style={{ color: "var(--app-ink)" }} className="font-extrabold">{sticker.region}</Tiny>
                  <Tiny>{sticker.dateLabel}</Tiny>
                </button>
              ))}

              {(activeFilter !== "획득" ? Array.from({ length: LOCKED_COUNT }) : []).map((_, i) => (
                <div
                  key={`l-${i}`}
                  className="aspect-square rounded-2xl flex items-center justify-center opacity-40"
                  style={{ background: "var(--app-line-soft)", border: "1.5px dashed var(--app-line)" }}
                >
                  <span className="text-2xl">🔒</span>
                </div>
              ))}

              {activeFilter !== "잠김" && (
                <button
                  onClick={() => setView("new-start")}
                  className="aspect-square rounded-2xl flex items-center justify-center"
                  style={{ border: "1.6px dashed rgb(var(--accent-070))" }}
                >
                  <Plus className="w-6 h-6" style={{ color: "rgb(var(--accent-070))" }} />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ── New Start ── */}
        {view === "new-start" && (
          <motion.div key="new-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pt-4">
            <Meta className="mb-4 block">어떤 지역의 스티커를 만들까요?</Meta>
            <div className="flex flex-col gap-2.5">
              {[
                { emoji: "🏝️", title: "최근 다녀온 지역", sub: "거제", selected: true },
                { emoji: "🗺️", title: "지도에서 고르기", sub: "방문한 지역 중 선택", selected: false },
                { emoji: "🔍", title: "검색해서 추가", sub: "지역명으로 검색", selected: false },
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setView("photo-pick")}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl text-left"
                  style={{
                    background: opt.selected ? "rgb(var(--accent-010))" : "var(--app-card)",
                    border: `1.6px solid ${opt.selected ? "rgb(var(--accent-070))" : "var(--app-line-soft)"}`,
                  }}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <div className="flex-1">
                    <Body className="font-bold block">{opt.title}</Body>
                    <Meta className="mt-0.5 block">{opt.sub}</Meta>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Photo Pick ── */}
        {view === "photo-pick" && (
          <motion.div key="photo-pick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pt-4">
            <Meta className="mb-3 block">대표 사진을 선택하세요</Meta>
            <div className="grid grid-cols-3 gap-1.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setView("design")}
                  className="aspect-square rounded-xl flex items-center justify-center"
                  style={{
                    background: "var(--app-line-soft)",
                    border: `${i === 2 ? "2.4px solid rgb(var(--accent-070))" : "1.5px solid var(--app-line)"}`,
                  }}
                >
                  <Tiny>📸 {i + 1}</Tiny>
                </button>
              ))}
            </div>
            <button onClick={() => setView("design")} className="w-full mt-2 text-center py-2 text-[13px]" style={{ color: "var(--app-ink-3)" }}>건너뛰기</button>
          </motion.div>
        )}

        {/* ── Design Editor ── */}
        {view === "design" && (
          <motion.div key="design" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pt-4">
            <div className="flex justify-center my-6">
              <div
                className="w-[220px] h-[220px] rounded-full flex flex-col items-center justify-center gap-2"
                style={{ background: "rgb(var(--accent-010))", border: `3px solid ${selectedColor}` }}
              >
                <span className="text-5xl">🏝️</span>
                <span className="text-[16px] font-extrabold" style={{ color: "var(--app-ink)" }}>거제</span>
                <Tiny>2024.12 · 민지&준호</Tiny>
              </div>
            </div>

            <div className="mt-4">
              <Tiny className="mb-2 block">모양</Tiny>
              <div className="flex gap-2">
                {SHAPES.map((shape) => {
                  const isActive = selectedShape === shape;
                  return (
                    <button
                      key={shape}
                      onClick={() => setSelectedShape(shape)}
                      className="flex-1 py-2 rounded-xl text-[13px] font-bold"
                      style={{
                        background: isActive ? "rgb(var(--accent-010))" : "var(--app-card)",
                        border: `${isActive ? "2px" : "1.5px"} solid ${isActive ? "rgb(var(--accent-070))" : "var(--app-line-soft)"}`,
                      }}
                    >
                      {shape}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4">
              <Tiny className="mb-2 block">테두리 색</Tiny>
              <div className="flex gap-2.5">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className="w-9 h-9 rounded-full"
                    style={{
                      background: c,
                      border: selectedColor === c ? "3px solid var(--app-ink)" : "1.6px solid var(--app-line-soft)",
                      boxShadow: selectedColor === c ? "inset 0 0 0 3px var(--app-card)" : undefined,
                    }}
                  />
                ))}
              </div>
            </div>

            <button onClick={handleSaveSticker} disabled={saving} className="w-full mt-6 py-3.5 rounded-full text-[16px] font-bold disabled:opacity-50" style={accentBtn}>
              {saving ? "저장 중..." : "스티커 저장"}
            </button>
          </motion.div>
        )}

        {/* ── Saved ── */}
        {view === "saved" && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-5 pt-20"
          >
            <div
              className="w-[120px] h-[120px] rounded-full flex items-center justify-center mb-4"
              style={{ background: "rgb(var(--accent-010))", border: `3px solid ${selectedColor}` }}
            >
              <span className="text-4xl">🏝️</span>
            </div>
            <H2>스티커가 추가됐어요!</H2>
            <Meta className="mt-2 text-center block">{stickers.length + (coupleId ? 0 : 1)}번째 스티커가 저장되었어요</Meta>
            <button onClick={() => setView("book")} className="mt-6 px-8 py-3 rounded-full text-[15px] font-bold" style={accentBtn}>
              스티커북 보기
            </button>
          </motion.div>
        )}

        {/* ── Browse Carousel ── */}
        {view === "browse" && (
          <motion.div
            key="browse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-5 pt-10"
            style={{ background: "#1a1612", minHeight: "calc(100vh - 56px)" }}
          >
            <div
              className="w-[200px] h-[200px] rounded-full flex flex-col items-center justify-center gap-2"
              style={{ background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.2)" }}
            >
              <span className="text-5xl">{stickers[browseIndex]?.emoji}</span>
              <span className="text-[16px] font-bold text-white">{stickers[browseIndex]?.region}</span>
              <span className="text-[11px] text-white/60">{stickers[browseIndex]?.dateLabel}</span>
            </div>
            <div className="flex gap-1.5 mt-6">
              {stickers.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBrowseIndex(i)}
                  className={`w-2 h-2 rounded-full ${i === browseIndex ? "bg-white" : "bg-white/30"}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default Stickers;
