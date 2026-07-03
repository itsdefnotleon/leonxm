import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "leonxm:previous-path";
const CURRENT_KEY = "leonxm:current-path";

/**
 * Tracks route changes and stores the previous pathname in sessionStorage.
 * Mount once (inside a Router).
 */
export function usePreviousPathTracker() {
  const location = useLocation();
  const initialized = useRef(false);

  useEffect(() => {
    const prevCurrent = sessionStorage.getItem(CURRENT_KEY);
    if (initialized.current && prevCurrent && prevCurrent !== location.pathname) {
      sessionStorage.setItem(STORAGE_KEY, prevCurrent);
    }
    sessionStorage.setItem(CURRENT_KEY, location.pathname);
    initialized.current = true;
  }, [location.pathname]);
}

export function getPreviousPath(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEY);
}
