"use client";

import { useEffect } from "react";

// Keep in sync with Nav h-14 and globals.css scroll-padding-top
const NAV_H = 56;

const ARRIVE_EPS     = 2;    // px — "arrived" within this distance of target
const POST_ARRIVE_MS = 300;  // ms quiet period after landing before next snap fires
const MAX_FLIGHT_MS  = 950;  // give up polling after this long (safety valve)

const SNAP_THRESHOLD = 35;   // min delta (px) to trigger a section snap
const GESTURE_RESET  = 400;  // ms of silence that marks the start of a new gesture
const TAIL_PEAK_MIN  = 50;   // only apply tail-detection if gesture peaked above this
const TAIL_RATIO     = 0.3;  // events below (peak × ratio) are treated as momentum tail

/**
 * Mouse / fine-pointer scroll manager.
 *
 * Behaviour goals
 * ───────────────
 * • Quantised mouse wheel  → one click = one section, smooth + immediate.
 * • Freewheel mouse        → first strong tick snaps to the next section;
 *                            the long decelerating roll-off is absorbed silently.
 * • MacBook / trackpad     → a confident swipe snaps to the next section;
 *                            the coast-after-lift is absorbed silently.
 * • Touch / coarse pointer → CSS mandatory snap handles these natively (no-op here).
 *
 * Why previous versions were janky on freewheel / trackpad
 * ──────────────────────────────────────────────────────────
 * Freewheel mice and trackpad momentum produce a long, decelerating tail of
 * wheel events *after* the user has finished the intentional gesture.
 *
 * v1 (scrollEnd + setTimeout): `scrollend` fired inconsistently — often while
 *    residual events were still arriving — releasing the lock too early and
 *    triggering an unintended second snap.
 *
 * v2 (RAF easing loop): moved the animation to the main thread, which made the
 *    hero / stack / contact sections worse than the compositor-threaded native
 *    smooth scroll.
 *
 * v3 (polling + browser smooth scroll): reliable arrival detection via polling,
 *    but the POST_ARRIVE cooldown wasn't long enough to outlast aggressive
 *    freewheel tails, so a second snap still fired occasionally.
 *
 * This version (v4) adds **gesture peak tracking**. Every wheel event within a
 * gesture (no gap > GESTURE_RESET ms) updates a running maximum delta. Once
 * subsequent events drop below TAIL_RATIO × peak, they are classified as
 * momentum tail and silently blocked via preventDefault — no second snap fires
 * regardless of how long the tail lasts. Sub-threshold events are also always
 * blocked so the page can't drift off a snap point between gestures.
 */
