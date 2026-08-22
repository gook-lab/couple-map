import React from "react";
import { Tiny } from "@/components/ui/typography";

interface StatCardProps {
  value: number | string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label }) => (
  <div className="glass-card p-3 text-center">
    <div className="text-[22px] font-bold" style={{ color: "var(--app-ink)" }}>{value}</div>
    <Tiny className="block mt-0.5">{label}</Tiny>
  </div>
);

export default StatCard;
