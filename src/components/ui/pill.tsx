import React from "react";

interface PillProps {
  children: React.ReactNode;
  active?: boolean;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
}

const Pill: React.FC<PillProps> = ({ children, active = false, variant, onClick, className = "" }) => {
  const isPrimary = variant === "primary" || active;

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold transition-all ${
        isPrimary ? "" : "glass-pill"
      } ${className}`}
      style={
        isPrimary
          ? { background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)" }
          : { color: "var(--app-ink-2)" }
      }
    >
      {children}
    </button>
  );
};

export default Pill;
