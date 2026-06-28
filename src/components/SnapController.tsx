"use client";

import { useEffect } from "react";

/**
 * Lean section-snap controller for fine pointers (mouse / trackpad).
 *
 * Each section is a full-height `.panel`. We disable CSS snap for fine pointers
 * (so JS and CSS don't fight) and let coarse pointers (touch) keep native CSS
 * mandatory snap, which already feels good with momentum.
 *
 * Triggering model — one snap per deliberate *push*, detected by acceleration.
 * We track a decaying velocity envelope; a "push" is an event whose magnitude
 * spikes above that envelope (mag > env * ACCEL_RATIO + ACCEL_FLOOR), or the
 * first event after a quiet GESTURE_GAP. Crucially, the inertia of scrolling a
 * section to its bottom only ever *decelerates*, so it can never spike the
 * envelope — reaching the bottom never carries into a snap on the same gesture.
 * The next distinct flick/notch does spike, so it snaps right away (one push,
 * one section). A single push can't fire twice (its momentum tail decays), so
 * a flick can't double-jump two sections.
 *
 * After a snap the gesture is *locked*: every remaining event (the decaying
 * inertia tail) is swallowed until the next quiet gap, so a flick's momentum
 * can't bleed into scrolling the section it just landed on.
 *
 * A separate IntersectionObserver (which runs for every pointer type, including
 * touch where native CSS snap handles movement) resets a section's nested
 * scrollers to the top once it leaves the viewport, so every section/card is
 * always re-entered from the start — and a section above is one push away.
 *
 * Leaving the Projects panel uses a "peek & confirm" gesture: the first push
 * past the carousel nudges the next section into view and snaps back, signalling
 * there's more below without yanking the user away from the other project cards.
 * A second deliberate push within the confirm window commits to the next panel.
 */
const GESTURE_GAP = 110;  // ms of quiet that marks a fresh, intentional gesture
const GAP_MIN = 8;        // px (normalized) of intent a gap-start needs to fire
const ENV_HALFLIFE = 100; // ms half-life of the decaying velocity envelope
const ACCEL_RATIO = 1.5;  // mag must exceed env * this (+ floor) to count as a push
const ACCEL_FLOOR = 8;    // px floor so tiny ripples on a near-zero env don't fire
const FLOOR = 4;          // px of intent needed to count as a scroll at all
const ANIM_MS = 340;      // cooldown while a programmatic snap is in flight

const PEEK_PX = 96;       // how far the next section is nudged into view
const PEEK_HOLD = 460;    // ms the peek is held before snapping back
const PEEK_WINDOW = 1500; // ms after a peek during which a 2nd push confirms

