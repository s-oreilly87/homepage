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
      "Multi-protocol AV controller that unifies Roku TV, Denon/Marantz AVR, an HTPC, a gaming PC, and TP-Link smart-home devices into a single, locally hosted PWA — no cloud, no app store, no account.",
    highlights: [
      "<bold>Try the live demo linked above.</bold> On desktop you can watch the remote drive a set of virtual home-theatre devices in real time.",
      "<bold>Scene presets:</bold> orchestrate every device in sequence, switching inputs, display resolution, and audio mode, then launching the app, all in a single tap.",
      "<bold>Air Mouse:</bold> streams phone gyroscope data over Socket.io to move the HTPC cursor, with two-point couch calibration for accuracy from the sofa.",
      "<bold>Custom Telnet driver:</bold> a persistent, auto-reconnecting connection that extends the limited Denon/Marantz HTTP API to surface controls most apps bury in on-screen menus.",
      "<bold>Cross-platform HTPC automation:</bold> a dedicated control path per OS, using EventGhost on Windows, ydotool on Linux Wayland/X11, and robotjs on macOS.",
      "<bold>Local smart-home control:</bold> TP-Link Kasa plugs, switches, and dimmers, all driven over LAN with zero cloud dependency.",
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
      "Monitors New Zealand DOC, BC Parks, Ontario Parks, and Parks Canada booking sites for hard-to-get hut and campsite availability, then drives the booking flow automatically, right through to payment where the site allows it.",
    highlights: [
      "<bold>Monitoring:</bold> watches Great Walks, standard huts, and Canadian provincial-park sites on a scheduled Redis/ARQ worker.",
      "<bold>Notifications:</bold> email and Gotify alerts fire the instant a slot opens.",
      "<bold>Auto-booking:</bold> Playwright drives the JS-heavy checkout using saved occupant details and Fernet-encrypted credentials, proven live against both NZ DOC and Canada's Camis parks platform.",
      "<bold>Live checkout handoff:</bold> the booking browser is exposed over noVNC, so you can finish payment before the hold expires (25 minutes on DOC, 15 on the Canadian parks sites).",
      "<bold>Coming soon:</bold> Newfoundland and Yukon adapters, plus an AI agent that builds new site adapters for you automatically.",
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
      "Brewery management software covering AI-assisted recipe building, ingredient shopping, a guided brew day, and fermentation tracking. A private SaaS currently in development.",
    highlights: [
      "<bold>Demo coming soon.</bold> Already fully featured for the home-brewer scope.",
      "<bold>AI recipe generator:</bold> pick a style, dial in your target ABV/IBU/color, add a guiding note, and get back a complete recipe that's ready to brew, with smart ingredient substitutions when something's out of stock.",
      "<bold>Shop the cheapest ingredients:</bold> live price comparison across every supplier you use, with the lowest-cost bundle for a recipe surfaced automatically.",
      "<bold>Brew-day wizard:</bold> step-by-step instructions with timestamp buttons, live timers, and fermentation gravity tracking, so brew day runs itself.",
      "<bold>Community recipe sharing:</bold> fork and edit any recipe, with full ancestry tracked through parent and child chains.",
      "<bold>Multi-brewery support:</bold> separate per-brewery inventory and shopping lists across hops, fermentables, yeasts, and miscellaneous ingredients.",
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
  },
  {
    title: "ThriftyAI",
    description:
      "A budget-aware control plane for coding agents. It routes every task to the cheapest model that can actually do it, then enforces scope, testing, and review outside the LLM so a cheap local model can't quietly wreck a repo.",
    highlights: [
      "<bold>Cost-aware model routing:</bold> sends routine work to free local models and only escalates to paid cloud models when a task genuinely needs it, with hard per-task and daily spend caps enforced at runtime.",
      "<bold>Local-first:</bold> runs entirely against local models via Ollama for everyday tasks, keeping day-to-day coding cost close to zero.",
      "<bold>Full agent pipeline:</bold> discover, plan, execute, validate, review, and gate, each phase running in an isolated git worktree with automatic repair attempts, so nothing touches your real branch until it's proven safe.",
      "<bold>Benchmarking & grading:</bold> a built-in benchmark suite scores candidate models on real coding tasks, bug-catch rate, edit success, and latency, so routing decisions are backed by evidence, not guesswork.",
      "<bold>Full run visibility:</bold> every run logs per-phase timing, token usage, and cost; a web dashboard for tracking and configuring runs is next up on the roadmap.",
    ],
    stack: ["Python", "Typer", "Ollama", "Claude API", "FastAPI", "React"],
    status: "in-progress",
    imagePalette: { from: "#0d0a1a", via: "#1c1236", to: "#2c1a4a" },
  }
];
