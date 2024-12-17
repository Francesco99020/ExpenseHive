/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      clipPath: {
        hexagon: "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
      },
      colors: {
        'dark-brown': '#6b4701',
        'light-brown': '#896800',
        'orange-brown': '#985b10',
        'bright-yellow': '#f6e000',
        'dark-yellow': '#f9c901',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-clip-path'),
  ],
};