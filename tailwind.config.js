/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#245c4b",
        ink: "#23332d",
        muted: "#788078",
        terracotta: "#b76d54",
        sand: { 50: "#fbfaf6", 100: "#f4f1e9", 200: "#e8e4da" },
      },
      boxShadow: {
        soft: "0 12px 35px rgba(34, 52, 43, .07)",
        lift: "0 22px 50px rgba(34, 52, 43, .13)",
      },
      fontFamily: { sans: ["Readex Pro", "DM Sans", "sans-serif"] },
    },
  },
  plugins: [],
};
