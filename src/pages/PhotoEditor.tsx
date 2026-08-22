import React, { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Tiny } from "@/components/ui/typography";

interface PhotoEditorProps {
  photoUrl?: string;
  onApply: (editedDataUrl: string) => void;
  onClose: () => void;
}

const FILTERS = [
  { id: "none", label: "원본", css: "" },
  { id: "warm", label: "따뜻한", css: "sepia(0.3) saturate(1.4)" },
  { id: "cool", label: "시원한", css: "saturate(0.8) hue-rotate(20deg)" },
  { id: "bw", label: "흑백", css: "grayscale(1)" },
  { id: "vintage", label: "빈티지", css: "sepia(0.5) contrast(0.9) brightness(1.1)" },
  { id: "vivid", label: "선명한", css: "saturate(1.6) contrast(1.1)" },
];

const TOOLS = [
  { id: "crop", emoji: "✂", label: "자르기" },
  { id: "filter", emoji: "☀", label: "필터" },
  { id: "draw", emoji: "✏", label: "낙서" },
  { id: "text", emoji: "T", label: "텍스트" },
  { id: "sticker", emoji: "★", label: "스티커" },
];

const PEN_COLORS = ["#ffffff", "#1a1612", "#f97863", "#4A7DE0", "#fbbf24", "#8FD7B8"];
const STICKERS = ["❤️", "⭐", "🌸", "✨", "🎀", "🥰", "📸", "🌈", "🔥", "💯"];

interface Pt { x: number; y: number }
interface Stroke { points: Pt[]; color: string }
interface Overlay { id: string; kind: "text" | "sticker"; content: string; x: number; y: number; color: string }

