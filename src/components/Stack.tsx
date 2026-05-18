import { TechLogo } from "@/components/TechLogo";

const STACK: Record<string, string[]> = {
  Frontend:      ["React", "Next.js", "TypeScript", "Vue.js", "Tailwind CSS", "Tanstack"],
  Backend:       ["Laravel", "PHP", "Python", "FastAPI", "Java", "Spring Boot"],
  "Database & Queues":      ["MySQL", "MariaDB", "PostgreSQL", "Redis", "Laravel Horizon"],
  "DevOps & AI": ["Docker", "Claude API", "Laravel AI"],
};

export default function Stack() {
  return (
    <section id="stack" className="animate-stack snap-section min-h-svh border-t-2 border-line flex flex-col justify-center pt-16 pb-30">

      <p tabIndex={0} className="section-label focus:outline-none focus-visible:text-accent transition-colors w-fit">Stack</p>

      <p className="text-dim text-base text-pretty max-w-[52ch] mb-8">
        I'm strongest building with <span className="text-primary">Laravel</span> and <span className="text-primary">React{"\u2009"}/{"\u2009"}Next.js</span> with <span className="text-primary">Typescript</span>.
        Also very comfortable in <span className="text-primary">Java</span> and<span className="text-primary"> Python</span> frameworks and <span className="text-primary">Vue.js</span> frontends.
        Recently hands-on with <span className="text-primary">LLM API integration</span> and AI agent workflows using MCP tooling in production.
      </p>

      <div className="flex flex-col gap-6">
        {Object.entries(STACK).map(([group, names]) => (
          <div key={group}>
            <p className="text-[0.6875rem] font-display text-dim/50 uppercase tracking-widest mb-2.5">{group}</p>
            <div className="flex flex-wrap gap-2">
              {names.map((name) => (
                <TechLogo key={name} name={name} />
              ))}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
