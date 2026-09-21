/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
      },
      colors: {
        neon: {
          cyan: "#00fff5",
          pink: "#ff00ff",
          yellow: "#ffff00",
          green: "#39ff14",
          orange: "#ff6600",
          blue: "#0080ff",
          red: "#ff0040",
        },
      },
      animation: {
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },
      },
    },
  },
  plugins: [],
};
