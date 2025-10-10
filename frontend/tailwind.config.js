/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 따뜻한 스케치북 팔레트
        warm: {
          50: '#fef9f3',
          100: '#fef3e7',
          200: '#fce4c4',
          300: '#fad5a1',
          400: '#f8b75b',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        sketch: {
          cream: '#fffef9',
          sand: '#f5e6d3',
          brown: '#8b7355',
          orange: '#ff9a56',
          coral: '#ff6b6b',
          yellow: '#ffd93d',
          green: '#6bcf7f',
          blue: '#4d96ff',
        },
      },
      fontFamily: {
        hand: ['SejongGeulggot', 'cursive'],
        sketch: ['SejongGeulggot', 'cursive'],
        cute: ['SejongGeulggot', 'cursive'],
      },
      animation: {
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'draw': 'draw 0.5s ease-out',
      },
      keyframes: {
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        draw: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'sketch': '0 4px 6px rgba(139, 115, 85, 0.1), 0 2px 4px rgba(139, 115, 85, 0.06)',
        'paper': '0 8px 16px rgba(139, 115, 85, 0.15), 0 3px 6px rgba(139, 115, 85, 0.1)',
      },
    },
  },
  plugins: [],
};