export default function ScrollManager() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const html = document.documentElement;

    // Disable CSS snap for fine-pointer devices — we manage it in JS
    html.style.scrollSnapType    = "none";
    html.style.scrollBehavior    = "auto";
    html.style.overscrollBehaviorY = "none";

    let locked        = false;
    let pollId: number | null = null;
    let gesturePeak   = 0;   // largest abs-delta seen in the current gesture
    let lastGestureMs = 0;   // timestamp of the last wheel event
    interface SnapTarget {
      y: number;
      el: HTMLElement;
      focusEl: HTMLElement | null;
    }
    let cachedTargets: SnapTarget[] = [];

    function getDocumentTop(el: HTMLElement) {
      return el.getBoundingClientRect().top + window.scrollY;
    }

    // ── Snap target cache ────────────────────────────────────────────────
    function refreshTargets() {
      const sections = Array.from(document.querySelectorAll<HTMLElement>(".snap-section"));
      cachedTargets = sections
        .map((el) => {
          const y = Math.round(getDocumentTop(el) - NAV_H);

          let focusEl: HTMLElement | null = null;
          if (el.id.startsWith("snap-project-")) {
            const idx = parseInt(el.id.replace("snap-project-", ""));
            if (idx === 0) {
              // The "Projects" section label
              focusEl = document.querySelector("#projects .section-label") as HTMLElement;
            } else {
              // Focus the card wrapper (tabIndex=-1) so the NEXT tab hits the carousel
              focusEl = document.querySelector(`[data-snap-target="#${el.id}"]`) as HTMLElement;
            }
          } else {
            // Hero, Stack, Contact: focus the tabIndex=0 anchor inside them
            focusEl = el.querySelector('[tabindex="0"]') as HTMLElement;
          }

          return { y, el, focusEl };
        })
        .filter(t => t.y >= 0)
        .sort((a, b) => a.y - b.y);
    }

    refreshTargets();
    window.addEventListener("resize", refreshTargets);
    const ro = new ResizeObserver(refreshTargets);
    ro.observe(document.body);

    // ── Scroll animation ─────────────────────────────────────────────────
    // Uses the browser's compositor-threaded smooth scroll for visual quality,
    // with a polling loop to detect arrival reliably (scrollend is inconsistent).
    function doScroll(target: number, focusEl?: HTMLElement | null) {
      if (pollId !== null) cancelAnimationFrame(pollId);
      locked = true;

      window.scrollTo({ top: target, behavior: "smooth" });

      const t0 = performance.now();

      function poll() {
        const elapsed = performance.now() - t0;

        // Skip the first 80 ms — avoids false-positive on very short scrolls
        // where scrollY transiently passes through the target value.
        if (elapsed > 80 && Math.abs(window.scrollY - target) < ARRIVE_EPS) {
          pollId = null;
          // Sync focus once we've arrived
          focusEl?.focus({ preventScroll: true });
          setTimeout(() => { locked = false; }, POST_ARRIVE_MS);
          return;
        }

        // Safety valve — unlock if target is unreachable (e.g. near page bottom)
        if (elapsed > MAX_FLIGHT_MS) {
          pollId = null;
          focusEl?.focus({ preventScroll: true });
          setTimeout(() => { locked = false; }, 150);
          return;
        }

        pollId = requestAnimationFrame(poll);
      }

      pollId = requestAnimationFrame(poll);
    }

    function getProjectCardScroller(target: EventTarget | null) {
      if (!(target instanceof Element)) return null;

      const direct = target.closest<HTMLElement>("[data-project-card-scroll]");
      if (direct) return direct;

      const proxy = target.closest<HTMLElement>("[data-snap-target]");
      if (!proxy) return null;

      const nestedScroller = proxy.querySelector<HTMLElement>("[data-project-card-scroll]");
      if (nestedScroller) return nestedScroller;

      const selector = proxy.dataset.snapTarget;
      if (!selector) return null;

      return document.querySelector<HTMLElement>(
        `[data-snap-target="${selector}"] [data-project-card-scroll]`,
      );
    }

    function canScrollCard(scroller: HTMLElement, delta: number) {
      const maxScroll = scroller.scrollHeight - scroller.clientHeight;
      if (maxScroll <= 1) return false;

      if (delta > 0) return scroller.scrollTop < maxScroll - 1;
      return scroller.scrollTop > 1;
    }

    function getKeyScrollDelta(e: KeyboardEvent) {
      if (e.key === "ArrowDown") return 56;
      if (e.key === "ArrowUp") return -56;
      if (e.key === "PageDown" || (e.key === " " && !e.shiftKey)) return window.innerHeight * 0.75;
      if (e.key === "PageUp" || (e.key === " " && e.shiftKey)) return window.innerHeight * -0.75;
      return 0;
    }

    function snapToAdjacent(delta: number, minOffset = 1) {
      const dir = delta > 0 ? 1 : -1;
      const cur = window.scrollY;

      const target = dir > 0
        ? cachedTargets.find(t => t.y > cur + minOffset)
        : [...cachedTargets].reverse().find(t => t.y < cur - minOffset);

      if (target === undefined) return false;

      doScroll(target.y, target.focusEl);
      return true;
    }

    // ── Keyboard handler ─────────────────────────────────────────────────
    function onKeyDown(e: KeyboardEvent) {
      // If we're already moving, block other scroll keys to prevent queueing/jank
      const isScrollKey = ["ArrowDown", "ArrowUp", "Space", "PageDown", "PageUp", "Home", "End"].includes(e.key) || (e.key === " " && e.shiftKey);
      if (locked && isScrollKey) {
        e.preventDefault();
        return;
      }

      const cardScrollDelta = getKeyScrollDelta(e);
      if (cardScrollDelta !== 0) {
        const scroller = getProjectCardScroller(e.target);
        if (scroller && canScrollCard(scroller, cardScrollDelta)) {
          e.preventDefault();
          scroller.scrollBy({ top: cardScrollDelta, behavior: "auto" });
          return;
        }
      }

      const cur = window.scrollY;
      let target: SnapTarget | undefined;

      if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
        target = cachedTargets.find(t => t.y > cur + 10);
      } else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
        target = [...cachedTargets].reverse().find(t => t.y < cur - 10);
      } else if (e.key === "Home") {
        target = cachedTargets[0];
      } else if (e.key === "End") {
        target = cachedTargets[cachedTargets.length - 1];
      }

      if (target !== undefined) {
        e.preventDefault();
        doScroll(target.y, target.focusEl);
      }
    }

    // ── Focus handler ────────────────────────────────────────────────────
    // When tabbing, the browser natively scrolls to the focused element.
    // We catch this and "snap" to the nearest valid scroll point for that section.
    function onFocusIn(e: FocusEvent) {
      const el = e.target as HTMLElement;
      if (!el) return;

      // 1. Direct snap section
      const snapSection = el.closest(".snap-section") as HTMLElement;
      // 2. Proxy element that points to a snap target (e.g. project cards)
      const proxy = el.closest("[data-snap-target]") as HTMLElement;

      let targetEl = snapSection;
      if (proxy) {
        const selector = proxy.dataset.snapTarget;
        if (selector) targetEl = document.querySelector(selector) as HTMLElement;
      }

      if (targetEl) {
        const targetY = Math.round(getDocumentTop(targetEl) - NAV_H);

        // Only snap if we aren't already very close
        if (Math.abs(window.scrollY - targetY) > 10) {
          doScroll(targetY);
        }
      }
    }

    // ── Wheel handler ────────────────────────────────────────────────────
    function onWheel(e: WheelEvent) {
      const now    = performance.now();
      const delta  = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY; // normalise Firefox line-mode
      const absDelta = Math.abs(delta);
      const scroller = getProjectCardScroller(e.target);

      // Ignore absolute micro-nudges (browser housekeeping, rounding, etc.)
      if (absDelta < 5) {
        if (scroller) e.preventDefault();
        return;
      }

      if (!locked && scroller && canScrollCard(scroller, delta)) {
        gesturePeak = 0;
        lastGestureMs = 0;
        return;
      }

      if (!locked && scroller) {
        e.preventDefault();
        snapToAdjacent(delta);
        return;
      }

      // ── Gesture peak tracking ─────────────────────────────────────────
      // A new gesture begins after GESTURE_RESET ms of silence.
      // We track the running maximum delta so we can identify when the tail
      // of a gesture is arriving (delta has fallen well below the peak).
      if (now - lastGestureMs > GESTURE_RESET) gesturePeak = 0;
      lastGestureMs = now;
      gesturePeak = Math.max(gesturePeak, absDelta);

      // Momentum tail: delta has decayed to a small fraction of the gesture peak.
      // This is the roll-off from freewheel mice and the coast after a trackpad
      // swipe. Blocking these silently is the key fix for freewheel / trackpad jank.
      const isTail = gesturePeak >= TAIL_PEAK_MIN && absDelta < gesturePeak * TAIL_RATIO;

      // Three cases to block silently (preventDefault but no new snap):
      //   1. Already snapping to a target
      //   2. Momentum tail — decelerating roll-off / coast
      //   3. Sub-threshold — too small to constitute intentional navigation;
      //      blocking keeps the page locked to its snap point between gestures
      if (locked || isTail || absDelta < SNAP_THRESHOLD) {
        e.preventDefault();
        return;
      }

      // ── Intentional scroll — navigate to the adjacent section ─────────
      if (!snapToAdjacent(delta)) return; // already at first / last section

      e.preventDefault();
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("focusin", onFocusIn);

    return () => {
      html.style.scrollSnapType      = "";
      html.style.scrollBehavior      = "";
      html.style.overscrollBehaviorY = "";
      window.removeEventListener("resize", refreshTargets);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("focusin", onFocusIn);
      if (pollId !== null) cancelAnimationFrame(pollId);
      ro.disconnect();
    };
  }, []);

  return null;
}
