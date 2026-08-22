import React, { useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { motion } from "framer-motion";
import { Body, Meta, Tiny } from "@/components/ui/typography";
import AppButton from "@/components/ui/app-button";
import AppTextarea from "@/components/ui/app-textarea";
import DatePicker from "@/components/ui/date-picker";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import toast from "@/lib/toast";

interface Capsule { id: string; message: string; openDate: Date; sealed: boolean; createdAt: Date; }

const TimeCapsule: React.FC = () => {
  const [capsules, setCapsules] = useState<Capsule[]>([
    { id: "1", message: "1주년 때 열어볼 편지 💌", openDate: new Date(2027, 0, 1), sealed: true, createdAt: new Date() },
  ]);
  const [showCreate, setShowCreate] = useState(false);
  const [message, setMessage] = useState("");
  const [openDate, setOpenDate] = useState(new Date(Date.now() + 30 * 86400000));

  const handleCreate = () => {
    if (!message.trim()) return;
    setCapsules([{ id: `c-${Date.now()}`, message, openDate, sealed: true, createdAt: new Date() }, ...capsules]);
    setMessage(""); setShowCreate(false);
    toast.success({ message: "타임캡슐이 봉인됐어요 🔒" });
  };

  const canOpen = (c: Capsule) => new Date() >= c.openDate;

  const handleOpen = (id: string) => {
    setCapsules((prev) => prev.map((c) => c.id === id ? { ...c, sealed: false } : c));
    toast.success({ message: "타임캡슐이 열렸어요! ✨" });
  };

  return (
    <PageContainer withBottomNav>
      <PageHeader title="추억 캡슐 🔮" />

      <div className="px-5 pt-4">
        <Meta className="block mb-4">특정 날짜에 열리는 타임캡슐을 만들어보세요</Meta>

        {!showCreate ? (
          <AppButton onClick={() => setShowCreate(true)} icon={<Lock className="w-4 h-4" />}>새 캡슐 만들기</AppButton>
        ) : (
          <div className="glass-card p-5 mb-4 space-y-3">
            <AppTextarea label="메시지" value={message} onChange={setMessage} placeholder="미래의 우리에게 보내는 편지..." maxLength={300} showCount />
            <DatePicker label="열리는 날" value={openDate} onChange={setOpenDate} />
            <div className="flex gap-2">
              <AppButton variant="secondary" onClick={() => setShowCreate(false)}>취소</AppButton>
              <AppButton onClick={handleCreate} icon={<Lock className="w-4 h-4" />}>봉인하기</AppButton>
            </div>
          </div>
        )}

        <div className="mt-5 space-y-3">
          {capsules.map((c) => (
            <motion.div key={c.id} layout className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                {c.sealed ? <Lock className="w-4 h-4" style={{ color: "rgb(var(--accent-070))" }} /> : <Unlock className="w-4 h-4" style={{ color: "var(--app-ink-3)" }} />}
                <Tiny className="font-semibold">{c.sealed ? "봉인됨" : "열림"}</Tiny>
                <Tiny className="ml-auto">{c.openDate.toLocaleDateString("ko-KR")} 오픈</Tiny>
              </div>
              {c.sealed ? (
                <div className="text-center py-4">
                  <span className="text-3xl">🔒</span>
                  <Meta className="block mt-2">
                    {canOpen(c) ? "열 수 있어요!" : `${Math.ceil((c.openDate.getTime() - Date.now()) / 86400000)}일 남음`}
                  </Meta>
                  {canOpen(c) && (
                    <AppButton size="sm" className="mt-3" fullWidth={false} onClick={() => handleOpen(c.id)}>캡슐 열기</AppButton>
                  )}
                </div>
              ) : (
                <Body className="text-[14px] leading-relaxed mt-2">{c.message}</Body>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default TimeCapsule;
