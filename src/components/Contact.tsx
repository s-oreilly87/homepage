"use client";

import { useState } from "react";

// Resume email — change handle when GitHub is confirmed
const EMAIL  = "sean@seanoreilly.dev";
const GITHUB = "github.com/s-oreilly87";

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-display text-[0.8125rem] text-dim hover:text-accent transition-colors"
    >
      {children}
    </a>
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
    <section className="animate-contact py-14 pb-28 border-t-2 border-line">

      <p className="section-label">Contact</p>

      <p className="text-dim text-base text-pretty max-w-[38ch] mb-6">
        Open to interesting problems. Feel free to reach out.
      </p>

      <div className="flex items-center flex-wrap gap-5">

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${EMAIL}`}
            onClick={handleEmailClick}
            className="font-display text-[0.8125rem] text-dim hover:text-accent transition-colors"
          >
            {EMAIL}
          </a>
          {copied && (
            <span className="font-display text-[0.6875rem] text-accent">
              copied
            </span>
          )}
        </div>

        <span className="text-line" aria-hidden="true">·</span>

        <ExternalLink href={`https://${GITHUB}`}>{GITHUB}</ExternalLink>

      </div>
    </section>
  );
}
