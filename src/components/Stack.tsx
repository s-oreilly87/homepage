import { TechLogo } from "@/components/TechLogo";

// ── Tech stack — ordered by prominence across résumé ─────────────────────
const STACK = [
  // Frontend
  "React", "Next.js", "TypeScript", "Vue.js", "Tailwind CSS", "Tanstack",
  // Backend
  "Laravel", "PHP", "Python", "FastAPI", "Java", "Spring Boot",
  // Data / Infra
  "MySQL", "PostgreSQL", "Redis", "Docker",
  // AI
  "Claude API",
];

export default function Stack() {
  return (
    <section id="stack" className="animate-stack snap-section min-h-svh border-t-2 border-line flex flex-col justify-center pt-16 pb-30">

      <p className="section-label">Stack</p>

      <p className="text-dim text-base text-pretty max-w-[52ch] mb-8">
        Strongest in Laravel and React&thinsp;/&thinsp;Next.js. Also comfortable in Java and
        Python-based frameworks. Recently hands-on with LLM API integration and
        AI agent workflows using MCP tooling in production.
      </p>

      <div className="flex flex-wrap gap-2">
        {STACK.map((name) => (
          <TechLogo key={name} name={name} />
        ))}
      </div>

    </section>
  );
}
