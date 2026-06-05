import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Every request to /api/... gets forwarded to mobigate-app.mobi
      // The browser only sees localhost:8080 — no CORS at all
      '/api': {
        target: 'https://mobigate-app.mobi',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));