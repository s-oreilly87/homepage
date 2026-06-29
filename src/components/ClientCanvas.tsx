"use client";

import { NeuroNoise } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

const RADIAL_MASK =
  "radial-gradient(circle at center, black var(--bg-radial-percent), transparent calc(var(--bg-radial-percent) + 25%))";

/**
 * Animated shader backdrop, revealed on mount by expanding a radial mask
 * (--bg-radial-percent) from the centre outward.
 *
 * The shader's blur is applied as `filter: blur()` on the element itself rather
 * than `backdrop-filter`: a backdrop filter composites against the HDR display
 * pipeline and visibly bands on the near-black background, whereas an element
 * filter runs before compositing and stays clean. `scale(1.3)` overscans the
 * canvas so the blur's soft edges fall outside the viewport.
 */
export default function ClientCanvas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerStyle = {
    opacity: mounted ? 1 : 0,
    WebkitMaskImage: RADIAL_MASK,
    maskImage: RADIAL_MASK,
    "--bg-radial-percent": mounted ? "150%" : "0%",
    transition: "opacity 3s ease-in-out, --bg-radial-percent 3s ease-in-out",
    position: "fixed",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
  } as CSSProperties;

  return (
    <div style={containerStyle}>
      <NeuroNoise
        colorBack="#0a0a0a"
        colorMid="#431407"
        colorFront="#fb923c"
        brightness={0.1}
        contrast={0.2}
        speed={0.3}
        minPixelRatio={1}
        maxPixelCount={1920 * 1080}
        style={{
          width: "100%",
          height: "100%",
          filter: "blur(5px)",
          transform: "scale(1.3)",
          transformOrigin: "center",
        }}
      />
    </div>
  );
}
