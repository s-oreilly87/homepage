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
    // Disable CSS smooth scroll to avoid conflict with JS programmatic smooth scroll
    html.style.scrollBehavior = "auto";
    // Prevent Mac "bounce" jitter
    html.style.overscrollBehaviorY = "none";

    let locked = false;
    let cachedTargets: number[] = [];

    /**
     * Collect snap-point scroll-Y positions from all .snap-section elements.
     * Uses a stable offsetParent walk to ignore CSS transforms (like entry animations).
     * Subtracts NAV_H so the target lands just below the fixed nav.
     */
    function refreshTargets() {
      cachedTargets = Array.from(document.querySelectorAll<HTMLElement>(".snap-section"))
        .map((el) => {
          let top = 0;
          let curr: HTMLElement | null = el;
          while (curr) {
            top += curr.offsetTop;
            curr = curr.offsetParent as HTMLElement | null;
          }
          return Math.round(top - NAV_H);
        })
        .filter((y) => y >= 0)
        .sort((a, b) => a - b);
    }

    // Initial measure + re-measure on layout shifts (e.g. Projects section expansion)
    refreshTargets();
    window.addEventListener("resize", refreshTargets);
    const ro = new ResizeObserver(refreshTargets);
    ro.observe(document.body);

    function onWheel(e: WheelEvent) {
      // Normalise: Firefox deltaMode=1 (lines) → pixels
      const delta = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;

      // Ignore sub-threshold deltas — trackpad inertia coasting or micro-scrolls
      if (Math.abs(delta) < 40) return;

      if (locked) {
        // Block the browser's own scroll while our animation is in flight
        e.preventDefault();
        return;
      }

      const dir = delta > 0 ? 1 : -1;
      const cur = window.scrollY;
      const targets = cachedTargets;

      // Robust target selection: find the next target strictly ahead/behind 
      // our current position. Using a tiny 0.1px epsilon handles sub-pixel 
      // rounding without skipping the intended section.
      const EPS = 0.1;
      const next =
        dir > 0
          ? targets.find((t) => t > cur + EPS)
          : [...targets].reverse().find((t) => t < cur - EPS);

      if (next === undefined) return; // already at first / last stop

      e.preventDefault();
      locked = true;

      window.scrollTo({ top: next, behavior: "smooth" });

      // Unlock when scroll finishes (modern browsers) or fallback timeout
      let timeoutId: NodeJS.Timeout;

      const unlock = () => {
        // Cooldown: wait a bit after the scroll finishes before allowing
        // the next snap. This absorbs residual momentum from freewheels
        // and prevents "machine-gunning" through sections.
        setTimeout(() => {
          locked = false;
        }, 250);

        clearTimeout(timeoutId);
        window.removeEventListener("scrollend", unlock);
      };

      timeoutId = setTimeout(unlock, LOCK_MS);
      window.addEventListener("scrollend", unlock, { once: true });
    }

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      html.style.scrollSnapType = "";
      html.style.scrollBehavior = "";
      window.removeEventListener("resize", refreshTargets);
      window.removeEventListener("wheel", onWheel);
      ro.disconnect();
    };
  }, []);

  // Renders nothing — pure side-effect component
  return null;
}
