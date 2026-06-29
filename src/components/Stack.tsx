import { TechLogo } from "@/components/TechLogo";
import { ScrollIndicator } from "@/components/ScrollIndicator";

const STACK: Record<string, string[]> = {
  Frontend:                 ["React", "Next.js", "TypeScript", "Vue.js", "Tailwind CSS", "Tanstack"],
  Backend:                  ["PHP", "Laravel", "Inertia", "Python", "FastAPI", "Java", "Spring Boot"],
  "Database & Queues":      ["MySQL", "MariaDB", "PostgreSQL", "Redis", "Laravel Horizon"],
  "DevOps & AI":            ["Docker", "Claude API", "Laravel AI"],
};

export default function Stack() {
  return (
    <section id="stack" className="panel">
      <div className="pt-6 pb-2">
        <p tabIndex={0} className="section-label w-fit transition-colors focus:outline-none focus-visible:text-accent">Stack</p>
      </div>

      <div className="panel-body flex animate-panel flex-col gap-8 pb-10">
        <p className="max-w-[52ch] text-base/7 text-pretty text-dim sm:text-base">
          I'm at my best building with <span className="text-primary">Laravel</span> and <span className="text-primary">React{"\u2009"}/{"\u2009"}Next.js</span> on a <span className="text-primary">TypeScript</span> foundation,
          and just as comfortable in <span className="text-primary">Java</span> and <span className="text-primary">Python</span> frameworks or a <span className="text-primary">Vue.js</span> frontend.
          Lately I've been deep in <span className="text-primary">LLM API integration</span> and agentic workflows, wiring up MCP tooling that holds up in production.
        </p>

        <div className="flex flex-col gap-6">
          {Object.entries(STACK).map(([group, names]) => (
            <div key={group}>
              <p className="mb-2.5 font-display text-[0.6875rem] tracking-widest text-faint uppercase">{group}</p>
              <div className="flex flex-wrap gap-2">
                {names.map((name) => (
                  <TechLogo key={name} name={name} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ScrollIndicator targetId="projects" label="Projects" />
    </section>
  );
}
