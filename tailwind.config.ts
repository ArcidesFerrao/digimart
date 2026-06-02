import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B1120",
        surface: "#111827",
        border: "#1e2d45",
        teal: "#00E5CC",
        "teal-dim": "#00b8a4",
        foreground: "#F0F4FF",
        muted: "#8892a4",
        danger: "#FF4D6D",
        warn: "#FFB830",
        green: "#22d68a",
      },
      fontFamily: {
        bebas: ["Bebas Neue", "sans-serif"],
        syne: ["Syne", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default withUt(config);
