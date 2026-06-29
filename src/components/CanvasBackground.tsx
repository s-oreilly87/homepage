"use client";

import { useEffect, useRef } from "react";

function hash(n: number): number {
  n = Math.sin(n) * 43758.5453123;
  return n - Math.floor(n);
}

function smoothstep(a: number, b: number, t: number): number {
  t = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function noise2d(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  const a = hash(ix + iy * 57);
  const b = hash(ix + 1 + iy * 57);
  const c = hash(ix + (iy + 1) * 57);
  const d = hash(ix + 1 + (iy + 1) * 57);

  const ux = smoothstep(0, 1, fx);
  const uy = smoothstep(0, 1, fy);

  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

const CELL = 48;

export default function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const startTime = performance.now();
    let lastDrawTime = 0;
    // cols/rows cached and only updated on resize
    let cols = 0;
    let rows = 0;

    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.ceil(canvas.width  / CELL) + 1;
      rows = Math.ceil(canvas.height / CELL) + 1;
    }

    resize();
    window.addEventListener("resize", resize);

    function draw(now: number) {
      rafRef.current = requestAnimationFrame(draw);

      // Throttle to ~30 fps — the animation moves at t*0.00008 so 30fps is
      // visually indistinguishable from 60fps but halves the main-thread load.
      if (now - lastDrawTime < 33) return;
      lastDrawTime = now;

      if (!canvas || !ctx) return;
      const t = (now - startTime) * 0.00008;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Single batched path: one beginPath + all arcs + one fill.
      // The original code called fill() ~250 times per frame (one per visible
      // dot), each requiring a separate canvas rasterise pass on the main
      // thread. Batching collapses that to a single rasterise call.
      ctx.fillStyle = "rgba(251, 146, 60, 0.08)";
      ctx.beginPath();

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const n = noise2d(x * 0.25 + t, y * 0.25 + t * 0.7);
          if (n < 0.38) continue;

          const cx = x * CELL + noise2d(x * 0.5 + t * 1.3, y * 0.3) * 12;
          const cy = y * CELL + noise2d(x * 0.3, y * 0.5 + t) * 12;

          // moveTo before each arc is required so each circle is a separate
          // sub-path (otherwise arcs are connected by straight lines).
          ctx.moveTo(cx + 1, cy);
          ctx.arc(cx, cy, 1, 0, Math.PI * 2);
        }
      }

      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 size-full"
    />
  );
}
