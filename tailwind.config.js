// tailwind.config.js
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      mont: ["var(--font-mont)", ...fontFamily.sans],
      colors: {
        dark: "#1b1b1b",
        light: "#f5f5f5",
        primary: "#B63E96", // 240,86,199
        primaryDark: "#58E6D9", // 80,230,217
      },
      backgroundImage: {
        circularLight:
          "repeating-radial-gradient(rgba(0,0,0,0.7) 2px, #f5f5f5 5px, #f5f5f5 100px)",
        circularDark:
          "repeating-radial-gradient(rgba(255,255,255,0.7) 2px, #1b1b1b 5px, #1b1b1b 100px)",
        circularLightLg:
          "repeating-radial-gradient(rgba(0,0,0,0.7) 2px, #f5f5f5 5px, #f5f5f5 80px)",
        circularDarkLg:
          "repeating-radial-gradient(rgba(255,255,255,0.7) 2px, #1b1b1b 5px, #1b1b1b 80px)",
        circularLightMd:
          "repeating-radial-gradient(rgba(0,0,0,0.4) 2px,#f5f5f5 5px,#f5f5f5 60px)",

        circularDarkMd:
          "repeating-radial-gradient(rgba(255,255,255,0.5) 2px,#1b1b1b 5px,#1b1b1b 60px)",

        circularLightSm:
          "repeating-radial-gradient(rgba(0,0,0,0.4) 2px,#f5f5f5 5px,#f5f5f5 40px)",

        circularDarkSm:
          "repeating-radial-gradient(rgba(255,255,255,0.5) 2px,#1b1b1b 4px,#1b1b1b 40px)",
      },
      keyframes: {
        faultyBulb: {
          "0%": { filter: "drop-shadow(0px 1px 100px #eacf7010)" },
          "25%": { filter: "drop-shadow(0px 1px 100px #eacf7030)" },
          "50%": { filter: "drop-shadow(0px 1px 100px #eacf70)" },
          "75%": { filter: "drop-shadow(0px 1px 100px #eacf7070)" },
          "100%": { filter: "drop-shadow(0px 1px 100px #eacf7030)" },
        },
      },
      animation: {
        faultyBulb: "faultyBulb 1s ease-in-out infinite",
      },
    },
    screens: {
      "2xl": { max: "1535px" },
      // => @media (max-width: 1535px) { ... }

      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }

      xs: { max: "479px" },
      // => @media (max-width: 479px) { ... }
      xxs: { max: "375px" },
    },
  },
  plugins: [],
};
