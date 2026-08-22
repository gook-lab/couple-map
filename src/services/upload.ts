import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadPhoto(
  file: File,
  path: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  onProgress?.(100);
  return getDownloadURL(snapshot.ref);
}

export async function uploadPhotos(
  files: File[],
  basePath: string,
  onProgress?: (current: number, total: number) => void
): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const url = await uploadPhoto(files[i], `${basePath}/${Date.now()}-${files[i].name}`);
    urls.push(url);
    onProgress?.(i + 1, files.length);
  }
  return urls;
}

export function generatePhotoPath(coupleId: string, memoryId?: string): string {
  const timestamp = Date.now();
  if (memoryId) return `couples/${coupleId}/memories/${memoryId}/${timestamp}`;
  return `couples/${coupleId}/photos/${timestamp}`;
}

/**
 * 미리보기 소스(blob: / data: URL)를 Firebase Storage에 업로드하고 영구 URL을 반환한다.
 * 이미 http(s) URL인 항목은 그대로 통과시킨다(재업로드 방지).
 */
export async function uploadImageSources(
  sources: string[],
  basePath: string,
  onProgress?: (current: number, total: number) => void
): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < sources.length; i++) {
    const src = sources[i];
    if (src.startsWith("http://") || src.startsWith("https://")) {
      urls.push(src);
      onProgress?.(i + 1, sources.length);
      continue;
    }
    const blob = await (await fetch(src)).blob();
    const ext = (blob.type.split("/")[1] || "jpg").split("+")[0];
    const storageRef = ref(storage, `${basePath}/${Date.now()}-${i}.${ext}`);
    const snapshot = await uploadBytes(storageRef, blob);
    urls.push(await getDownloadURL(snapshot.ref));
    onProgress?.(i + 1, sources.length);
  }
  return urls;
}
