export type ProjectStatus =
  | "in-progress"
  | "polish"
  | "to-build"
  | "private"
  | "coming-soon"
  | "live";

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
      "Multi-protocol AV controller unifying Roku TV, Denon/Marantz AVR, HTPC, and gaming PC control into one locally hosted PWA",
    highlights: [
      "<bold>Check out the demo linked above!</bold> On desktop, see the remote's effects on virtual home theatre devices in real time.",
      "<bold>Scene presets</bold> orchestrate all devices in sequence — switch inputs, set display resolution, audio mode, and launch the app in one tap",
      "<bold>Air Mouse</bold> streams phone gyroscope data over Socket.io to control the HTPC cursor, with two-point couch calibration",
      "<bold>Custom persistent Telnet driver</bold> with auto-reconnect extends the limited Denon/Marantz HTTP API",
      "<bold>HTPC automation</bold> with per device control paths - Windows via EventGhost, Linux Wayland/X11 via ydotool, macOS via robotjs",
      "<bold>PWA</bold> installable from any browser on the local network, with a swipeable panel layout built for phones",
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
      "Polls NZ DOC booking sites for hard-to-get hut and campsite availability, then automates the booking flow end-to-end through to payment.",
    highlights: [
      "<bold>Monitoring:</bold> Watches Great Walks and standard huts on a Redis/ARQ schedule.",
      "<bold>Notifications:</bold> Email and Gotify alerts fire the moment a slot opens.",
      "<bold>Auto-booking:</bold> Playwright drives JS-heavy checkout flows using saved occupant details and Fernet-encrypted credentials",
      "<bold>Live checkout browser</bold> exposed over noVNC — complete payment before the 25-minute NZ DOC hold expires",
      "<bold>Coming Soon: Canadian provincial park adapters + AI agent custom adapter builder flow!</bold>  Adapter architecture makes it straightforward to add new booking sites beyond the current NZ DOC flows",
    ],
    stack: ["FastAPI", "React", "Typescript", "Playwright", "ARQ", "Claude API"],
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
      "Brewery management software — recipe builder, calculators, brew-day wizard and fermentation tracking. Private SaaS in development.",
    highlights: [
      "<bold>Coming Soon: Demo!</bold> Fully featured for the home-brewer scope.",
      "<bold>Live recipe builder</bold> — OG, FG, ABV, IBU, and SRM recalculate on every edit across fermentables, hops, yeast, and mash",
      "<bold>AI recipe generator</bold> — pick a BJCP style, dial in parameters, add a guiding note, and get a fully built recipe ready to brew",
      "<bold>Brew Day wizard</bold> with step-by-step instructions, timestamp buttons, live timers, and fermentation gravity tracking",
      "<bold>Community recipe sharing</bold> with fork-and-edit — recipe ancestry is tracked through parent → child chains",
      "<bold>Multi-brewery support</bold> with per-brewery inventory across hops, fermentables, yeasts, and misc ingredients",
    ],
    stack: ["Laravel", "Inertia", "React", "Typescript", "Tailwind CSS", "MariaDB", "Laravel AI"],
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
      "Agentic trading research and alerting platform that combines deterministic market signals with Claude-powered validation, backtesting, paper trading, and full reasoning traceability.",
    highlights: [
      "<bold>Hybrid signal pipeline:</bold> PHP/Python compute technical triggers, then Claude validates context from strategy notes, news, catalysts, and open paper positions",
      "<bold>Versioned strategy builder</bold> with natural-language-to-JSON compilation, deterministic backtests, cooldowns, sizing rules, and immutable prompt/config history",
      "<bold>Observable agent runtime</bold> with persisted tool calls, structured outputs, token usage, latency, prompt versions, model versions, and per-run cost accounting",
      "<bold>Full trading workflow</bold>: research workspace, watchlists, market-data ingestion, alerts inbox, Gotify push notifications, and paper portfolio tracking",
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
