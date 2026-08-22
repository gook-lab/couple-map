import React, { useState } from "react";
import { H2, Meta, Tiny } from "@/components/ui/typography";
import GlassList from "@/components/ui/glass-list";
import ListRow from "@/components/ui/list-row";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { useAuthStore } from "@/store/use-auth-store";
import { buildCoupleExport, downloadExport } from "@/services/data-export";
import toast from "@/lib/toast";

const Help: React.FC = () => {
  const coupleId = useAuthStore((s) => s.state.coupleId);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (exporting) return;
    if (!coupleId) {
      toast.error({ message: "파트너 연결 후 사용할 수 있어요" });
      return;
    }
    setExporting(true);
    try {
      const bundle = await buildCoupleExport(coupleId);
      downloadExport(bundle);
      toast.success({ message: "백업 파일을 내려받았어요 📦" });
    } catch {
      toast.error({ message: "내보내기에 실패했어요" });
    }
    setExporting(false);
  };

  const handleContact = () => {
    window.location.href = "mailto:support@couple.app?subject=둘%20사이%20문의";
  };

  return (
    <PageContainer withBottomNav>
      <PageHeader title="도움말" />

      <div className="px-5 pt-4">
        {/* App info */}
        <div className="glass-card p-5 text-center mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto text-2xl"
            style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)" }}
          >
            ♥
          </div>
          <H2 className="mt-3">둘 사이</H2>
          <Meta className="mt-1 block">v1.0.0</Meta>
          <Tiny className="mt-1 block">커플 여행 지도 앱</Tiny>
        </div>

        <GlassList header="자주 묻는 질문">
          <ListRow emoji="❓" title="추억은 어떻게 추가하나요?" detail="+ 버튼" chevron={false} />
          <ListRow emoji="❓" title="파트너는 어떻게 연결하나요?" detail="초대 코드" chevron={false} />
          <ListRow emoji="❓" title="테마는 어떻게 바꾸나요?" detail="MY → 테마" chevron={false} />
          <ListRow emoji="❓" title="데이터는 안전한가요?" detail="Firebase 암호화" isLast chevron={false} />
        </GlassList>

        <GlassList header="내 데이터" className="mt-3">
          <ListRow
            emoji="📦"
            title="추억 내보내기"
            detail={exporting ? "내보내는 중..." : "JSON 백업"}
            isLast
            onClick={handleExport}
          />
        </GlassList>

        <GlassList header="정보" className="mt-3">
          <ListRow emoji="📄" title="이용약관" />
          <ListRow emoji="🔒" title="개인정보처리방침" />
          <ListRow emoji="📦" title="오픈소스 라이센스" isLast />
        </GlassList>

        <GlassList header="문의" className="mt-3">
          <ListRow emoji="📧" title="이메일 문의" detail="support@couple.app" chevron={false} onClick={handleContact} />
          <ListRow emoji="💬" title="카카오톡 문의" isLast />
        </GlassList>

        <div className="mt-6 text-center">
          <Tiny className="block">© 2026 둘 사이. All rights reserved.</Tiny>
        </div>
      </div>
    </PageContainer>
  );
};

export default Help;
