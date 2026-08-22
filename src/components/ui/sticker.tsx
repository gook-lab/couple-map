import React from "react";

// Memory Pocket 프리미티브 — 스티커 태그 + 라운드 뱃지.
// pocket 프리셋에서 ink 보더 + chunk shadow로 스티커 팝 느낌을 낸다.

export type CandyColor =
  | "peach"
  | "mint"
  | "sky"
  | "butter"
  | "lilac"
  | "pink"
  | "paper"
  | "accent"
  | "ink";

const CANDY_BG: Record<CandyColor, string> = {
  peach: "var(--c-peach)",
  mint: "var(--c-mint)",
  sky: "var(--c-sky)",
  butter: "var(--c-butter)",
  lilac: "var(--c-lilac)",
  pink: "var(--c-pink)",
  paper: "var(--app-card)",
  accent: "rgb(var(--accent-070))",
  ink: "var(--app-ink)",
};

function foreground(color: CandyColor): string {
  if (color === "accent" || color === "ink") return "var(--app-ink-on-accent)";
  return "var(--app-ink)";
}

interface StickerProps {
  children: React.ReactNode;
  color?: CandyColor;
  className?: string;
  style?: React.CSSProperties;
}

export const Sticker: React.FC<StickerProps> = ({ children, color = "butter", className = "", style }) => (
  <span
    className={`inline-flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold whitespace-nowrap ${className}`}
    style={{
      background: CANDY_BG[color],
      color: foreground(color),
      border: "1.5px solid var(--app-line)",
      boxShadow: "0 2px 0 rgba(0, 0, 0, 0.12)",
      ...style,
    }}
  >
    {children}
  </span>
);

interface CandyCardProps {
  children: React.ReactNode;
  color?: CandyColor;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  shadow?: boolean;
}

export const CandyCard: React.FC<CandyCardProps> = ({
  children,
  color = "paper",
  className = "",
  style,
  onClick,
  shadow = true,
}) => {
  const base: React.CSSProperties = {
    background: CANDY_BG[color],
    color: foreground(color),
    border: "1.5px solid var(--app-line)",
    borderRadius: "var(--app-radius)",
    boxShadow: shadow ? "var(--app-shadow)" : undefined,
    ...style,
  };
  if (onClick) {
    return (
      <button onClick={onClick} className={`text-left ${className}`} style={base}>
        {children}
      </button>
    );
  }
  return (
    <div className={className} style={base}>
      {children}
    </div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  color?: CandyColor;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({ children, color = "accent", className = "", style }) => (
  <span
    className={`inline-flex items-center justify-center rounded-full text-[12px] font-extrabold ${className}`}
    style={{
      minWidth: 24,
      height: 24,
      padding: "0 7px",
      background: CANDY_BG[color],
      color: foreground(color),
      border: "1.5px solid var(--app-line)",
      boxShadow: "0 2px 0 rgba(0, 0, 0, 0.15)",
      ...style,
    }}
  >
    {children}
  </span>
);
