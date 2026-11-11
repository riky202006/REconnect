/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-black': '#121411',
        'brand-bg': '#F3F4F1',
        'brand-paper': '#E5E6E1',
        'brand-chartreuse': '#DDF247',
        'brand-pink': '#FF6FA5',
        'brand-blue': '#8FD3F4',
        'brand-orange': '#FFB04A',
        'brand-urgent': '#FF5A36',
      },
      fontFamily: {
        heading: ['"Archivo Narrow"', 'sans-serif'],
        body: ['"Hanken Grotesk"', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        'hard-sm': '2px 2px 0px #121411',
        'hard': '3px 3px 0px #121411',
        'hard-card': '4px 4px 0px #121411',
        'hard-lg': '6px 6px 0px #121411',
        'hard-xl': '8px 8px 0px #121411',
      },
      borderWidth: {
        '3': '3px',
      },
      borderRadius: {
        'neo': '5px',
      }
    },
  },
  plugins: [],
}

