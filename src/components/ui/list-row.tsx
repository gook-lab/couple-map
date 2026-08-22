import React from "react";

interface ListRowProps {
  icon?: React.ReactNode;
  emoji?: string;
  title: string;
  detail?: string;
  chevron?: boolean;
  onClick?: () => void;
  isLast?: boolean;
  destructive?: boolean;
}

const ListRow: React.FC<ListRowProps> = ({
  icon, emoji, title, detail, chevron = true, onClick, isLast = false, destructive = false,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 py-3.5 px-1 text-left transition-colors ${
      !isLast ? "border-b" : ""
    }`}
    style={{ borderColor: !isLast ? "var(--app-line-soft)" : "transparent" }}
  >
    {emoji && <span className="text-lg flex-shrink-0">{emoji}</span>}
    {icon && <span className="flex-shrink-0">{icon}</span>}
    <span
      className="flex-1 text-[15px] min-w-0 truncate"
      style={{ color: destructive ? "rgb(var(--color-couple-status-red))" : "var(--app-ink)" }}
    >
      {title}
    </span>
    {detail && <span className="text-[13px] mr-1 flex-shrink-0" style={{ color: "var(--app-ink-2)" }}>{detail}</span>}
    {chevron && <span className="text-[14px] flex-shrink-0" style={{ color: "var(--app-ink-3)" }}>›</span>}
  </button>
);

export default ListRow;
