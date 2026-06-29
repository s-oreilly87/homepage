import type { Project } from "@/lib/projects";

export const projectStatusStyles: Record<
  Project["status"],
  { label: string; dotClassName: string }
> = {
  live: { label: "Live", dotClassName: "bg-green-600" },
  "in-progress": { label: "In progress", dotClassName: "bg-accent" },
  "coming-soon": { label: "Coming soon", dotClassName: "bg-[#333]" },
};
