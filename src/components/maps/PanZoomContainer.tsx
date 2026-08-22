import React, { useState, useRef, useEffect } from "react";
import { Plus, Minus, LocateFixed } from "lucide-react";

interface PanZoomContainerProps {
  children: React.ReactNode;
  height: number;
  minScale?: number;
  maxScale?: number;
}

const PanZoomContainer: React.FC<PanZoomContainerProps> = ({
  children, height, minScale = 0.8, maxScale = 5,
}) => {
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ down: false, startX: 0, startY: 0, lastTx: 0, lastTy: 0, moved: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).tagName === "BUTTON") return;
      state.current = { down: true, startX: e.clientX, startY: e.clientY, lastTx: tx, lastTy: ty, moved: false };
    };

    const onMove = (e: PointerEvent) => {
      if (!state.current.down) return;
      const dx = e.clientX - state.current.startX;
      const dy = e.clientY - state.current.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        state.current.moved = true;
        setTx(state.current.lastTx + dx);
        setTy(state.current.lastTy + dy);
      }
    };

    const onUp = () => {
      state.current.down = false;
    };

    const onClick = (e: MouseEvent) => {
      if (state.current.moved) {
        e.stopPropagation();
        e.preventDefault();
        state.current.moved = false;
      }
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, [tx, ty]);

  const zoomIn = () => setScale((s) => Math.min(s * 1.4, maxScale));
  const zoomOut = () => setScale((s) => Math.max(s / 1.4, minScale));
  const reset = () => { setScale(1); setTx(0); setTy(0); };

  return (
    <div ref={ref} className="relative w-full overflow-hidden"
      style={{ height, cursor: "grab", touchAction: "none", userSelect: "none" }}>

      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        <button onClick={zoomIn} aria-label="확대" className="w-8 h-8 rounded-lg border flex items-center justify-center shadow-sm" style={{ background: "var(--app-card)" }}>
          <Plus className="w-4 h-4 " style={{ color: "var(--app-ink-2)" }} />
        </button>
        <button onClick={zoomOut} aria-label="축소" className="w-8 h-8 rounded-lg border flex items-center justify-center shadow-sm" style={{ background: "var(--app-card)" }}>
          <Minus className="w-4 h-4 " style={{ color: "var(--app-ink-2)" }} />
        </button>
        <button onClick={reset} aria-label="초기화" className="w-8 h-8 rounded-lg border flex items-center justify-center shadow-sm mt-1" style={{ background: "var(--app-card)" }}>
          <LocateFixed className="w-4 h-4 " style={{ color: "var(--app-ink-2)" }} />
        </button>
      </div>

      <div style={{
        transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
        transformOrigin: "center center",
        width: "100%", height: "100%",
      }}>
        {children}
      </div>
    </div>
  );
};

export { PanZoomContainer };
