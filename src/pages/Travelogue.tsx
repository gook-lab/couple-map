import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Share2, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { H2, H3, Body, Meta, Tiny } from "@/components/ui/typography";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { useAuthStore } from "@/store/use-auth-store";
import { publishTravelogue } from "@/services/travelogues";
import toast from "@/lib/toast";

type SubView = "entry" | "pick-pins" | "order" | "caption" | "cover" | "published";

const SAMPLE_MEMORIES = [
  { id: "1", title: "함덕 도착", date: "03.14", checked: true },
  { id: "2", title: "갈치조림 맛집", date: "03.14", checked: true },
  { id: "3", title: "협재 해수욕장", date: "03.15", checked: true },
  { id: "4", title: "애월 카페", date: "03.15", checked: true },
  { id: "5", title: "오일장 구경", date: "03.16", checked: true },
  { id: "6", title: "성산일출봉", date: "03.16", checked: false },
  { id: "7", title: "공항 출발", date: "03.17", checked: false },
];

const COVER_STYLES = ["클래식", "폴라로이드", "미니멀", "엽서"];

const PAST_JOURNALS = [
  { title: "봄제주 둘이서", dates: "24.03.14-17", pages: 9 },
  { title: "서핑 도전기", dates: "24.07.02-04", pages: 6 },
];

