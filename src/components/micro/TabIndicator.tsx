import React from "react";
import { motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
}

interface TabIndicatorProps {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
}

const TabIndicator: React.FC<TabIndicatorProps> = ({ tabs, activeId, onChange }) => {
  const activeIndex = tabs.findIndex((t) => t.id === activeId);
  const tabWidth = 100 / tabs.length;

  return (
    <div className="relative rounded-full border p-1">
      {/* Sliding indicator */}
      <motion.div
        className="absolute top-1 bottom-1 rounded-full shadow-sm"
        style={{ background: "rgb(var(--accent-070))", width: `${tabWidth}%` }}
        animate={{ left: `${activeIndex * tabWidth}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />

      <div className="relative flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex-1 py-2 text-center text-[13px] font-medium relative z-10 transition-colors"
            style={{ color: activeId === tab.id ? "var(--app-ink-on-accent)" : "var(--app-ink-2)" }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabIndicator;
