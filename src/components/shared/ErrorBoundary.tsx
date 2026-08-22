import React from "react";
import * as Sentry from "@sentry/react";
import { H2, Meta } from "@/components/ui/typography";

function FallbackUI() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-7" style={{ background: "var(--app-bg)" }}>
      <span className="text-[64px]">😵</span>
      <H2 className="mt-4">문제가 발생했어요</H2>
      <Meta className="mt-2 text-center block">잠시 후 다시 시도해주세요</Meta>
      <button
        onClick={() => { window.location.href = "/today"; }}
        className="mt-5 px-6 py-2.5 rounded-full text-[15px] font-semibold text-white"
        style={{ background: "rgb(var(--accent-070))" }}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Sentry.ErrorBoundary fallback={<FallbackUI />} showDialog>
    {children}
  </Sentry.ErrorBoundary>
);

export default ErrorBoundary;
