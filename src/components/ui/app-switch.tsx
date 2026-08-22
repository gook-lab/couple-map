import React from "react";

interface AppSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

const AppSwitch: React.FC<AppSwitchProps> = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between py-3.5 border-b" style={{ borderColor: "var(--app-line-soft)" }}>
    {(label || description) && (
      <div>
        {label && <span className="text-[15px] font-medium" style={{ color: "var(--app-ink)" }}>{label}</span>}
        {description && <span className="text-[13px] block mt-0.5" style={{ color: "var(--app-ink-2)" }}>{description}</span>}
      </div>
    )}
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="w-11 h-[26px] rounded-full relative transition-colors flex-shrink-0"
      style={{ background: checked ? "rgb(var(--accent-070))" : "var(--app-line)" }}
    >
      <div
        className="absolute top-[2px] w-[22px] h-[22px] rounded-full shadow-sm transition-all"
        style={{ left: checked ? "calc(100% - 24px)" : "2px", background: "var(--app-card)" }}
      />
    </button>
  </div>
);

export default AppSwitch;
