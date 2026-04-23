import { useEffect, useRef, useState } from "react";
import type { VitalsReading } from "@/types/vitals";

interface UseVitalsResult {
  latest: VitalsReading | null;
  history: VitalsReading[];
  connected: boolean;
  lastUpdated: number | null;
}

const HISTORY_LIMIT = 60;

/**
 * Polls /api/latest every `intervalMs` and keeps a rolling history.
 * Sets connected=false if no successful response in the last 3s.
 */
export function useVitals(intervalMs = 1000): UseVitalsResult {
  const [latest, setLatest] = useState<VitalsReading | null>(null);
  const [history, setHistory] = useState<VitalsReading[]>([]);
  const [connected, setConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const lastOkRef = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const res = await fetch("/api/latest", { cache: "no-store" });
        if (!res.ok) throw new Error("bad status");
        const data = (await res.json()) as VitalsReading;
        if (cancelled) return;
        lastOkRef.current = Date.now();
        setLatest(data);
        setLastUpdated(Date.now());
        setHistory((prev) => {
          const next = [...prev, data];
          return next.length > HISTORY_LIMIT ? next.slice(-HISTORY_LIMIT) : next;
        });
      } catch {
        // ignore — connection state handled by interval below
      } finally {
        if (!cancelled) timer = setTimeout(poll, intervalMs);
      }
    };

    poll();
    const conn = setInterval(() => {
      setConnected(Date.now() - lastOkRef.current < 3000);
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearInterval(conn);
    };
  }, [intervalMs]);

  return { latest, history, connected, lastUpdated };
}
