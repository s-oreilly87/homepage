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
      colorMid="#0c1100"
      colorFront="#c8f542"
      brightness={0.028}
      contrast={0.35}
      speed={0.3}
      // Render at ~160×90 regardless of screen size/DPR.
      // The 28px CSS blur makes sub-200px resolution completely invisible,
      // but cuts fragment shader work by ~576× vs the default 4K cap.
      minPixelRatio={1}
      maxPixelCount={160 * 90}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        filter: "blur(28px)",
        transform: "scale(1.06)",
        transformOrigin: "center",
      }}
    />
  );
}
