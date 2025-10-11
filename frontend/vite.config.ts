import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // абсолютные пути, чтобы ассеты корректно грузились под nginx и в Telegram WebApp
  build: {
    outDir: "dist",
  },
});