import type { Config } from "tailwindcss";

// Palette et typographies de la charte Casanova Beauty & Spa
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "casanova-gold": "#FFD700",
        "casanova-black": "#1A1A1A",
        "casanova-white": "#F5F5F5",
        "casanova-pink": "#FF69B4",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-montserrat)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)",
      },
      boxShadow: {
        gold: "0 10px 40px -10px rgba(255, 215, 0, 0.35)",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out forwards",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
