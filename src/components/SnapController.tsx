"use client";

import { useEffect } from "react";

/**
 * Unified wheel-driven section snapping for fine pointers (mouse AND trackpad).
 *
 * A mouse wheel and a trackpad are indistinguishable per-event on modern browsers
 * (Chrome reports a hi-res mouse exactly like a trackpad), so instead of guessing
 * the device we treat ALL wheel input on a fine pointer the same way and own it
 * completely: every wheel event is `preventDefault`-ed, so native scroll never
 * runs — it can't overshoot the page bounds and can't fight our snap animation.
 * Touch (a coarse pointer) is left to native CSS `scroll-snap` entirely, which is
 * already perfect on mobile.
 *
 * One rule drives everything, keyed off the quiet GAP between events:
 *   - A fresh gesture (preceded by >= GESTURE_GAP of quiet) acts on its first
 *     event: if the current panel's inner content can scroll in that direction we
 *     scroll it (applying the raw delta, so a trackpad keeps its momentum feel and
 *     both devices get real feedback); otherwise we snap one section.
 *   - Every later event of the same gesture (the trackpad momentum tail, or a fast
 *     burst of notches) is swallowed until the next quiet gap. That makes one
 *     flick / one deliberate notch advance exactly one section, with no double
 *     jumps and no overshoot.
 *
 * `usedInner` keeps it to "at most two gestures per section": a CONTINUOUS gesture
 * that scrolled content to its end won't also snap (wait for a fresh gesture),
 * while DISCRETE scrolling — where each notch is its own gesture — snaps on the
 * very first notch after the content bottom is reached.
 *
 * A scroll-idle pass (runs for every pointer type, including touch) resets a
 * section's nested scrollers to the top once it leaves the viewport, so every
 * section/card is always re-entered from the start.
 */
const GESTURE_GAP = 110;     // ms of quiet that marks a fresh, intentional gesture
const ANIM_MS = 340;         // duration of a programmatic snap animation
const LINE_PX = 40;          // px per line for deltaMode === 1 (Firefox mouse)
const REACCEL = 2.2;         // a push this many× the decaying tail = a new gesture
const REACCEL_FLOOR = 10;    // px; ignore momentum bumps smaller than a real push
const REVERSAL_FLOOR = 6;    // px; ignore the tiny opposite "settle" blip after momentum

