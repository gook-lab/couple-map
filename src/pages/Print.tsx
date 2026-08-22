import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { H2, Body, Meta, Tiny } from "@/components/ui/typography";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import toast from "@/lib/toast";

type SubView = "shop" | "map-options" | "preview" | "address" | "pay" | "done" | "track";

const PRODUCTS = [
  { emoji: "🗺️", title: "지역 지도 포스터", price: "15,000원~", desc: "우리가 색칠한 지도를 포스터로" },
  { emoji: "📖", title: "여행기 포토북", price: "24,000원~", desc: "추억을 한 권의 책으로" },
  { emoji: "🏷️", title: "스티커 세트", price: "8,000원~", desc: "수집한 스티커를 실물로" },
  { emoji: "📷", title: "미니 폴라로이드", price: "6,000원~", desc: "추억 사진을 폴라로이드로" },
];

const SIZES = ["A3", "A2", "A1"];
const FINISHES = ["매트지", "광택지", "캔버스"];

const TRACK_STEPS = [
  { label: "주문 접수", time: "5/6 08:42", done: true },
  { label: "제작 중", time: "5/6 14:00", done: false, current: true },
  { label: "발송", time: "", done: false },
  { label: "배송 중", time: "", done: false },
  { label: "도착", time: "", done: false },
];

const VIEW_TITLE: Record<SubView, string> = {
  shop: "굿즈 샵",
  "map-options": "지도 포스터",
  preview: "미리보기",
  address: "배송지",
  pay: "결제",
  done: "주문 완료",
  track: "배송 추적",
};

