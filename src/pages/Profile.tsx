import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "@/lib/toast";
import { ChevronRight, Heart, Camera } from "lucide-react";
import { H2, H3, Body, Meta, Tiny } from "@/components/ui/typography";
import ProfileCard from "@/components/ui/profile-card";
import StatCard from "@/components/ui/stat-card";
import GlassList from "@/components/ui/glass-list";
import ListRow from "@/components/ui/list-row";
import PageTransition from "@/components/ui/page-transition";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { useAuthStore } from "@/store/use-auth-store";
import { saveUserProfile, getUserProfile } from "@/services/user-profile";
import AppInput from "@/components/ui/app-input";
import AppTextarea from "@/components/ui/app-textarea";
import DatePicker from "@/components/ui/date-picker";
import AppSwitch from "@/components/ui/app-switch";
import { useTheme } from "@/contexts/ThemeContext";
import { subscribePlaces } from "@/services/places";
import type { Place } from "@/types/place";

type SubPage = null | "edit-profile" | "couple-info" | "notifications" | "theme";

const ACCENT_COLORS = [
  { id: "coral", color: "#f97863" },
  { id: "blue", color: "#4A7DE0" },
  { id: "sage", color: "#6b8c66" },
  { id: "purple", color: "#c084fc" },
  { id: "yellow", color: "#fbbf24" },
  { id: "black", color: "#000000" },
];

