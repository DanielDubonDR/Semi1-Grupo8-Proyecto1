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
      purple: '#663CFF',
      lightPurple: "#984AF0",
      silver: "#CBCBCB",
      white: "#FFFFFF",
    }}
  },

  plugins: [],
}

