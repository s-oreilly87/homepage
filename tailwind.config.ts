import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0A",
        surface: "#111111",
        border: "#1E1E1E",
        text: "#F0F0F0",
        muted: "#888888",
        accent: "#fb923c",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "monospace"],
        body: ["var(--font-body)", "sans-serif"],
      },
      maxWidth: {
        content: "680px",
      },
    },
  },
  plugins: [],
};

export default config;
