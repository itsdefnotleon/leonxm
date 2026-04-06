import { useState, useEffect } from "react";
import { NowPlaying } from "@/lib/channels";

export function useNowPlaying(apiUrl: string) {
  const [data, setData] = useState<NowPlaying | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(apiUrl);
        const json = await res.json();
        setData(json);
      } catch {
        // silently fail
      }
    };

    fetchNowPlaying();
    interval = setInterval(fetchNowPlaying, 15000);

    return () => clearInterval(interval);
  }, [apiUrl]);

  return data;
}
