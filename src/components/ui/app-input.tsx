import React, { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { Tiny } from "@/components/ui/typography";

interface AppInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  suffix?: React.ReactNode;
  error?: string;
  clearable?: boolean;
  onChange?: (value: string) => void;
}

const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  ({ label, suffix, error, clearable, type = "text", onChange, value, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;
    const hasValue = value !== undefined && value !== "";

    return (
      <div>
        {label && <Tiny className="mb-1.5 block">{label}</Tiny>}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={`w-full h-12 px-4 rounded-xl text-[15px] outline-none transition-colors ${(clearable || isPassword) ? "pr-10" : ""} ${suffix ? "pr-20" : ""} ${className}`}
            style={{
              background: "var(--app-card)",
              border: `1.5px solid ${error ? "rgb(var(--color-couple-status-red))" : "var(--app-line)"}`,
              color: "var(--app-ink)",
            }}
            {...props}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {clearable && hasValue && (
              <button type="button" onClick={() => onChange?.("")} className="p-0.5 rounded-full">
                <X className="w-4 h-4" style={{ color: "var(--app-ink-3)" }} />
              </button>
            )}
            {isPassword && (
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-0.5">
                {showPassword
                  ? <EyeOff className="w-4 h-4" style={{ color: "var(--app-ink-3)" }} />
                  : <Eye className="w-4 h-4" style={{ color: "var(--app-ink-3)" }} />}
              </button>
            )}
            {suffix}
          </div>
        </div>
        {error && <Tiny className="mt-1 block" style={{ color: "rgb(var(--color-couple-status-red))" }}>{error}</Tiny>}
      </div>
    );
  }
);

AppInput.displayName = "AppInput";
export default AppInput;
