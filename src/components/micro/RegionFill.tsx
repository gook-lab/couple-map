import React from "react";
import { motion } from "framer-motion";

interface RegionFillProps {
  label: string;
  size?: number;
  delay?: number;
}

const RegionFill: React.FC<RegionFillProps> = ({ label, size = 200, delay = 0 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <defs>
        <radialGradient id={`fill-${label}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(var(--accent-070))" stopOpacity="1" />
          <stop offset="60%" stopColor="rgb(var(--accent-070))" stopOpacity="0.7" />
          <stop offset="100%" stopColor="rgb(var(--accent-070))" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`clip-${label}`}>
          <circle cx="100" cy="100" r="70" />
        </clipPath>
      </defs>

      <circle cx="100" cy="100" r="70" fill="var(--app-line-soft)" stroke="var(--app-line)" strokeWidth="2" />

      <motion.circle
        cx="100" cy="100" r="70"
        fill={`url(#fill-${label})`}
        clipPath={`url(#clip-${label})`}
        initial={{ r: 0, opacity: 0 }}
        animate={{ r: 70, opacity: 1 }}
        transition={{ duration: 0.7, delay, ease: "easeOut" }}
      />

      <text x="100" y="105" textAnchor="middle" fontSize="14" fontWeight="700" fill="white">
        {label}
      </text>
    </svg>
  );
};

export default RegionFill;
