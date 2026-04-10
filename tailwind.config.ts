import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        noir: {
          bg: "#0e0e0e",
          surface: "#131313",
          elevated: "#262626",
          deepest: "#000000",
        },
        primary: "#e6ffc6",
        "primary-on": "#284700",
        secondary: "#ccbdff",
        "secondary-dim": "#7d52ff",
        tertiary: "#ffaedf",
        "tertiary-dim": "#ff69b4",
        "on-surface": "#e0e0e0",
        "on-surface-variant": "#9e9e9e",
        ghost: "rgba(72,72,72,0.15)",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        body: ['"Manrope"', "sans-serif"],
      },
      boxShadow: {
        float: "0 20px 40px rgba(0,0,0,0.4)",
        "glow-purple": "0 0 8px #7d52ff",
        "glow-magenta": "0 0 8px #ff69b4",
        "glow-primary": "0 0 8px #e6ffc6",
      },
      fontSize: {
        "label-sm": ["0.6875rem", { lineHeight: "1rem" }],
      },
    },
  },
  plugins: [],
};

export default config;
