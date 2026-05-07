"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { type Project, projects } from "@/lib/projects";
import { TechLogo } from "@/components/TechLogo";

// ── Constants ─────────────────────────────────────────────────────────────
const NAV_H = 56;
// Approx distance from viewport top to where card stack begins
// (sticky-container top) + heading paddingTop(28) + label(~20) + paddingBottom(40)
const STICK_TOP = NAV_H + 88; // ≈ 144 px

const CARD_GAP = 32;   // breathing room below card before transition starts
const SCALE_STEP = 0.038;
const OPACITY_STEP = 0.14;
const Y_STEP = 10;   // px translate-up per burial level

const statusStyle: Record<
  Project["status"],
  { label: string; dot: string }
> = {
  "in-progress": {label: "In progress", dot: "bg-accent"},
  polish: {label: "Polishing", dot: "bg-dim"},
  "to-build": {label: "Coming soon", dot: "bg-[#333]"},
  private: {label: "Private", dot: "bg-[#2a2a2a]"},
};

// ── Placeholder image ─────────────────────────────────────────────────────
function PlaceholderImage({palette}: { palette: Project["imagePalette"] }) {
  return (
    <div
      className="relative w-full rounded-xl overflow-hidden mb-6 aspect-video"
      style={{
        background: `linear-gradient(145deg, ${palette.from} 0%, ${palette.via} 55%, ${palette.to} 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff0a 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0px, transparent 18px, #ffffff03 18px, #ffffff03 19px)",
        }}
        aria-hidden="true"
      />
      <span
        className="absolute bottom-3 right-3.5 font-display text-[0.5rem] tracking-widest uppercase text-white/15 select-none">
        Screenshot TBC
      </span>
    </div>
  );
}

// ── Image Modal ───────────────────────────────────────────────────────────
function ImageModal({
  src,
  alt,
  onClose,
  onNext,
  onPrev,
  hasMultiple,
}: {
  src: string;
  alt: string;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasMultiple: boolean;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext?.();
      if (e.key === "ArrowLeft") onPrev?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6 md:p-16 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 z-50 size-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/10"
        aria-label="Close modal"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>

      {hasMultiple && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev?.();
            }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 size-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all border border-white/10 backdrop-blur-md"
            aria-label="Previous image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext?.();
            }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 size-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all border border-white/10 backdrop-blur-md"
            aria-label="Next image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </>
      )}

      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain transition-transform duration-300"
          priority
          sizes="100vw"
        />
      </div>
    </div>
  );
}

// ── Carousel image ────────────────────────────────────────────────────────
function ImageCarousel({images, alt}: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const next = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowModal(true);
        }}
        className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 group bg-black/5 border border-line/50 cursor-zoom-in"
      >
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={`${alt} screenshot ${i + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority={i === 0}
          />
        </div>
      ))}

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 size-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity border border-white/10"
            aria-label="Previous image"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 size-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity border border-white/10"
            aria-label="Next image"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <div
                key={i}
                className={`size-1 rounded-full transition-all duration-300 ${
                  i === index ? "bg-white w-3" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>

    {showModal && createPortal(
      <ImageModal
        src={images[index]}
        alt={alt}
        onClose={() => setShowModal(false)}
        onNext={images.length > 1 ? () => next() : undefined}
        onPrev={images.length > 1 ? () => prev() : undefined}
        hasMultiple={images.length > 1}
      />,
      document.body
    )}
  </>
  );
}

// ── Project card ──────────────────────────────────────────────────────────
function ProjectCard({project, index}: { project: Project; index: number }) {
  const status = statusStyle[project.status];
  const num = String(index + 1).padStart(2, "0");

  const card = (
    <article
      className={[
        "relative bg-surface border border-line rounded-2xl overflow-hidden",
        "p-7 pt-6",
        project.href ? "hover:border-accent/25 transition-colors duration-300 cursor-pointer" : "",
      ]
        .join(" ")
        .trim()}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/35 to-transparent"/>
      {project.images && project.images.length > 0 ? (
        <ImageCarousel images={project.images} alt={project.title}/>
      ) : (
        <PlaceholderImage palette={project.imagePalette}/>
      )}
      <div className="flex items-center gap-2 mb-4">
        <span className={`size-1.5 rounded-full shrink-0 ${status.dot}`} aria-hidden="true"/>
        <span className="font-display text-[0.625rem] tracking-wide text-[#777]">
          {status.label}
        </span>
      </div>
      <h3 className="font-display text-primary text-[1.125rem] leading-snug mb-3">
        {project.title}
      </h3>
      <p className="text-dim text-sm text-pretty leading-relaxed mb-5">
        {project.description}
      </p>
      <ul className="space-y-1.5 mb-6" aria-label="Key features">
        {project.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2.5 text-[#777] text-[0.8125rem] leading-snug">
            <span className="mt-[0.35em] size-1 rounded-full bg-accent/50 shrink-0" aria-hidden="true"/>
            {h}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1.5 pt-5 border-t border-line">
        {project.stack.map((name) => (
          <TechLogo key={name} name={name} size={12}/>
        ))}
      </div>
    </article>
  );

  if (project.href) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} — ${project.description}`}
      >
        {card}
      </a>
    );
  }

  return card;
}

