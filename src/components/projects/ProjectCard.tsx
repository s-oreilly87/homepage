"use client";

import type { Project } from "@/lib/projects";
import { TechLogo } from "@/components/TechLogo";
import { GithubButton } from "@/components/GithubButton";
import { ImageCarousel } from "@/components/projects/ImageCarousel";
import { PlaceholderImage } from "@/components/projects/PlaceholderImage";
import { projectStatusStyles } from "@/components/projects/constants";

/**
 * Strips HTML tags from a string for use in ARIA labels and other plain-text contexts.
 */
function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, "");
}

/**
 * A simple component to render text with support for basic HTML tags and custom <bold>/<italic> tags.
 * Uses dangerouslySetInnerHTML as the content is trusted from the local project data.
 */
function FormattedText({ text }: { text: string }) {
  if (!text) return null;

  const processed = text
    .replace(/<bold>/g, "<strong>")
    .replace(/<\/bold>/g, "</strong>")
    .replace(/<italic>/g, "<em>")
    .replace(/<\/italic>/g, "</em>");

  return <span dangerouslySetInnerHTML={{ __html: processed }} />;
}

type HeightMode = "auto" | "fill";

interface ProjectCardProps {
  project: Project;
  /**
   * "auto" — natural height (normal flow).
   * "fill" — fills its parent's height and scrolls its own content (carousel).
   */
  heightMode?: HeightMode;
}

export function ProjectCard({ project, heightMode = "auto" }: ProjectCardProps) {
  const status = projectStatusStyles[project.status];

  return (
    <article
      className={`relative bg-surface border border-line rounded-2xl group/card p-7 pt-6 transition-colors duration-300 ${
        heightMode === "fill"
          ? "card-scroll h-full overflow-y-auto touch-pan-y no-scrollbar"
          : ""
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/35 to-transparent" />
      {project.images?.length ? (
        <ImageCarousel images={project.images} alt={project.title} />
      ) : (
        <PlaceholderImage palette={project.imagePalette} />
      )}

      <div className="flex items-center gap-2 mb-4">
        <span className={`size-1.5 rounded-full shrink-0 ${status.dotClassName}`} aria-hidden="true" />
        <span className="font-display text-[0.625rem] tracking-wide text-[#777]">
          {status.label}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 mb-3">
        <h3
          tabIndex={!project.href ? 0 : undefined}
          className={`font-display text-primary text-[1.125rem] leading-snug relative group/title flex-1 transition-transform duration-300 origin-left py-1 -my-1 focus:outline-none focus-visible:text-accent ${project.href ? "hover:scale-[1.01] cursor-pointer" : ""}`}
        >
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} - ${stripHtml(project.description)}`}
              className="inline-flex items-center gap-1.5 hover:text-accent group-hover/title:text-accent transition-colors after:absolute after:inset-0 after:z-0"
            >
              {project.title}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent/50 group-hover/title:text-accent transition-colors">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          ) : (
            project.title
          )}
        </h3>

        {(project.github || project.site) && (
          <div className="relative z-10 flex items-center gap-1 shrink-0 mt-0.5">
            {project.github && (
              <GithubButton
                href={project.github}
                ariaLabel={`${project.title} on GitHub`}
                onClick={(event) => event.stopPropagation()}
              />
            )}

            {project.site && (
              <a
                href={project.site}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                aria-label={`${project.title} live site`}
                className="size-7 flex items-center justify-center rounded-md text-[#555] hover:text-primary hover:bg-white/5 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>

      <p className="text-[#aaa] text-sm text-pretty leading-relaxed mb-5 [&_strong]:text-primary/90 [&_strong]:font-semibold [&_b]:text-primary/90 [&_b]:font-semibold [&_em]:text-primary/80 [&_em]:italic [&_i]:text-primary/80 [&_i]:italic">
        <FormattedText text={project.description} />
      </p>

      <ul className="space-y-1.5 mb-6" aria-label="Key features">
        {project.highlights.map((highlight) => (
          <li
            key={highlight}
            className="flex items-start gap-2.5 text-[#777] text-[0.8125rem] leading-snug [&_strong]:text-primary/90 [&_strong]:font-semibold [&_b]:text-primary/90 [&_b]:font-semibold [&_em]:text-primary/80 [&_em]:italic [&_i]:text-primary/80 [&_i]:italic"
          >
            <span className="mt-[0.35em] size-1 rounded-full bg-accent/50 shrink-0" aria-hidden="true" />
            <FormattedText text={highlight} />
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1.5 pt-5 border-t border-line">
        {project.stack.map((name) => (
          <TechLogo key={name} name={name} size={12} />
        ))}
      </div>
    </article>
  );
}
