/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      animation: {
        'laser-scan': 'laser 2.5s ease-in-out infinite',
        'radar-pulse': 'radar 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        laser: {
          '0%': { top: '0%', opacity: '0.3' },
          '50%': { top: '100%', opacity: '1' },
          '100%': { top: '0%', opacity: '0.3' },
        },
        radar: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
