export type ProjectStatus =
  | "in-progress"
  | "polish"
  | "to-build"
  | "private";

export interface Project {
  title: string;
  description: string;
  stack: string[];
  status: ProjectStatus;
  statusLabel: string;
  href?: string;
}

export const projects: Project[] = [
  {
    title: "Home Theatre PWA",
    description:
      "Multi-protocol AV controller syncing Roku, Denon/Marantz AVR, TV, HTPC, and gaming PC actions from a single progressive web app.",
    stack: ["Next.js", "HTTP", "Telnet", "WebSocket"],
    status: "in-progress",
    statusLabel: "Demo in progress",
    // href: "https://...",
  },
  {
    title: "Hut Hunter",
    description:
      "Polls NZ DOC booking websites for hut and campsite availability, automates the booking flow through to payment.",
    stack: ["FastAPI", "React"],
    status: "polish",
    statusLabel: "Polishing",
    // href: "https://...",
  },
  {
    title: "Trading Alerts",
    description:
      "AI agent that monitors market conditions, reasons over strategy, and fires structured trade alerts.",
    stack: ["Next.js", "Claude API"],
    status: "to-build",
    statusLabel: "Coming soon",
  },
  {
    title: "Beer Engine",
    description:
      "Brewery Management Software - v1 Recipe creator, calculators, and brew-day wizard. Private — launch info coming soon...",
    stack: ["Laravel", "Inertia", "React"],
    status: "private",
    statusLabel: "Private",
  },
];
