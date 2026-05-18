"use client";

import { useState } from "react";
import { siGithub } from "simple-icons";

const EMAIL  = "sean@seanoreilly.dev";
const GITHUB = "github.com/s-oreilly87";
const LINKEDIN = "linkedin.com/in/sean-o-reilly-78815124a";

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

      <p tabIndex={0} className="section-label focus:outline-none focus-visible:text-accent transition-colors w-fit">Contact</p>

      <p className="text-dim text-base text-pretty max-w-[38ch] mb-6">
        Open to building ambitious projects and solving complex problems. Feel free to reach out.
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

        <a
          href={`https://${LINKEDIN}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-display text-[0.8125rem] text-dim hover:text-accent transition-colors"
        >
          <LinkedInIcon />
          {LINKEDIN}
        </a>

      </div>
    </section>
  );
}

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

function LinkedInIcon() {
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
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}


