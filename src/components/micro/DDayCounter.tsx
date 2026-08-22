import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DDayCounterProps {
  targetDate: Date;
  label?: string;
  large?: boolean;
}

const DDayCounter: React.FC<DDayCounterProps> = ({ targetDate, label, large = false }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const diff = targetDate.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  const dDayText = days > 0 ? `D-${days}` : days === 0 ? "D-DAY" : `D+${Math.abs(days)}`;

  return (
    <div className="flex flex-col items-center">
      {label && (
        <span className="text-[13px] mb-1" style={{ color: "var(--app-ink-2)" }}>{label}</span>
      )}
      <div
        className="font-bold tracking-tight"
        style={{
          fontSize: large ? 88 : 48,
          color: "rgb(var(--accent-070))",
          letterSpacing: large ? -2 : -1,
          lineHeight: 1,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={dDayText}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {dDayText}
          </motion.span>
        </AnimatePresence>
      </div>
      {days > 0 && (
        <div className="flex items-center gap-1.5 mt-2 text-[14px]" style={{ color: "var(--app-ink-2)" }}>
          <TimeSegment value={hours} label="h" />
          <span className="opacity-50">:</span>
          <TimeSegment value={mins} label="m" />
          <span className="opacity-50">:</span>
          <TimeSegment value={secs} label="s" />
        </div>
      )}
    </div>
  );
};

function TimeSegment({ value, label }: { value: number; label: string }) {
  return (
    <span className="font-mono">
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="inline-block"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
      <span className="text-[11px] opacity-60">{label}</span>
    </span>
  );
}

export default DDayCounter;
