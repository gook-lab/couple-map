import React from "react";
import { motion } from "framer-motion";

interface PinDropProps {
  delay?: number;
  size?: number;
  color?: string;
  children?: React.ReactNode;
}

const PinDrop: React.FC<PinDropProps> = ({ delay = 0, size = 26, color, children }) => {
  return (
    <motion.div
      className="relative inline-flex flex-col items-center"
      initial={{ y: -80, scale: 1.4, opacity: 0.4 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      {children || (
        <div
          className="rounded-full flex items-center justify-center text-white shadow-md"
          style={{
            width: size,
            height: size,
            background: color || "rgb(var(--accent-070))",
          }}
        >
          📍
        </div>
      )}
      <motion.div
        className="rounded-full bg-black/20"
        style={{ width: size + 2, height: 6 }}
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 0.4, delay: delay + 0.3 }}
      />
    </motion.div>
  );
};

export default PinDrop;
