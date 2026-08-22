import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { H3, Meta } from "@/components/ui/typography";

interface ErrorModalProps {
  open: boolean;
  icon?: string;
  title: string;
  message: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  open, icon = "⚠️", title, message,
  primaryLabel, secondaryLabel,
  onPrimary, onSecondary, onClose,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-7"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div
              className="w-full max-w-sm rounded-2xl p-5"
              style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)", boxShadow: "var(--app-shadow)" }}
            >
              <div className="text-center">
                <span className="text-[36px]">{icon}</span>
                <H3 className="mt-2">{title}</H3>
                <Meta className="mt-1.5 leading-relaxed block">{message}</Meta>
              </div>
              <div className="flex gap-2 mt-5">
                {secondaryLabel && (
                  <button
                    onClick={onSecondary || onClose}
                    className="flex-1 py-2.5 rounded-full glass-pill text-[14px] font-bold"
                    style={{ color: "var(--app-ink-2)" }}
                  >
                    {secondaryLabel}
                  </button>
                )}
                {primaryLabel && (
                  <button
                    onClick={onPrimary || onClose}
                    className="flex-1 py-2.5 rounded-full text-[14px] font-bold"
                    style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)" }}
                  >
                    {primaryLabel}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ErrorModal;
