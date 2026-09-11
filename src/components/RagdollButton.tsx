import { useRef, useState } from "react";
import ragdollSound from "@/assets/ragdoll-sound.mp3.asset.json";

const FALL_MS = 2600;
const RESET_MS = 6000;

export function RagdollButton() {
  const [active, setActive] = useState(false);
  const timeouts = useRef<number[]>([]);

  const ragdoll = () => {
    if (active) return;
    setActive(true);

    const audio = new Audio(ragdollSound.url);
    audio.play().catch(() => {});

    // Grab the big visible chunks of the page and make them flop
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
      // force reflow so the transition kicks in
      void el.offsetHeight;
      el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
      el.style.opacity = "0.15";
    });

    timeouts.current.push(
      window.setTimeout(() => {
        originals.forEach(({ el, transition, transform, opacity }) => {
          el.style.transition = "transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 500ms ease-out";
          el.style.transform = transform;
          el.style.opacity = opacity;
        });
      }, RESET_MS - 1200),
      window.setTimeout(() => {
        originals.forEach(({ el }) => {
          el.style.transition = "";
        });
        setActive(false);
      }, RESET_MS)
    );
  };

  return (
    <button
      onClick={ragdoll}
      aria-label="Secret"
      title=""
      className="text-sm text-muted-foreground/40 hover:text-muted-foreground/80 transition-colors cursor-default"
    >
      i am Garry and i made a mod
    </button>
  );
}
