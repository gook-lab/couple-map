import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { H3, Tiny } from "@/components/ui/typography";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label }) => {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(value.getFullYear());
  const [viewMonth, setViewMonth] = useState(value.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const days = Array.from({ length: 42 }, (_, i) => i - firstDay + 1);

  const isSelected = (d: number) =>
    d === value.getDate() && viewMonth === value.getMonth() && viewYear === value.getFullYear();

  const isToday = (d: number) => {
    const now = new Date();
    return d === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear();
  };

  const handleSelect = (d: number) => {
    onChange(new Date(viewYear, viewMonth, d));
    setOpen(false);
  };

  const prev = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
  };

  const next = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
  };

  const formatted = `${value.getFullYear()}년 ${value.getMonth() + 1}월 ${value.getDate()}일`;

  return (
    <div>
      {label && <Tiny className="mb-1.5 block">{label}</Tiny>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left"
        style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)" }}
      >
        <span className="text-[15px]" style={{ color: "var(--app-ink)" }}>{formatted}</span>
        <Calendar className="w-4 h-4" style={{ color: "var(--app-ink-3)" }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-3 rounded-xl" style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)" }}>
              <div className="flex items-center justify-between mb-3">
                <button type="button" onClick={prev} className="p-1">
                  <ChevronLeft className="w-4 h-4" style={{ color: "var(--app-ink-2)" }} />
                </button>
                <H3>{viewYear}년 {viewMonth + 1}월</H3>
                <button type="button" onClick={next} className="p-1">
                  <ChevronRight className="w-4 h-4" style={{ color: "var(--app-ink-2)" }} />
                </button>
              </div>

              <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d, i) => (
                  <div key={d} className="text-center py-1 text-[11px] font-medium"
                    style={{ color: i === 0 ? "rgb(var(--accent-070))" : "var(--app-ink-2)" }}>
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0.5">
                {days.slice(0, 35).map((d, i) => {
                  const inMonth = d > 0 && d <= daysInMonth;
                  const selected = inMonth && isSelected(d);
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={!inMonth}
                      onClick={() => inMonth && handleSelect(d)}
                      className={`h-9 rounded-lg text-[13px] transition-all ${
                        !inMonth ? "opacity-0" : isToday(d) ? "font-bold" : "font-medium"
                      }`}
                      style={{
                        background: selected ? "rgb(var(--accent-070))" : undefined,
                        color: selected ? "var(--app-ink-on-accent)" : "var(--app-ink)",
                      }}
                    >
                      {inMonth ? d : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatePicker;
