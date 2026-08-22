import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, MoreHorizontal, Heart, MessageCircle, Send, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { H2, H3, Body, Meta, Tiny } from "@/components/ui/typography";
import Pill from "@/components/ui/pill";
import PageContainer from "@/components/layout/PageContainer";
import { subscribePlaces } from "@/services/places";
import { useAuthStore } from "@/store/use-auth-store";
import { addComment } from "@/services/comments";
import { setReaction, removeReaction } from "@/services/reactions";
import type { Place } from "@/types/place";

const REACTIONS = ["❤️", "🥰", "😍", "🌊", "✨", "➕"];

interface Comment {
  id: string;
  author: string;
  initial: string;
  text: string;
  time: string;
}

const MemoryDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.state.user);
  const coupleId = useAuthStore((s) => s.state.coupleId);
  const [place, setPlace] = useState<Place | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (!coupleId) return;
    try {
      return subscribePlaces(coupleId, (places) => {
        const found = places.find((p) => p.id === id);
        if (found) setPlace(found);
      });
    } catch { /* */ }
  }, [id, coupleId]);

  const handleDoubleTap = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount((c) => c + 1);
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 1000);
    }
  };

  const handleLikeToggle = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    if (newLiked) {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 1000);
      if (id && user) { try { setReaction(id, user.uid, "❤️"); } catch { /* */ } }
    } else {
      if (id && user) { try { removeReaction(id, user.uid); } catch { /* */ } }
    }
  };

  const handleReaction = (emoji: string) => {
    setSelectedReaction(emoji);
    setShowReactions(false);
    if (id && user) { try { setReaction(id, user.uid, emoji); } catch { /* */ } }
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || !user) return;
    const text = commentText;
    setComments((prev) => [
      ...prev,
      { id: `c-${Date.now()}`, author: user.displayName || "나", initial: user.displayName?.[0] || "나", text, time: "방금" },
    ]);
    setCommentText("");
    if (id) {
      try { await addComment(id, { memoryId: id, authorId: user.uid, authorName: user.displayName || "나", text }); } catch { /* */ }
    }
  };

  if (!place) {
    return (
      <PageContainer flex center>
        <Meta>추억을 찾는 중...</Meta>
      </PageContainer>
    );
  }

  const formattedDate = place.visitedAt?.[0]
    ? new Date(place.visitedAt[0]).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    : "";

  const avatar = {
    background: "rgb(var(--accent-070))",
    color: "var(--app-ink-on-accent)",
    border: "1.5px solid var(--app-line)",
  } as React.CSSProperties;
  const floatBtn = {
    background: "var(--app-card)",
    border: "1.5px solid var(--app-line)",
  } as React.CSSProperties;

  return (
    <PageContainer withBottomNav>
      {/* Hero image */}
      <div
        className="relative h-[280px]"
        style={{ background: "var(--app-line-soft)", borderBottom: "1.5px solid var(--app-line)" }}
        onDoubleClick={handleDoubleTap}
      >
        {place.photos?.[0] ? (
          <img src={place.photos[0]} alt={place.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-30">📸</span>
          </div>
        )}

        {/* Heart burst animation */}
        <AnimatePresence>
          {showHeartBurst && (
            <>
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.95 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-[120px] drop-shadow-lg">❤️</span>
              </motion.div>
              {[
                { x: -20, y: -40, size: 16, delay: 0.1 },
                { x: -10, y: -70, size: 12, delay: 0.15 },
                { x: 30, y: -60, size: 18, delay: 0.2 },
                { x: 50, y: -90, size: 10, delay: 0.25 },
                { x: -40, y: -50, size: 8, delay: 0.3 },
              ].map((p, i) => (
                <motion.span
                  key={i}
                  className="absolute pointer-events-none"
                  style={{ left: "50%", top: "50%", fontSize: p.size }}
                  initial={{ x: 0, y: 0, opacity: 0.9 }}
                  animate={{ x: p.x, y: p.y, opacity: 0 }}
                  transition={{ duration: 0.8, delay: p.delay }}
                >
                  ❤️
                </motion.span>
              ))}
            </>
          )}
        </AnimatePresence>

        <button
          onClick={() => navigate(-1)}
          className="absolute top-14 left-4 flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] font-bold"
          style={floatBtn}
        >
          <ChevronLeft className="w-4 h-4" /> 뒤로
        </button>
        <button
          aria-label="더보기"
          className="absolute top-14 right-4 w-9 h-9 flex items-center justify-center rounded-full"
          style={floatBtn}
        >
          <MoreHorizontal className="w-4 h-4" style={{ color: "var(--app-ink-2)" }} />
        </button>

        <div className="absolute bottom-3 left-4 right-4">
          <div className="inline-block px-2 py-0.5 rounded-md" style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)" }}>
            <Tiny>{formattedDate} · {place.region}</Tiny>
          </div>
          <H2 className="mt-1" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)", color: "#ffffff" }}>{place.name}</H2>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-4">
        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold" style={avatar}>
            {user?.displayName?.[0] || "나"}
          </div>
          <span className="text-[13px] font-bold">{user?.displayName || "나"}</span>
          <Tiny>방금 전</Tiny>
        </div>

        {/* Diary */}
        {place.memo && <Body className="mt-4 leading-[1.7]">{place.memo}</Body>}

        {/* Tags */}
        {place.tags && place.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {place.tags.map((tag) => (
              <Pill key={tag} variant="secondary">{tag}</Pill>
            ))}
          </div>
        )}

        {/* Reaction display */}
        {selectedReaction && (
          <div className="mt-3 flex items-center gap-1.5">
            <span className="text-lg">{selectedReaction}</span>
            <Tiny>반응을 보냈어요</Tiny>
          </div>
        )}

        <div className="h-px my-4" style={{ background: "var(--app-line-soft)" }} />

        {/* Actions */}
        <div className="flex items-center gap-4 text-[14px]" style={{ color: "var(--app-ink-2)" }}>
          <motion.button
            onClick={handleLikeToggle}
            onContextMenu={(e) => { e.preventDefault(); setShowReactions(true); }}
            whileTap={{ scale: 1.3 }}
            className="flex items-center gap-1.5"
          >
            <Heart
              className="w-[18px] h-[18px]"
              fill={liked ? "rgb(var(--accent-070))" : "none"}
              style={liked ? { color: "rgb(var(--accent-070))" } : undefined}
            />
            <span className="font-bold" style={liked ? { color: "rgb(var(--accent-070))" } : undefined}>
              {likeCount}
            </span>
          </motion.button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5">
            <MessageCircle className="w-[18px] h-[18px]" />
            💬 {comments.length}
          </button>
          <div className="flex-1" />
          <Tiny>{liked ? "● 함께 보는 중" : "파트너 아직 못 봄"}</Tiny>
        </div>

        {/* Reaction picker */}
        <AnimatePresence>
          {showReactions && (
            <motion.div
              className="mt-3 flex items-center justify-around p-3 rounded-3xl glass-card"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
            >
              {REACTIONS.map((emoji) => (
                <motion.button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  whileHover={{ scale: 1.4 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-[24px] p-1"
                >
                  {emoji}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comments section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <H3 className="mb-3">댓글</H3>

                {comments.length === 0 && <Meta className="py-3 block">아직 댓글이 없어요</Meta>}

                {comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-2.5 mb-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0" style={avatar}>
                      {c.initial}
                    </div>
                    <div className="flex-1 rounded-xl px-3 py-2" style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)" }}>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold">{c.author}</span>
                        <Tiny>{c.time}</Tiny>
                      </div>
                      <Body className="text-[14px] mt-0.5">{c.text}</Body>
                    </div>
                  </div>
                ))}

                {/* Comment input */}
                <div className="flex items-center gap-2 pt-2 mt-2" style={{ borderTop: "1.5px solid var(--app-line-soft)" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0" style={avatar}>
                    {user?.displayName?.[0] || "나"}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSendComment(); }}
                      placeholder="댓글을 남겨보세요..."
                      className="flex-1 px-3.5 py-2 rounded-full text-[14px] outline-none"
                      style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)", color: "var(--app-ink)" }}
                    />
                    <button
                      aria-label="사진 답장"
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)" }}
                    >
                      <Camera className="w-4 h-4" style={{ color: "var(--app-ink-2)" }} />
                    </button>
                    <button
                      onClick={handleSendComment}
                      disabled={!commentText.trim()}
                      className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-40"
                      style={{ background: "rgb(var(--accent-070))", color: "var(--app-ink-on-accent)", border: "1.5px solid var(--app-line)" }}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageContainer>
  );
};

export default MemoryDetail;
