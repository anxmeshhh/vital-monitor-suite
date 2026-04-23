import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Mock ESP32 /api/latest endpoint — generates realistic, time-varying vitals.
// Occasionally simulates alerts and falls so the dashboards have something to react to.
function mockApiPlugin(): Plugin {
  let tick = 0;
  return {
    name: "mock-vitalglove-api",
    configureServer(server) {
      server.middlewares.use("/api/latest", (_req, res) => {
        tick += 1;
        const t = tick / 10;

        // Base values with sine wobble
        let hr = Math.round(78 + Math.sin(t) * 8 + (Math.random() - 0.5) * 4);
        let spo2 = Math.round(97 + Math.sin(t / 3) * 1 + (Math.random() - 0.5) * 1);
        let temp = +(36.6 + Math.sin(t / 5) * 0.4 + (Math.random() - 0.5) * 0.2).toFixed(1);
        let gforce = +(1 + Math.abs(Math.sin(t / 2)) * 0.3 + (Math.random() - 0.5) * 0.2).toFixed(2);
        let fall = false;

        // Periodic anomalies (every ~40s a brief spike, every ~90s a fall)
        const cycle = tick % 90;
        if (cycle >= 35 && cycle <= 45) {
          hr = 135 + Math.round(Math.random() * 10); // tachycardia
        }
        if (cycle >= 55 && cycle <= 60) {
          spo2 = 89 + Math.round(Math.random() * 3); // hypoxia
        }
        if (cycle === 75) {
          fall = true;
          gforce = +(4 + Math.random() * 2).toFixed(2);
        }

        const alert =
          hr < 50 || hr > 120 ||
          spo2 < 94 ||
          temp < 15 || temp > 50 ||
          fall;

        // Risk score derived from vitals
        let risk = 10;
        if (hr > 120 || hr < 50) risk += 35;
        else if (hr > 100) risk += 15;
        if (spo2 < 94) risk += 30;
        if (spo2 < 90) risk += 15;
        if (temp > 38 || temp < 35) risk += 20;
        if (fall) risk += 50;
        if (gforce > 3) risk += 15;
        risk = Math.min(100, risk + Math.round((Math.random() - 0.5) * 5));

        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "no-store");
        res.end(
          JSON.stringify({
            timestamp: Date.now(),
            hr,
            spo2,
            temp,
            gforce,
            fall,
            alert,
            risk,
          }),
        );
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
  plugins: [react(), mockApiPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