const Print: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<SubView>("shop");
  const [selectedSize, setSelectedSize] = useState("A3");
  const [selectedFinish, setSelectedFinish] = useState("매트지");

  const accentBg = { background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)" } as React.CSSProperties;
  const placeholderTile = { background: "var(--app-line-soft)" } as React.CSSProperties;
  const cardSurface = { background: "var(--app-card)", border: "1px solid var(--app-line-soft)" } as React.CSSProperties;
  const inputSurface = { background: "var(--app-card)", border: "1px solid var(--app-line)", color: "var(--app-ink)" } as React.CSSProperties;

  const handleBack = () => {
    if (view === "shop") navigate(-1);
    else setView("shop");
  };

  return (
    <PageContainer withBottomNav>
      <PageHeader title={VIEW_TITLE[view]} onBack={handleBack} />

      <AnimatePresence mode="wait">
        {/* ── Shop ── */}
        {view === "shop" && (
          <motion.div key="shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pt-3">
            {/* Promo banner */}
            <div className="p-4 rounded-2xl mb-4 text-center" style={{ background: "rgb(var(--accent-010))", border: "1.6px solid rgb(var(--accent-030))" }}>
              <Tiny style={{ color: "rgb(var(--accent-070))" }}>🎉 1주년 기념 20% 할인</Tiny>
            </div>

            <div className="flex flex-col gap-3">
              {PRODUCTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setView("map-options")}
                  className="flex items-center gap-3.5 p-4 rounded-2xl text-left"
                  style={cardSurface}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={placeholderTile}>{p.emoji}</div>
                  <div className="flex-1">
                    <Body className="font-semibold">{p.title}</Body>
                    <Meta className="block mt-0.5">{p.desc}</Meta>
                    <span className="text-[13px] font-bold mt-1 block" style={{ color: "rgb(var(--accent-070))" }}>{p.price}</span>
                  </div>
                  <ChevronRight className="w-4 h-4" style={{ color: "var(--app-ink-3)" }} />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Map Options ── */}
        {view === "map-options" && (
          <motion.div key="map-options" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pt-4">
            <div className="h-[200px] rounded-2xl mb-4 flex items-center justify-center" style={placeholderTile}>
              <span className="text-5xl opacity-20">🗺️</span>
            </div>

            <div className="mb-4">
              <Tiny className="mb-2 block">사이즈</Tiny>
              <div className="flex gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className="flex-1 py-2.5 rounded-xl text-[14px] font-medium"
                    style={
                      selectedSize === s
                        ? { background: "rgb(var(--accent-010))", border: "2px solid rgb(var(--accent-070))" }
                        : { border: "1px solid var(--app-line-soft)" }
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <Tiny className="mb-2 block">용지</Tiny>
              <div className="flex gap-2">
                {FINISHES.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFinish(f)}
                    className="flex-1 py-2.5 rounded-xl text-[14px] font-medium"
                    style={
                      selectedFinish === f
                        ? { background: "rgb(var(--accent-010))", border: "2px solid rgb(var(--accent-070))" }
                        : { border: "1px solid var(--app-line-soft)" }
                    }
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <Tiny className="mb-2 block">각인</Tiny>
              <input
                type="text"
                defaultValue="민지 & 준호 · D+428"
                className="w-full h-11 px-3.5 rounded-xl text-[15px] outline-none"
                style={inputSurface}
              />
            </div>

            <button
              onClick={() => setView("preview")}
              className="w-full py-3.5 rounded-full text-[16px] font-semibold"
              style={accentBg}
            >
              미리보기
            </button>
          </motion.div>
        )}

        {/* ── Preview ── */}
        {view === "preview" && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-5 py-10"
            style={{ background: "#1a1612", minHeight: "calc(100vh - 56px)" }}
          >
            <div className="w-[280px] h-[380px] rounded-lg shadow-2xl bg-white flex items-center justify-center">
              <span className="text-6xl opacity-20">🗺️</span>
            </div>
            <Meta className="mt-4" style={{ color: "rgba(255,255,255,0.6)" }}>{selectedSize} · {selectedFinish}</Meta>
            <button
              onClick={() => setView("address")}
              className="w-full mt-6 py-3.5 rounded-full text-[16px] font-semibold"
              style={accentBg}
            >
              주문하기
            </button>
          </motion.div>
        )}

        {/* ── Address ── */}
        {view === "address" && (
          <motion.div key="address" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pt-4">
            <div className="p-4 rounded-2xl mb-3" style={{ background: "var(--app-card)", border: "2px solid rgb(var(--accent-070))" }}>
              <div className="flex items-center justify-between">
                <Body className="font-semibold">기본 배송지</Body>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgb(var(--accent-010))", color: "rgb(var(--accent-070))" }}>기본</span>
              </div>
              <Meta className="mt-1 block">김민지 · 서울 강남구 테헤란로 123</Meta>
              <Meta>010-1234-5678</Meta>
            </div>

            <div className="mt-3">
              <Tiny className="mb-1.5 block">배송 메모</Tiny>
              <textarea
                placeholder="문 앞에 놓아주세요"
                className="w-full min-h-[60px] px-3.5 py-3 rounded-xl text-[15px] outline-none resize-none"
                style={inputSurface}
              />
            </div>

            <button
              onClick={() => setView("pay")}
              className="w-full mt-5 py-3.5 rounded-full text-[16px] font-semibold"
              style={accentBg}
            >
              결제하기
            </button>
          </motion.div>
        )}

        {/* ── Pay ── */}
        {view === "pay" && (
          <motion.div key="pay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pt-4">
            <div className="p-4 rounded-2xl mb-4" style={cardSurface}>
              <div className="flex justify-between py-1"><Meta>지도 포스터 ({selectedSize})</Meta><Body>22,000원</Body></div>
              <div className="flex justify-between py-1"><Meta>배송비</Meta><Body>3,000원</Body></div>
              <div className="flex justify-between py-1"><Meta style={{ color: "rgb(var(--accent-070))" }}>1주년 할인</Meta><span className="text-[14px]" style={{ color: "rgb(var(--accent-070))" }}>-5,000원</span></div>
              <div className="h-px my-2" style={{ background: "var(--app-line-soft)" }} />
              <div className="flex justify-between"><span className="text-[16px] font-bold" style={{ color: "var(--app-ink)" }}>총 결제금액</span><span className="text-[18px] font-bold" style={{ color: "rgb(var(--accent-070))" }}>20,000원</span></div>
            </div>

            <div className="flex flex-col gap-2 mb-5">
              {["카카오페이", "카드 결제", "계좌이체"].map((method, i) => (
                <button
                  key={method}
                  className="w-full p-3.5 rounded-xl text-left text-[15px] font-medium"
                  style={i === 0 ? { background: "#fee500", color: "#1c1917" } : { border: "1px solid var(--app-line-soft)", color: "var(--app-ink)" }}
                >
                  {method}
                </button>
              ))}
            </div>

            <button
              onClick={() => { toast.success({ message: "주문이 완료됐어요!" }); setView("done"); }}
              className="w-full py-3.5 rounded-full text-[16px] font-semibold"
              style={accentBg}
            >
              20,000원 결제하기
            </button>
          </motion.div>
        )}

        {/* ── Done ── */}
        {view === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center px-5 pt-16"
          >
            <div className="w-[90px] h-[90px] rounded-full flex items-center justify-center" style={{ background: "rgb(var(--accent-070))" }}>
              <Check className="w-10 h-10" style={{ color: "var(--app-ink-on-accent)" }} />
            </div>
            <H2 className="mt-4">주문 완료!</H2>
            <Meta className="mt-2 text-center">OD-20260506-0042</Meta>
            <Tiny className="mt-1 text-center">예상 도착: 5월 11-13일</Tiny>

            <div className="w-full mt-6 flex items-center justify-between px-2">
              {["주문", "제작", "발송", "도착"].map((stepLabel, i) => (
                <React.Fragment key={stepLabel}>
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
                      style={
                        i === 0
                          ? { background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)" }
                          : { border: "1px solid var(--app-line)", color: "var(--app-ink-3)" }
                      }
                    >
                      {i === 0 ? "✓" : i + 1}
                    </div>
                    <Tiny>{stepLabel}</Tiny>
                  </div>
                  {i < 3 && <div className="flex-1 h-px mx-1" style={{ background: "var(--app-line-soft)" }} />}
                </React.Fragment>
              ))}
            </div>

            <button
              onClick={() => setView("track")}
              className="w-full mt-8 py-3 rounded-full glass-pill text-[15px] font-medium"
              style={{ color: "var(--app-ink-2)" }}
            >
              배송 추적
            </button>
          </motion.div>
        )}

        {/* ── Track ── */}
        {view === "track" && (
          <motion.div key="track" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pt-4">
            <div className="p-4 rounded-2xl mb-4" style={cardSurface}>
              <Meta>주문번호</Meta>
              <Body className="font-semibold block">OD-20260506-0042</Body>
              <Tiny className="mt-1 block">지도 포스터 {selectedSize} · {selectedFinish}</Tiny>
            </div>

            <div className="relative pl-8">
              <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: "var(--app-line-soft)" }} />
              {TRACK_STEPS.map((step, i) => (
                <div key={i} className="relative pb-5">
                  <div
                    className={`absolute left-[-22px] top-1 w-3 h-3 rounded-full border-2 ${step.current ? "animate-pulse" : ""}`}
                    style={{
                      borderColor: "var(--app-card)",
                      background: step.done || step.current ? "rgb(var(--accent-070))" : "var(--app-line-soft)",
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[14px] ${step.done || step.current ? "font-semibold" : ""}`}
                      style={{ color: step.done || step.current ? "var(--app-ink)" : "var(--app-ink-3)" }}
                    >
                      {step.label} {step.done && "✓"}
                    </span>
                    {step.time && <Tiny>{step.time}</Tiny>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default Print;
