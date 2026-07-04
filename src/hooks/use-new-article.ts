import { useState, useEffect, useCallback } from "react";
import { sortedArticles } from "@/lib/articles";

const KEY = "leonxm:last-seen-article-id";

export function useNewArticleIndicator() {
  const [isUnseen, setIsUnseen] = useState(false);
  const latestArticleId = sortedArticles[0]?.id ?? "";

  useEffect(() => {
    if (!latestArticleId) return;
    try {
      const lastSeen = localStorage.getItem(KEY);
      setIsUnseen(lastSeen !== latestArticleId);
    } catch {
      setIsUnseen(true);
    }
  }, [latestArticleId]);

  const markSeen = useCallback(() => {
    if (!latestArticleId) return;
    try {
      localStorage.setItem(KEY, latestArticleId);
    } catch {}
    setIsUnseen(false);
  }, [latestArticleId]);

  return { isUnseen, markSeen };
}
