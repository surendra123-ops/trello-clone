/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trello: {
          blue: '#0079bf',
          'blue-dark': '#026aa7',
        },
      },
    },
  },
  plugins: [],
}