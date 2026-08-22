import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { H3, Tiny } from "@/components/ui/typography";
import AppButton from "@/components/ui/app-button";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { useAuthStore } from "@/store/use-auth-store";
import { uploadImageSources } from "@/services/upload";
import { addVoiceMemo } from "@/services/voice-memos";
import toast from "@/lib/toast";

const VoiceMemo: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.state.user);
  const coupleId = useAuthStore((s) => s.state.coupleId);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [saving, setSaving] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [bars, setBars] = useState<number[]>(Array(32).fill(0.2));
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animRef = useRef<number | undefined>(undefined);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        ctx.close();
      };

      recorder.start();
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);

      const updateBars = () => {
        if (!analyserRef.current) return;
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        setBars(Array.from(data.slice(0, 32)).map((v) => Math.max(v / 255, 0.1)));
        animRef.current = requestAnimationFrame(updateBars);
      };
      updateBars();
    } catch {
      toast.error({ message: "마이크 권한이 필요해요" });
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
    clearInterval(timerRef.current);
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setBars(Array(32).fill(0.2));
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handleSave = async () => {
    if (!audioUrl) return;
    if (coupleId && user) {
      setSaving(true);
      try {
        const [url] = await uploadImageSources([audioUrl], `couples/${coupleId}/voice`);
        await addVoiceMemo({ coupleId, authorId: user.uid, audioUrl: url, durationSec: seconds });
      } catch {
        toast.error({ message: "저장에 실패했어요" });
        setSaving(false);
        return;
      }
      setSaving(false);
    }
    toast.success({ message: "음성 메모가 저장됐어요 🎤" });
    navigate(-1);
  };

  return (
    <PageContainer flex>
      <PageHeader title="음성 메모" />

      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
        {!audioUrl ? (
          <>
            <Tiny style={recording ? { color: "rgb(var(--accent-070))" } : undefined}>
              {recording ? "RECORDING" : "탭하여 녹음 시작"}
            </Tiny>
            <span className="text-[48px] font-bold font-mono" style={{ color: "var(--app-ink)" }}>{formatTime(seconds)}</span>

            {/* Waveform */}
            <div className="flex items-end gap-[3px] h-16">
              {bars.map((h, i) => (
                <motion.div
                  key={i}
                  className="w-[6px] rounded-full"
                  animate={{ height: `${h * 100}%` }}
                  transition={{ duration: 0.1 }}
                  style={{ background: i < (seconds % 32) + 1 && recording ? "rgb(var(--accent-070))" : "var(--app-line)" }}
                />
              ))}
            </div>

            {/* Record/Stop button */}
            <button
              onClick={recording ? stopRecording : startRecording}
              className="w-[84px] h-[84px] rounded-full flex items-center justify-center"
              style={{ background: "rgb(var(--accent-070))", border: "1.5px solid var(--app-line)", boxShadow: "var(--app-shadow)" }}
            >
              {recording ? (
                <div className="w-7 h-7 rounded-sm" style={{ background: "var(--app-ink-on-accent)" }} />
              ) : (
                <div className="w-5 h-5 rounded-full" style={{ background: "var(--app-ink-on-accent)" }} />
              )}
            </button>
            <Tiny>{recording ? "탭하여 정지" : "탭하여 녹음"}</Tiny>
          </>
        ) : (
          <>
            <span className="text-5xl">🎤</span>
            <H3>{formatTime(seconds)} 녹음 완료</H3>
            <audio src={audioUrl} controls className="w-full max-w-[300px]" />
            <div className="flex gap-3 w-full max-w-[300px]">
              <AppButton variant="secondary" onClick={() => { setAudioUrl(null); setSeconds(0); }}>다시 녹음</AppButton>
              <AppButton onClick={handleSave} loading={saving}>저장하기</AppButton>
            </div>
          </>
        )}
      </div>

      <div className="px-5 pb-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill">
          <MapPin className="w-3 h-3" style={{ color: "rgb(var(--accent-070))" }} />
          <Tiny>현재 위치에 저장</Tiny>
        </div>
      </div>
    </PageContainer>
  );
};

export default VoiceMemo;
