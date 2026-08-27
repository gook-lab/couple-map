import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Body, Meta, Tiny } from "@/components/ui/typography";
import DatePicker from "@/components/ui/date-picker";
import AppTextarea from "@/components/ui/app-textarea";
import AppButton from "@/components/ui/app-button";
import Pill from "@/components/ui/pill";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import PhotoEditor from "@/pages/PhotoEditor";
import { savePlace } from "@/services/places";
import { uploadImageSources } from "@/services/upload";
import { useAuthStore } from "@/store/use-auth-store";
import toast from "@/lib/toast";

interface PlaceData {
  kakaoPlaceId: string;
  name: string;
  address: string;
  category: string;
  lat: number;
  lng: number;
}

const SUGGESTED_TAGS = ["#바다", "#데이트", "#맛집", "#카페", "#여행", "#주말"];

const PinForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const coupleId = useAuthStore((s) => s.state.coupleId);
  const { regionName, place } = (location.state || {}) as {
    regionId?: string;
    regionName?: string;
    place?: PlaceData;
  };

  const [diary, setDiary] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState(new Date());

  const addTag = (tag: string) => {
    const normalized = tag.startsWith("#") ? tag : `#${tag}`;
    if (!tags.includes(normalized)) {
      setTags([...tags, normalized]);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      addTag(tagInput.trim());
      setTagInput("");
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAddPhoto = () => {
    if (photos.length >= 9) {
      toast.error({ message: "사진은 최대 9장까지" });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 9 - photos.length;
    const newPhotos = Array.from(files).slice(0, remaining).map((f) => URL.createObjectURL(f));
    setPhotos([...photos, ...newPhotos]);
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!place || !coupleId) return;
    setSaving(true);

    try {
      const basePath = `places/${coupleId}`;
      const photoUrls = photos.length > 0 ? await uploadImageSources(photos, basePath) : [];

      await savePlace({
        coupleId,
        kakaoPlaceId: place.kakaoPlaceId,
        name: place.name,
        address: place.address,
        category: place.category || "기타",
        lat: place.lat,
        lng: place.lng,
        region: regionName || "",
        status: "visited",
        memo: diary,
        rating: 0,
        photos: photoUrls,
        visitedAt: [date],
        tags,
      });

      setSaving(false);
      toast.success({ message: "추억이 저장됐어요 ✨" });
      navigate("/travel", { replace: true });
    } catch {
      setSaving(false);
      toast.error({ message: "저장에 실패했어요" });
    }
  };

  if (!place) {
    return (
      <PageContainer flex center>
        <Meta>장소 정보가 없어요</Meta>
      </PageContainer>
    );
  }

  return (
    <PageContainer flex>
      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
      <PageHeader
        title="새 추억"
        right={<button className="text-[14px] font-bold" style={{ color: "var(--app-ink-3)" }}>임시저장</button>}
      />

      <div className="flex-1 overflow-y-auto px-5 pt-3 pb-28">
        {/* Location bar */}
        <div
          className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl"
          style={{ background: "rgb(var(--accent-010))", border: "1.6px solid rgb(var(--accent-070))" }}
        >
          <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "rgb(var(--accent-070))" }} />
          <Body className="font-bold flex-1">{place.name}</Body>
          <button onClick={() => navigate(-1)} className="text-[13px] font-bold" style={{ color: "rgb(var(--accent-070))" }}>
            변경
          </button>
        </div>

        {/* Date */}
        <div className="mt-4">
          <DatePicker label="언제" value={date} onChange={setDate} />
        </div>

        {/* Photos */}
        <div className="mt-4">
          <Tiny className="mb-1.5 block">사진</Tiny>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={handleAddPhoto}
              className="aspect-square rounded-xl flex items-center justify-center"
              style={{ border: "1.6px dashed var(--app-line)", color: "var(--app-ink-3)" }}
            >
              <Plus className="w-5 h-5" />
            </button>
            {photos.map((photo, i) => (
              <div
                key={photo}
                className="aspect-square rounded-xl relative overflow-hidden"
                style={{ background: "var(--app-line-soft)", border: "1.5px solid var(--app-line)" }}
              >
                <button onClick={() => setEditingIndex(i)} className="absolute inset-0">
                  {/^(blob:|data:|https?:)/.test(photo) ? (
                    <img src={photo} alt={`사진 ${i + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tiny>사진 {i + 1}</Tiny>
                    </div>
                  )}
                </button>
                <button
                  onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Diary */}
        <div className="mt-4">
          <AppTextarea
            label="일기"
            value={diary}
            onChange={setDiary}
            placeholder="이 장소에서의 추억을 적어보세요..."
            maxLength={500}
            showCount
          />
        </div>

        {/* Tags */}
        <div className="mt-3">
          <Tiny className="mb-1.5 block">태그</Tiny>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Pill key={tag} variant="primary" onClick={() => removeTag(tag)}>
                {tag} ×
              </Pill>
            ))}
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="+ 태그"
                className="w-20 px-2.5 py-1 rounded-full text-[12px] outline-none bg-transparent"
                style={{ border: "1.6px dashed var(--app-line)", color: "var(--app-ink-2)" }}
              />
            </div>
          </div>

          {/* Suggested tags */}
          <div className="mt-2.5">
            <Tiny className="mb-1 block">추천</Tiny>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).map((tag) => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  className="px-2.5 py-1 rounded-full text-[12px] opacity-70 hover:opacity-100 transition-opacity"
                  style={{ border: "1.5px solid var(--app-line-soft)", color: "var(--app-ink-2)" }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-4 pt-3 z-20" style={{ background: "var(--app-bg)" }}>
        <AppButton onClick={handleSave} loading={saving}>
          저장하기
        </AppButton>
      </div>

      {/* Saving overlay */}
      <AnimatePresence>
        {saving && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <div
              className="relative rounded-2xl px-7 py-5 w-[280px]"
              style={{ background: "var(--app-card)", border: "1.5px solid var(--app-line)", boxShadow: "var(--app-shadow)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 border-2 rounded-full animate-spin flex-shrink-0"
                  style={{ borderColor: "var(--app-line-soft)", borderTopColor: "rgb(var(--accent-070))" }}
                />
                <div>
                  <Body className="font-bold block">업로드 중</Body>
                  <Meta>사진 {photos.length}장 · 기다려주세요</Meta>
                </div>
              </div>
              <div className="h-1.5 rounded-full mt-4 overflow-hidden" style={{ background: "var(--app-line-soft)" }}>
                <motion.div
                  // width 대신 transform (레이아웃 재계산 회피, 시각 동일)
                  className="h-full w-full rounded-full"
                  style={{ background: "rgb(var(--accent-070))" }}
                  initial={{ x: "-90%" }}
                  animate={{ x: "-10%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </div>
              <Meta className="mt-2 block text-right">약 3초 남음</Meta>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo editor — 오버레이로 띄워 PinForm 입력 상태 보존 */}
      {editingIndex !== null && photos[editingIndex] && (
        <PhotoEditor
          photoUrl={photos[editingIndex]}
          onClose={() => setEditingIndex(null)}
          onApply={(edited) => {
            setPhotos((prev) => prev.map((p, j) => (j === editingIndex ? edited : p)));
            setEditingIndex(null);
          }}
        />
      )}
    </PageContainer>
  );
};

export default PinForm;
