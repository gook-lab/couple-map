import React, { useState } from "react";
import { X, MapPin, Star, Check, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Place } from "@/types/place";
import { updatePlace } from "@/services/places";

interface PlaceDetailModalProps {
  place: Place;
  onClose: () => void;
}

const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({ place, onClose }) => {
  const [memo, setMemo] = useState(place.memo);
  const [rating, setRating] = useState(place.rating);
  const [status, setStatus] = useState(place.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 3000)
      );
      await Promise.race([
        updatePlace(place.id, { memo, rating, status }),
        timeout,
      ]);
    } catch {
      console.warn("Firestore update failed or timed out");
    }
    setSaving(false);
    onClose();
  };

  const isVisited = status === "visited";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="w-full max-w-lg rounded-t-3xl"
          style={{ background: "var(--app-card)", borderTop: "1.5px solid var(--app-line)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-10 h-1 rounded-full" style={{ background: "var(--app-line)" }} />
          </div>

          <div className="px-5 pb-20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{
                    background: isVisited ? "rgb(var(--accent-070))" : "var(--app-line-soft)",
                    border: "1.5px solid var(--app-line)",
                  }}
                >
                  <MapPin className="w-5 h-5" style={{ color: isVisited ? "var(--app-ink-on-accent)" : "var(--app-ink)" }} />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold" style={{ color: "var(--app-ink)" }}>
                    {place.name}
                  </h2>
                  <p className="text-[12px]" style={{ color: "var(--app-ink-2)" }}>
                    {place.category} · {place.address}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5" style={{ color: "var(--app-ink-3)" }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setStatus("wanted")}
                className={`flex-1 py-2.5 rounded-full transition-all flex items-center justify-center gap-1.5 text-[14px] font-bold ${!isVisited ? "" : "glass-pill"}`}
                style={
                  !isVisited
                    ? { background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)" }
                    : { color: "var(--app-ink-2)" }
                }
              >
                <Heart className="w-4 h-4" /> 가고싶어
              </button>
              <button
                onClick={() => setStatus("visited")}
                className={`flex-1 py-2.5 rounded-full transition-all flex items-center justify-center gap-1.5 text-[14px] font-bold ${isVisited ? "" : "glass-pill"}`}
                style={
                  isVisited
                    ? { background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)" }
                    : { color: "var(--app-ink-2)" }
                }
              >
                <Check className="w-4 h-4" /> 다녀왔어
              </button>
            </div>

            <div className="mb-4">
              <label className="text-[12px] font-bold mb-1.5 block" style={{ color: "var(--app-ink-2)" }}>
                별점
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star === rating ? 0 : star)} className="p-1">
                    <Star
                      className="w-7 h-7 transition-colors"
                      fill={star <= rating ? "currentColor" : "none"}
                      style={{ color: star <= rating ? "rgb(var(--color-couple-yellow))" : "var(--app-line)" }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="text-[12px] font-bold mb-1.5 block" style={{ color: "var(--app-ink-2)" }}>
                메모
              </label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="이 장소에 대한 메모를 남겨보세요..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl text-[14px] focus:outline-none resize-none"
                style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)", color: "var(--app-ink)" }}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 rounded-full text-[15px] font-bold disabled:opacity-50"
              style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)" }}
            >
              {saving ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PlaceDetailModal;
