import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { H1, H2, Body, Meta, Tiny } from "@/components/ui/typography";
import AppInput from "@/components/ui/app-input";
import PageContainer from "@/components/layout/PageContainer";
import { useAuthStore } from "@/store/use-auth-store";
import toast from "@/lib/toast";

type Phase = "splash" | "welcome" | "login";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuthStore((s) => s.state);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);

  const [phase, setPhase] = useState<Phase>("splash");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/onboarding", { replace: true });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) return;
    const timer = setTimeout(() => setPhase("welcome"), 1800);
    return () => clearTimeout(timer);
  }, [authLoading, isAuthenticated]);

  if (authLoading) {
    return (
      <PageContainer flex center>
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "rgb(var(--accent-070))", borderTopColor: "transparent" }}
        />
      </PageContainer>
    );
  }

  if (isAuthenticated) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      toast.success({ message: "로그인 성공!" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "오류가 발생했어요";
      let errorMsg = msg;
      if (msg.includes("user-not-found") || msg.includes("invalid-credential")) errorMsg = "이메일 또는 비밀번호가 맞지 않아요";
      else if (msg.includes("email-already-in-use")) errorMsg = "이미 가입된 이메일이에요";
      else if (msg.includes("weak-password")) errorMsg = "비밀번호는 6자 이상이어야 해요";
      else if (msg.includes("invalid-email")) errorMsg = "올바른 이메일을 입력해주세요";
      toast.error({ message: errorMsg });
    }
    setSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (!msg.includes("popup-closed") && !msg.includes("cancelled") && !msg.includes("Opener-Policy")) {
        toast.error({ message: "구글 로그인에 실패했어요" });
      }
    }
    setSubmitting(false);
  };

  return (
    <PageContainer flex>
      <AnimatePresence mode="wait">
        {/* ── OB_01: Splash ── */}
        {phase === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center gap-3.5"
          >
            <motion.div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgb(var(--accent-070))", border: "1.5px solid var(--app-line)" }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
            >
              <Heart className="w-9 h-9" style={{ color: "var(--app-ink-on-accent)" }} fill="currentColor" />
            </motion.div>
            <H1>둘 사이</H1>
            <Meta>우리의 지도와 추억</Meta>
            <motion.div
              className="flex gap-1.5 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ background: "rgb(var(--accent-070))" }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ── OB_02: Welcome ── */}
        {phase === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col px-7 pt-20 pb-10"
          >
            <Tiny className="uppercase tracking-wider">Welcome</Tiny>
            <H1 className="mt-3 text-[30px] leading-tight">
              둘만의 지도를
              <br />
              <span style={{ color: "rgb(var(--accent-070))" }}>그려볼까요</span>
            </H1>
            <Body className="mt-4 leading-relaxed" style={{ color: "var(--app-ink-2)" }}>
              함께 다녀온 곳, 가고 싶은 곳,
              <br />
              기억하고 싶은 순간들을
              <br />
              지도 위에 색칠해보세요.
            </Body>

            <div className="flex-1" />

            <button
              onClick={() => setPhase("login")}
              className="w-full py-3.5 rounded-full text-[16px] font-bold"
              style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)", boxShadow: "var(--app-shadow)" }}
            >
              시작하기
            </button>
            <button
              onClick={() => setPhase("login")}
              className="w-full py-3 mt-2 text-[13px]"
              style={{ color: "var(--app-ink-2)" }}
            >
              이미 계정이 있어요 · <span className="font-bold" style={{ color: "rgb(var(--accent-070))" }}>로그인</span>
            </button>
          </motion.div>
        )}

        {/* ── OB_03: Login Selection ── */}
        {phase === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col px-7 pt-20 pb-10"
          >
            <H2>간편하게 로그인</H2>
            <Meta className="mt-1">한 번만 인증하면 돼요</Meta>

            <div className="flex flex-col gap-2.5 mt-8">
              {/* Google */}
              <button
                onClick={handleGoogleLogin}
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl flex items-center gap-3 text-[16px] font-bold disabled:opacity-50 transition-opacity"
                style={{ background: "var(--app-card)", color: "var(--app-ink)", border: "1.5px solid var(--app-line)" }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" className="flex-shrink-0">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Google로 계속하기
              </button>

              {/* Email/Password toggle */}
              <button
                onClick={() => setShowEmailForm(!showEmailForm)}
                className="w-full py-3.5 px-4 rounded-xl flex items-center gap-3 text-[16px] font-bold"
                style={{ border: "1.6px dashed var(--app-line)", color: "var(--app-ink-2)" }}
              >
                <span className="w-[18px] h-[18px] flex items-center justify-center text-[14px] opacity-80">✉️</span>
                이메일로 계속하기
              </button>
            </div>

            {/* Email form (expandable) */}
            <AnimatePresence>
              {showEmailForm && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                  onSubmit={handleEmailSubmit}
                >
                  <div className="pt-4 space-y-3">
                    <AppInput type="email" value={email} onChange={setEmail} placeholder="이메일" clearable />
                    <AppInput type="password" value={password} onChange={setPassword} placeholder="비밀번호 (6자 이상)" />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 rounded-full text-[15px] font-bold disabled:opacity-50"
                      style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)" }}
                    >
                      {submitting ? "잠시만..." : isRegister ? "회원가입" : "로그인"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsRegister(!isRegister); }}
                      className="w-full text-center text-[13px] py-1"
                      style={{ color: "var(--app-ink-2)" }}
                    >
                      {isRegister ? "이미 계정이 있어요 → 로그인" : "계정이 없어요 → 회원가입"}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="flex-1" />

            <Tiny className="text-center block">
              계속하면 이용약관 · 개인정보처리방침에 동의
            </Tiny>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default Login;
