import { useState, useEffect } from "react";
import { NowPlaying } from "@/lib/channels";

const POLL_MS = 10000;

export function useNowPlaying(apiUrl: string) {
  const [data, setData] = useState<NowPlaying | null>(null);

  useEffect(() => {
    setData(null);
    if (!apiUrl) return;
    let cancelled = false;

    const fetchNowPlaying = async () => {
      try {
        const sep = apiUrl.includes("?") ? "&" : "?";
        const res = await fetch(`${apiUrl}${sep}_=${Date.now()}`, { cache: "no-store" });
        const json = await res.json();
        if (cancelled) return;
        // Some stations expose a flat now-playing payload — normalise it
        if (json && !json.now_playing && (json.title || json.artist)) {
          const art: string | undefined = json.artworkUrl;
          setData({
            now_playing: {
              song: {
                title: json.title,
                artist: json.artist,
                art: art?.startsWith("//") ? `https:${art}` : art,
              },
            },
          });
          return;
        }
        setData(json);
      } catch {
        // silently fail
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchNowPlaying();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [apiUrl]);

  return data;
}
