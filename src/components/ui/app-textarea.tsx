import React from "react";
import { Tiny } from "@/components/ui/typography";

interface AppTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label?: string;
  error?: string;
  showCount?: boolean;
  onChange?: (value: string) => void;
}

const AppTextarea = React.forwardRef<HTMLTextAreaElement, AppTextareaProps>(
  ({ label, error, showCount, maxLength, value, onChange, className = "", ...props }, ref) => {
    const length = typeof value === "string" ? value.length : 0;

    return (
      <div>
        {label && <Tiny className="mb-1.5 block">{label}</Tiny>}
        <textarea
          ref={ref}
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full min-h-[100px] px-3.5 py-3 rounded-xl text-[15px] outline-none resize-none leading-[1.7] transition-colors ${className}`}
          style={{
            background: "var(--app-card)",
            border: `1.5px solid ${error ? "rgb(var(--color-couple-status-red))" : "var(--app-line)"}`,
            color: "var(--app-ink)",
          }}
          {...props}
        />
        <div className="flex justify-between mt-1">
          {error ? <Tiny style={{ color: "rgb(var(--color-couple-status-red))" }}>{error}</Tiny> : <span />}
          {showCount && maxLength && <Tiny>{length} / {maxLength}</Tiny>}
        </div>
      </div>
    );
  }
);

AppTextarea.displayName = "AppTextarea";
export default AppTextarea;
