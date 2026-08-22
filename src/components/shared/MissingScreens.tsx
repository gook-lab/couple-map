import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { H3, Meta, Tiny } from "@/components/ui/typography";

export const PhotoReplySheet: React.FC<{ memoryTitle?: string; onClose: () => void; onSend?: () => void }> = ({ memoryTitle = "해운대에서 파도", onClose, onSend }) => {
  const [caption, setCaption] = useState("");
  return (
    <div className="min-h-screen bg-couple-gray-005 pb-20">
      <header className="sticky top-0 z-10 glass-bar px-4 pt-3 pb-3 flex items-center gap-3">
        <button onClick={onClose} aria-label="뒤로 가기" className="p-1 -ml-1">
          <ChevronLeft className="w-6 h-6 text-couple-gray-090" />
        </button>
        <H3>사진으로 답장</H3>
      </header>
      <div className="px-5 pt-3">
        <Meta>"{memoryTitle}"에 답장</Meta>
        <div className="mt-3 h-[200px] rounded-xl bg-couple-gray-010 flex items-center justify-center">
          <span className="text-4xl opacity-20">📸</span>
        </div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="한마디 남기기..."
          className="w-full mt-3 min-h-[70px] px-3.5 py-3 rounded-xl border text-[14px] outline-none resize-none leading-relaxed"
        />
        <div className="flex gap-1.5 mt-2">
          <span className="px-2.5 py-1 rounded-full text-[12px] border" style={{ background: "rgb(var(--accent-010))" }}>📍 위치 첨부</span>
          <span className="px-2.5 py-1 rounded-full text-[12px] border">🎵 음악</span>
        </div>
        <button onClick={onSend || onClose} className="w-full mt-5 py-3.5 rounded-full text-[16px] font-semibold text-white" style={{ background: "rgb(var(--accent-070))" }}>
          답장 보내기
        </button>
      </div>
    </div>
  );
};

export const YearReviewScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const slides = [
    { date: "2023년 10월 — 첫 만남", title: "365일 전,\n우리가 만났어요", emoji: "🌱" },
    { date: "2023년 12월 — 첫 여행", title: "함께 떠난\n첫 번째 여행", emoji: "✈️" },
    { date: "2024년 3월 — 제주도", title: "바다가 좋았던\n봄제주", emoji: "🌊" },
  ];
  const slide = slides[slideIndex];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#1a1612", color: "#f4ecd9" }}>
      <header className="px-4 pt-3 pb-3 flex items-center justify-between">
        <button onClick={onClose} className="text-[13px]" style={{ color: "#f4ecd9" }}>닫기</button>
        <span className="text-[13px]" style={{ color: "rgba(244,236,217,0.6)" }}>{slideIndex + 1} / {slides.length}</span>
        <button className="text-[13px]" style={{ color: "#f4ecd9" }}>공유</button>
      </header>

      <div className="flex gap-1 px-4 mb-4">
        {slides.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full" style={{ background: i <= slideIndex ? "#fff" : "rgba(255,255,255,0.3)" }} />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <Tiny style={{ color: "rgba(244,236,217,0.6)" }}>{slide.date}</Tiny>
        <h2 className="text-[32px] font-bold text-center mt-2 leading-tight whitespace-pre-line" style={{ color: "#f4ecd9" }}>{slide.title}</h2>
        <span className="text-[64px] mt-4">{slide.emoji}</span>
      </div>

      <div className="px-4 pb-6">
        <div className="rounded-xl p-3 flex items-center gap-2.5" style={{ background: "rgba(255,255,255,0.1)" }}>
          <span className="text-[22px]">🎵</span>
          <div>
            <span className="text-[13px] font-semibold block" style={{ color: "#f4ecd9" }}>우리의 첫 노래</span>
            <span className="text-[11px]" style={{ color: "rgba(244,236,217,0.7)" }}>♪ 자동 재생 중</span>
          </div>
          <span className="ml-auto text-[14px]">⏸</span>
        </div>
      </div>

      <div className="flex justify-center gap-2 pb-6">
        {slideIndex > 0 && (
          <button onClick={() => setSlideIndex(slideIndex - 1)} className="px-4 py-2 rounded-full text-[13px]" style={{ background: "rgba(255,255,255,0.1)", color: "#f4ecd9" }}>← 이전</button>
        )}
        {slideIndex < slides.length - 1 && (
          <button onClick={() => setSlideIndex(slideIndex + 1)} className="px-4 py-2 rounded-full text-[13px] font-semibold text-white" style={{ background: "rgb(var(--accent-070))" }}>다음 →</button>
        )}
        {slideIndex === slides.length - 1 && (
          <button onClick={onClose} className="px-4 py-2 rounded-full text-[13px] font-semibold text-white" style={{ background: "rgb(var(--accent-070))" }}>완료</button>
        )}
      </div>
    </div>
  );
};

export const PartnerPushCard: React.FC<{ authorName?: string; previewText?: string }> = ({ authorName = "파트너", previewText = "오랜만의 바다. 파도 소리가 정말 좋았다..." }) => (
  <div className="rounded-2xl border p-3.5 shadow-sm" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)" }}>
    <div className="flex items-center gap-2 mb-2">
      <div className="w-[18px] h-[18px] rounded flex items-center justify-center" style={{ background: "rgb(var(--accent-070))" }}>
        <span className="text-[10px] text-white">♥</span>
      </div>
      <span className="text-[12px] font-semibold text-couple-gray-090">둘 사이</span>
      <Tiny className="ml-auto">지금</Tiny>
    </div>
    <span className="text-[14px] font-semibold text-couple-gray-090 block">
      {authorName}가 추억을 추가했어요 💕
    </span>
    <Meta className="mt-1 block line-clamp-2">{previewText}</Meta>
  </div>
);