const PhotoEditor: React.FC<PhotoEditorProps> = ({ photoUrl, onApply, onClose }) => {
  const [activeTool, setActiveTool] = useState("filter");
  const [activeFilter, setActiveFilter] = useState("none");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [penColor, setPenColor] = useState(PEN_COLORS[0]);
  const [textDraft, setTextDraft] = useState("");

  const imgRef = useRef<HTMLImageElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef<Pt[] | null>(null);
  const dragRef = useRef<string | null>(null);

  const currentFilter = FILTERS.find((f) => f.id === activeFilter)?.css || "";

  // ── 스트로크 캔버스 다시 그리기 ──
  const redrawStrokes = useCallback(() => {
    const canvas = canvasRef.current;
    const box = boxRef.current;
    if (!canvas || !box) return;
    const w = box.clientWidth;
    const h = box.clientHeight;
    if (w === 0 || h === 0) return;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(2, w * 0.012);
    const drawStroke = (s: Stroke) => {
      if (s.points.length < 1) return;
      ctx.strokeStyle = s.color;
      ctx.beginPath();
      ctx.moveTo(s.points[0].x * w, s.points[0].y * h);
      s.points.forEach((p) => ctx.lineTo(p.x * w, p.y * h));
      ctx.stroke();
    };
    strokes.forEach(drawStroke);
    if (drawingRef.current) drawStroke({ points: drawingRef.current, color: penColor });
  }, [strokes, penColor]);

  useEffect(() => {
    redrawStrokes();
    window.addEventListener("resize", redrawStrokes);
    return () => window.removeEventListener("resize", redrawStrokes);
  }, [redrawStrokes, activeTool]);

  // ── 포인터 좌표 → 0~1 정규화 ──
  const normalize = (e: React.PointerEvent): Pt => {
    const rect = boxRef.current!.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
    };
  };

  // ── 드로잉 ──
  const handleDrawDown = (e: React.PointerEvent) => {
    if (activeTool !== "draw") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = [normalize(e)];
    redrawStrokes();
  };
  const handleDrawMove = (e: React.PointerEvent) => {
    if (activeTool !== "draw" || !drawingRef.current) return;
    drawingRef.current.push(normalize(e));
    redrawStrokes();
  };
  const handleDrawUp = () => {
    if (!drawingRef.current) return;
    const points = drawingRef.current;
    drawingRef.current = null;
    if (points.length > 0) setStrokes((prev) => [...prev, { points, color: penColor }]);
  };

  // ── 오버레이 드래그 ──
  const handleOverlayMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const p = normalize(e);
    setOverlays((prev) => prev.map((o) => (o.id === dragRef.current ? { ...o, x: p.x, y: p.y } : o)));
  };

  const addText = () => {
    if (!textDraft.trim()) return;
    setOverlays((prev) => [...prev, { id: `t-${Date.now()}`, kind: "text", content: textDraft.trim(), x: 0.5, y: 0.5, color: penColor }]);
    setTextDraft("");
  };
  const addSticker = (emoji: string) => {
    setOverlays((prev) => [...prev, { id: `s-${Date.now()}`, kind: "sticker", content: emoji, x: 0.5, y: 0.45, color: "#fff" }]);
  };

  // ── 최종 합성 ──
  const renderEdited = (): string | null => {
    const img = imgRef.current;
    if (!img || !img.naturalWidth) return null;

    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    const hasCrop = !!(completedCrop && completedCrop.width > 0 && completedCrop.height > 0);

    const cropNatX = hasCrop ? completedCrop!.x * scaleX : 0;
    const cropNatY = hasCrop ? completedCrop!.y * scaleY : 0;
    const sw = hasCrop ? completedCrop!.width * scaleX : img.naturalWidth;
    const sh = hasCrop ? completedCrop!.height * scaleY : img.naturalHeight;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(sw);
    canvas.height = Math.round(sh);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    if (currentFilter) ctx.filter = currentFilter;
    ctx.drawImage(img, cropNatX, cropNatY, sw, sh, 0, 0, canvas.width, canvas.height);
    ctx.filter = "none";

    // 정규화 좌표(전체 이미지 기준) → 크롭 캔버스 좌표
    const toX = (nx: number) => nx * img.naturalWidth - cropNatX;
    const toY = (ny: number) => ny * img.naturalHeight - cropNatY;

    // 스트로크
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(2, img.naturalWidth * 0.012);
    strokes.forEach((s) => {
      if (s.points.length < 1) return;
      ctx.strokeStyle = s.color;
      ctx.beginPath();
      ctx.moveTo(toX(s.points[0].x), toY(s.points[0].y));
      s.points.forEach((p) => ctx.lineTo(toX(p.x), toY(p.y)));
      ctx.stroke();
    });

    // 텍스트/스티커
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    overlays.forEach((o) => {
      const size = o.kind === "sticker" ? img.naturalWidth * 0.14 : img.naturalWidth * 0.07;
      ctx.font = `bold ${size}px -apple-system, sans-serif`;
      if (o.kind === "text") {
        ctx.fillStyle = o.color;
        ctx.shadowColor = "rgba(0,0,0,0.35)";
        ctx.shadowBlur = size * 0.15;
      } else {
        ctx.fillStyle = "#000";
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      }
      ctx.fillText(o.content, toX(o.x), toY(o.y));
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    });

    try {
      return canvas.toDataURL("image/jpeg", 0.92);
    } catch {
      return null;
    }
  };

  const handleDone = useCallback(() => {
    const edited = renderEdited();
    onApply(edited || photoUrl || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onApply, photoUrl, completedCrop, currentFilter, strokes, overlays]);

  const previewUrl = photoUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e7e5e4' width='400' height='400'/%3E%3Ctext x='200' y='200' text-anchor='middle' fill='%2357534e' font-size='20'%3E사진 미리보기%3C/text%3E%3C/svg%3E";

  const drawActive = activeTool === "draw";
  const overlayActive = activeTool === "text" || activeTool === "sticker";

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#1a1612", color: "#fff" }}>
      {/* Header */}
      <header className="px-4 pt-3 pb-3 flex items-center justify-between">
        <button onClick={onClose} className="flex items-center gap-1 text-[14px]" style={{ color: "#f4ecd9" }}>
          <ChevronLeft className="w-5 h-5" /> 취소
        </button>
        <span className="text-[14px]" style={{ color: "#f4ecd9" }}>편집</span>
        <button onClick={handleDone} className="text-[14px] font-semibold" style={{ color: "rgb(var(--accent-070))" }}>
          완료
        </button>
      </header>

      {/* Preview */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[360px] rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          {activeTool === "crop" ? (
            <ReactCrop crop={crop} onChange={setCrop} onComplete={setCompletedCrop}>
              <img ref={imgRef} src={previewUrl} alt="편집" crossOrigin="anonymous" className="w-full block" style={{ filter: currentFilter }} />
            </ReactCrop>
          ) : (
            <div
              ref={boxRef}
              className="relative w-full"
              style={{ touchAction: drawActive ? "none" : "auto" }}
              onPointerMove={handleOverlayMove}
              onPointerUp={() => { dragRef.current = null; }}
            >
              <img ref={imgRef} src={previewUrl} alt="편집" crossOrigin="anonymous" onLoad={redrawStrokes} className="w-full block" style={{ filter: currentFilter, transition: "filter 0.3s" }} />
              {/* 스트로크 캔버스 */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ pointerEvents: drawActive ? "auto" : "none", touchAction: "none" }}
                onPointerDown={handleDrawDown}
                onPointerMove={handleDrawMove}
                onPointerUp={handleDrawUp}
              />
              {/* 텍스트/스티커 오버레이 */}
              {overlays.map((o) => (
                <div
                  key={o.id}
                  onPointerDown={(e) => {
                    if (!overlayActive) return;
                    dragRef.current = o.id;
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }}
                  className="absolute select-none"
                  style={{
                    left: `${o.x * 100}%`,
                    top: `${o.y * 100}%`,
                    transform: "translate(-50%, -50%)",
                    fontSize: o.kind === "sticker" ? 44 : 22,
                    fontWeight: 700,
                    color: o.kind === "text" ? o.color : undefined,
                    textShadow: o.kind === "text" ? "0 1px 4px rgba(0,0,0,0.4)" : undefined,
                    cursor: overlayActive ? "move" : "default",
                    pointerEvents: overlayActive ? "auto" : "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {o.content}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tool panels */}
      <div className="px-4 pt-4 pb-2 min-h-[92px]">
        {activeTool === "filter" && (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {FILTERS.map((f) => (
              <button key={f.id} onClick={() => setActiveFilter(f.id)}
                className={`flex-shrink-0 text-center ${activeFilter === f.id ? "opacity-100" : "opacity-60"}`}>
                <div className="w-[56px] h-[56px] rounded-lg overflow-hidden border mb-1"
                  style={{ borderColor: activeFilter === f.id ? "rgb(var(--accent-070))" : "transparent" }}>
                  <img src={previewUrl} alt={f.label} className="w-full h-full object-cover" style={{ filter: f.css }} />
                </div>
                <Tiny style={{ color: activeFilter === f.id ? "rgb(var(--accent-070))" : "#f4ecd9" }}>{f.label}</Tiny>
              </button>
            ))}
          </div>
        )}

        {activeTool === "crop" && (
          <div className="text-center py-3">
            <Tiny style={{ color: "#f4ecd9" }}>드래그하여 영역을 선택하세요</Tiny>
          </div>
        )}

        {activeTool === "draw" && (
          <div className="flex items-center justify-center gap-3">
            {PEN_COLORS.map((c) => (
              <button key={c} onClick={() => setPenColor(c)} aria-label="펜 색"
                className="w-8 h-8 rounded-full"
                style={{ background: c, border: penColor === c ? "3px solid rgb(var(--accent-070))" : "2px solid rgba(255,255,255,0.3)" }} />
            ))}
            {strokes.length > 0 && (
              <button onClick={() => setStrokes((p) => p.slice(0, -1))} className="text-[13px] ml-1" style={{ color: "#f4ecd9" }}>
                되돌리기
              </button>
            )}
          </div>
        )}

        {activeTool === "text" && (
          <div className="flex items-center gap-2">
            <input
              value={textDraft}
              onChange={(e) => setTextDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addText(); }}
              placeholder="텍스트 입력 후 추가"
              className="flex-1 h-10 px-3 rounded-lg text-[14px] outline-none"
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
            />
            <div className="flex gap-1.5">
              {PEN_COLORS.slice(0, 4).map((c) => (
                <button key={c} onClick={() => setPenColor(c)} aria-label="색"
                  className="w-7 h-7 rounded-full"
                  style={{ background: c, border: penColor === c ? "2.5px solid rgb(var(--accent-070))" : "2px solid rgba(255,255,255,0.3)" }} />
              ))}
            </div>
            <button onClick={addText} className="h-10 px-3 rounded-lg text-[13px] font-bold" style={{ background: "rgb(var(--accent-070))", color: "#fff" }}>
              추가
            </button>
          </div>
        )}

        {activeTool === "sticker" && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {STICKERS.map((s) => (
              <button key={s} onClick={() => addSticker(s)} className="flex-shrink-0 text-[28px] w-11 h-11 rounded-lg" style={{ background: "rgba(255,255,255,0.08)" }}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tool bar */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-5 gap-1.5">
          {TOOLS.map((tool) => (
            <button key={tool.id} onClick={() => setActiveTool(tool.id)}
              className={`py-2 rounded-lg text-center transition-all ${activeTool === tool.id ? "bg-white/10" : ""}`}>
              <span className="text-[16px] block">{tool.emoji}</span>
              <span className="text-[11px] block mt-0.5" style={{ color: activeTool === tool.id ? "#fff" : "rgba(255,255,255,0.5)" }}>
                {tool.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoEditor;
