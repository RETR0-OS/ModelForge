/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          400: '#FF724C',
          500: '#FF5333',
          600: '#E84A2E',
          700: '#D64229',
        },
      },
    },
  },
  plugins: [],
}

