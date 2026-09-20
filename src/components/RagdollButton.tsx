import { useCallback, useEffect, useRef, useState } from "react";
import ragdollSound from "@/assets/ragdoll-sound.mp3.asset.json";
import { MinecraftParticles } from "@/components/MinecraftParticles";

const FALL_MS = 2600;
const RESET_MS = 6000;

/** Local times (HH:MM) where the secret appears, for ~2 minutes each. */
const SCHEDULE = ["00:00", "04:20", "06:09", "11:11", "12:34", "13:37", "22:22"];
const WINDOW_MINUTES = 2;

const MIDNIGHT_TEXT = "WHY ARE YOU AWAKE";
const DEFAULT_TEXT = "i am Garry and i made a mod";

interface Window_ {
  /** Unique per calendar-day occurrence, e.g. "2026-09-20|13:37" */
  key: string;
  time: string;
}

function currentWindow(now = new Date()): Window_ | null {
  const day = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const minutesNow = now.getHours() * 60 + now.getMinutes();

  for (const time of SCHEDULE) {
    const [h, m] = time.split(":").map(Number);
    const start = h * 60 + m;
    for (const offset of [0, 1440]) {
      // handles the midnight window rolling over from the previous day
      const diff = minutesNow + offset - start;
      if (diff >= 0 && diff < WINDOW_MINUTES) {
        const keyDay = offset === 0 ? day : "prev";
        return { key: `${keyDay}|${time}`, time };
      }
    }
  }
  return null;
}

export function RagdollButton() {
  const [win, setWin] = useState<Window_ | null>(() => currentWindow());
  const [running, setRunning] = useState(false);
  const [particles, setParticles] = useState(false);
  const usedKeys = useRef<Set<string>>(new Set());
  const timeouts = useRef<number[]>([]);

  // Tick the local clock — hides/shows the secret without any visible countdown.
  useEffect(() => {
    const id = window.setInterval(() => {
      const next = currentWindow();
      setWin((prev) => (prev?.key === next?.key ? prev : next));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(
    () => () => {
      timeouts.current.forEach((t) => window.clearTimeout(t));
      timeouts.current = [];
    },
    []
  );

  const ragdoll = useCallback(() => {
    if (running || !win || usedKeys.current.has(win.key)) return;
    usedKeys.current.add(win.key);
    setRunning(true);

    const audio = new Audio(ragdollSound.url);
    audio.play().catch(() => {});

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        "header, main > *, main, footer > div, #root > div > *, [data-ragdoll]"
      )
    ).filter(
      (el, i, arr) =>
        !el.closest("[data-no-ragdoll]") &&
        !arr.some((other) => other !== el && other.contains(el))
    );

    const originals = targets.map((el) => ({
      el,
      transition: el.style.transition,
      transform: el.style.transform,
      opacity: el.style.opacity,
    }));

    targets.forEach((el) => {
      const rot = (Math.random() * 120 - 60).toFixed(1);
      const x = (Math.random() * 160 - 80).toFixed(0);
      const y = (window.innerHeight * (0.6 + Math.random() * 0.8)).toFixed(0);
      el.style.transition = `transform ${FALL_MS}ms cubic-bezier(0.55, 0, 0.85, 0.36), opacity ${FALL_MS}ms ease-in`;
      void el.offsetHeight;
      el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
      el.style.opacity = "0.15";
    });

    timeouts.current.push(
      window.setTimeout(() => {
        originals.forEach(({ el, transition, transform, opacity }) => {
          el.style.transition =
            "transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 500ms ease-out";
          el.style.transform = transform;
          el.style.opacity = opacity;
        });
      }, RESET_MS - 1200),
      window.setTimeout(() => {
        originals.forEach(({ el }) => {
          el.style.transition = "";
        });
        // tumble is fully finished — now the pixel death poof
        setParticles(true);
      }, RESET_MS)
    );
  }, [running, win]);

  const handleParticlesDone = useCallback(() => {
    setParticles(false);
    setRunning(false);
  }, []);

  if (!win) return particles ? <MinecraftParticles onDone={handleParticlesDone} /> : null;

  const used = usedKeys.current.has(win.key);

  return (
    <>
      {!used && (
        <button
          onClick={ragdoll}
          aria-label="Secret"
          title=""
          className="text-sm text-muted-foreground/40 hover:text-muted-foreground/80 transition-colors cursor-default"
        >
          {win.time === "00:00" ? MIDNIGHT_TEXT : DEFAULT_TEXT}
        </button>
      )}
      {particles && <MinecraftParticles onDone={handleParticlesDone} />}
    </>
  );
}
