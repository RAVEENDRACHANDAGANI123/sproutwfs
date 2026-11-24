/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0B4F8A',
          600: '#094070',
          700: '#073257',
        },
        sprout: {
          50: '#f2fbf4',
          100: '#e1f7e6',
          500: '#2E7D32',
          600: '#256628',
          700: '#1c4e1f',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
