import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

const COUPLE_COLLECTIONS = ["memories", "anniversaries", "wishlists", "expenses", "stickers"];

interface ExportBundle {
  exportedAt: string;
  coupleId: string;
  collections: Record<string, unknown[]>;
}

/** 커플의 추억 데이터를 모아 JSON 번들로 반환한다. */
export async function buildCoupleExport(coupleId: string): Promise<ExportBundle> {
  const collections: Record<string, unknown[]> = {};
  for (const name of COUPLE_COLLECTIONS) {
    try {
      const snap = await getDocs(query(collection(db, name), where("coupleId", "==", coupleId)));
      collections[name] = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch {
      collections[name] = [];
    }
  }
  return {
    exportedAt: new Date().toISOString(),
    coupleId,
    collections,
  };
}

/** 번들을 JSON 파일로 즉시 다운로드한다. */
export function downloadExport(bundle: ExportBundle): void {
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `couple-backup-${bundle.exportedAt.slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
