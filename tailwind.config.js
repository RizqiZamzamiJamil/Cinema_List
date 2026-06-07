import flowbite from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js}',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        brand: ['Space Grotesk', 'Poppins', 'sans-serif'],
      },
      colors: {
        cinema: {
          ink: '#070a10',
          panel: '#101722',
          mist: '#e5f8ff',
          silver: '#f4f7fb',
          teal: '#19d6f2',
          blue: '#0b8fff',
          navy: '#08224a',
          gold: '#f8c55f',
          coral: '#66b7ff',
        },
      },
      boxShadow: {
        poster: '0 18px 45px rgba(6, 14, 27, 0.28)',
      },
    },
  },
  plugins: [flowbite],
};
