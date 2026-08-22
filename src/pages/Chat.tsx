import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Mic, Send } from "lucide-react";
import { Tiny } from "@/components/ui/typography";
import PageContainer from "@/components/layout/PageContainer";
import { useAuthStore } from "@/store/use-auth-store";
import { subscribeChat, sendMessage, type ChatMessage as ChatMsg } from "@/services/chat";

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.state.user);
  const coupleId = useAuthStore((s) => s.state.coupleId);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!coupleId) return;
    try {
      return subscribeChat(coupleId, setMessages);
    } catch { /* Firestore not configured */ }
  }, [coupleId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !coupleId || !user) return;
    const text = input;
    setInput("");
    setSending(true);
    try {
      await sendMessage(coupleId, user.uid, text);
    } catch { /* fallback: show locally */ }
    setSending(false);
  };

  const formatTime = (date: Date) => date.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" });

  const partnerAvatar = {
    background: "rgb(var(--accent-020))",
    color: "rgb(var(--accent-070))",
    border: "1.5px solid var(--app-line)",
  } as React.CSSProperties;

  return (
    <PageContainer flex>
      <header className="sticky top-0 z-10 glass-bar px-4 pt-3 pb-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} aria-label="뒤로 가기" className="p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" style={{ color: "var(--app-ink)" }} />
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold" style={partnerAvatar}>♥</div>
        <div className="flex-1">
          <span className="text-[15px] font-bold">파트너</span>
          <Tiny className="block" style={{ color: "rgb(var(--accent-070))" }}>● 온라인</Tiny>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4">
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-16">
            <div className="text-center">
              <span className="text-4xl">💬</span>
              <Tiny className="block mt-2">첫 메시지를 보내보세요</Tiny>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {messages.map((msg) => {
            const isMe = msg.authorId === user?.uid;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} gap-2`}>
                {!isMe && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-auto" style={partnerAvatar}>♥</div>
                )}
                <div className="relative max-w-[75%]">
                  {msg.photo && (
                    <div
                      className={`rounded-2xl overflow-hidden mb-1 ${isMe ? "rounded-br-sm" : "rounded-bl-sm"}`}
                      style={{ border: "1.5px solid var(--app-line)" }}
                    >
                      <div className="h-[120px] flex items-center justify-center" style={{ background: "var(--app-line-soft)" }}>
                        <Tiny>{msg.photo}</Tiny>
                      </div>
                    </div>
                  )}
                  {msg.text && (
                    <div
                      className={`px-3.5 py-2.5 text-[14px] leading-relaxed font-medium ${isMe ? "rounded-2xl rounded-br-sm" : "rounded-2xl rounded-bl-sm"}`}
                      style={
                        isMe
                          ? { background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)" }
                          : { background: "var(--app-card)", color: "var(--app-ink)", border: "1.5px solid var(--app-line)" }
                      }
                    >
                      {msg.text}
                    </div>
                  )}
                  {msg.reaction && (
                    <div
                      className="absolute -bottom-2.5 right-2 px-2 py-0.5 rounded-full text-[12px]"
                      style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)" }}
                    >
                      {msg.reaction}
                    </div>
                  )}
                  <Tiny className={`block mt-0.5 ${isMe ? "text-right" : ""}`}>{formatTime(msg.createdAt)}</Tiny>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 glass-bar px-3 py-2.5 flex items-center gap-2">
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)" }}
        >
          <Plus className="w-4 h-4" style={{ color: "var(--app-ink-2)" }} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          placeholder="메시지..."
          className="flex-1 px-3.5 py-2.5 rounded-full text-[14px] outline-none"
          style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)", color: "var(--app-ink)" }}
        />
        {input.trim() ? (
          <button
            onClick={handleSend}
            disabled={sending}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50"
            style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)" }}
          >
            <Send className="w-4 h-4" />
          </button>
        ) : (
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgb(var(--accent-010))", border: "1.5px solid var(--app-line)" }}
          >
            <Mic className="w-4 h-4" style={{ color: "rgb(var(--accent-070))" }} />
          </button>
        )}
      </div>
    </PageContainer>
  );
};

export default Chat;
