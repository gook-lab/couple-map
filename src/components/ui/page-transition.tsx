import React from "react";
import { motion } from "framer-motion";
import { pageSlide, spring } from "@/lib/animations";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = "",
}) => (
  <motion.div
    variants={pageSlide}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={spring}
    className={className}
  >
    {children}
  </motion.div>
);

export default PageTransition;
