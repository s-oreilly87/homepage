"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { GitHubGlyph, LinkedInGlyph, MailIcon } from "@/components/icons";

const EMAIL  = "sean@seanoreilly.dev";
const GITHUB = "github.com/s-oreilly87";
const LINKEDIN = "linkedin.com/in/sean-o-reilly-78815124a";

export default function Contact({ children }: { children?: ReactNode }) {
  const [copied, setCopied] = useState(false);

  function handleEmailClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <section id="contact" className="panel">
      <div className="pt-6 pb-2">
        <p tabIndex={0} className="section-label w-fit transition-colors focus:outline-none focus-visible:text-accent">Contact</p>
      </div>

      <div className="panel-body flex animate-panel flex-col">
        <div className="flex flex-1 flex-col justify-center">
          <p className="mb-6 max-w-[38ch] text-base/7 text-pretty text-dim sm:text-base">
            If you’re hiring, or you have a project that needs someone who can take it from idea to production and own the whole thing, I’d love to hear from you.
            <br /><br />
            Always happy to talk through full-time roles, contract work, or collaborating on something ambitious.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">

            <div className="flex items-center gap-2">
              <a
                href={`mailto:${EMAIL}`}
                onClick={handleEmailClick}
                className="flex items-center gap-2 font-display text-[0.875rem] text-dim transition-colors hover:text-accent sm:text-[0.8125rem]"
              >
                <MailIcon size={13} />
                {EMAIL}
              </a>
              {copied && (
                <span className="font-display text-[0.6875rem] text-accent">
                  copied
                </span>
              )}
            </div>

            <span className="text-line max-sm:hidden" aria-hidden="true">·</span>

            <a
              href={`https://${GITHUB}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-display text-[0.875rem] text-dim transition-colors hover:text-accent sm:text-[0.8125rem]"
            >
              <GitHubGlyph size={13} className="shrink-0" />
              {GITHUB}
            </a>

            <span className="text-line max-sm:hidden" aria-hidden="true">·</span>

            <a
              href={`https://${LINKEDIN}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-display text-[0.875rem] text-dim transition-colors hover:text-accent sm:text-[0.8125rem]"
            >
              <LinkedInGlyph size={13} className="shrink-0" />
              {LINKEDIN}
            </a>

          </div>
        </div>

        {children}
      </div>
    </section>
  );
}
