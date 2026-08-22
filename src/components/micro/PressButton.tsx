import React from "react";
import { motion } from "framer-motion";

interface PressButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const PressButton: React.FC<PressButtonProps> = ({ children, onClick, className = "", style, disabled }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={style}
      whileTap={{ y: 2, scale: 0.98, boxShadow: "0 0 0 4px rgb(var(--accent-010))" }}
      whileHover={{ y: -1, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
};

export default PressButton;
