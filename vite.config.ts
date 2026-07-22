import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { generateRss } from "./scripts/generate-rss.mjs";

function rssPlugin() {
  let running = false;
  const run = async () => {
    if (running) return;
    running = true;
    try {
      await generateRss();
    } catch (e) {
      console.warn("[rss] generation failed:", e);
    } finally {
      running = false;
    }
  };
  return {
    name: "leonxm-rss",
    buildStart() {
      return run();
    },
    configureServer(server) {
      run();
      server.watcher.add(path.resolve(__dirname, "src/lib/articles.ts"));
      server.watcher.on("change", (file) => {
        if (file.endsWith("src/lib/articles.ts") || file.endsWith("src\\lib\\articles.ts")) {
          run();
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), rssPlugin()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
