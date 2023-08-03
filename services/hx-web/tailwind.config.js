const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui'],
        body: ['nunito', 'sans-serif'],
        display: ['Oswald', 'sans-serif'],
      },
      colors: {
        body: '#fcfcfc',
        primary: '#0D1321',
        dark: '#0D1321',
        // dark: "rgba(11, 13, 19, 1)",
        'light-dark': '#171e2e',
        // "light-dark": "rgba(17, 20, 33, 1)",
        'sidebar-body': '#F8FAFC',
      },
      boxShadow: {
        main: '0px 6px 18px rgba(0, 0, 0, 0.04)',
        light: '0px 4px 4px rgba(0, 0, 0, 0.08)',
        large: '0px 8px 16px rgba(17, 24, 39, 0.1)',
        card: '0px 2px 6px rgba(0, 0, 0, 0.06)',
        transaction: '0px 8px 16px rgba(17, 24, 39, 0.06)',
        expand: '0px 0px 50px rgba(17, 24, 39, 0.2)',
        button:
          '0px 2px 4px rgba(0, 0, 0, 0.06), 0px 4px 6px rgba(0, 0, 0, 0.1)',
      },
      dropShadow: {
        main: '0px 4px 8px rgba(0, 0, 0, 0.08)',
      },
      fontSize: {
        '13px': ['13px', '18px'],
      },
      backgroundImage: {
        'bg-emblem-gold': "url('images/ranked-emblem/emblem-gold.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        blink: 'blink 1.4s infinite both;',
        'move-up': 'moveUp 500ms infinite alternate',
        'scale-up': 'scaleUp 500ms infinite alternate',
        'drip-expand': 'expand 500ms ease-in forwards',
        'drip-expand-large': 'expand-large 600ms ease-in forwards',
        'move-up-small': 'moveUpSmall 500ms infinite alternate',
      },
      keyframes: {
        blink: {
          '0%': { opacity: 0.2 },
          '20%': { opacity: 1 },
          '100%': { opacity: 0.2 },
        },
        expand: {
          '0%': {
            opacity: 0,
            transform: 'scale(1)',
          },
          '30%': {
            opacity: 1,
          },
          '80%': {
            opacity: 0.5,
          },
          '100%': {
            transform: 'scale(30)',
            opacity: 0,
          },
        },
        'expand-large': {
          '0%': {
            opacity: 0,
            transform: 'scale(1)',
          },
          '30%': {
            opacity: 1,
          },
          '80%': {
            opacity: 0.5,
          },
          '100%': {
            transform: 'scale(96)',
            opacity: 0,
          },
        },
        moveUp: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-20px)' },
        },
        moveUpSmall: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-10px)' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        /* Hide scrollbar for Chrome, Safari and Opera */
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },

        /* Hide scrollbar for IE, Edge and Firefox */
        '.no-scrollbar': {
          '-ms-overflow-style': 'none' /* IE and Edge */,
          'scrollbar-width': 'none' /* Firefox */,
        },
      });
    }),
  ],
};
