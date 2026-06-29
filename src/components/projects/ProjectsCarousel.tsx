"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "@/lib/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";

export function ProjectsCarousel() {
  const count = projects.length;
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  // Which edges of the pill filmstrip are currently clipped (have hidden pills
  // beyond them) — drives a soft mask so only truly cut-off edges fade.
  const [clip, setClip] = useState({ left: false, right: false });
  // While a button-driven scroll is animating, ignore the scroll listener — it
  // would otherwise read the track's pre-animation scrollLeft and revert the
  // optimistic index, causing a flicker-then-slide glitch.
  const lockUntil = useRef(0);

  const goTo = useCallback(
    (next: number) => {
      const clamped = ((next % count) + count) % count;
      // Update immediately so the selector pill highlight + centering animate in
      // lockstep with the card slide (don't wait for the scroll listener).
      lockUntil.current = performance.now() + 700;
      setIndex(clamped);
      const track = trackRef.current;
      if (track) {
        track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
      }
    },
    [count],
  );

  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  // Derive the active index from the card track's horizontal scroll position
  // (covers buttons, keyboard, and touch swipe alike).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function onScroll() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (performance.now() < lockUntil.current) return;
        const i = Math.round(track!.scrollLeft / track!.clientWidth);
        setIndex((curr) => (i !== curr ? i : curr));
      });
    }

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Keep the active selector pill centered and in view as the project changes.
  useEffect(() => {
    const strip = stripRef.current;
    const pill = pillRefs.current[index];
    if (!strip || !pill) return;

    const stripRect = strip.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    const delta = pillRect.left - stripRect.left - (strip.clientWidth - pill.offsetWidth) / 2;
    strip.scrollTo({ left: strip.scrollLeft + delta, behavior: "smooth" });
  }, [index]);

  // Track which edges of the filmstrip are clipped so the fade only shows where
  // pills are actually cut off (never on a flush first/last pill or when they fit).
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const update = () => {
      const left = strip.scrollLeft > 1;
      const right = strip.scrollLeft < strip.scrollWidth - strip.clientWidth - 1;
      setClip((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
    };

    update();
    strip.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // Re-check after the centering scroll settles when the project changes.
    const t = window.setTimeout(update, 360);
    return () => {
      strip.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.clearTimeout(t);
    };
  }, [index, count]);

  const fadeW = 44;
  const stripMask =
    clip.left && clip.right
      ? `linear-gradient(to right, transparent 0, #000 ${fadeW}px, #000 calc(100% - ${fadeW}px), transparent 100%)`
      : clip.left
        ? `linear-gradient(to right, transparent 0, #000 ${fadeW}px, #000 100%)`
        : clip.right
          ? `linear-gradient(to right, #000 0, #000 calc(100% - ${fadeW}px), transparent 100%)`
          : undefined;

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    }
  }

  return (
    <div
      className="flex min-h-0 flex-1 flex-col gap-3"
      role="group"
      aria-roledescription="carousel"
      aria-label="Projects"
      onKeyDown={onKeyDown}
    >
      {/* ── Selector: arrows + scrollable filmstrip of project pills ── */}
      <div className="flex items-center gap-2">
        <NavButton direction="prev" onClick={prev} />

        <div
          ref={stripRef}
          role="tablist"
          aria-label="Select a project"
          className="no-scrollbar flex flex-1 items-stretch gap-2 overflow-x-auto scroll-smooth"
          style={{ maskImage: stripMask, WebkitMaskImage: stripMask }}
        >
          {projects.map((project, i) => {
            const active = i === index;
            return (
              <button
                key={project.title}
                ref={(el) => {
                  pillRefs.current[i] = el;
                }}
                role="tab"
                aria-selected={active}
                onClick={() => goTo(i)}
                className={`group flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 sm:py-1.5 transition-colors ${
                  active ? "border-accent/50 bg-accent/10" : "border-line hover:border-dim/40"
                }`}
              >
                <span
                  className={`font-display text-[0.6875rem] tabular-nums ${
                    active ? "text-accent" : "text-[#555] group-hover:text-dim"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`whitespace-nowrap text-[0.8125rem] sm:text-[0.75rem] ${
                    active ? "text-primary" : "text-dim group-hover:text-primary"
                  }`}
                >
                  {project.title}
                </span>
              </button>
            );
          })}
        </div>

        <NavButton direction="next" onClick={next} />
      </div>

      {/* ── Sliding card track (native horizontal scroll-snap) ── */}
      <div
        ref={trackRef}
        className="no-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth"
      >
        {projects.map((project, i) => (
          <div
            key={project.title}
            className="relative min-h-0 w-full shrink-0 snap-center"
            aria-hidden={i !== index}
          >
            <ProjectCard project={project} heightMode="fill" />
          </div>
        ))}
      </div>
    </div>
  );
}

function NavButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const isPrev = direction === "prev";
  return (
    <button
      onClick={onClick}
      aria-label={isPrev ? "Previous project" : "Next project"}
      className="group flex size-11 sm:size-9 shrink-0 items-center justify-center rounded-full border border-line text-dim transition-colors hover:border-accent/50 hover:bg-accent/5 hover:text-accent focus-visible:border-accent focus-visible:text-accent focus:outline-none"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-300 ${
          isPrev ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"
        }`}
        aria-hidden="true"
      >
        <path d={isPrev ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
      </svg>
    </button>
  );
}
