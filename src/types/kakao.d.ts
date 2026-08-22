import type { KakaoPlace } from "./place";

declare global {
  interface Window {
    kakao: {
      maps: {
        services: {
          Places: new () => {
            keywordSearch: (
              keyword: string,
              callback: (data: KakaoPlace[], status: string) => void,
              options?: { location?: unknown; radius?: number }
            ) => void;
          };
          Status: {
            OK: string;
            ZERO_RESULT: string;
            ERROR: string;
          };
        };
      };
    };
  }
}

export {};
