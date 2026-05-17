"use client";

import { useEffect, useRef } from "react";
import { projects } from "@/lib/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import {
  CARD_GAP,
  NAV_HEIGHT,
  OPACITY_STEP,
  SCALE_STEP,
  STICKY_TOP_OFFSET,
  Y_STEP,
} from "@/components/projects/constants";

interface SlotData {
  offsets: number[];
  sizes: number[];
  sectionTop: number;
}

function getActualTop(element: HTMLElement | null) {
  let top = 0;

  while (element) {
    top += element.offsetTop;
    element = element.offsetParent as HTMLElement | null;
  }

  return top;
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slotData = useRef<SlotData>({ offsets: [], sizes: [], sectionTop: 0 });

  useEffect(() => {
    function computeSlots() {
      const section = sectionRef.current;
      if (!section) return;

      const viewportHeight = window.innerHeight;
      const offsets: number[] = [];
      const sizes: number[] = [];
      let accumulatedHeight = 0;

      wrapRefs.current.forEach((wrap, index) => {
        offsets[index] = accumulatedHeight;

        const cardHeight = wrap?.offsetHeight ?? viewportHeight;
        const viewableHeight = viewportHeight - STICKY_TOP_OFFSET - CARD_GAP;
        const overflow = Math.max(0, cardHeight - viewableHeight);
        const slotSize = overflow + viewportHeight;

        sizes[index] = slotSize;
        accumulatedHeight += slotSize;
      });

      slotData.current = {
        offsets,
        sizes,
        sectionTop: getActualTop(section),
      };

      section.style.height = `${accumulatedHeight}px`;

      // Snap targets need real 100vh boxes on mobile browsers, then this aligns
      // each target with ScrollManager's fixed-nav offset.
      sentinelRefs.current.forEach((element, index) => {
        if (element) element.style.top = `${offsets[index] + NAV_HEIGHT}px`;
      });
    }

    computeSlots();

    const resizeObserver = new ResizeObserver(computeSlots);
    wrapRefs.current.forEach((element) => {
      if (element) resizeObserver.observe(element);
    });
    window.addEventListener("resize", computeSlots);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", computeSlots);
    };
  }, []);

  useEffect(() => {
    let rafId: number;

    function onScroll() {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const viewportHeight = window.innerHeight;
        const { offsets, sizes, sectionTop } = slotData.current;
        const rawScroll = window.scrollY - sectionTop;

        wrapRefs.current.forEach((wrap, index) => {
          if (!wrap) return;

          const inner = cardRefs.current[index];
          const slotStart = offsets[index] ?? index * viewportHeight;
          const slotSize = sizes[index] ?? viewportHeight;
          const contentOverflow = slotSize - viewportHeight;
          const scrollInSlot = rawScroll - slotStart;

          if (scrollInSlot <= -viewportHeight) {
            wrap.style.transform = "translate3d(0, 100%, 0)";
            wrap.style.opacity = "0";
            wrap.style.pointerEvents = "none";

            if (inner) {
              inner.style.transform = "translate3d(0, 0, 0) scale(1)";
              inner.style.opacity = "1";
            }
            return;
          }

          if (scrollInSlot < 0) {
            const progress = scrollInSlot / viewportHeight;

            wrap.style.transform = `translate3d(0, ${(-progress * 100).toFixed(1)}%, 0)`;
            wrap.style.opacity = Math.max(0, 1 + progress).toFixed(3);
            wrap.style.pointerEvents = "auto";

            if (inner) {
              inner.style.transform = "translate3d(0, 0, 0) scale(1)";
              inner.style.opacity = "1";
            }
            return;
          }

          const contentShift = Math.max(0, Math.min(contentOverflow, scrollInSlot));
          wrap.style.transform = `translate3d(0, -${contentShift.toFixed(1)}px, 0)`;
          wrap.style.opacity = "1";
          wrap.style.pointerEvents = "auto";

          if (!inner) return;

          const transitionScroll = Math.max(0, scrollInSlot - contentOverflow);
          const progress = transitionScroll / viewportHeight;

          if (progress <= 0) {
            inner.style.transform = "translate3d(0, 0, 0) scale(1)";
            inner.style.opacity = "1";
            return;
          }

          const scale = Math.max(0.82, 1 - progress * SCALE_STEP);
          const opacity = Math.max(0.35, 1 - progress * OPACITY_STEP);
          const translateY = (progress * -Y_STEP).toFixed(1);

          inner.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale.toFixed(4)})`;
          inner.style.opacity = opacity.toFixed(3);
        });
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
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
      style={{ height: `${projects.length * 100}vh` }}
    >
      {projects.map((_, index) => (
        <div
          key={`snap-${index}`}
          id={`snap-project-${index}`}
          ref={(element) => {
            sentinelRefs.current[index] = element;
          }}
          className="snap-section"
          aria-hidden="true"
          style={{
            position: "absolute",
            top: `calc(${index} * 100vh + ${NAV_HEIGHT}px)`,
            left: 0,
            right: 0,
            height: "100vh",
            pointerEvents: "none",
          }}
        />
      ))}

      <div className="sticky z-10" style={{ top: `${NAV_HEIGHT}px`, willChange: "transform" }}>
        <div style={{ paddingTop: "28px", paddingBottom: "40px" }}>
          <p
            tabIndex={0}
            data-snap-target="#snap-project-0"
            className="section-label focus:outline-none focus-visible:text-accent transition-colors w-fit"
            style={{ marginBottom: 0 }}
          >
            Projects
          </p>
        </div>

        <div className="relative">
          {projects.map((project, index) => (
            <div
              key={project.title}
              data-snap-target={`#snap-project-${index}`}
              tabIndex={-1}
              className="focus:outline-none"
              ref={(element) => {
                wrapRefs.current[index] = element;
              }}
              style={{
                position: index === 0 ? "relative" : "absolute",
                top: index === 0 ? undefined : 0,
                left: index === 0 ? undefined : 0,
                right: index === 0 ? undefined : 0,
                zIndex: index + 1,
                willChange: "transform, opacity",
              }}
            >
              <div
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                style={{ transformOrigin: "top center", willChange: "transform, opacity" }}
              >
                <ProjectCard project={project} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
