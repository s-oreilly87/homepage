"use client";

import type { MouseEvent } from "react";
import { TechLogo } from "./TechLogo";
import { GithubButton } from "./GithubButton";

export default function Footer() {
  const scrollToTop = (event: MouseEvent) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("nav-logo")?.focus({ preventScroll: true });
  };

  return (
    <footer id="footer" className="mt-auto flex shrink-0 flex-col items-center gap-8 border-t border-line pt-10 pb-4">
      <div className="flex flex-col items-center gap-4 pt-2">
        <span className="font-display text-[0.625rem] tracking-[0.2em] text-faint uppercase">Built with</span>
        <div className="flex flex-wrap justify-center gap-2 px-6">
          <TechLogo name="Next.js" size={12} />
          <TechLogo name="React" size={12} />
          <TechLogo name="TypeScript" size={12} />
          <TechLogo name="Tailwind CSS" size={12} />
        </div>
        <GithubButton
          href="https://github.com/s-oreilly87/homepage.git"
          ariaLabel="Homepage source on GitHub"
        />
      </div>
      
      <button
        tabIndex={0}
        onClick={scrollToTop}
        className="group flex flex-col items-center gap-3 text-dim transition-all duration-300 hover:text-primary focus:outline-none"
        aria-label="Back to top"
      >
        <div className="flex size-10 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:border-accent/50 group-hover:bg-accent/5 group-focus-visible:border-accent group-focus-visible:bg-accent/5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5">
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </div>
        <span className="font-display text-[0.625rem] tracking-[0.2em] text-faint uppercase transition-colors group-hover:text-accent group-focus-visible:text-accent">Back to top</span>
      </button>
    </footer>
  );
}
