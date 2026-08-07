/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f1f6fa",
          100: "#dce8f3",
          200: "#bdd4e7",
          300: "#92b8d5",
          400: "#6497bf",
          500: "#437aa8",
          600: "#285b91",
          700: "#1f4772",
          800: "#1d3c5e",
          900: "#1b334f",
        },
        accent: {
          50: "#f7f7f6",
          100: "#efefed",
          200: "#dfdfdc",
          300: "#c8c8c3",
          400: "#a9aaa4",
          500: "#8c8e87",
          600: "#70736d",
          700: "#5a5d58",
          800: "#494b47",
          900: "#3d3f3c",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "bounce-slow": "bounce 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
