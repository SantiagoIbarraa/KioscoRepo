/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FAF0E6',
          100: '#F5F5DC',
          200: '#DDD0B8',
          300: '#D2B48C',
          400: '#BC9A6A',
          500: '#A0522D',
          600: '#8B4513',
          700: '#654321',
          800: '#4A2C2A',
          900: '#2F1B14',
        },
        cream: {
          50: '#FFFEF7',
          100: '#FEFBF0',
          200: '#FAF0E6',
          300: '#F5F5DC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};