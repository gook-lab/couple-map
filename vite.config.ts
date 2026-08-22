import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteCommonjs()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-firebase": ["firebase/app", "firebase/auth", "firebase/firestore", "firebase/storage"],
          "vendor-maps": ["react-simple-maps", "d3-geo"],
          "vendor-motion": ["framer-motion"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 6173,
    // Kakao JS 키가 localhost:6173에만 등록돼 있어 다른 포트로 폴백하면
    // 지도/장소검색이 401로 막힌다. 포트 점유 시 조용히 옮기지 말고 실패시킨다.
    strictPort: true,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "unsafe-none",
    },
  },
});
