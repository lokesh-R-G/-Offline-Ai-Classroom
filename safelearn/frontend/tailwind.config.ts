/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "safety-red": "#dc2626",
        "safety-blue": "#0284c7",
        "safety-purple": "#a855f7"
      }
    },
  },
  plugins: [],
}
