import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StationNewsItem {
  station: string;
  title: string;
  url: string;
  date: string | null;
}

export function useStationNews(station?: "ilikeradio" | "swarmradio", limit = 5) {
  const [items, setItems] = useState<StationNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ limit: String(limit) });
    if (station) params.set("station", station);

    const load = (showSpinner: boolean) => {
      if (showSpinner) setLoading(true);
      return supabase.functions
      .invoke(`station-news?${params.toString()}`, { method: "GET" })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setError(error.message);
        } else {
          setItems((data?.items ?? []) as StationNewsItem[]);
        }
      })
      .catch((e) => !cancelled && setError(String(e)))
      .finally(() => !cancelled && setLoading(false));
    };

    load(true);

    // Automatic refresh: every 5 minutes and whenever the tab regains focus.
    const interval = window.setInterval(() => load(false), 5 * 60 * 1000);
    const onFocus = () => load(false);
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [station, limit]);

  return { items, loading, error };
}
