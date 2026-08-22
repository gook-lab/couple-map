import React from "react";
import { useNavigate } from "react-router-dom";
import { H2, H3, Meta, Tiny } from "@/components/ui/typography";

export const StorageFullModal: React.FC<{ onCleanup?: () => void; onClose: () => void }> = ({ onCleanup, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-7">
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
    <div className="relative w-full max-w-sm rounded-2xl border p-5 shadow-xl" style={{ background: "var(--app-card)" }}>
      <div className="text-center">
        <span className="text-[36px]">💾</span>
        <H3 className="mt-2">저장 공간이 가득 차요</H3>
        <Meta className="mt-1.5 block">무료 1GB 중 987MB 사용 중이에요</Meta>
      </div>
      <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: "var(--app-line-soft)" }}>
        <div className="h-full rounded-full" style={{ width: "98.7%", background: "rgb(var(--accent-070))" }} />
      </div>
      <Meta className="mt-2 block text-center">오래된 사진을 정리하거나 프리미엄으로 업그레이드해보세요</Meta>
      <div className="flex gap-2 mt-4">
        <button onClick={onCleanup || onClose} className="flex-1 py-2.5 rounded-full glass-pill text-[14px] font-medium">정리하기</button>
        <button onClick={onClose} className="flex-1 py-2.5 rounded-full text-[14px] font-semibold text-white" style={{ background: "rgb(var(--accent-070))" }}>프리미엄 ⭐</button>
      </div>
    </div>
  </div>
);

export const UploadFailCard: React.FC<{ onRetry?: () => void; onSaveAsIs?: () => void }> = ({ onRetry, onSaveAsIs }) => (
  <div className="rounded-2xl border p-4" style={{ background: "var(--app-card)", borderColor: "rgb(var(--accent-070))" }}>
    <div className="flex items-center gap-2 mb-2">
      <span>⚠️</span>
      <span className="text-[15px] font-semibold text-couple-gray-090">업로드 실패</span>
    </div>
    <Meta className="block">사진 1장이 업로드되지 않았어요. 네트워크가 끊겼을 수 있어요.</Meta>
    <div className="flex gap-2 mt-3">
      <button onClick={onSaveAsIs} className="flex-1 py-2 rounded-full glass-pill text-[13px] font-medium">이대로 저장</button>
      <button onClick={onRetry} className="flex-1 py-2 rounded-full text-[13px] font-semibold text-white" style={{ background: "rgb(var(--accent-070))" }}>다시 시도</button>
    </div>
  </div>
);

export const PartnerOfflineCard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl border p-4" style={{ background: "var(--app-card)" }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-couple-gray-040" />
        <span className="text-[15px] font-semibold text-couple-gray-090">파트너 위치를 알 수 없어요</span>
      </div>
      <Meta className="block">마지막 위치는 3시간 전 강남역 근처예요. 위치 공유를 잠시 끈 것 같아요.</Meta>
      <div className="flex gap-2 mt-3">
        <button className="flex-1 py-2 rounded-full glass-pill text-[13px] font-medium">마지막 위치 보기</button>
        <button onClick={() => navigate("/chat")} className="flex-1 py-2 rounded-full text-[13px] font-semibold text-white" style={{ background: "rgb(var(--accent-070))" }}>메시지 보내기</button>
      </div>
    </div>
  );
};

export const AppUpdateModal: React.FC<{ onUpdate?: () => void; onLater?: () => void }> = ({ onUpdate, onLater }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-7">
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative w-full max-w-sm rounded-2xl border p-5 shadow-xl" style={{ background: "var(--app-card)" }}>
      <div className="text-center">
        <span className="text-[60px]">✨</span>
        <H2 className="mt-2">업데이트가 있어요</H2>
      </div>
      <div className="mt-4 space-y-1.5">
        <Tiny className="block font-semibold">v2.4 신규 기능</Tiny>
        <Meta className="block">· 음성 메모</Meta>
        <Meta className="block">· 1년 추억 영상</Meta>
        <Meta className="block">· 다크 모드</Meta>
      </div>
      <button onClick={onUpdate} className="w-full mt-5 py-3 rounded-full text-[15px] font-semibold text-white" style={{ background: "rgb(var(--accent-070))" }}>지금 업데이트</button>
      <button onClick={onLater} className="w-full mt-2 py-2 text-[13px] text-couple-gray-050 text-center">나중에</button>
    </div>
  </div>
);

export const MaintenanceScreen: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-7" style={{ background: "var(--app-bg)" }}>
    <span className="text-[64px]">🛠</span>
    <H2 className="mt-4">잠시 점검 중이에요</H2>
    <Meta className="mt-2 text-center block">더 좋은 둘 사이를 위해 단장 중<br />잠시 후 다시 와주세요!</Meta>
    <div className="mt-6 rounded-2xl border p-4 text-center" style={{ background: "var(--app-card)" }}>
      <Tiny className="block">예상 종료</Tiny>
      <span className="text-[18px] font-bold text-couple-gray-090 block mt-1">오늘 저녁 10시</span>
      <Meta className="mt-1 block">약 1시간 47분 남았어요</Meta>
    </div>
    <button className="mt-5 px-6 py-2.5 rounded-full text-[14px] font-semibold text-white" style={{ background: "rgb(var(--accent-070))" }}>공지 보기</button>
  </div>
);

export const PhotoLimitModal: React.FC<{ onCancel?: () => void; onSave?: () => void }> = ({ onCancel, onSave }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-7">
    <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
    <div className="relative w-full max-w-sm rounded-2xl border p-5 shadow-xl" style={{ background: "var(--app-card)" }}>
      <div className="text-center">
        <span className="text-[32px]">📷</span>
        <H3 className="mt-2">사진은 최대 9장까지</H3>
        <Meta className="mt-1.5 block leading-relaxed">10번째 사진은 추가할 수 없어요. 다른 사진을 빼거나 새 추억으로 나눠주세요.</Meta>
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-full glass-pill text-[14px] font-medium">취소</button>
        <button onClick={onSave} className="flex-1 py-2.5 rounded-full text-[14px] font-semibold text-white" style={{ background: "rgb(var(--accent-070))" }}>9장만 저장</button>
      </div>
    </div>
  </div>
);
