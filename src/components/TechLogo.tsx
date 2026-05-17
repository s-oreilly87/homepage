import {
  siReact,
  siNextdotjs,
  siTypescript,
  siLaravel,
  siPhp,
  siPython,
  siFastapi,
  siOpenjdk,
  siSpringboot,
  siMysql,
  siPostgresql,
  siRedis,
  siVuedotjs,
  siDocker,
  siTailwindcss,
  siAnthropic,
  siInertia,
  siTanstack,
  type SimpleIcon,
} from "simple-icons";

/** Map display names → Simple Icons data */
const ICON_MAP: Record<string, SimpleIcon> = {
  React:          siReact,
  "Next.js":      siNextdotjs,
  TypeScript:     siTypescript,
  Laravel:        siLaravel,
  PHP:            siPhp,
  Python:         siPython,
  FastAPI:        siFastapi,
  Java:           siOpenjdk,
  "Spring Boot":  siSpringboot,
  MySQL:          siMysql,
  PostgreSQL:     siPostgresql,
  Redis:          siRedis,
  "Vue.js":       siVuedotjs,
  Docker:         siDocker,
  "Tailwind CSS": siTailwindcss,
  "Claude API":   siAnthropic,
  Anthropic:      siAnthropic,
  Inertia:        siInertia,
  Tanstack:       siTanstack,
};

interface TechLogoProps {
  /** Display name used for icon lookup and label */
  name: string;
  /** Show the text label alongside the icon (default: true) */
  showLabel?: boolean;
  /** Icon size in px (default: 13) */
  size?: number;
  /** Visual variant — "pill" wraps in a bordered container, "bare" is icon+text only */
  variant?: "pill" | "bare";
}

/**
 * Renders a Simple Icons SVG + optional text label for a given tech name.
 * Falls back to a plain text tag if no icon is found.
 */
export function TechLogo({
  name,
  showLabel = true,
  size = 13,
  variant = "pill",
}: TechLogoProps) {
  const icon = ICON_MAP[name];

  // ── No icon found — plain text tag fallback ──────────────────────────────
  if (!icon) {
    return (
      <span className="font-display text-[0.625rem] text-[#777] bg-page border border-line rounded px-2 py-0.5">
        {name}
      </span>
    );
  }

  const svgEl = (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className="fill-current shrink-0"
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );

  if (variant === "bare") {
    return (
      <span className="inline-flex items-center gap-1.5 text-dim">
        {svgEl}
        {showLabel && <span className="font-display text-[0.6875rem]">{name}</span>}
      </span>
    );
  }

  // ── Pill variant ─────────────────────────────────────────────────────────
  return (
    <span className="inline-flex items-center gap-1.5 font-display text-[0.6875rem] text-dim hover:text-primary hover:border-line/60 transition-colors duration-200 bg-surface border border-line rounded-md px-2.5 py-1.5 cursor-default">
      {svgEl}
      {showLabel && name}
    </span>
  );
}
