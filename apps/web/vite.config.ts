import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://localhost:18444",
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
