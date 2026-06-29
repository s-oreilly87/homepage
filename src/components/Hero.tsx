import { ScrollIndicator } from "@/components/ScrollIndicator";

export default function Hero() {
  return (
    <section id="hero" className="panel">
      <div className="panel-body flex flex-col">
        <div className="animate-hero my-auto pt-6 pb-10">
      <p className="font-display text-[0.6875rem] tracking-widest uppercase mb-10 flex items-center gap-3">
        <span className="text-[#444]">01</span>
        <span className="inline-block size-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
        <span className="text-accent">Full-Stack Engineer</span>
      </p>

      <h1
        tabIndex={0}
        className="font-display text-primary tracking-tight mb-8 focus:outline-none"
        style={{ fontSize: "clamp(3rem, 11vw, 5.5rem)", lineHeight: 1.0 }}
      >Sean<br />O'Reilly</h1>

      <div className="w-10 h-px bg-accent mb-8" aria-hidden="true" />

      <div className="text-dim text-base text-pretty max-w-[50ch] space-y-3 mb-8">
        <p>
          <span className="text-primary">Senior full-stack engineer</span> with over 4 years shipping production
          software end-to-end. I've built internal platforms,
          <span className="text-primary">event-driven backend systems</span>, and <span className="text-primary">LLM{"\u2009"}/{"\u2009"}AI agent pipelines</span>   — from ambiguous requirements through to production debugging.
        </p>
        <p>
          Most recently at{" "}
          <span className="text-primary">Nettwerk Music Group</span> via
          Springloaded, building a unified platform in Laravel, React, and
          TypeScript. Before that, ML-assisted tooling in Spring Boot and Vue.js
          at <span className="text-primary">ATS Engineers. </span>
          Educational background in biochemistry and jazz performance.
        </p>
      </div>

      <p className="font-display text-[#888] text-[0.75rem] flex flex-wrap gap-4">
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
