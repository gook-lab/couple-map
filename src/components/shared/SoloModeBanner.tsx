import React from "react";
import { useNavigate } from "react-router-dom";
import { Body, Meta } from "@/components/ui/typography";

const SoloModeBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-2xl p-4 flex items-start gap-3"
      style={{ background: "rgb(var(--accent-010))", border: "1.6px solid rgb(var(--accent-070))", boxShadow: "var(--app-shadow)" }}
    >
      <span className="text-[36px]">👋</span>
      <div className="flex-1">
        <Body className="font-bold block">혼자 둘러보는 중</Body>
        <Meta className="mt-0.5 block">파트너와 연결하면 더 즐거워요</Meta>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => navigate("/onboarding")}
            className="px-3.5 py-1.5 rounded-full text-[13px] font-bold"
            style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)", color: "var(--app-ink-2)" }}
          >
            코드 입력
          </button>
          <button
            onClick={() => navigate("/onboarding")}
            className="px-3.5 py-1.5 rounded-full text-[13px] font-bold"
            style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)" }}
          >
            초대하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SoloModeBanner;
