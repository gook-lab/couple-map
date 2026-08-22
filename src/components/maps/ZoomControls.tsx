import React from "react";
import { Plus, Minus, LocateFixed } from "lucide-react";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset?: () => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut, onReset }) => (
  <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
    <button
      onClick={onZoomIn}
      aria-label="확대"
      className="w-8 h-8 rounded-lg/90 border flex items-center justify-center shadow-sm"
    >
      <Plus className="w-4 h-4 " style={{ color: "var(--app-ink-2)" }} />
    </button>
    <button
      onClick={onZoomOut}
      aria-label="축소"
      className="w-8 h-8 rounded-lg/90 border flex items-center justify-center shadow-sm"
    >
      <Minus className="w-4 h-4 " style={{ color: "var(--app-ink-2)" }} />
    </button>
    {onReset && (
      <button
        onClick={onReset}
        aria-label="초기화"
        className="w-8 h-8 rounded-lg/90 border flex items-center justify-center shadow-sm mt-1"
      >
        <LocateFixed className="w-4 h-4 " style={{ color: "var(--app-ink-2)" }} />
      </button>
    )}
  </div>
);

export default ZoomControls;
