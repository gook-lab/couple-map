import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { H3 } from "@/components/ui/typography";

type PageHeaderProps = {
  title: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
  right?: React.ReactNode;
  transparent?: boolean;
  className?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onBack,
  showBack = true,
  right,
  transparent = false,
  className = "",
}) => {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));

  const barClass = transparent
    ? "px-4 pt-3 pb-3"
    : "glass-bar px-4 pt-3 pb-3";

  return (
    <header
      className={`sticky top-0 z-10 flex items-center justify-between gap-3 ${barClass} ${className}`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {showBack && (
          <button
            type="button"
            onClick={handleBack}
            aria-label="뒤로 가기"
            className="p-1 -ml-1 shrink-0"
          >
            <ChevronLeft className="w-6 h-6" style={{ color: "var(--app-ink)" }} />
          </button>
        )}
        <H3 className="truncate">{title}</H3>
      </div>
      {right ? <div className="shrink-0 flex items-center gap-2">{right}</div> : null}
    </header>
  );
};

export default PageHeader;