export default function SnapController() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const html = document.documentElement;
    const prevSnapType = html.style.getPropertyValue("scroll-snap-type");
    // !important guarantees we override the stylesheet's `y mandatory` so CSS and
    // JS never fight (CSS snap would otherwise reintroduce the ~50%-screen feel).
    html.style.setProperty("scroll-snap-type", "none", "important");
    // Scopes `overscroll-behavior: contain` to inner scrollers for fine pointers
    // only (see globals.css) — stops the wheel chaining past the first/last panel
    // while leaving touch free to chain into native CSS snap.
    html.classList.add("snap-js");

    let lastTs = 0;
    let animUntil = 0;
    let env = 0;             // decaying velocity envelope (for acceleration detection)
    let lockGesture = false; // true after a snap, until the gesture's next quiet gap

    let peekActive = false;
    let peekExpire = 0;
    let peekTimers: number[] = [];

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

    function clearPeek() {
      peekActive = false;
      peekTimers.forEach((t) => clearTimeout(t));
      peekTimers = [];
    }

    function snapTo(target: number, tops: number[]) {
      const clamped = Math.max(0, Math.min(tops.length - 1, target));
      const top = tops[clamped];
      if (top === undefined) return;
      animUntil = performance.now() + ANIM_MS;
      lockGesture = true; // swallow the rest of this gesture's inertia tail
      window.scrollTo({ top, behavior: "smooth" });
    }

    function startPeek(top: number) {
      clearPeek();
      peekActive = true;
      peekExpire = performance.now() + PEEK_WINDOW;
      animUntil = performance.now() + PEEK_HOLD + 200;
      window.scrollTo({ top: top + PEEK_PX, behavior: "smooth" });
      peekTimers.push(
        window.setTimeout(() => {
          window.scrollTo({ top, behavior: "smooth" });
        }, PEEK_HOLD),
      );
      peekTimers.push(
        window.setTimeout(() => {
          peekActive = false;
        }, PEEK_WINDOW),
      );
    }

    // Fast scroller lookup — no getComputedStyle in the wheel hot path (that was
    // forcing a style recalc on every event and causing the jitter). The only
    // vertical scrollers are tagged with these classes.
    function innerScroller(start: EventTarget | null): HTMLElement | null {
      const el = start instanceof Element ? start.closest<HTMLElement>(".panel-body, .card-scroll") : null;
      return el && el.scrollHeight > el.clientHeight + 1 ? el : null;
    }
    function canScroll(el: HTMLElement, dir: number) {
      if (dir > 0) return el.scrollTop < el.scrollHeight - el.clientHeight - 1;
      return el.scrollTop > 1;
    }

    function onWheel(e: WheelEvent) {
      const dir = Math.sign(e.deltaY);
      if (dir === 0) return;

      // We fully own the wheel for fine pointers: ALWAYS preventDefault, then
      // drive every scroll manually with hard clamps. The browser never scrolls
      // anything itself, so there is no native path that could run unbounded
      // past a container's top/bottom (the bug that kept resurfacing whenever a
      // `return` left one event un-prevented for some device's delta mode).
      e.preventDefault();

      const now = performance.now();
      const gap = now - lastTs;
      lastTs = now;
      if (dir < 0) clearPeek();

      // Normalize to px. Pixel-mode deltas (trackpad, modern mice) are 1:1;
      // line/page deltas are scaled to a comparable, native-feeling distance.
      const px =
        e.deltaMode === 1
          ? e.deltaY * 40
          : e.deltaMode === 2
            ? e.deltaY * window.innerHeight
            : e.deltaY;
      const mag = Math.abs(px);

      // Decay the velocity envelope toward zero over time, then test whether this
      // event spikes above it — that's a fresh, deliberate push. Decaying inertia
      // (scrolling to a bottom, or a flick's momentum tail) never spikes, so it
      // can't trigger a snap. Update the envelope to the new peak afterwards.
      env *= Math.pow(0.5, gap / ENV_HALFLIFE);
      const accelerating = mag > env * ACCEL_RATIO + ACCEL_FLOOR;
      env = Math.max(env, mag);

      // A quiet gap ends the previous gesture (and its post-snap lock).
      if (gap >= GESTURE_GAP) lockGesture = false;

      // A programmatic snap / peek is in flight — absorb the gesture + its tail.
      if (now < animUntil) return;

      // Is this event a fresh, intentional push (vs. a decaying inertia tail)?
      const fresh =
        (gap >= GESTURE_GAP && mag >= GAP_MIN) || // flick start / isolated notch
        accelerating;                             // a deliberate re-push / wheel notch

      // Inner content scrolling takes precedence over snapping while the content
      // can still move. We move it manually and clamp hard to [0, max] — a
      // post-snap inertia tail is swallowed so a flick's momentum can't bleed
      // into scrolling the section it just landed on.
      const inner = innerScroller(e.target);
      if (inner) {
        const max = inner.scrollHeight - inner.clientHeight;
        const canMove = dir > 0 ? inner.scrollTop < max - 1 : inner.scrollTop > 1;
        if (canMove) {
          if (lockGesture && !fresh) return;
          const next = inner.scrollTop + px;
          inner.scrollTop = next < 0 ? 0 : next > max ? max : next;
          return;
        }
      }

      if (mag < FLOOR) return;

      // Snap only on a fresh, deliberate push. At a content boundary this means
      // the gesture that scrolled to the bottom (and its momentum) is ignored —
      // only the next distinct push snaps. On an open section it's the same test,
      // so momentum can't blow through several short sections at once.
      if (!fresh) return;

      const panels = getPanels();
      const tops = topsOf(panels);
      const ci = currentIndex(tops);
      const projectsIndex = panels.findIndex((p) => p.id === "projects");

      // Peek & confirm when leaving the Projects panel downward.
      if (dir > 0 && ci === projectsIndex && ci < tops.length - 1) {
        if (peekActive && now <= peekExpire) {
          clearPeek();
          snapTo(ci + 1, tops);
        } else {
          startPeek(tops[ci]);
        }
        return;
      }

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
      const inner = innerScroller(active);
      if (inner && canScroll(inner, dir)) return;

      if (next !== ci) {
        e.preventDefault();
        clearPeek();
        snapTo(next, tops);
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      if (prevSnapType) html.style.setProperty("scroll-snap-type", prevSnapType);
      else html.style.removeProperty("scroll-snap-type");
      html.classList.remove("snap-js");
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      clearPeek();
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
