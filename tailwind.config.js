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
          ink: '#101114',
          panel: '#18191f',
          mist: '#e8f5f6',
          teal: '#30d5c8',
          gold: '#f8c55f',
          coral: '#ff6b5f',
        },
      },
      boxShadow: {
        poster: '0 18px 45px rgba(16, 17, 20, 0.22)',
      },
    },
  },
  plugins: [flowbite],
};
