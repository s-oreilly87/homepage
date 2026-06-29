export type ProjectStatus = "live" | "in-progress" | "coming-soon";

export interface Project {
  title: string;
  description: string;
  highlights: string[];
  stack: string[];
  status: ProjectStatus;
  href?: string;
  /** When true, the title link is flagged as a live demo (shows a "Demo" label). */
  demo?: boolean;
  github?: string;
  site?: string;
  imagePalette: { from: string; via: string; to: string };
  images?: string[];
}

export const projects: Project[] = [
  {
    title: "Home Theatre Remote",
    description:
      "Multi-protocol AV controller that unifies Roku TV, Denon/Marantz AVR, an HTPC, and a gaming PC into a single, locally hosted PWA.",
    highlights: [
      "<bold>Try the live demo linked above.</bold> On desktop you can watch the remote drive a set of virtual home-theatre devices in real time.",
      "<bold>Scene presets:</bold> orchestrate every device in sequence, switching inputs, display resolution, and audio mode, then launching the app, all in a single tap.",
      "<bold>Air Mouse:</bold> streams phone gyroscope data over Socket.io to move the HTPC cursor, with two-point couch calibration for accuracy from the sofa.",
      "<bold>Custom Telnet driver:</bold> a persistent, auto-reconnecting connection that extends the limited Denon/Marantz HTTP API.",
      "<bold>Cross-platform HTPC automation:</bold> a dedicated control path per OS, using EventGhost on Windows, ydotool on Linux Wayland/X11, and robotjs on macOS.",
      "<bold>Installable PWA:</bold> add it from any browser on the local network, with a swipeable panel layout built for phones.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Socket.io"],
    status: "live",
    imagePalette: {from: "#050d1c", via: "#0a1930", to: "#0d2244"},
    images: ["/images/projects/htpc-remote-1.png", "/images/projects/htpc-remote-2.png", "/images/projects/htpc-remote-3.png"],
    github: "https://github.com/s-oreilly87/htpc-remote",
    href: "https://htpc-remote.seanoreilly.dev",
    demo: true,

  },
  {
    title: "Hut Hunter",
    description:
      "Monitors NZ DOC booking sites for hard-to-get hut and campsite availability, then drives the booking flow automatically, right through to payment.",
    highlights: [
      "<bold>Monitoring:</bold> watches Great Walks and standard huts on a scheduled Redis/ARQ worker.",
      "<bold>Notifications:</bold> email and Gotify alerts fire the instant a slot opens.",
      "<bold>Auto-booking:</bold> Playwright drives the JS-heavy checkout using saved occupant details and Fernet-encrypted credentials.",
      "<bold>Live checkout handoff:</bold> the booking browser is exposed over noVNC, so you can finish payment before the 25-minute DOC hold expires.",
      "<bold>Coming soon:</bold> Canadian provincial-park adapters, plus an AI agent that builds new site adapters for you. A pluggable architecture already makes supporting booking sites beyond NZ DOC straightforward.",
    ],
    stack: ["FastAPI", "React", "TypeScript", "Playwright", "ARQ", "Claude API"],
    status: "live",
    imagePalette: {from: "#060f07", via: "#0b1e0d", to: "#0e2811"},
    images: [
      "/images/projects/hut-hunter-1.png",
      "/images/projects/hut-hunter-2.png",
      "/images/projects/hut-hunter-3.png",
      "/images/projects/hut-hunter-4.png",
      "/images/projects/hut-hunter-5.png",
    ],
    href: "https://hut-hunter.seanoreilly.dev",
    github: "https://github.com/s-oreilly87/hut-hunter",

  },
  {
    title: "Beer Engine",
    description:
      "Brewery management software covering recipe building, calculators, a guided brew day, and fermentation tracking. A private SaaS currently in development.",
    highlights: [
      "<bold>Demo coming soon.</bold> Already fully featured for the home-brewer scope.",
      "<bold>Live recipe builder:</bold> OG, FG, ABV, IBU, and SRM recalculate on every edit across fermentables, hops, yeast, and mash.",
      "<bold>AI recipe generator:</bold> pick a BJCP style, dial in your parameters, add a guiding note, and get back a complete recipe that's ready to brew.",
      "<bold>Brew-day wizard:</bold> step-by-step instructions with timestamp buttons, live timers, and fermentation gravity tracking.",
      "<bold>Community recipe sharing:</bold> fork and edit any recipe, with full ancestry tracked through parent and child chains.",
      "<bold>Multi-brewery support:</bold> separate per-brewery inventory across hops, fermentables, yeasts, and miscellaneous ingredients.",
    ],
    stack: ["Laravel", "Inertia", "React", "TypeScript", "Tailwind CSS", "MariaDB", "Laravel AI"],
    status: "coming-soon",
    imagePalette: {from: "#0f0600", via: "#1c0d00", to: "#221200"},
    images: [
      "/images/projects/beer-engine-1.png",
      "/images/projects/beer-engine-2.png",
      "/images/projects/beer-engine-3.png",
      "/images/projects/beer-engine-4.png",
      "/images/projects/beer-engine-5.png",
    ],
  },
  {
    title: "Trading Alerts",
    description:
      "Agentic trading-research and alerting platform that pairs deterministic market signals with Claude-powered validation, backtesting, paper trading, and full reasoning traceability.",
    highlights: [
      "<bold>Hybrid signal pipeline:</bold> PHP and Python compute the technical triggers, then Claude validates them against strategy notes, news, catalysts, and open paper positions.",
      "<bold>Versioned strategy builder:</bold> compiles natural language into JSON, with deterministic backtests, cooldowns, sizing rules, and an immutable history of every prompt and config.",
      "<bold>Observable agent runtime:</bold> persists every tool call and structured output alongside token usage, latency, prompt and model versions, and per-run cost accounting.",
      "<bold>Complete trading workflow:</bold> research workspace, watchlists, market-data ingestion, an alerts inbox, Gotify push notifications, and paper-portfolio tracking.",
    ],
    stack: [
      "Laravel",
      "Inertia",
      "React",
      "TypeScript",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Laravel Horizon",
      "Laravel AI",
    ],
    status: "in-progress",
    imagePalette: { from: "#0b1020", via: "#12312b", to: "#d4a72c" },
    images: [
      "/images/projects/trading-alerts-1.png",
      "/images/projects/trading-alerts-2.png",
      "/images/projects/trading-alerts-3.png",
    ],
  }
];
