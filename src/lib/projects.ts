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
  github?: string;
  site?: string;
  /** CSS linear-gradient color stops for the placeholder image */
  imagePalette: { from: string; via: string; to: string };
  images?: string[];
}

export const projects: Project[] = [
  {
    title: "Home Theatre Remote",
    description:
      "Multi-protocol AV controller unifying Roku TV, Denon/Marantz AVR, HTPC, and gaming PC into one locally hosted PWA",
    highlights: [
      "Check out the demo linked above! On desktop, see the remotes effects on virtual home theatre devices in real time.",
      "Scene presets orchestrate all devices in sequence — switch inputs, set display resolution, audio mode, and launch the app in one tap",
      "AirMouse streams phone gyroscope data over Socket.io to control the HTPC cursor, with two-point couch calibration",
      "Custom persistent Telnet driver with auto-reconnect extends the limited Denon/Marantz HTTP API",
      "Per-platform automation paths: Windows via EventGhost, Linux Wayland/X11 via ydotool, macOS via robotjs + libnut",
      "PWA — installable from any browser on the local network, swipeable panel layout built for phones",
    ],
    stack: ["Next.js", "TypeScript", "Socket.io", "Tailwind CSS"],
    status: "live",
    imagePalette: {from: "#050d1c", via: "#0a1930", to: "#0d2244"},
    images: ["/images/projects/htpc-remote-1.png", "/images/projects/htpc-remote-2.png", "/images/projects/htpc-remote-3.png"],
    github: "https://github.com/s-oreilly87/htpc-remote",
    href: "https://htpc-remote.seanoreilly.dev",

  },
  {
    title: "Hut Hunter",
    description:
      "Polls NZ DOC booking sites for hard-to-get hut and campsite availability, then automates the booking flow end-to-end through to payment.",
    highlights: [
      "Watches Great Walks and standard huts on a Redis/ARQ schedule — email and Gotify alerts fire the moment a slot opens",
      "Auto-booking: Playwright drives DOC's JS-heavy checkout using saved occupant details and Fernet-encrypted credentials",
      "Live checkout browser exposed over noVNC — complete payment before the 25-minute DOC hold expires",
      "Adapter architecture makes it straightforward to add new booking sites beyond the current DOC flows",
    ],
    stack: ["FastAPI", "React", "Playwright", "ARQ / Redis"],
    status: "live",
    imagePalette: {from: "#060f07", via: "#0b1e0d", to: "#0e2811"},
    images: ["/images/projects/hut-hunter-1.png", "/images/projects/hut-hunter-2.png", "/images/projects/hut-hunter-3.png", "/images/projects/hut-hunter-4.png"],
    href: "https://hut-hunter.seanoreilly.dev",
    github: "https://github.com/s-oreilly87/hut-hunter",

  },
  {
    title: "Beer Engine",
    description:
      "Brewery management software — recipe builder, calculators, brew-day wizard and fermentation tracking. Private SaaS in development.",
    highlights: [
      "Live recipe builder — OG, FG, ABV, IBU, and SRM recalculate on every edit across fermentables, hops, yeast, and mash",
      "AI recipe generator — pick a BJCP style, dial in parameters, add a guiding note, and get a fully built recipe ready to brew",
      "Brew Day Wizard with step-by-step instructions, timestamp buttons, and live timers" +
      "Fermentation gravity tracking with fermentation profile chart",
      "Community recipes with fork-and-edit — recipe ancestry is tracked through parent → child chains",
      "Multi-brewery support with per-brewery inventory across hops, fermentables, yeasts, and misc ingredients",
    ],
    stack: ["Laravel", "Inertia", "React", "AI"],
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
      "Hybrid signal pipeline: PHP/Python compute technical triggers, then Claude validates context from strategy notes, news, catalysts, and open paper positions",
      "Versioned strategy builder with natural-language-to-JSON compilation, deterministic backtests, cooldowns, sizing rules, and immutable prompt/config history",
      "Observable agent runtime with persisted tool calls, structured outputs, token usage, latency, prompt versions, model versions, and per-run cost accounting",
      "Full trading workflow: research workspace, watchlists, market-data ingestion, alerts inbox, Gotify push notifications, and paper portfolio tracking",
    ],
    stack: [
      "Laravel",
      "PHP",
      "Laravel AI",
      "Claude API",
      "Inertia",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "FastAPI",
      "Python",
      "PostgreSQL",
      "TimescaleDB",
    ],
    status: "in-progress",
    imagePalette: { from: "#0b1020", via: "#12312b", to: "#d4a72c" },
  }
];
