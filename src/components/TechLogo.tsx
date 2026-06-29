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
  siMariadb,
  siLaravelhorizon,
  type SimpleIcon,
} from "simple-icons";

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
  MariaDB:        siMariadb,
  PostgreSQL:     siPostgresql,
  Redis:          siRedis,
  "Vue.js":       siVuedotjs,
  Docker:         siDocker,
  "Tailwind CSS": siTailwindcss,
  "Claude API":   siAnthropic,
  Anthropic:      siAnthropic,
  Inertia:        siInertia,
  Tanstack:       siTanstack,
  "Laravel Horizon": siLaravelhorizon,
};

interface TechLogoProps {
  name: string;
  showLabel?: boolean;
  size?: number;
  variant?: "pill" | "bare";
}

export function TechLogo({
  name,
  showLabel = true,
  size = 13,
  variant = "pill",
}: TechLogoProps) {
  const icon = ICON_MAP[name];

  const svgEl = icon ? (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 fill-current"
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  ) : null;

  if (variant === "bare") {
    return (
      <span className="inline-flex items-center gap-1.5 text-dim">
        {svgEl}
        {showLabel && <span className="font-display text-[0.75rem] sm:text-[0.6875rem]">{name}</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex cursor-default items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-2 font-display text-[0.75rem] text-dim transition-colors duration-200 hover:border-line/60 hover:text-primary sm:py-1.5 sm:text-[0.6875rem]">
      {svgEl}
      {showLabel && name}
    </span>
  );
}
