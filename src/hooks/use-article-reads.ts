import { useCallback, useEffect, useState } from "react";
import { sortedArticles } from "@/lib/articles";

const KEY = "leonxm:read-article-ids";

function loadReads(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set(parsed.filter((v) => typeof v === "string"));
  } catch {}
  return new Set();
}

function saveReads(reads: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...reads]));
  } catch {}
}

const listeners = new Set<(r: Set<string>) => void>();
let current: Set<string> | null = null;

function getCurrent(): Set<string> {
  if (current === null) current = loadReads();
  return current;
}

function emit(next: Set<string>) {
  current = next;
  saveReads(next);
  listeners.forEach((l) => l(next));
}

export function useArticleReads() {
  const [reads, setReads] = useState<Set<string>>(() => getCurrent());

  useEffect(() => {
    listeners.add(setReads);
    setReads(getCurrent());
    return () => {
      listeners.delete(setReads);
    };
  }, []);

  const markRead = useCallback((id: string) => {
    const c = getCurrent();
    if (c.has(id)) return;
    const next = new Set(c);
    next.add(id);
    emit(next);
  }, []);

  const markAllRead = useCallback(() => {
    const next = new Set(sortedArticles.map((a) => a.id));
    emit(next);
  }, []);

  const isRead = useCallback((id: string) => reads.has(id), [reads]);
  const unreadCount = sortedArticles.filter((a) => !reads.has(a.id)).length;
  const hasUnread = unreadCount > 0;

  return { reads, isRead, markRead, markAllRead, hasUnread, unreadCount };
}
