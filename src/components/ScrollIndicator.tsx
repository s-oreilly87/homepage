"use client";

import { Chevron } from "@/components/icons";
import { TapTarget } from "@/components/TapTarget";
import { scrollToSection } from "@/lib/scroll";

export function ScrollIndicator({ targetId, label }: { targetId: string; label?: string }) {
  return (
    <div className="flex shrink-0 justify-center pb-1">
      <button
        type="button"
        onClick={() => scrollToSection(targetId)}
        aria-label={label ? `Scroll to ${label}` : "Scroll to next section"}
        className="group relative flex h-6 w-12 items-center justify-center text-dim/60 transition-colors hover:text-accent focus:outline-none focus-visible:text-accent"
      >
        <TapTarget />
        <Chevron
          direction="down"
          size={20}
          strokeWidth={1.5}
          className="animate-scroll-hint group-hover:[animation-play-state:paused]"
        />
      </button>
    </div>
  );
}