const Travelogue: React.FC = () => {
  const navigate = useNavigate();
  const coupleId = useAuthStore((s) => s.state.coupleId);
  const [view, setView] = useState<SubView>("entry");
  const [memories, setMemories] = useState(SAMPLE_MEMORIES);
  const [currentPage, setCurrentPage] = useState(0);
  const [caption, setCaption] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [coverStyle, setCoverStyle] = useState("클래식");
  const [coverTitle, setCoverTitle] = useState("봄제주, 둘이서");
  const [publishing, setPublishing] = useState(false);

  const selectedCount = memories.filter((m) => m.checked).length;

  const toggleMemory = (id: string) => {
    setMemories((prev) => prev.map((m) => m.id === id ? { ...m, checked: !m.checked } : m));
  };

  const selectedMemories = memories.filter((m) => m.checked);

  // 선택된 추억의 순서를 위/아래로 이동 (원본 memories 배열에서 위치 교환)
  const moveSelected = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= selectedMemories.length) return;
    setMemories((prev) => {
      const ai = prev.indexOf(selectedMemories[idx]);
      const bi = prev.indexOf(selectedMemories[target]);
      if (ai < 0 || bi < 0) return prev;
      const next = [...prev];
      [next[ai], next[bi]] = [next[bi], next[ai]];
      return next;
    });
  };

  const handlePublish = async () => {
    if (coupleId) {
      setPublishing(true);
      try {
        await publishTravelogue({
          coupleId,
          title: coverTitle,
          coverStyle,
          pages: selectedMemories.map((m) => ({ title: m.title, date: m.date })),
        });
      } catch {
        toast.error({ message: "발행에 실패했어요" });
        setPublishing(false);
        return;
      }
      setPublishing(false);
    }
    toast.success({ message: "여행기가 완성됐어요! 📖" });
    setView("published");
  };

  const titleFor = (v: SubView) =>
    v === "entry" ? "여행기"
      : v === "pick-pins" ? "추억 선택"
      : v === "order" ? "순서 정하기"
      : v === "caption" ? `페이지 ${currentPage + 1}/${selectedCount}`
      : v === "cover" ? "표지 디자인"
      : "여행기 완성";

  const handleBack = () => {
    if (view === "entry") navigate(-1);
    else if (view === "pick-pins") setView("entry");
    else if (view === "order") setView("pick-pins");
    else if (view === "caption") setView("order");
    else if (view === "cover") setView("caption");
    else if (view === "published") setView("entry");
  };

  const accentBtn = { background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)" } as React.CSSProperties;
  const cardSurface = { background: "var(--app-card)", border: "1.5px solid var(--app-line)" } as React.CSSProperties;
  const inputSurface = { background: "var(--app-card)", border: "1.5px solid var(--app-line)", color: "var(--app-ink)" } as React.CSSProperties;

  return (
    <PageContainer withBottomNav>
      <PageHeader
        title={titleFor(view)}
        onBack={handleBack}
        right={
          view === "published" ? (
            <button aria-label="공유" className="p-1"><Share2 className="w-5 h-5" style={{ color: "var(--app-ink-2)" }} /></button>
          ) : undefined
        }
      />

      <AnimatePresence mode="wait">
        {/* ── Entry ── */}
        {view === "entry" && (
          <motion.div key="entry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pt-3">
            <div className="p-4 rounded-2xl" style={cardSurface}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "rgb(var(--accent-010))", border: "1.5px solid var(--app-line)" }}>🏝️</div>
                <div>
                  <H3>제주</H3>
                  <Tiny>추억 12개 · 사진 47장</Tiny>
                </div>
              </div>
            </div>

            <button
              onClick={() => setView("pick-pins")}
              className="w-full mt-4 p-4 rounded-2xl text-left"
              style={{ background: "rgb(var(--accent-010))", border: "1.6px solid rgb(var(--accent-070))", boxShadow: "var(--app-shadow)" }}
            >
              <H3>여행기를 만들어보세요</H3>
              <Meta className="mt-1 block">추억을 모아 하나의 이야기로</Meta>
            </button>

            {PAST_JOURNALS.length > 0 && (
              <div className="mt-5">
                <Tiny className="mb-2 block">이전 여행기</Tiny>
                <div className="flex flex-col gap-2">
                  {PAST_JOURNALS.map((j, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={cardSurface}>
                      <div className="w-10 h-14 rounded-lg flex items-center justify-center" style={{ background: "var(--app-line-soft)" }}>
                        <Tiny>📖</Tiny>
                      </div>
                      <div className="flex-1">
                        <Body className="font-bold">{j.title}</Body>
                        <Tiny className="block mt-0.5">{j.dates} · {j.pages}p</Tiny>
                      </div>
                      <ChevronRight className="w-4 h-4" style={{ color: "var(--app-ink-3)" }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Pick Pins ── */}
        {view === "pick-pins" && (
          <motion.div key="pick-pins" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pt-3">
            <Meta className="mb-1 block">2024.03.14 - 03.17</Meta>
            <Tiny className="mb-4 block">{selectedCount}개 선택됨</Tiny>

            <div className="flex flex-col gap-2">
              {memories.map((m) => (
                <button
                  key={m.id}
                  onClick={() => toggleMemory(m.id)}
                  className="flex items-center gap-3 p-3 rounded-xl text-left"
                  style={{
                    background: m.checked ? "rgb(var(--accent-010))" : "var(--app-card)",
                    border: `1.6px solid ${m.checked ? "rgb(var(--accent-070))" : "var(--app-line-soft)"}`,
                  }}
                >
                  <div
                    className="w-5 h-5 rounded border-2 flex items-center justify-center"
                    style={{ borderColor: m.checked ? "rgb(var(--accent-070))" : "var(--app-line)", background: m.checked ? "rgb(var(--accent-070))" : "transparent" }}
                  >
                    {m.checked && <span className="text-[10px]" style={{ color: "var(--app-ink-on-accent)" }}>✓</span>}
                  </div>
                  <div className="flex-1">
                    <Body className="font-bold">{m.title}</Body>
                    <Tiny className="block mt-0.5">{m.date}</Tiny>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setView("order")}
              disabled={selectedCount === 0}
              className="w-full mt-5 py-3.5 rounded-full text-[16px] font-bold disabled:opacity-40"
              style={accentBtn}
            >
              {selectedCount}개 선택 완료
            </button>
          </motion.div>
        )}

        {/* ── Order Pages ── */}
        {view === "order" && (
          <motion.div key="order" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pt-3">
            <Meta className="mb-4 block">화살표로 순서를 바꿀 수 있어요</Meta>
            <div className="flex flex-col gap-2">
              {selectedMemories.map((m, i) => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl" style={cardSurface}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold" style={accentBtn}>{i + 1}</div>
                  <div className="flex-1">
                    <Body className="font-bold">{m.title}</Body>
                    <Tiny className="block mt-0.5">{m.date}</Tiny>
                  </div>
                  <div className="flex flex-col">
                    <button
                      onClick={() => moveSelected(i, -1)}
                      disabled={i === 0}
                      aria-label="위로"
                      className="p-0.5 disabled:opacity-25"
                    >
                      <ChevronUp className="w-4 h-4" style={{ color: "var(--app-ink-2)" }} />
                    </button>
                    <button
                      onClick={() => moveSelected(i, 1)}
                      disabled={i === selectedMemories.length - 1}
                      aria-label="아래로"
                      className="p-0.5 disabled:opacity-25"
                    >
                      <ChevronDown className="w-4 h-4" style={{ color: "var(--app-ink-2)" }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setCurrentPage(0); setView("caption"); }}
              className="w-full mt-5 py-3.5 rounded-full text-[16px] font-bold"
              style={accentBtn}
            >
              다음
            </button>
          </motion.div>
        )}

        {/* ── Caption ── */}
        {view === "caption" && (
          <motion.div key="caption" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pt-3">
            <div className="h-[180px] rounded-xl mb-4 flex items-center justify-center" style={{ background: "var(--app-line-soft)" }}>
              <span className="text-4xl opacity-20">📸</span>
            </div>
            <div>
              <Tiny className="mb-1.5 block">한 줄 요약</Tiny>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={selectedMemories[currentPage]?.title}
                className="w-full h-11 px-3.5 rounded-xl text-[15px] outline-none"
                style={inputSurface}
              />
            </div>
            <div className="mt-3">
              <Tiny className="mb-1.5 block">본문</Tiny>
              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder="이 순간의 이야기를 적어보세요..."
                className="w-full min-h-[100px] px-3.5 py-3 rounded-xl text-[15px] outline-none resize-none leading-[1.7]"
                style={inputSurface}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { if (currentPage > 0) setCurrentPage(currentPage - 1); }}
                disabled={currentPage === 0}
                className="flex-1 py-3 rounded-full glass-pill text-[14px] font-bold disabled:opacity-30"
                style={{ color: "var(--app-ink-2)" }}
              >
                ← 이전
              </button>
              <button
                onClick={() => {
                  if (currentPage < selectedCount - 1) setCurrentPage(currentPage + 1);
                  else setView("cover");
                }}
                className="flex-1 py-3 rounded-full text-[14px] font-bold"
                style={accentBtn}
              >
                {currentPage < selectedCount - 1 ? "다음 →" : "표지 만들기"}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Cover Design ── */}
        {view === "cover" && (
          <motion.div key="cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pt-4">
            <div className="flex justify-center my-4">
              <div
                className="w-[220px] h-[290px] rounded-lg flex flex-col items-center justify-center p-5"
                style={{ background: "rgb(var(--accent-010))", border: "2px solid var(--app-line)", boxShadow: "var(--app-shadow)" }}
              >
                <Tiny style={{ color: "rgb(var(--accent-070))" }}>VOL.03</Tiny>
                <div className="w-12 h-0.5 mt-2 mb-3" style={{ background: "rgb(var(--accent-070))" }} />
                <input
                  type="text"
                  value={coverTitle}
                  onChange={(e) => setCoverTitle(e.target.value)}
                  className="text-[20px] font-bold text-center bg-transparent outline-none w-full"
                  style={{ color: "var(--app-ink)" }}
                />
                <Tiny className="mt-2">2024.03.14 - 03.17</Tiny>
                <div className="w-full h-[80px] rounded-lg mt-4 flex items-center justify-center" style={{ background: "var(--app-line-soft)" }}>
                  <span className="text-2xl opacity-20">📸</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Tiny className="mb-2 block">스타일</Tiny>
              <div className="flex gap-2">
                {COVER_STYLES.map((style) => {
                  const isActive = coverStyle === style;
                  return (
                    <button
                      key={style}
                      onClick={() => setCoverStyle(style)}
                      className="flex-1 py-2 rounded-xl text-[13px] font-bold"
                      style={{
                        background: isActive ? "rgb(var(--accent-010))" : "var(--app-card)",
                        border: `${isActive ? "2px" : "1.5px"} solid ${isActive ? "rgb(var(--accent-070))" : "var(--app-line-soft)"}`,
                      }}
                    >
                      {style}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handlePublish}
              disabled={publishing}
              className="w-full mt-5 py-3.5 rounded-full text-[16px] font-bold disabled:opacity-50"
              style={accentBtn}
            >
              {publishing ? "발행 중..." : "여행기 발행"}
            </button>
          </motion.div>
        )}

        {/* ── Published ── */}
        {view === "published" && (
          <motion.div
            key="published"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center px-5 pt-10"
            style={{ background: "#1a1612", minHeight: "calc(100vh - 56px)" }}
          >
            <div
              className="w-[240px] h-[320px] rounded-lg shadow-2xl flex flex-col items-center justify-center p-6"
              style={{ background: "rgb(var(--accent-010))", border: "2px solid var(--app-line)" }}
            >
              <Tiny style={{ color: "rgb(var(--accent-070))" }}>VOL.03</Tiny>
              <H2 className="text-center mt-2">{coverTitle}</H2>
              <Meta className="mt-1">2024.03.14 - 03.17</Meta>
              <div className="w-full h-[100px] rounded-lg mt-4" style={{ background: "var(--app-line-soft)" }} />
            </div>

            <div className="flex gap-1.5 mt-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? "bg-white" : "bg-white/30"}`} />
              ))}
            </div>

            <div className="flex gap-2 mt-8 w-full">
              <button
                onClick={() => setView("entry")}
                className="flex-1 py-3 rounded-full text-[14px] font-bold"
                style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(255,255,255,0.2)" }}
              >
                수정
              </button>
              <button
                onClick={() => navigate("/print")}
                className="flex-1 py-3 rounded-full text-[14px] font-bold"
                style={accentBtn}
              >
                인쇄 주문
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default Travelogue;
