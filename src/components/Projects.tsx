import { projects, type Project } from "@/lib/projects";

const statusStyle: Record<
  Project["status"],
  { label: string; className: string }
> = {
  "in-progress": { label: "In progress", className: "text-accent" },
  polish:        { label: "Polishing",   className: "text-dim" },
  "to-build":    { label: "Coming soon", className: "text-[#555]" },
  private:       { label: "Private",     className: "text-[#444]" },
};

function ProjectCard({ project }: { project: Project }) {
  const status = statusStyle[project.status];

  // Cards that link get hover lift (transform only — no transition-colors per interactivity guideline)
  const interactiveClasses = project.href
    ? "hover:-translate-y-0.5 hover:border-accent/30 transition-transform cursor-pointer"
    : "";

  const card = (
    <div
      className={[
        "bg-surface border border-line rounded-lg p-5",
        interactiveClasses,
      ]
        .join(" ")
        .trim()}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="font-display text-primary text-[0.875rem] text-balance">
          {project.title}
        </h3>
        <span
          className={`font-display text-[0.6875rem] tracking-wide shrink-0 ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-dim text-sm text-pretty mb-4">
        {project.description}
      </p>

      {/* Stack tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.stack.map((tag) => (
          <span
            key={tag}
            className="font-display text-[0.625rem] text-[#555] bg-page border border-line rounded px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  if (project.href) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} — ${project.description}`}
      >
        {card}
      </a>
    );
  }

  return card;
}

export default function Projects() {
  return (
    <section className="animate-projects py-14 border-t-2 border-line">

      <p className="section-label">Projects</p>

      <div className="grid gap-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>

    </section>
  );
}
