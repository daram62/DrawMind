/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 동화책 파스텔 팔레트
        fairy: {
          50: '#fef7ff',
          100: '#fce8ff',
          200: '#f9d5ff',
          300: '#f5b3ff',
          400: '#ee82ff',
          500: '#e14eff',
          600: '#c92bdb',
          700: '#a820b3',
          800: '#8a1d92',
          900: '#721c76',
        },
        dream: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e6fe',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        storybook: {
          cream: '#fffbf0',
          peach: '#ffd4b8',
          lavender: '#e6d9ff',
          mint: '#d4f4dd',
          sky: '#d4e8ff',
          rose: '#ffd4e5',
        },
      },
      fontFamily: {
        storybook: ['"Caveat"', 'cursive'],
        fairy: ['"Patrick Hand"', 'cursive'],
        dream: ['"Indie Flower"', 'cursive'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'page-turn': 'pageTurn 0.8s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.1)' },
        },
        pageTurn: {
          '0%': { transform: 'rotateY(-90deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"...')",
        'watercolor': 'linear-gradient(135deg, rgba(255,182,193,0.3) 0%, rgba(221,160,221,0.3) 50%, rgba(173,216,230,0.3) 100%)',
      },
      boxShadow: {
        'storybook': '0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)',
        'dreamy': '0 20px 60px rgba(147, 51, 234, 0.15), 0 8px 16px rgba(147, 51, 234, 0.1)',
      },
    },
  },
  plugins: [],
};
