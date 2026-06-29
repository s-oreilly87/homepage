"use client";

export function ScrollIndicator({ targetId, label }: { targetId: string; label?: string }) {
  function handleClick() {
    const target = document.getElementById(targetId);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: "smooth" });
  }

  return (
    <div className="shrink-0 flex justify-center pb-1">
      <button
        type="button"
        onClick={handleClick}
        aria-label={label ? `Scroll to ${label}` : "Scroll to next section"}
        className="group relative flex h-6 w-12 items-center justify-center text-dim/60 transition-colors hover:text-accent focus:outline-none focus-visible:text-accent"
      >
        <span className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden" aria-hidden="true" />
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-scroll-hint group-hover:[animation-play-state:paused]"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
