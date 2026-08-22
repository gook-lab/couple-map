import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Download, Share2 } from "lucide-react";
import { toPng } from "html-to-image";
import AppButton from "@/components/ui/app-button";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import toast from "@/lib/toast";

const TEMPLATES = [
  { id: "simple", label: "심플", bg: "#fde6e0" },
  { id: "dark", label: "다크", bg: "#1a1612" },
  { id: "polaroid", label: "폴라로이드", bg: "#fff" },
  { id: "gradient", label: "그라데이션", bg: "linear-gradient(135deg, #fdc3ba, #f97863)" },
];

const ShareCard: React.FC = () => {
  const location = useLocation();
  const { placeName, date, memo, region } = (location.state || {}) as { placeName?: string; date?: string; memo?: string; region?: string };
  const [template, setTemplate] = useState("simple");
  const cardRef = useRef<HTMLDivElement>(null);

  const currentTpl = TEMPLATES.find((t) => t.id === template)!;
  const isDark = template === "dark" || template === "gradient";

  const [busy, setBusy] = useState(false);

  const renderCard = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    return toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
  };

  const handleDownload = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const dataUrl = await renderCard();
      if (!dataUrl) throw new Error("no card");
      const link = document.createElement("a");
      link.download = `couple-${placeName || "memory"}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success({ message: "이미지가 저장됐어요! 📸" });
    } catch {
      toast.error({ message: "이미지 저장에 실패했어요" });
    }
    setBusy(false);
  };

  const handleShare = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const dataUrl = await renderCard();
      if (!dataUrl) throw new Error("no card");
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "couple-card.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "둘 사이" });
      } else {
        const link = document.createElement("a");
        link.download = file.name;
        link.href = dataUrl;
        link.click();
        toast.success({ message: "이미지를 저장했어요 (공유 미지원 기기)" });
      }
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        toast.error({ message: "공유에 실패했어요" });
      }
    }
    setBusy(false);
  };

  return (
    <PageContainer withBottomNav>
      <PageHeader title="공유 카드 만들기" />

      <div className="px-5 pt-4">
        {/* Preview — 내보내기용 카드, 앱 테마와 무관한 고정 색 */}
        <div className="flex justify-center mb-5">
          <div
            ref={cardRef}
            className="w-[280px] rounded-2xl overflow-hidden"
            style={{ background: currentTpl.bg, border: "1.5px solid var(--app-line)", boxShadow: "var(--app-shadow)" }}
          >
            <div className="aspect-square flex items-center justify-center" style={{ background: "#ebebe9" }}>
              <span className="text-5xl opacity-20">📸</span>
            </div>
            <div className="p-5">
              <h3 className="text-[18px] font-bold" style={{ color: isDark ? "#ffffff" : "#1c1917" }}>
                {placeName || "우리의 추억"}
              </h3>
              {memo && (
                <p className="text-[13px] mt-2 leading-relaxed" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#78716c" }}>
                  {memo.slice(0, 60)}
                </p>
              )}
              <div className="flex items-center justify-between mt-4">
                <span className="text-[11px]" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "#a8a29e" }}>
                  {date || "2026"} · {region || "어딘가"}
                </span>
                <span className="text-[11px] font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.6)" : "#f97863" }}>
                  둘 사이 ♥
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Templates */}
        <div className="flex gap-3 justify-center mb-5">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              aria-label={t.label}
              className={`w-12 h-12 rounded-xl border-2 overflow-hidden ${template === t.id ? "" : "opacity-50"}`}
              style={{ borderColor: template === t.id ? "rgb(var(--accent-070))" : "var(--app-line-soft)", background: t.bg }}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <AppButton variant="secondary" onClick={handleDownload} loading={busy} icon={<Download className="w-4 h-4" />}>저장</AppButton>
          <AppButton onClick={handleShare} loading={busy} icon={<Share2 className="w-4 h-4" />}>공유</AppButton>
        </div>
      </div>
    </PageContainer>
  );
};

export default ShareCard;
