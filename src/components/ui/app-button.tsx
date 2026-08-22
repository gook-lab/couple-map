import React from "react";
import { motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
>;

interface AppButtonProps extends NativeButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "font-bold",
  secondary: "glass-pill font-bold",
  ghost: "font-bold border border-dashed",
  danger: "font-bold",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-5 py-3 text-[15px]",
  lg: "px-6 py-3.5 text-[16px]",
};

const AppButton: React.FC<AppButtonProps> = ({
  variant = "primary", size = "lg", fullWidth = true, loading = false,
  icon, children, disabled, className = "", style, ...props
}) => {
  const variantStyle: React.CSSProperties =
    variant === "primary"
      ? { background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)" }
      : variant === "danger"
      ? { background: "rgb(var(--color-couple-status-red))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)" }
      : variant === "ghost"
      ? { color: "var(--app-ink-2)", borderColor: "var(--app-line)" }
      : { color: "var(--app-ink-2)" };

  return (
    <motion.button
      whileTap={{ scale: 0.98, y: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      disabled={disabled || loading}
      className={`rounded-full inline-flex items-center justify-center gap-2 transition-opacity disabled:opacity-40 ${
        VARIANTS[variant]
      } ${SIZES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      style={{ ...variantStyle, ...style }}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default AppButton;
