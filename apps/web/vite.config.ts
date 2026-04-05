import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router-dom")
          ) {
            return "react-vendor";
          }
          if (id.includes("node_modules/@tanstack/react-query")) {
            return "query";
          }
          if (
            id.includes("node_modules/react-hook-form") ||
            id.includes("node_modules/@hookform/resolvers") ||
            id.includes("node_modules/zod")
          ) {
            return "form";
          }
          if (id.includes("node_modules/@supabase/supabase-js")) {
            return "supabase";
          }
          if (id.includes("node_modules/recharts")) {
            return "charts";
          }
          return undefined;
        },
      },
    },
  },
});
