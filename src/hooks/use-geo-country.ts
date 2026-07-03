import { useEffect, useState } from "react";

const CACHE_KEY = "leonxm:geo-country";

type State = { status: "loading" | "ready" | "error"; country: string | null };

let cached: State | null = null;
let inflight: Promise<State> | null = null;
const listeners = new Set<(s: State) => void>();

function emit(s: State) {
  cached = s;
  listeners.forEach((l) => l(s));
}

async function fetchCountry(): Promise<State> {
  try {
    const stored = sessionStorage.getItem(CACHE_KEY);
    if (stored) return { status: "ready", country: stored };
  } catch {}
  try {
    const res = await fetch("https://ipwho.is/");
    const data = await res.json();
    const country: string | null = data?.country_code ?? null;
    if (country) {
      try {
        sessionStorage.setItem(CACHE_KEY, country);
      } catch {}
      return { status: "ready", country };
    }
    return { status: "error", country: null };
  } catch {
    return { status: "error", country: null };
  }
}

export function useGeoCountry(): State {
  const [state, setState] = useState<State>(() => cached ?? { status: "loading", country: null });

  useEffect(() => {
    listeners.add(setState);
    if (cached && cached.status !== "loading") {
      setState(cached);
    } else {
      if (!inflight) {
        inflight = fetchCountry().then((s) => {
          inflight = null;
          emit(s);
          return s;
        });
      }
    }
    return () => {
      listeners.delete(setState);
    };
  }, []);

  return state;
}

export function isChannelBlocked(
  allowed: string[] | undefined,
  country: string | null,
): boolean {
  if (!allowed || allowed.length === 0) return false;
  if (!country) return true; // unknown → block restricted channels
  return !allowed.includes(country.toUpperCase());
}
