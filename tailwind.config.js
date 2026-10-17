/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vcb: {
          dark: '#025938',
          DEFAULT: '#025938',
          green: '#15803d',
          lime: '#65a30d',
          light: '#e8f5e9',
        },
      },
    },
  },
  plugins: [],
};