export default function SnapController() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Touch (coarse) is left to native CSS snap — it's already perfect on mobile.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const html = document.documentElement;
    let lastTs = 0;
    let animUntil = 0;
    let rafId = 0;
    let usedInner = false; // this gesture has scrolled inner content
    let snapped = false;   // this gesture already snapped — swallow its tail
    let lastDir = 0;       // direction of the previous event (for reversal detection)
    let ema = 0;           // running magnitude baseline (px) — tracks the momentum tail
    let peakMag = 0;       // peak magnitude of the current gesture
    let decayed = false;   // the gesture's momentum has been observed decaying

    function getPanels(): HTMLElement[] {
      return Array.from(document.querySelectorAll<HTMLElement>(".panel"));
    }
    function topsOf(panels: HTMLElement[]): number[] {
      return panels.map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY));
    }
    function currentIndex(tops: number[]): number {
      const y = window.scrollY;
      let best = 0;
      let bestDist = Infinity;
      tops.forEach((t, i) => {
        const d = Math.abs(t - y);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      return best;
    }

    // Animate the window to `to` ourselves (easeOutCubic). Two CSS features have
    // to be suspended for the duration or the animation breaks:
    //   - `scroll-snap-type: mandatory` — Firefox insta-snaps any programmatic
    //     scroll to the nearest snap point, so it never animates.
    //   - `scroll-behavior: smooth` — makes every per-frame scrollTo ALSO try to
    //     smooth-animate, so the frames fight and stutter/jump.
    // Input is blocked by animUntil meanwhile, so suspending them is safe; we
    // restore both once we've landed exactly on the snap point.
    function suspendCss() {
      html.style.setProperty("scroll-snap-type", "none", "important");
      html.style.setProperty("scroll-behavior", "auto", "important");
    }
    function restoreCss() {
      html.style.removeProperty("scroll-snap-type");
      html.style.removeProperty("scroll-behavior");
    }
    function animateScroll(to: number) {
      cancelAnimationFrame(rafId);
      const from = window.scrollY;
      const dist = to - from;
      suspendCss();
      if (Math.abs(dist) < 1) {
        restoreCss();
        return;
      }
      const start = performance.now();
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / ANIM_MS);
        window.scrollTo(0, from + dist * ease(t));
        if (t < 1) rafId = requestAnimationFrame(step);
        else restoreCss();
      };
      rafId = requestAnimationFrame(step);
    }

    function snapTo(target: number, tops: number[]) {
      const clamped = Math.max(0, Math.min(tops.length - 1, target));
      const top = tops[clamped];
      if (top === undefined) return;
      // Boundary no-op (already at first/last section): hard stop, nothing scrolls.
      if (Math.abs(top - window.scrollY) < 1) return;
      snapped = true; // swallow the rest of this gesture's inertia tail
      animUntil = performance.now() + ANIM_MS;
      animateScroll(top);
    }

    function canScroll(el: HTMLElement, dir: number) {
      if (dir > 0) return el.scrollTop < el.scrollHeight - el.clientHeight - 1;
      return el.scrollTop > 1;
    }
    // The visible, scrollable inner element of a panel — independent of where the
    // mouse cursor is (a fast wheel never moves the pointer, so e.target can land
    // on a neighbouring panel). For the Projects carousel this resolves to the
    // active card; off-screen cards have their centres outside the viewport.
    function activeInner(panel: HTMLElement | undefined): HTMLElement | null {
      if (!panel) return null;
      const vw = window.innerWidth;
      const els = panel.querySelectorAll<HTMLElement>(".panel-body, .card-scroll");
      for (const el of els) {
        if (el.scrollHeight <= el.clientHeight + 1) continue;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        if (r.width > 0 && r.height > 0 && cx > 0 && cx < vw) return el;
      }
      return null;
    }

    function onWheel(e: WheelEvent) {
      const dir = Math.sign(e.deltaY);
      if (dir === 0) return;

      // We own every wheel event on a fine pointer: native never scrolls, so it
      // can't overshoot the page bounds or fight the snap animation.
      e.preventDefault();

      const now = performance.now();
      const gap = now - lastTs;
      lastTs = now;

      // Mid-snap: swallow everything (momentum tail, extra notches) so the
      // animation can't be jumped forward or double-snapped.
      if (now < animUntil) return;

      const px =
        e.deltaMode === 1
          ? e.deltaY * LINE_PX
          : e.deltaMode === 2
            ? e.deltaY * window.innerHeight
            : e.deltaY;
      const mag = Math.abs(px);

      // Detect a FRESH, intentional gesture instead of waiting for all momentum to
      // die (which is what made flipping back-and-forth feel unresponsive). Any of:
      //   - a quiet gap (clean pause / deliberate discrete scroll),
      //   - a direction reversal (momentum never reverses → always intentional),
      //   - a re-acceleration: a spike above the decaying tail baseline (ema) once
      //     the tail has actually started decaying, so a new flick registers before
      //     the previous momentum fully fades — without the initial ramp of one
      //     flick re-triggering itself.
      const reversal = lastDir !== 0 && dir !== lastDir && mag > REVERSAL_FLOOR;
      const reaccel = decayed && mag > REACCEL_FLOOR && mag > ema * REACCEL;
      const fresh = gap >= GESTURE_GAP || reversal || reaccel;

      if (fresh) {
        ema = mag;
        peakMag = mag;
        decayed = false;
      } else {
        peakMag = Math.max(peakMag, mag);
        if (mag < peakMag * 0.6) decayed = true;
        ema = ema * 0.7 + mag * 0.3;
      }
      lastDir = dir;

      if (fresh) {
        usedInner = false;
        snapped = false;
      }
      // Still the previous gesture's momentum tail — swallow it.
      if (snapped) return;

      const panels = getPanels();
      const tops = topsOf(panels);
      const ci = currentIndex(tops);

      // Scroll the current panel's visible inner scroller while it can move (not
      // the element under the cursor — a fast wheel never moves the pointer; see
      // activeInner). Applying the raw delta keeps a trackpad's momentum feel and
      // gives both devices real partial-scroll feedback.
      const inner = activeInner(panels[ci]);
      if (inner) {
        const max = inner.scrollHeight - inner.clientHeight;
        const canMove = dir > 0 ? inner.scrollTop < max - 1 : inner.scrollTop > 1;
        if (canMove) {
          const next = inner.scrollTop + px;
          inner.scrollTop = next < 0 ? 0 : next > max ? max : next;
          usedInner = true; // a continuous gesture can't also snap; a fresh one can
          return;
        }
      }

      // At a content boundary, or a panel with no inner scroll. A CONTINUOUS
      // gesture that just scrolled content to its end must not also snap — wait
      // for a fresh gesture. DISCRETE scrolling resets usedInner on every gap, so
      // the first notch after the bottom snaps immediately.
      if (usedInner) return;

      snapTo(ci + dir, tops);
    }

    function onKeyDown(e: KeyboardEvent) {
      const keys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];
      if (!keys.includes(e.key)) return;

      const active = document.activeElement;
      if (
        active instanceof HTMLElement &&
        (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)
      ) {
        return;
      }

      const now = performance.now();
      if (now < animUntil) {
        e.preventDefault();
        return;
      }

      const panels = getPanels();
      const tops = topsOf(panels);
      const ci = currentIndex(tops);
      let next = ci;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") next = ci + 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") next = ci - 1;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tops.length - 1;

      const dir = next > ci ? 1 : -1;
      const inner = activeInner(panels[ci]);
      if (inner && canScroll(inner, dir)) return;

      if (next !== ci) {
        e.preventDefault();
        snapTo(next, tops);
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(rafId);
      restoreCss();
    };
  }, []);

  // Reset a section's nested scroll to the top once it leaves the viewport, so a
  // section or project card is always re-entered from the top. Runs on scroll
  // idle for ALL pointer types (including touch, where native CSS snap drives
  // movement and the controller above doesn't run). A 1px tolerance avoids the
  // sub-pixel overlap that made an IntersectionObserver fire a section too late.
  useEffect(() => {
    let idle: number | undefined;

    function resetOffscreen() {
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>(".panel").forEach((panel) => {
        const r = panel.getBoundingClientRect();
        const onScreen = r.bottom > 1 && r.top < vh - 1;
        if (onScreen) return;
        panel.querySelectorAll<HTMLElement>(".panel-body, .card-scroll").forEach((el) => {
          el.scrollTop = 0;
        });
      });
    }

    function onScroll() {
      if (idle) window.clearTimeout(idle);
      idle = window.setTimeout(resetOffscreen, 120);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    resetOffscreen();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idle) window.clearTimeout(idle);
    };
  }, []);

  return null;
}
