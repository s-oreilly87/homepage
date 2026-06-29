import { GitHubGlyph } from "@/components/icons";

interface GithubButtonProps {
  href: string;
  ariaLabel: string;
  /** Icon size in px. Defaults to 17. */
  size?: number;
  /** Show the "GitHub" text label. Defaults to true. */
  showLabel?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export function GithubButton({
  href,
  ariaLabel,
  size = 17,
  showLabel = true,
  onClick,
}: GithubButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onClick={onClick}
      className="flex h-9 items-center gap-1.5 rounded-md px-3 text-faint transition-colors hover:bg-white/5 hover:text-primary"
    >
      {showLabel && (
        <span className="mt-0.5 text-[12px] font-medium tracking-wide uppercase">GitHub</span>
      )}
      <GitHubGlyph size={size} />
    </a>
  );
}
