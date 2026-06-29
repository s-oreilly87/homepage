import { ScrollIndicator } from "@/components/ScrollIndicator";

export default function Hero() {
  return (
    <section id="hero" className="panel">
      <div className="panel-body flex flex-col">
        <div className="my-auto animate-hero pt-6 pb-10">
          <p className="mb-10 flex items-center gap-3 font-display text-[0.6875rem] tracking-widest uppercase">
            <span className="text-faint">01</span>
            <span className="inline-block size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            <span className="text-accent">Full-Stack Engineer</span>
          </p>

          <h1
            tabIndex={0}
            className="mb-8 font-display tracking-tight text-primary focus:outline-none"
            style={{ fontSize: "clamp(3rem, 11vw, 5.5rem)", lineHeight: 1.0 }}
          >Sean<br />O'Reilly</h1>

          <div className="mb-8 h-px w-10 bg-accent" aria-hidden="true" />

          <div className="mb-8 max-w-[50ch] space-y-3 text-base text-pretty text-dim">
            <p>
              <span className="text-primary">Senior full-stack engineer</span> with over 4 years shipping production
              software end to end. I've built internal platforms,{" "}
              <span className="text-primary">event-driven backend systems</span>, and <span className="text-primary">LLM{"\u2009"}/{"\u2009"}AI agent pipelines</span>, owning each one from ambiguous requirements through to production debugging.
            </p>
            <p>
              Most recently at{" "}
              <span className="text-primary">Nettwerk Music Group</span> through
              Springloaded, building a unified platform in Laravel, React, and
              TypeScript. Before that, ML-assisted tooling in Spring Boot and Vue.js
              at <span className="text-primary">ATS Engineers.</span>{" "}
              Academic background in biochemistry and jazz performance, which is a roundabout way of saying I like learning hard things and seeing them through.
            </p>
          </div>

          <p className="flex flex-wrap gap-4 font-display text-[0.8125rem] text-dim sm:text-[0.75rem]">
            <span>Remote · NYC</span>
            <span className="text-line" aria-hidden="true">·</span>
            <span>Open to full-time & contract</span>
          </p>
        </div>
      </div>
      <ScrollIndicator targetId="stack" label="Stack" />
    </section>
  );
}
