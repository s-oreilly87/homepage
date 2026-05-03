// Ordered by prominence across resumes
const stackTags = [
  "React / Next.js",
  "PHP / Laravel",
  "TypeScript",
  "Python / FastAPI",
  "Java / Spring Boot",
  "MySQL / PostgreSQL",
  "Redis",
  "Vue.js",
  "Docker",
  "Tailwind CSS",
  "LLM APIs / MCP",
];

export default function Stack() {
  return (
    <section className="animate-stack py-14 border-t-2 border-line">

      <p className="section-label">Stack</p>

      <p className="text-dim text-base text-pretty max-w-[52ch] mb-7">
        Strongest in Laravel and React/Next.js. Also comfortable in Java and
        Python based frameworks. Recently hands-on with LLM API integration and AI agent
        workflows using MCP tooling in production.
      </p>

      <div className="flex flex-wrap gap-2">
        {stackTags.map((tag) => (
          <span
            key={tag}
            className="font-display text-[0.6875rem] text-dim bg-surface border border-line rounded px-2.5 py-1"
          >
            {tag}
          </span>
        ))}
      </div>

    </section>
  );
}
