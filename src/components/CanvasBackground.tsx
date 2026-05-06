"use client";

import { useEffect, useRef } from "react";

// Lightweight pseudo-random noise background.
// Draws slowly drifting dim dots — reads as texture, not spectacle.

function hash(n: number): number {
  // Simple integer hash
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

export default function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let startTime = performance.now();

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    function draw(now: number) {
      if (!canvas || !ctx) return;
      const t = (now - startTime) * 0.00008; // very slow drift

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw a grid of noise-modulated subtle circles
      const cellSize = 48;
      const cols = Math.ceil(canvas.width / cellSize) + 1;
      const rows = Math.ceil(canvas.height / cellSize) + 1;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const n = noise2d(x * 0.25 + t, y * 0.25 + t * 0.7);
          if (n < 0.38) continue; // sparse — only draw some

          const cx = x * cellSize + noise2d(x * 0.5 + t * 1.3, y * 0.3) * 12;
          const cy = y * cellSize + noise2d(x * 0.3, y * 0.5 + t) * 12;
          const alpha = (n - 0.38) * 0.18; // max ~0.11

          ctx.beginPath();
          ctx.arc(cx, cy, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(251, 146, 60, ${alpha})`; // accent tint
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
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
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 1,
      }}
    />
  );
}
