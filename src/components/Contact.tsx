"use client";

import { useState } from "react";
import { siGithub } from "simple-icons";

// Resume email — change handle when GitHub is confirmed
const EMAIL  = "sean@seanoreilly.dev";
const GITHUB = "github.com/s-oreilly87";

// ── Inline SVG icons ─────────────────────────────────────────────────────
function MailIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width={13}
      height={13}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" />
      <path d="M1.5 5L8 9.5L14.5 5" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={13}
      height={13}
      fill="currentColor"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d={siGithub.path} />
    </svg>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  function handleEmailClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <section id="contact" className="animate-contact snap-section min-h-svh border-t-2 border-line flex flex-col justify-center pt-16 pb-30">

      <p className="section-label">Contact</p>

      <p className="text-dim text-base text-pretty max-w-[38ch] mb-6">
        Open to interesting problems. Feel free to reach out.
      </p>

      <div className="flex items-center flex-wrap gap-5">

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${EMAIL}`}
            onClick={handleEmailClick}
            className="flex items-center gap-2 font-display text-[0.8125rem] text-dim hover:text-accent transition-colors"
          >
            <MailIcon />
            {EMAIL}
          </a>
          {copied && (
            <span className="font-display text-[0.6875rem] text-accent">
              copied
            </span>
          )}
        </div>

        <span className="text-line" aria-hidden="true">·</span>

        <a
          href={`https://${GITHUB}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-display text-[0.8125rem] text-dim hover:text-accent transition-colors"
        >
          <GitHubIcon />
          {GITHUB}
        </a>

      </div>
    </section>
  );
}
