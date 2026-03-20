import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forge: {
          bg: "#030407",
          surface: "#070910",
          card: "#0B0D16",
          border: "#12172A",
          "border-hover": "#1C2540",
          red: "#E03020",
          "red-hover": "#B82818",
          gold: "#C88A08",
          "gold-dim": "#241800",
          "gold-bright": "#F0AA20",
          green: "#1E9A5A",
          "green-dim": "#0A1F12",
          blue: "#2060CC",
          purple: "#7040C0",
          orange: "#D06020",
          text: "#E2DDD8",
          muted: "#384060",
          dim: "#161C2C",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      gridTemplateColumns: {
        "forge-layout": "350px 1fr",
      },
    },
  },
  plugins: [],
};

export default config;
