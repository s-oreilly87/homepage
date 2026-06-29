import { siGithub } from "simple-icons";

interface IconProps {
  size?: number;
  className?: string;
}

/** Shared attributes for the line-drawn (stroked) icons. */
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

type ChevronDirection = "up" | "down" | "left" | "right";

const chevronPaths: Record<ChevronDirection, string> = {
  up: "m18 15-6-6-6 6",
  down: "m6 9 6 6 6-6",
  left: "m15 18-6-6 6-6",
  right: "m9 18 6-6-6-6",
};

interface ChevronProps extends IconProps {
  direction: ChevronDirection;
  strokeWidth?: number;
}

export function Chevron({ direction, size = 24, strokeWidth = 2, className }: ChevronProps) {
  return (
    <svg
      {...stroke}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
    >
      <path d={chevronPaths[direction]} />
    </svg>
  );
}

export function ExternalLinkIcon({ size = 14, className }: IconProps) {
  return (
    <svg
      {...stroke}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function CloseIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      {...stroke}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function MailIcon({ size = 13, className }: IconProps) {
  return (
    <svg
      {...stroke}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      strokeWidth={1.25}
      className={`shrink-0 ${className ?? ""}`}
      aria-hidden="true"
    >
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" />
      <path d="M1.5 5L8 9.5L14.5 5" />
    </svg>
  );
}

export function GitHubGlyph({ size = 17, className }: IconProps) {
  return (
    <svg
      role="img"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d={siGithub.path} />
    </svg>
  );
}

export function LinkedInGlyph({ size = 13, className }: IconProps) {
  return (
    <svg
      role="img"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}
