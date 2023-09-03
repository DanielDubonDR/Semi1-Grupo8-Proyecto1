/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/*.{js,jsx}',
    "./src/**/*.{js,jsx,ts,tsx}",
  
  ],
  theme: {
    extend: { colors: {
      black: '#040303',
      black2: '#1A1A1A',
      black3: '#2B2B2B',
      h_black: "#121112",
      darkPurple: '#17124a',
      purple: '#663CFF',
      lightPurple: "#984AF0",
      silver: "#CBCBCB",
      white: "#FFFFFF",
      strongPurple: '#8312b8',
    }}
  },

  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}

