import type { Project } from "@/lib/projects";

export const NAV_HEIGHT = 56;
export const STICKY_TOP_OFFSET = NAV_HEIGHT + 88;
export const CARD_GAP = 32;
export const SCALE_STEP = 0.038;
export const OPACITY_STEP = 0.14;
export const Y_STEP = 10;

export const projectStatusStyles: Record<
  Project["status"],
  { label: string; dotClassName: string }
> = {
  live: { label: "Live", dotClassName: "bg-green-600" },
  "in-progress": { label: "In progress", dotClassName: "bg-accent" },
  polish: { label: "Polishing", dotClassName: "bg-dim" },
  "to-build": { label: "Coming soon", dotClassName: "bg-[#333]" },
  private: { label: "Private", dotClassName: "bg-[#2a2a2a]" },
  "coming-soon": { label: "Coming soon", dotClassName: "bg-[#333]" },
};
