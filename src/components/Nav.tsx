"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Stack",    id: "stack" },
  { label: "Projects", id: "projects" },
  { label: "Contact",  id: "contact" },
] as const;

export default function Nav() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    // Observe each section — fires when it crosses the upper 30% of the viewport
    const observers: IntersectionObserver[] = [];

    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-10% 0px -60% 0px", threshold: 0 },
      );

      obs.observe(el);
      observers.push(obs);
    });

    // Also activate hero when near the top
    const heroObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive("hero");
      },
      { rootMargin: "0px 0px -80% 0px", threshold: 0 },
    );
    const hero = document.getElementById("hero");
    if (hero) heroObs.observe(hero);

    return () => {
      observers.forEach((o) => o.disconnect());
      heroObs.disconnect();
    };
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 h-14 flex items-center justify-between px-6"
      style={{
        background: "rgba(10,10,10,0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Logo / name */}
      <button
        id="nav-logo"
        onClick={() => scrollTo("hero")}
        className="font-display text-[0.6875rem] tracking-widest text-accent hover:text-primary transition-colors duration-200 uppercase"
      >
        Sean O&apos;Reilly
      </button>

      {/* Section links */}
      <nav className="flex items-center gap-7" aria-label="Page sections">
        {NAV_LINKS.map(({ label, id }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={[
                "relative font-display text-[0.6875rem] tracking-wide transition-colors duration-200",
                isActive ? "text-primary" : "text-[#666] hover:text-dim",
              ].join(" ")}
              aria-current={isActive ? "true" : undefined}
            >
              {label}
              {/* Active underline dot */}
              {isActive && (
                <span
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-accent"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
