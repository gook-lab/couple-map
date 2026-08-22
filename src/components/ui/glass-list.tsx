import React from "react";
import { Tiny } from "@/components/ui/typography";

interface GlassListProps {
  header?: string;
  children: React.ReactNode;
  className?: string;
}

const GlassList: React.FC<GlassListProps> = ({ header, children, className = "" }) => (
  <div className={className}>
    {header && <Tiny className="block mb-2">{header}</Tiny>}
    <div className="glass-card px-4 overflow-hidden">{children}</div>
  </div>
);

export default GlassList;