const NOTIF_SETTINGS = [
  { key: "new_memory", title: "새 추억 알림", sub: "파트너가 추억을 추가했을 때", default: true },
  { key: "comments", title: "댓글 · 좋아요", sub: "내 추억에 반응이 왔을 때", default: true },
  { key: "anniversary", title: "기념일 알림", sub: "D-7부터 매일", default: true },
  { key: "location", title: "위치 알림", sub: "도착했을 때", default: true },
  { key: "recall", title: "추억 회상", sub: "1년 전 오늘", default: false },
  { key: "weekly", title: "주간 리포트", sub: "매주 일요일 저녁", default: false },
  { key: "marketing", title: "광고 · 마케팅", sub: "이벤트와 혜택 정보", default: false },
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { palette, setPalette, modePreference, setModePreference, font, setFont } = useTheme();
  const user = useAuthStore((s) => s.state.user);
  const logout = useAuthStore((s) => s.logout);
  const coupleId = useAuthStore((s) => s.state.coupleId);

  const [subPage, setSubPage] = useState<SubPage>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState("여행과 카페를 좋아하는 사람");
  const [disconnectText, setDisconnectText] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [birthdayDate, setBirthdayDate] = useState(new Date(1996, 4, 12));
  const selectedFont = font;
  const setSelectedFont = setFont;
  const [notifToggles, setNotifToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_SETTINGS.map((n) => [n.key, n.default]))
  );

  useEffect(() => {
    if (!coupleId) return;
    try { return subscribePlaces(coupleId, setPlaces); } catch { /* */ }
  }, [coupleId]);

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then((profile) => {
      if (profile) {
        if (profile.displayName) setDisplayName(profile.displayName);
        if (profile.bio) setBio(profile.bio);
      }
    }).catch(() => {});
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const totalPhotos = places.reduce((s, p) => s + (p.photos?.length || 0), 0);
  const visitedRegions = new Set(places.map((p) => p.region).filter(Boolean));

  // ── Sub pages ──
  if (subPage === "edit-profile") {
    return (
      <PageContainer withBottomNav>
        <PageHeader
          title="프로필 수정"
          onBack={() => setSubPage(null)}
          right={
            <button
              onClick={async () => {
                setProfileSaving(true);
                if (user) {
                  try { await saveUserProfile({ uid: user.uid, displayName, bio }); } catch { /* */ }
                }
                await new Promise((r) => setTimeout(r, 500));
                setProfileSaving(false);
                toast.success({ message: "저장됐어요" });
                setSubPage(null);
              }}
              className="text-[14px] font-semibold"
              style={{ color: "rgb(var(--accent-070))" }}
            >
              저장
            </button>
          }
        />
        <div className="px-5 pt-5">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                className="w-[100px] h-[100px] rounded-full flex items-center justify-center text-3xl"
                style={{ background: "var(--app-line-soft)", border: "1.6px solid var(--app-line-soft)" }}
              >
                {displayName?.[0] || "?"}
              </div>
              <div
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgb(var(--accent-070))" }}
              >
                <Camera className="w-4 h-4" style={{ color: "var(--app-ink-on-accent)" }} />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <AppInput label="이름" value={displayName} onChange={setDisplayName} clearable />
            <AppInput
              label="아이디"
              value="@minji_96"
              readOnly
              suffix={<Tiny style={{ color: "rgb(var(--accent-070))" }}>✓ 사용 가능</Tiny>}
            />
            <DatePicker label="생일" value={birthdayDate} onChange={setBirthdayDate} />
            <AppTextarea label="자기소개" value={bio} onChange={setBio} className="min-h-[60px]" />
          </div>
        </div>
        <AnimatePresence>
          {profileSaving && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
              <div
                className="relative rounded-2xl px-7 py-5 flex items-center gap-3"
                style={{ background: "rgba(28,25,23,0.85)" }}
              >
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <Body style={{ color: "#ffffff" }}>저장 중...</Body>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PageContainer>
    );
  }

  if (subPage === "couple-info") {
    return (
      <PageContainer withBottomNav>
        <PageHeader title="우리 정보" onBack={() => setSubPage(null)} />
        <div className="px-5 pt-4">
          <div
            className="rounded-2xl p-5 text-center"
            style={{ background: "rgb(var(--accent-010))", border: "1px solid var(--app-line-soft)" }}
          >
            <div className="flex items-center justify-center gap-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-semibold"
                style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)" }}
              >
                {displayName?.[0] || "나"}
              </div>
              <Heart className="w-5 h-5" style={{ color: "rgb(var(--accent-070))" }} fill="currentColor" />
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-semibold"
                style={{ background: "rgb(var(--accent-020))", color: "rgb(var(--accent-070))" }}
              >
                ♥
              </div>
            </div>
            <H3 className="mt-3">{displayName} ♥ 파트너</H3>
            <Meta className="mt-1">D+482 · 2024.02.14부터</Meta>
          </div>
          <div className="mt-5">
            {[
              { label: "만난 날", value: "2024년 2월 14일" },
              { label: "커플 이름", value: "민현 ♥" },
              { label: "커플 사진", value: "변경하기" },
              { label: "배경 음악", value: "어쿠스틱 플레이리스트" },
              { label: "우리만의 이모지", value: "💕" },
            ].map((item, idx, arr) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-3.5"
                style={{ borderBottom: idx < arr.length - 1 ? "1px solid var(--app-line-soft)" : undefined }}
              >
                <Meta>{item.label}</Meta>
                <div className="flex items-center gap-1.5">
                  <Body className="font-medium">{item.value}</Body>
                  <ChevronRight className="w-3.5 h-3.5" style={{ color: "var(--app-ink-3)" }} />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setSubPage("disconnect" as SubPage)}
            className="w-full text-center py-3 mt-6 text-[13px]"
            style={{ color: "rgb(var(--color-couple-status-red))" }}
          >
            커플 끊기
          </button>
        </div>
      </PageContainer>
    );
  }

  if ((subPage as string) === "disconnect") {
    return (
      <PageContainer flex center className="px-7">
        <div
          className="w-full rounded-2xl p-5 shadow-xl"
          style={{ background: "var(--app-card)", border: "1px solid var(--app-line-soft)" }}
        >
          <div className="text-center">
            <span className="text-[36px]">💔</span>
            <H3 className="mt-2">정말 끊으시겠어요?</H3>
            <Meta className="mt-2 block leading-relaxed">
              지금까지 함께한 <strong>482일</strong>의 추억(<strong>{places.length}개</strong>, 사진 {totalPhotos}장)은 <strong>30일간 보관</strong>된 후 삭제돼요.
            </Meta>
          </div>
          <div
            className="mt-3 p-3 rounded-lg text-[12px] leading-relaxed"
            style={{ background: "rgb(var(--color-couple-status-red) / 0.08)", color: "rgb(var(--color-couple-status-red))" }}
          >
            ⚠️ 파트너에게도 알림이 가고 둘의 데이터가 분리돼요.
          </div>
          <input
            type="text"
            placeholder={'"끊을게요" 입력'}
            value={disconnectText}
            onChange={(e) => setDisconnectText(e.target.value)}
            className="w-full mt-4 px-3 py-2.5 rounded-lg text-[14px] outline-none"
            style={{ background: "var(--app-card)", border: "1px solid var(--app-line)", color: "var(--app-ink)" }}
          />
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => { setSubPage("couple-info"); setDisconnectText(""); }}
              className="flex-1 py-2.5 rounded-full glass-pill text-[14px] font-medium"
              style={{ color: "var(--app-ink-2)" }}
            >
              취소
            </button>
            <button
              disabled={disconnectText !== "끊을게요"}
              onClick={async () => {
                try {
                  const { disconnectCouple } = await import("@/services/account");
                  if (coupleId && user) await disconnectCouple(coupleId, user.uid);
                  toast.success({ message: "커플 연결이 해제됐어요" });
                  navigate("/onboarding", { replace: true });
                } catch {
                  toast.error({ message: "실패했어요" });
                }
              }}
              className="flex-1 py-2.5 rounded-full text-[14px] font-semibold disabled:opacity-40"
              style={{ background: "rgb(var(--color-couple-status-red))", color: "var(--app-ink-on-accent)" }}
            >
              끊기
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  if ((subPage as string) === "delete-account") {
    return (
      <PageContainer flex center className="px-7">
        <div
          className="w-full rounded-2xl p-5 shadow-xl"
          style={{ background: "var(--app-card)", border: "1px solid var(--app-line-soft)" }}
        >
          <div className="text-center">
            <span className="text-[36px]">⚠️</span>
            <H3 className="mt-2">정말 탈퇴하시겠어요?</H3>
            <Meta className="mt-2 block leading-relaxed">
              탈퇴하면 모든 추억, 사진, 기념일 데이터가<br/><strong>영구 삭제</strong>되며 복구할 수 없어요.
            </Meta>
          </div>
          <div
            className="mt-3 p-3 rounded-lg text-[12px] leading-relaxed"
            style={{ background: "rgb(var(--color-couple-status-red) / 0.08)", color: "rgb(var(--color-couple-status-red))" }}
          >
            ⚠️ 커플 연결도 자동으로 끊어지고, 파트너에게 알림이 전송돼요.
          </div>
          <input
            type="text"
            placeholder={'"탈퇴합니다" 입력'}
            value={disconnectText}
            onChange={(e) => setDisconnectText(e.target.value)}
            className="w-full mt-4 px-3 py-2.5 rounded-lg text-[14px] outline-none"
            style={{ background: "var(--app-card)", border: "1px solid var(--app-line)", color: "var(--app-ink)" }}
          />
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => { setSubPage(null); setDisconnectText(""); }}
              className="flex-1 py-2.5 rounded-full glass-pill text-[14px] font-medium"
              style={{ color: "var(--app-ink-2)" }}
            >
              취소
            </button>
            <button
              disabled={disconnectText !== "탈퇴합니다"}
              onClick={async () => {
                try {
                  const { deleteAccount } = await import("@/services/account");
                  if (user) await deleteAccount(user.uid, coupleId);
                  navigate("/");
                } catch {
                  toast.error({ message: "탈퇴에 실패했어요" });
                }
              }}
              className="flex-1 py-2.5 rounded-full text-[14px] font-semibold disabled:opacity-40"
              style={{ background: "rgb(var(--color-couple-status-red))", color: "var(--app-ink-on-accent)" }}
            >
              탈퇴하기
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (subPage === "notifications") {
    return (
      <PageContainer withBottomNav>
        <PageHeader title="알림 설정" onBack={() => setSubPage(null)} />
        <div className="px-5 pt-3">
          {NOTIF_SETTINGS.map((setting) => (
            <AppSwitch
              key={setting.key}
              label={setting.title}
              description={setting.sub}
              checked={notifToggles[setting.key]}
              onChange={(v) => setNotifToggles((prev) => ({ ...prev, [setting.key]: v }))}
            />
          ))}
        </div>
      </PageContainer>
    );
  }

  if (subPage === "theme") {
    return (
      <PageContainer withBottomNav>
        <PageHeader title="테마" onBack={() => setSubPage(null)} />
        <div className="px-5 pt-4">
          <Tiny className="mb-2 block">모드</Tiny>
          <div className="flex gap-2 mb-6">
            {([
              { id: "light" as const, label: "라이트", preview: "#fff" },
              { id: "dark" as const, label: "다크", preview: "#1a1612" },
              { id: "system" as const, label: "시스템", preview: "linear-gradient(90deg, #fff 50%, #1a1612 50%)" },
            ]).map((m) => {
              const isActive = modePreference === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setModePreference(m.id)}
                  className="flex-1 p-3 rounded-xl text-center"
                  style={{
                    border: isActive
                      ? "2px solid rgb(var(--accent-070))"
                      : "1px solid var(--app-line-soft)",
                  }}
                >
                  <div
                    className="h-[50px] rounded-lg mb-2"
                    style={{ background: m.preview, border: "1px solid var(--app-line-soft)" }}
                  />
                  <span className={`text-[13px] ${isActive ? "font-semibold" : "font-medium"}`}>{m.label}</span>
                </button>
              );
            })}
          </div>

          <Tiny className="mb-2 block">액센트 컬러</Tiny>
          <div className="flex gap-2.5 flex-wrap mb-6">
            {ACCENT_COLORS.map((c) => {
              const isSelected = palette === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setPalette(c.id as typeof palette)}
                  className="w-11 h-11 rounded-full transition-all"
                  style={{
                    background: c.color,
                    border: isSelected
                      ? "3px solid var(--app-ink)"
                      : "1.6px solid var(--app-line-soft)",
                    boxShadow: isSelected ? "inset 0 0 0 3px var(--app-card)" : undefined,
                  }}
                />
              );
            })}
          </div>

          <Tiny className="mb-2 block">디자인 스타일</Tiny>
          <div className="flex gap-2">
            {([
              { id: "pocket" as const, title: "포켓", sub: "스티커북" },
              { id: "clean" as const, title: "깔끔", sub: "미니멀" },
              { id: "sketch" as const, title: "스케치", sub: "손글씨" },
            ]).map((f) => {
              const isActive = selectedFont === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFont(f.id)}
                  className="flex-1 p-3.5 rounded-xl"
                  style={{
                    border: isActive
                      ? "2px solid rgb(var(--accent-070))"
                      : "1px solid var(--app-line-soft)",
                  }}
                >
                  <span className="text-[17px] font-semibold block">{f.title}</span>
                  <Meta className="mt-0.5 block">{f.sub}</Meta>
                </button>
              );
            })}
          </div>
        </div>
      </PageContainer>
    );
  }

  // ── Main MY page ──
  return (
    <PageContainer withBottomNav>
      <PageTransition>
        <div className="px-5 pt-5">
          <H2>MY</H2>

          <div className="mt-4">
            <ProfileCard
              initial={user?.displayName?.[0] || "?"}
              name={user?.displayName || "이름 설정"}
              subtitle={`@${user?.email?.split("@")[0] || "user"} · ${user?.email?.split("@")[1] || ""}`}
              badge={coupleId ? "파트너와 D+482" : undefined}
              onClick={() => setSubPage("edit-profile")}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <StatCard value={places.length} label="추억" />
            <StatCard value={visitedRegions.size} label="시·도" />
            <StatCard value={totalPhotos} label="사진" />
          </div>

          <GlassList header="계정" className="mt-4">
            <ListRow emoji="👤" title="프로필 수정" onClick={() => setSubPage("edit-profile")} />
            <ListRow emoji="💕" title="우리 정보" onClick={() => setSubPage("couple-info")} />
            <ListRow emoji="💬" title="채팅" onClick={() => navigate("/chat")} />
            <ListRow emoji="📍" title="위치 공유" onClick={() => navigate("/location")} isLast />
          </GlassList>

          <GlassList header="기능" className="mt-3">
            <ListRow emoji="🏷️" title="스티커북" onClick={() => navigate("/stickers")} />
            <ListRow emoji="📖" title="여행기" onClick={() => navigate("/travelogue")} />
            <ListRow emoji="🔍" title="커플 탐색" onClick={() => navigate("/explore")} />
            <ListRow emoji="🖨️" title="굿즈 인쇄" onClick={() => navigate("/print")} />
            <ListRow emoji="📊" title="통계" onClick={() => navigate("/stats")} />
            <ListRow emoji="💸" title="데이트 비용" onClick={() => navigate("/expenses")} isLast />
          </GlassList>

          <GlassList header="설정" className="mt-3">
            <ListRow emoji="🔔" title="알림 설정" onClick={() => setSubPage("notifications")} />
            <ListRow emoji="🎨" title="테마" onClick={() => setSubPage("theme")} />
            <ListRow emoji="❓" title="도움말" onClick={() => navigate("/help")} />
            <ListRow emoji="↗" title="로그아웃" chevron={false} onClick={handleLogout} />
            <ListRow emoji="🗑️" title="회원 탈퇴" destructive chevron={false} isLast onClick={() => setSubPage("delete-account" as SubPage)} />
          </GlassList>
        </div>
      </PageTransition>
    </PageContainer>
  );
};

export default Profile;
