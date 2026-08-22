import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { H3, Body, Meta } from "@/components/ui/typography";

interface AddSheetProps {
  open: boolean;
  onClose: () => void;
}

interface AddOption {
  id: string;
  emoji: string;
  title: string;
  description: string;
  route: string;
  highlight: boolean;
}

const OPTIONS: AddOption[] = [
  { id: "memory-pin", emoji: "📍", title: "추억 핀", description: "장소를 색칠하고 사진/일기 추가", route: "/add/country", highlight: true },
  { id: "travel-plan", emoji: "✈️", title: "여행 계획", description: "곧 떠날 곳 미리 표시", route: "/calendar", highlight: false },
  { id: "bucket-list", emoji: "💭", title: "버킷 리스트", description: "함께 가고 싶은 곳", route: "/add/country", highlight: false },
  { id: "diary", emoji: "✍️", title: "일기 · 사진", description: "오늘의 추억을 기록", route: "/compose", highlight: false },
  { id: "voice", emoji: "🎤", title: "음성 메모", description: "목소리로 남기는 추억", route: "/voice", highlight: false },
  { id: "anniversary", emoji: "🎁", title: "기념일 · 이벤트", description: "특별한 날 등록", route: "/anniversary/add", highlight: false },
];

const AddSheet: React.FC<AddSheetProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleSelect = (option: AddOption) => {
    onClose();
    if (option.route) {
      navigate(option.route);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed left-1/2 -translate-x-1/2 w-full max-w-[430px] bottom-0 z-50 rounded-t-3xl"
            style={{ background: "var(--app-card)", borderTop: "1.5px solid var(--app-line)", boxShadow: "0 -4px 20px rgba(0,0,0,0.12)" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: "var(--app-line)" }} />
            </div>

            <div className="px-5 pt-2 pb-2">
              <H3>무엇을 추가할까요?</H3>
            </div>

            <div className="px-5 pb-8 flex flex-col gap-2.5">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt)}
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl text-left transition-all"
                  style={{
                    background: opt.highlight ? "rgb(var(--accent-010))" : "var(--app-card)",
                    border: `1.5px solid ${opt.highlight ? "rgb(var(--accent-070))" : "var(--app-line-soft)"}`,
                  }}
                >
                  <span className="text-2xl flex-shrink-0">{opt.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <Body className="font-bold block">{opt.title}</Body>
                    <Meta className="mt-0.5 block">{opt.description}</Meta>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--app-ink-3)" }} />
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddSheet;
