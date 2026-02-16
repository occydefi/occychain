/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'occy-dark': '#0A0E27',
        'occy-green': '#00FF88',
        'occy-red': '#FF4444',
        'occy-blue': '#00D9FF',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
