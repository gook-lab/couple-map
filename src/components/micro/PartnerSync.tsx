import React from "react";
import { motion } from "framer-motion";
import { Tiny } from "@/components/ui/typography";

interface PartnerSyncProps {
  name: string;
  initial: string;
  online?: boolean;
  typing?: boolean;
  activity?: string;
}

const PartnerSync: React.FC<PartnerSyncProps> = ({
  name, initial, online = true, typing = false, activity,
}) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl border">
      <div className="relative">
        <div
          className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-[14px] font-semibold"
          style={{ background: "rgb(var(--accent-020))", color: "rgb(var(--accent-070))" }}
        >
          {initial}
        </div>
        {online && (
          <motion.div
            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
            style={{ background: "rgb(var(--accent-070))" }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
      <div className="flex-1">
        <span className="text-[14px] font-semibold" style={{ color: "var(--app-ink)" }}>{name}</span>
        {activity && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[12px]" style={{ color: "rgb(var(--accent-070))" }}>●</span>
            <Tiny style={{ color: "rgb(var(--accent-070))" }}>{activity}</Tiny>
          </div>
        )}
        {typing && (
          <div className="flex items-center gap-1.5 mt-1">
            <div
              className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[8px] font-semibold"
              style={{ background: "rgb(var(--accent-020))", color: "rgb(var(--accent-070))" }}
            >
              {initial}
            </div>
            <div className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 rounded-full"
                  style={{ background: "var(--app-ink-3)" }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
            <Tiny>입력 중...</Tiny>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerSync;
