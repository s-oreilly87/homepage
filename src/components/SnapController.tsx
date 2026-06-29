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
    // The JS engine owns ALL snapping on a fine pointer, so the CSS
    // `scroll-snap-type: y mandatory` is redundant here — and on Firefox it's
    // actively harmful: with APZ on (DevTools closed) the compositor enforces
    // mandatory snap on its own thread and hijacks the gesture, snapping the
    // page instead of letting us scroll a card's inner content. Opening DevTools
    // disables APZ, which is exactly why the bug "fixed itself" with the
    // inspector open. Disable CSS snap outright for fine pointers; touch keeps
    // its (perfect) native CSS snap because this effect never runs there.
    html.style.setProperty("scroll-snap-type", "none", "important");
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

    // Animate the window to `to` ourselves (easeOutCubic). `scroll-behavior:
    // smooth` has to be suspended for the duration or every per-frame scrollTo
    // ALSO tries to smooth-animate, so the frames fight and stutter/jump. Input
    // is blocked by animUntil meanwhile, so suspending it is safe. (Snap-type is
    // already off for the whole session — see above.)
    function suspendCss() {
      html.style.setProperty("scroll-behavior", "auto", "important");
    }
    function restoreCss() {
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
      const center = vw / 2;
      const els = panel.querySelectorAll<HTMLElement>(".panel-body, .card-scroll");
      // Pick the scroller closest to the viewport centre, not just the first one
      // on screen: a horizontally-clipped neighbour card can still report a centre
      // a few px inside the viewport, so "first on screen" could grab the wrong
      // card. The active (centred) card always wins this.
      let best: HTMLElement | null = null;
      let bestDist = Infinity;
      for (const el of els) {
        if (el.scrollHeight <= el.clientHeight + 1) continue;
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) continue;
        const cx = r.left + r.width / 2;
        if (cx <= 0 || cx >= vw) continue;
        const dist = Math.abs(cx - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = el;
        }
      }
      return best;
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

      // Home/End jump straight to the first/last section.
      if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        snapTo(e.key === "Home" ? 0 : tops.length - 1, tops);
        return;
      }

      const dir = e.key === "ArrowUp" || e.key === "PageUp" ? -1 : 1;

      // Scroll the section's inner content first (the card isn't focused, so the
      // browser won't do it for us); only snap once the content is at its edge.
      const inner = activeInner(panels[ci]);
      if (inner && canScroll(inner, dir)) {
        e.preventDefault();
        const page = e.key === "PageDown" || e.key === "PageUp" || e.key === " ";
        const step = page ? inner.clientHeight * 0.9 : 64;
        const max = inner.scrollHeight - inner.clientHeight;
        const nextTop = inner.scrollTop + dir * step;
        inner.scrollTop = nextTop < 0 ? 0 : nextTop > max ? max : nextTop;
        return;
      }

      e.preventDefault();
      snapTo(ci + dir, tops);
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(rafId);
      restoreCss();
      html.style.removeProperty("scroll-snap-type");
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
