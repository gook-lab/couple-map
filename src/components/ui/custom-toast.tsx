import React from "react";
import { type Toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { CircleX, TriangleAlert, CircleCheck } from "lucide-react";

type ToastType = "success" | "error" | "warning";

interface CustomToastProps {
  t: Toast;
  type: ToastType;
  title?: string;
  message: string;
}

const CustomToast: React.FC<CustomToastProps> = ({ t, type = "success", message }) => {
  const styles = {
    error: {
      icon: <CircleX className="w-5 h-5 text-red-400" />,
      cls: "border-red-400/50 bg-red-950/80 text-red-300",
    },
    warning: {
      icon: <TriangleAlert className="w-5 h-5 text-amber-400" />,
      cls: "border-amber-400/50 bg-amber-950/80 text-amber-300",
    },
    success: {
      icon: <CircleCheck className="w-5 h-5 text-green-400" />,
      cls: "border-green-400/50 bg-green-950/80 text-green-300",
    },
  }[type];

  return (
    <AnimatePresence>
      {t.visible && (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className={`pointer-events-auto flex rounded-2xl border glass shadow-lg ${styles.cls}`}
        >
          <div className="w-full p-3">
            <p className="text-[15px] font-semibold flex items-center gap-3">
              {styles.icon}
              <span>{message}</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomToast;
