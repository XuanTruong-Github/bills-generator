/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#70A800',
          hover: '#619200',
          dark: '#527b00',
          light: '#f2f8e6',
          foreground: '#ffffff',
        },
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
