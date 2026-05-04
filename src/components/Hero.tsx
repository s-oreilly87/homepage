export default function Hero() {
  return (
    <section id="hero" className="animate-hero snap-section min-h-[90svh] flex flex-col justify-end pb-16">

      {/* Eyebrow */}
      <p className="font-display text-[0.6875rem] tracking-widest uppercase mb-10 flex items-center gap-3">
        <span className="text-[#444]">01</span>
        <span className="inline-block size-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
        <span className="text-accent">Full-Stack Engineer</span>
      </p>

      {/* Name */}
      <h1
        className="font-display text-primary tracking-tight mb-8"
        style={{ fontSize: "clamp(3rem, 11vw, 5.5rem)", lineHeight: 1.0 }}
      >
        Sean<br />O&apos;Reilly
      </h1>

      {/* Accent rule */}
      <div className="w-10 h-px bg-accent mb-8" aria-hidden="true" />

      {/* Bio */}
      <div className="text-dim text-base text-pretty max-w-[50ch] space-y-3 mb-8">
        <p>
          Senior full-stack engineer with 4+ years shipping production
          software end-to-end. I&apos;ve built internal platforms,
          event-driven backend systems, and LLM&thinsp;/&thinsp;AI agent
          pipelines — from ambiguous requirements through to production debugging.
        </p>
        <p>
          Most recently at{" "}
          <span className="text-primary">Nettwerk Music Group</span> via
          Springloaded, building a unified platform in Laravel, React, and
          TypeScript. Before that, ML-assisted tooling in Spring Boot and Vue.js at ATS Engineers.
          Educational background in biochemistry and jazz.
        </p>
      </div>

      {/* Meta */}
      <p className="font-display text-[#666] text-[0.75rem] flex flex-wrap gap-4">
        <span>Remote · NYC</span>
        <span className="text-line" aria-hidden="true">·</span>
        <span>Open to full-time &amp; contract</span>
      </p>

    </section>
  );
}
