"use client";

import { useEffect } from "react";

// Keep in sync with Nav h-14 and globals.css scroll-padding-top
const NAV_H = 56;

// How long to lock after triggering a scroll (covers smooth-scroll flight time)
const LOCK_MS = 750;

/**
 * Mouse / fine-pointer scroll manager.
 *
 * Problem: CSS `scroll-snap-type: y mandatory` works beautifully with touch
 * because momentum swipes carry enough distance. A mouse scroll wheel fires
 * discrete events that don't reach the snap threshold, so the browser snaps
 * *back* — horrible UX.
 *
 * Solution: for pointer:fine devices (mouse, trackpad) —
 *   1. Disable CSS snap (which causes the snap-back)
 *   2. Intercept wheel events and fire one programmatic smooth-scroll to the
 *      next snap target per gesture
 *
 * Touch / coarse-pointer: no-op — CSS mandatory snap handles those natively.
 */
export default function ScrollManager() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const html = document.documentElement;

    // Hand snap control to JS — prevents CSS mandatory from snapping back
    html.style.scrollSnapType = "none";

    let locked = false;
    let cachedTargets: number[] = [];

    /**
     * Collect snap-point scroll-Y positions from all .snap-section elements.
     * Subtracts NAV_H so the target lands just below the fixed nav.
     */
    function refreshTargets() {
      cachedTargets = Array.from(document.querySelectorAll<HTMLElement>(".snap-section"))
        .map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY - NAV_H))
        .filter((y) => y >= 0)
        .sort((a, b) => a - b);
    }

    // Initial measure + re-measure on resize
    refreshTargets();
    window.addEventListener("resize", refreshTargets);

    function onWheel(e: WheelEvent) {
      // Normalise: Firefox deltaMode=1 (lines) → pixels
      const delta = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;

      // Ignore sub-threshold deltas — trackpad inertia coasting
      if (Math.abs(delta) < 20) return;

      if (locked) {
        // Block the browser's own scroll while our animation is in flight
        e.preventDefault();
        return;
      }

      const dir = delta > 0 ? 1 : -1;
      const cur = window.scrollY;
      const targets = cachedTargets;
      // Small hysteresis — don't re-snap to the point we're already on
      const PAD = 16;

      const next =
        dir > 0
          ? targets.find((t) => t > cur + PAD)
          : [...targets].reverse().find((t) => t < cur - PAD);

      if (next === undefined) return; // already at first / last stop

      e.preventDefault();
      locked = true;
      window.scrollTo({ top: next, behavior: "smooth" });
      setTimeout(() => {
        locked = false;
      }, LOCK_MS);
    }

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      html.style.scrollSnapType = "";
      window.removeEventListener("resize", refreshTargets);
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

  // Renders nothing — pure side-effect component
  return null;
}
