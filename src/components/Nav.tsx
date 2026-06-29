"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Stack",    id: "stack" },
  { label: "Projects", id: "projects" },
  { label: "Contact",  id: "contact" },
] as const;

export default function Nav() {
  const [active, setActive] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  function scrollTo(id: string) {
    setMenuOpen(false);
    const target = document.getElementById(id);
    if (!target) return;

    // Panels reserve the nav height internally and snap to their own top.
    const top = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: "smooth" });
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
      <button
        id="nav-logo"
        onClick={() => scrollTo("hero")}
        className="font-display text-[0.6875rem] tracking-widest text-accent hover:text-primary transition-colors duration-200 uppercase"
      >Sean O&apos;Reilly</button>

      {/* Desktop / tablet inline nav */}
      <nav className="hidden sm:flex items-center gap-7" aria-label="Page sections">
        {NAV_LINKS.map(({ label, id }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={[
                "relative font-display text-[0.6875rem] tracking-wide transition-colors duration-200",
                isActive ? "text-primary" : "text-faint hover:text-primary",
              ].join(" ")}
              aria-current={isActive ? "true" : undefined}
            >
              {label}
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

      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        className="relative -mr-2 flex size-10 items-center justify-center text-dim hover:text-primary transition-colors sm:hidden focus:outline-none focus-visible:text-accent"
      >
        <span className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden" aria-hidden="true" />
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
          {menuOpen ? (
            <>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </>
          ) : (
            <>
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile menu panel */}
      {menuOpen && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 top-14 z-40 cursor-default bg-page/40 sm:hidden"
          />
          <nav
            id="mobile-menu"
            aria-label="Page sections"
            className="absolute inset-x-0 top-full z-50 flex flex-col border-b border-line bg-page/95 px-6 py-3 backdrop-blur-md sm:hidden"
          >
            {NAV_LINKS.map(({ label, id }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={[
                    "flex items-center gap-2.5 py-3 font-display text-[0.8125rem] tracking-wide transition-colors",
                    isActive ? "text-primary" : "text-dim hover:text-primary",
                  ].join(" ")}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span
                    className={`size-1 rounded-full ${isActive ? "bg-accent" : "bg-line"}`}
                    aria-hidden="true"
                  />
                  {label}
                </button>
              );
            })}
          </nav>
        </>
      )}
    </header>
  );
}
