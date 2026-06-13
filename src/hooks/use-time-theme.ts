import { useEffect, useState } from "react";

export type TimeTheme = "dawn" | "day" | "dusk" | "night";

export function getTimeTheme(date = new Date()): TimeTheme {
  const h = date.getHours();
  if (h >= 5 && h < 9) return "dawn";
  if (h >= 9 && h < 17) return "day";
  if (h >= 17 && h < 21) return "dusk";
  return "night";
}

export const themeLabels: Record<TimeTheme, string> = {
  dawn: "Dawn",
  day: "Daylight",
  dusk: "Dusk",
  night: "Midnight",
};

export function useTimeTheme(): TimeTheme {
  const [theme, setTheme] = useState<TimeTheme>(() => getTimeTheme());

  useEffect(() => {
    const apply = () => {
      const t = getTimeTheme();
      setTheme(t);
      document.documentElement.dataset.timeTheme = t;
    };
    apply();
    const id = window.setInterval(apply, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return theme;
}
