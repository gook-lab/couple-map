import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tiny } from "@/components/ui/typography";

const OfflineBanner: React.FC = () => {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center gap-2.5 safe-area-top"
        >
          <span className="text-lg">⚠️</span>
          <div className="flex-1">
            <span className="text-[14px] font-semibold text-amber-900">인터넷 연결 없음</span>
            <Tiny className="text-amber-700 block">저장된 추억은 볼 수 있어요 · 새 추억은 연결 후 동기화</Tiny>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 rounded-full text-[12px] font-semibold bg-amber-200 text-amber-900"
          >
            재시도
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineBanner;
