import React from "react";
import { Meta, Tiny } from "@/components/ui/typography";

interface ProfileCardProps {
  initial: string;
  name: string;
  subtitle: string;
  badge?: string;
  onClick?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ initial, name, subtitle, badge, onClick }) => (
  <button onClick={onClick} className="w-full glass-card p-4 flex items-center gap-3.5 text-left">
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center text-[22px] font-semibold flex-shrink-0"
      style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)" }}
    >
      {initial}
    </div>
    <div className="flex-1 min-w-0">
      <span className="text-[18px] font-bold block truncate" style={{ color: "var(--app-ink)" }}>{name}</span>
      <Meta className="mt-0.5 block">{subtitle}</Meta>
      {badge && <Tiny className="mt-0.5 block" style={{ color: "rgb(var(--accent-070))" }}>{badge}</Tiny>}
    </div>
    <span className="text-[18px] flex-shrink-0" style={{ color: "var(--app-ink-3)" }}>›</span>
  </button>
);

export default ProfileCard;