// ─────────────────────────────────────────────────────────────────────────────
// Projects section
//
// Architecture (desktop & mobile):
//   • One tall <section> captures scroll distance; height is computed from
//     per-card slot sizes (= contentOverflow + 100vh each).
//   • Zero-size snap sentinels are replaced by 100vh-tall absolutely-positioned
//     divs so CSS snap (used on mobile/touch) has real box edges to snap to.
//     Their positions are updated dynamically after card-height measurement.
//   • A single sticky container holds the heading + every card.
//   • Two wrappers per card:
//       wrapRef  (outer) — handles position/stacking + content-shift translateY
//       cardRef  (inner) — handles entry-from-below + burial scale/opacity
//   • Per-slot animation phases driven by scroll:
//       1. Entry      (scrollInSlot: -vh → 0)    — card slides up from below
//       2. Content    (scrollInSlot: 0 → overflow) — card shifts up to reveal content
//       3. Transition (scrollInSlot: overflow → overflow+vh) — next card piles on
// ─────────────────────────────────────────────────────────────────────────────
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);   // outer
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);   // inner
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Slot geometry stored in a ref so the scroll handler always reads fresh values
  // without triggering re-renders.
  const slotData = useRef<{ offsets: number[]; sizes: number[]; sectionTop: number }>({
    offsets: [],
    sizes: [],
    sectionTop: 0,
  });

  const N = projects.length;

  // ── Slot geometry computation ────────────────────────────────────────────
  useEffect(() => {
    function getActualTop(el: HTMLElement | null): number {
      let top = 0;
      while (el) {
        top += el.offsetTop;
        el = el.offsetParent as HTMLElement | null;
      }
      return top;
    }

    function computeSlots() {
      const section = sectionRef.current;
      if (!section) return;

      const vh = window.innerHeight;
      const offsets: number[] = [];
      const sizes: number[] = [];
      let acc = 0;

      wrapRefs.current.forEach((wrap, i) => {
        offsets[i] = acc;
        const cardH = wrap?.offsetHeight ?? vh;
        const viewable = vh - STICK_TOP - CARD_GAP;
        const overflow = Math.max(0, cardH - viewable);
        const slotSize = overflow + vh;
        sizes[i] = slotSize;
        acc += slotSize;
      });

      const sectionTop = getActualTop(section);
      slotData.current = {offsets, sizes, sectionTop};

      // Resize the section so there's exactly enough scroll distance
      section.style.height = `${acc}px`;

      // Re-position sentinels: sentinel i snaps to sectionTop + offsets[i].
      // ScrollManager/CSS-snap formula: target = el.top + scrollY - NAV_H
      // → place el at absolute top = offsets[i] + NAV_H from section top.
      sentinelRefs.current.forEach((el, i) => {
        if (el) el.style.top = `${offsets[i] + NAV_H}px`;
      });
    }

    computeSlots();

    // Re-measure whenever a card resizes (font load, image decode, etc.)
    const ro = new ResizeObserver(computeSlots);
    wrapRefs.current.forEach(el => el && ro.observe(el));
    window.addEventListener("resize", computeSlots);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", computeSlots);
    };
  }, []);

  // ── Scroll animation ──────────────────────────────────────────────────────
  useEffect(() => {
    let rafId: number;

    function onScroll() {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const vh = window.innerHeight;
        const {offsets, sizes, sectionTop} = slotData.current;
        const rawScroll = window.scrollY - sectionTop;

        wrapRefs.current.forEach((wrap, i) => {
          if (!wrap) return;
          const inner = cardRefs.current[i];

          const slotStart = offsets[i] ?? i * vh;
          const slotSize = sizes[i] ?? vh;
          const contentOverflow = slotSize - vh;          // extra px to scroll content
          const scrollInSlot = rawScroll - slotStart;

          // ── 1. Below viewport — completely hidden ────────────────────────
          if (scrollInSlot <= -vh) {
            wrap.style.transform = "translate3d(0, 100%, 0)";
            wrap.style.opacity = "0";
            if (inner) {
              inner.style.transform = "translate3d(0, 0, 0) scale(1)";
              inner.style.opacity = "1";
            }
            return;
          }

          // ── 2. Entry — card slides up from below ────────────────────────
          if (scrollInSlot < 0) {
            const t = scrollInSlot / vh; // –1 → 0
            wrap.style.transform = `translate3d(0, ${(-t * 100).toFixed(1)}%, 0)`;
            wrap.style.opacity = Math.max(0, 1 + t).toFixed(3);
            if (inner) {
              inner.style.transform = "translate3d(0, 0, 0) scale(1)";
              inner.style.opacity = "1";
            }
            return;
          }

          // ── 3. Content phase — shift card up to reveal overflow ──────────
          const contentShift = Math.max(0, Math.min(contentOverflow, scrollInSlot));
          wrap.style.transform = `translate3d(0, -${contentShift.toFixed(1)}px, 0)`;
          wrap.style.opacity = "1";

          // ── 4. Transition phase — bury card as next one arrives ──────────
          const transitionScroll = Math.max(0, scrollInSlot - contentOverflow);
          const t = transitionScroll / vh; // 0 → 1+

          if (!inner) return;
          if (t <= 0) {
            inner.style.transform = "translate3d(0, 0, 0) scale(1)";
            inner.style.opacity = "1";
          } else {
            const scale = Math.max(0.82, 1 - t * SCALE_STEP);
            const op = Math.max(0.35, 1 - t * OPACITY_STEP);
            const ty = (t * -Y_STEP).toFixed(1);
            inner.style.transform = `translate3d(0, ${ty}px, 0) scale(${scale.toFixed(4)})`;
            inner.style.opacity = op.toFixed(3);
          }
        });
      });
    }

    window.addEventListener("scroll", onScroll, {passive: true});
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="animate-projects border-t-2 border-line relative"
      style={{height: `${N * 100}vh` /* overridden by computeSlots */}}
    >
      {/*
        ── Snap sentinels ────────────────────────────────────────────────────
        100vh-tall absolutely-positioned divs. CSS scroll snap needs a real
        box edge — zero-size elements are ignored on mobile browsers.
        Positions are updated by computeSlots so they land at the correct
        scroll target for each card regardless of content overflow.
      */}
      {projects.map((_, i) => (
        <div
          key={`snap-${i}`}
          ref={(el) => {
            sentinelRefs.current[i] = el;
          }}
          className="snap-section"
          aria-hidden="true"
          style={{
            position: "absolute",
            top: `calc(${i} * 100vh + ${NAV_H}px)`, // overridden by computeSlots
            left: 0,
            right: 0,
            height: "100vh",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── Sticky heading + card stack ──────────────────────────────────── */}
      <div className="sticky z-10" style={{top: `${NAV_H}px`, willChange: "transform"}}>

        <div style={{paddingTop: "28px", paddingBottom: "40px"}}>
          <p className="section-label" style={{marginBottom: 0}}>
            Projects
          </p>
        </div>

        {/*
          Card 0  → position:relative  (establishes container height)
          Cards 1…N → position:absolute at origin, higher z-index
          wrapRef drives content-shift (outer translateY)
          cardRef drives entry/burial  (inner scale + opacity)
        */}
        <div className="relative">
          {projects.map((project, i) => (
            <div
              key={project.title}
              ref={(el) => {
                wrapRefs.current[i] = el;
              }}
              style={{
                position: i === 0 ? "relative" : "absolute",
                top: i === 0 ? undefined : 0,
                left: i === 0 ? undefined : 0,
                right: i === 0 ? undefined : 0,
                zIndex: i + 1,
                willChange: "transform, opacity",
              }}
            >
              <div
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                style={{transformOrigin: "top center", willChange: "transform, opacity"}}
              >
                <ProjectCard project={project} index={i}/>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
