"use client";

import { NeuroNoise } from "@paper-design/shaders-react";

// Blur applied directly to the element — not backdrop-filter.
// backdrop-filter composites with the HDR display pipeline and causes banding.
// filter: blur() operates on the element before compositing — no banding.
// scale(1.06) hides the soft edge artifacts that gaussian blur creates at boundaries.
export default function ClientCanvas() {
  return (
    <NeuroNoise
      colorBack="#0a0a0a"
      colorMid="#431407"
      colorFront="#fb923c"
      brightness={0.028}
      contrast={0.1}
      speed={0.3}
      // Render at ~100×56 regardless of screen size/DPR.
      // The 28px CSS blur makes low resolution completely invisible,
      // but significantly cuts fragment shader work.
      minPixelRatio={1}
      maxPixelCount={100 * 56}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        filter: "blur(16px)",
        transform: "scale(1.4)",
        transformOrigin: "center",
      }}
    />
  );
}
