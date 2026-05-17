import type { Project } from "@/lib/projects";
import { TechLogo } from "@/components/TechLogo";
import { ImageCarousel } from "@/components/projects/ImageCarousel";
import { PlaceholderImage } from "@/components/projects/PlaceholderImage";
import { projectStatusStyles } from "@/components/projects/constants";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const status = projectStatusStyles[project.status];

  return (
    <article className="relative bg-surface border border-line rounded-2xl overflow-hidden group/card p-7 pt-6 transition-colors duration-300">
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

      <div className="flex items-start justify-between gap-3 mb-3">
        <h3
          tabIndex={!project.href ? 0 : undefined}
          className={`font-display text-primary text-[1.125rem] leading-snug relative group/title flex-1 transition-transform duration-300 origin-left py-1 -my-1 focus:outline-none focus-visible:text-accent ${project.href ? "hover:scale-[1.01] cursor-pointer" : ""}`}
        >
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} - ${project.description}`}
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
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                aria-label={`${project.title} on GitHub`}
                className="flex items-center gap-1.5 px-2 h-7 rounded-md text-[#555] hover:text-primary hover:bg-white/5 transition-colors"
              >
                <span className="text-[10px] font-medium tracking-wide uppercase mt-0.5">GitHub</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
                </svg>
              </a>
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

      <p className="text-dim text-sm text-pretty leading-relaxed mb-5">
        {project.description}
      </p>

      <ul className="space-y-1.5 mb-6" aria-label="Key features">
        {project.highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-2.5 text-[#777] text-[0.8125rem] leading-snug">
            <span className="mt-[0.35em] size-1 rounded-full bg-accent/50 shrink-0" aria-hidden="true" />
            {highlight}
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
