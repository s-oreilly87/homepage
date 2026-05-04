export type ProjectStatus =
  | "in-progress"
  | "polish"
  | "to-build"
  | "private";

export interface Project {
  title: string;
  description: string;
  /** 3–4 short feature / highlight bullets */
  highlights: string[];
  stack: string[];
  status: ProjectStatus;
  href?: string;
  /** CSS linear-gradient color stops for the placeholder image */
  imagePalette: { from: string; via: string; to: string };
}

export const projects: Project[] = [
  {
    title: "Home Theatre PWA",
    description:
      "Multi-protocol AV controller unifying Roku, Denon/Marantz AVR, TV, HTPC, and gaming PC into one progressive web app — no cloud, no latency.",
    highlights: [
      "Real-time device state sync via WebSocket keeps every client in lockstep",
      "Custom Telnet protocol driver for the full Denon/Marantz AVR command set",
      "Roku ECP + TV HTTP APIs unified into a single reactive command bus",
      "Offline-first PWA — installable on any phone or tablet on the local network",
    ],
    stack: ["Next.js", "HTTP", "Telnet", "WebSocket"],
    status: "in-progress",
    imagePalette: { from: "#050d1c", via: "#0a1930", to: "#0d2244" },
    // href: "https://...",
  },
  {
    title: "Hut Hunter",
    description:
      "Polls NZ DOC booking sites for hut and campsite availability, then automates the booking flow end-to-end through to payment.",
    highlights: [
      "Monitors 900+ NZ DOC huts and campsites on a configurable cron schedule",
      "Headless browser navigates DOC's JS-heavy checkout — no public API available",
      "Push and email alerts fire the moment a slot opens for your target dates",
      "Configurable target list, date ranges, and party size per alert rule",
    ],
    stack: ["FastAPI", "React"],
    status: "polish",
    imagePalette: { from: "#060f07", via: "#0b1e0d", to: "#0e2811" },
    // href: "https://...",
  },
  {
    title: "Trading Alerts",
    description:
      "AI agent that monitors market conditions, reasons over a configurable strategy, and fires structured trade alerts to any webhook.",
    highlights: [
      "Claude reasons over live price action against a user-defined strategy prompt",
      "Tracks RSI divergence, EMA crossovers, and unusual volume in real time",
      "Emits structured JSON alerts to webhook — Telegram, Discord, or custom",
      "Paper-trading backtest mode for strategy validation before going live",
    ],
    stack: ["Next.js", "Claude API"],
    status: "to-build",
    imagePalette: { from: "#0f0c00", via: "#1c1500", to: "#241c00" },
  },
  {
    title: "Beer Engine",
    description:
      "Brewery management software — recipe builder, calculators, and brew-day wizard. Private SaaS in development.",
    highlights: [
      "BJCP-compliant recipe builder with IBU, ABV, and SRM calculators",
      "Hop schedule, grain bill, and yeast pitch rate wizard with auto-scaling",
      "Brew-day step timer and batch notes with a printable brew sheet",
      "Multi-batch cellar management and ingredient cost tracking",
    ],
    stack: ["Laravel", "Inertia", "React"],
    status: "private",
    imagePalette: { from: "#0f0600", via: "#1c0d00", to: "#221200" },
  },
];
