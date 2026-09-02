import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dae8ff",
          200: "#bcd6ff",
          300: "#8dbaff",
          400: "#5793ff",
          500: "#316bff",
          600: "#1a49f5",
          700: "#1638d1",
          800: "#182fa8",
          900: "#1a2d84",
          950: "#131c4f",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(0,0,0,0.05), 0 1px 3px 0 rgba(16,24,40,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
