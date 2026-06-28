import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#152238",
        muted: "#64748b",
        line: "#d8e1ea",
        panel: "#ffffff",
        canvas: "#f5f7fa",
        pine: "#0f5f56",
        pineSoft: "#e8f3ef",
        amberSoft: "#fff4df",
        redSoft: "#fff0ef",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(15, 35, 55, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
