"use client";

import type { MouseEvent } from "react";
import { TechLogo } from "./TechLogo";

export default function Footer() {
  const scrollToTop = (event: MouseEvent) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("nav-logo")?.focus({ preventScroll: true });
  };

  return (
    <footer className="mt-20 pb-20 flex flex-col items-center gap-12 border-t border-line">
      <div className="flex flex-col items-center gap-4 pt-16">
        <span className="text-[#444] text-[0.625rem] font-display uppercase tracking-[0.2em]">Built with</span>
        <div className="flex flex-wrap justify-center gap-2 px-6">
          <TechLogo name="Next.js" size={12} />
          <TechLogo name="React" size={12} />
          <TechLogo name="TypeScript" size={12} />
          <TechLogo name="Tailwind CSS" size={12} />
        </div>
        <a
          href="https://github.com/s-oreilly87/homepage.git"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Homepage source on GitHub"
          className="flex items-center gap-1.5 px-2 h-7 rounded-md text-[#555] hover:text-primary hover:bg-white/5 transition-colors"
        >
          <span className="text-[10px] font-medium tracking-wide uppercase mt-0.5">GitHub</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
          </svg>
        </a>
      </div>
      
      <button 
        onClick={scrollToTop}
        className="group flex flex-col items-center gap-3 text-dim hover:text-primary focus:outline-none transition-all duration-300"
        aria-label="Back to top"
      >
        <div className="size-10 rounded-full border border-line flex items-center justify-center group-hover:border-accent/50 group-hover:bg-accent/5 group-focus-visible:border-accent group-focus-visible:bg-accent/5 transition-all duration-300">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5 transition-transform duration-300">
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </div>
        <span className="font-display text-[0.625rem] tracking-[0.2em] uppercase text-[#555] group-hover:text-accent group-focus-visible:text-accent transition-colors">Back to top</span>
      </button>
    </footer>
  );
}
