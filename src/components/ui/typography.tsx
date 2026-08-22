import React, { type JSX } from "react";

interface TextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

const inkPrimary: React.CSSProperties = { color: "var(--app-ink)" };
const inkSecondary: React.CSSProperties = { color: "var(--app-ink-2)" };
const inkTertiary: React.CSSProperties = { color: "var(--app-ink-3)" };

export const H1: React.FC<TextProps> = ({ children, className = "", style, as: Tag = "h1" }) => (
  <Tag className={`text-[28px] font-bold leading-[1.15] tracking-[-0.6px] ${className}`} style={{ ...inkPrimary, ...style }}>{children}</Tag>
);

export const H2: React.FC<TextProps> = ({ children, className = "", style, as: Tag = "h2" }) => (
  <Tag className={`text-[21px] font-semibold leading-[1.2] tracking-[-0.4px] ${className}`} style={{ ...inkPrimary, ...style }}>{children}</Tag>
);

export const H3: React.FC<TextProps> = ({ children, className = "", style, as: Tag = "h3" }) => (
  <Tag className={`text-[17px] font-semibold ${className}`} style={{ ...inkPrimary, ...style }}>{children}</Tag>
);

export const Body: React.FC<TextProps> = ({ children, className = "", style, as: Tag = "p" }) => (
  <Tag className={`text-[15px] leading-[1.35] tracking-[-0.1px] ${className}`} style={{ ...inkPrimary, ...style }}>{children}</Tag>
);

export const Meta: React.FC<TextProps> = ({ children, className = "", style, as: Tag = "span" }) => (
  <Tag className={`text-[13px] ${className}`} style={{ ...inkSecondary, ...style }}>{children}</Tag>
);

export const Tiny: React.FC<TextProps> = ({ children, className = "", style, as: Tag = "span" }) => (
  <Tag className={`text-[11px] uppercase tracking-[0.4px] ${className}`} style={{ ...inkTertiary, ...style }}>{children}</Tag>
);

export const Emphasis: React.FC<TextProps> = ({ children, className = "" }) => (
  <span className={`font-bold ${className}`} style={{ color: "rgb(var(--accent-070))" }}>{children}</span>
);
