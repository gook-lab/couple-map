import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Meta, Tiny } from "@/components/ui/typography";
import EmptyState from "@/components/ui/empty-state";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { CandyCard, type CandyColor } from "@/components/ui/sticker";
import { stagger, staggerItem } from "@/lib/animations";
import { useAuthStore } from "@/store/use-auth-store";
import { subscribeNotifications, markAsRead, type AppNotification } from "@/services/notifications";

const SAMPLE_NOTIFICATIONS: AppNotification[] = [
  { id: "s1", userId: "", type: "memory", icon: "💕", title: "파트너가 새 추억을 추가했어요", body: "오랜만의 바다... · 부산 · 방금", read: false, createdAt: new Date() },
  { id: "s2", userId: "", type: "anniversary", icon: "🎁", title: "내일은 기념일이에요", body: "특별한 하루를 준비해보세요", read: false, createdAt: new Date(Date.now() - 3600000) },
  { id: "s3", userId: "", type: "comment", icon: "💬", title: "파트너가 댓글을 남겼어요", body: '"보고싶다" · 어제', read: true, createdAt: new Date(Date.now() - 86400000) },
  { id: "s4", userId: "", type: "like", icon: "❤️", title: "파트너가 좋아요를 눌렀어요", body: "해운대에서 파도 · 어제", read: true, createdAt: new Date(Date.now() - 86400000) },
  { id: "s5", userId: "", type: "location", icon: "📍", title: "파트너가 도착했어요", body: "카페 도토리 · 2일 전", read: true, createdAt: new Date(Date.now() - 172800000) },
];

const TYPE_COLOR: Record<string, CandyColor> = {
  memory: "pink",
  anniversary: "butter",
  comment: "sky",
  like: "peach",
  location: "mint",
};

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.state.user);
  const [notifications, setNotifications] = useState<AppNotification[]>(SAMPLE_NOTIFICATIONS);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!user) return;
    try {
      return subscribeNotifications(user.uid, (items) => {
        if (items.length > 0) { setNotifications(items); setLive(true); }
      });
    } catch { /* keep samples */ }
  }, [user]);

  const [notifTab, setNotifTab] = useState<"list" | "inbox">("list");

  const handleMarkAllRead = () => {
    if (live) notifications.filter((n) => !n.read).forEach((n) => markAsRead(n.id));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleTap = (notif: AppNotification) => {
    if (!notif.read) {
      if (live) markAsRead(notif.id);
      setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, read: true } : n));
    }
    if (notif.type === "memory" || notif.type === "like") navigate("/timeline");
    else if (notif.type === "anniversary") navigate("/calendar");
    else if (notif.type === "comment") navigate("/timeline");
    else if (notif.type === "location") navigate("/location");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return "방금";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
    if (diff < 172800000) return "어제";
    return `${Math.floor(diff / 86400000)}일 전`;
  };

  if (notifications.length === 0) {
    return (
      <PageContainer>
        <PageHeader title="알림" />
        <EmptyState icon="💌" title="새 소식이 없어요" description="파트너에게 먼저 한마디 남겨볼까요?" actionLabel="✏️ 한 줄 메모 보내기" onAction={() => navigate("/compose")} />
      </PageContainer>
    );
  }

  const iconBox = {
    background: "var(--app-card)",
    border: "1.5px solid var(--app-line)",
  } as React.CSSProperties;

  return (
    <PageContainer withBottomNav>
      <PageHeader
        title="알림"
        right={
          unreadCount > 0 ? (
            <button onClick={handleMarkAllRead} className="text-[13px] font-bold" style={{ color: "rgb(var(--accent-070))" }}>
              모두 읽음
            </button>
          ) : undefined
        }
      />

      <div className="px-5 pt-2 pb-2 flex gap-1.5">
        {([
          { id: "list" as const, label: "알림" },
          { id: "inbox" as const, label: "받은 편지함" },
        ]).map((t) => {
          const isActive = notifTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setNotifTab(t.id)}
              className="px-4 py-1.5 rounded-full text-[13px] font-bold transition-all"
              style={
                isActive
                  ? { background: "var(--app-ink)", color: "var(--app-bg)", border: "1.5px solid var(--app-line)" }
                  : { background: "var(--app-card)", color: "var(--app-ink-2)", border: "1.5px solid var(--app-line-soft)" }
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {notifTab === "inbox" && (
        <div className="px-5 pt-2">
          <Meta className="mb-3 block">파트너가 보낸 메모와 활동</Meta>
          {/* 노란 메모지: 다크모드에서도 종이는 노랑 → 글자 fixed 다크 */}
          <div
            className="p-4 rounded-2xl mb-3"
            style={{ background: "rgb(var(--color-couple-yellow))", color: "#1c1917", border: "1.5px solid var(--app-line)", boxShadow: "var(--app-shadow)", transform: "rotate(-0.7deg)" }}
          >
            <Tiny style={{ color: "rgba(28,25,23,0.6)" }}>FROM 파트너 · 방금</Tiny>
            <p className="text-[14px] mt-2 leading-relaxed">오늘 진짜 행복했어. 노을 같이 봐서 좋았다 :)</p>
            <button className="mt-2 text-[13px] font-bold" style={{ color: "#c2410c" }}>❤️ 답장</button>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { emoji: "🏖️", title: "새 사진 5장", sub: "협재해변에서 · 1시간 전", color: "sky" as CandyColor },
              { emoji: "📍", title: "새 핀: 협재해변", sub: "추가 · 2시간 전", color: "mint" as CandyColor },
              { emoji: "🎂", title: "D-7 · 파트너 생일", sub: "위시리스트 3개", color: "butter" as CandyColor },
            ].map((item, i) => (
              <CandyCard key={i} color={item.color} className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={iconBox}>{item.emoji}</div>
                <div className="flex-1">
                  <span className="text-[14px] font-bold block">{item.title}</span>
                  <Tiny className="block mt-0.5">{item.sub}</Tiny>
                </div>
              </CandyCard>
            ))}
          </div>
        </div>
      )}

      {notifTab === "list" && (
        <motion.div className="px-5 pt-2 flex flex-col gap-2.5" variants={stagger} initial="initial" animate="animate">
          {notifications.map((notif) => (
            <motion.div key={notif.id} variants={staggerItem}>
              <CandyCard
                color={notif.read ? "paper" : TYPE_COLOR[notif.type] || "peach"}
                shadow={!notif.read}
                onClick={() => handleTap(notif)}
                className="w-full flex items-center gap-3 p-3.5"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0" style={iconBox}>
                  {notif.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold truncate">{notif.title}</span>
                    {!notif.read && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "var(--app-ink)" }} />}
                  </div>
                  <Tiny className="mt-0.5 truncate block">{notif.body}</Tiny>
                </div>
                <Tiny className="flex-shrink-0">{formatTime(notif.createdAt)}</Tiny>
              </CandyCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </PageContainer>
  );
};

export default Notifications;
