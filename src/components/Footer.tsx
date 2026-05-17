"use client";

import { TechLogo } from "./TechLogo";

export default function Footer() {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Move focus back to the top of the page for keyboard users
    document.getElementById("nav-logo")?.focus({ preventScroll: true });
  };

  return (
    <footer className="mt-20 pb-20 flex flex-col items-center gap-12 border-t border-line">
      <div className="flex flex-col items-center gap-4 pt-16">
        <span className="text-[#444] text-[0.625rem] font-display uppercase tracking-[0.2em]">Built with</span>
        <div className="flex flex-wrap justify-center gap-2 px-6">
          <TechLogo name="Next.js" size={12} />
          <TechLogo name="TypeScript" size={12} />
          <TechLogo name="Tailwind CSS" size={12} />
          <TechLogo name="React" size={12} />
        </div>
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
