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
      className={`group/card rounded-2xl border border-line bg-surface p-7 pt-6 transition-colors duration-300 ${
        heightMode === "fill"
          ? // Fill the (positioned) wrapper absolutely so the scroll container has a
            // DEFINITE height. A flex-1 height here collapses to content height in
            // Chrome/Firefox (so it never overflows/scrolls) until a relayout is
            // forced — which is why it only worked with DevTools open. Safari was
            // fine either way. Absolute inset sidesteps the flex min-height trap.
            "card-scroll absolute inset-x-px inset-y-0 no-scrollbar touch-pan-y overflow-y-auto"
          : "relative"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/35 to-transparent" />
      {project.images?.length ? (
        <ImageCarousel images={project.images} alt={project.title} />
      ) : (
        <PlaceholderImage palette={project.imagePalette} />
      )}

      <div className="mb-4 flex items-center gap-2">
        <span className={`size-1.5 rounded-full shrink-0 ${status.dotClassName}`} aria-hidden="true" />
        <span className="font-display text-[0.6875rem] tracking-wide text-faint sm:text-[0.625rem]">
          {status.label}
        </span>
      </div>

      <div className="mb-3 flex items-center justify-between gap-3">
        <h3
          tabIndex={!project.href ? 0 : undefined}
          className={`group/title relative -my-1 flex-1 origin-left py-1 font-display text-lg/snug text-primary transition-transform duration-300 focus:outline-none focus-visible:text-accent ${project.href ? "cursor-pointer hover:scale-[1.01]" : ""}`}
        >
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} - ${stripHtml(project.description)}`}
              className="inline-flex items-center gap-1.5 transition-colors group-hover/title:text-accent after:absolute after:inset-0 after:z-0 hover:text-accent"
            >
              {project.title}
              {project.demo && (
                <span className="shrink-0 font-display text-[0.625rem] font-medium tracking-wider text-accent uppercase">
                  Demo
                </span>
              )}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-accent transition-colors">
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
          <div className="relative z-10 mt-0.5 flex shrink-0 items-center gap-1">
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
                className="flex size-7 items-center justify-center rounded-md text-faint transition-colors hover:bg-white/5 hover:text-primary"
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

      <p className="mb-5 text-base/relaxed text-pretty text-dim sm:text-sm [&_b]:font-semibold [&_b]:text-primary/90 [&_em]:text-primary/80 [&_em]:italic [&_i]:text-primary/80 [&_i]:italic [&_strong]:font-semibold [&_strong]:text-primary/90">
        <FormattedText text={project.description} />
      </p>

      <ul className="mb-6 space-y-1.5" aria-label="Key features">
        {project.highlights.map((highlight) => (
          <li
            key={highlight}
            className="flex items-start gap-2.5 text-sm/snug text-dim sm:text-[0.8125rem] [&_b]:font-semibold [&_b]:text-primary/90 [&_em]:text-primary/80 [&_em]:italic [&_i]:text-primary/80 [&_i]:italic [&_strong]:font-semibold [&_strong]:text-primary/90"
          >
            <span className="mt-[0.35em] size-1 shrink-0 rounded-full bg-accent/50" aria-hidden="true" />
            <FormattedText text={highlight} />
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1.5 border-t border-line pt-5">
        {project.stack.map((name) => (
          <TechLogo key={name} name={name} size={12} />
        ))}
      </div>
    </article>
  );
}
