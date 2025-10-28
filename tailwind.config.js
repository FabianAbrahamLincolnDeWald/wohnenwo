// tailwind.config.js — für Tailwind CSS v4

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#facc15', // Tailwind yellow-400
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  safelist: [
    "rounded-t-[var(--img-radius)]", // für steuerbaren Bildradius in Overlays
  ],
};
