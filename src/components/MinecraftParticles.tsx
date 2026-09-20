import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  shade: number;
}

interface Props {
  /** Called once the burst has fully faded out. */
  onDone?: () => void;
  /** Origin in viewport pixels. Defaults to the centre of the screen. */
  originX?: number;
  originY?: number;
}

const GRAVITY = 900; // px/s^2
const DRAG = 0.86;

/**
 * Minecraft-style death "poof": chunky pixel squares that burst upward and
 * outward from a single point, slow down, fall, and fade away.
 */
export function MinecraftParticles({ onDone, originX, originY }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    const ox = originX ?? w / 2;
    const oy = originY ?? h / 2;

    const particles: Particle[] = [];
    const makeParticle = (delay: number): Particle => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5; // mostly upward
      const speed = 120 + Math.random() * 520;
      const size = [3, 4, 6, 8, 10, 14][Math.floor(Math.random() * 6)];
      const maxLife = 0.9 + Math.random() * 1.4;
      return {
        x: ox + (Math.random() - 0.5) * 40,
        y: oy + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed * (0.5 + Math.random()),
        vy: Math.sin(angle) * speed,
        size,
        life: -delay,
        maxLife,
        shade: 200 + Math.floor(Math.random() * 56),
      };
    };

    for (let i = 0; i < 90; i++) particles.push(makeParticle(Math.random() * 0.35));

    let raf = 0;
    let last = performance.now();

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      onDone?.();
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, w, h);

      let alive = 0;
      for (const p of particles) {
        p.life += dt;
        if (p.life < 0) {
          alive++;
          continue;
        }
        if (p.life > p.maxLife) continue;
        alive++;

        p.vx *= Math.pow(DRAG, dt * 60 * 0.02 + 1) ** 0.02;
        p.vx *= 1 - 0.9 * dt;
        p.vy += GRAVITY * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const t = p.life / p.maxLife;
        const alpha = t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle = `rgb(${p.shade}, ${p.shade}, ${p.shade})`;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      }
      ctx.globalAlpha = 1;

      if (alive === 0) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    const safety = window.setTimeout(finish, 4000);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
    };
  }, [onDone, originX, originY]);

  return (
    <canvas
      ref={canvasRef}
      data-no-ragdoll
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
    />
  );
}
