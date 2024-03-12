module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      DEFAULT: '0.3rem',
      md: '0.375rem',
      lg: '0.5rem',
      full: '9999px',
      large: '12px',
    },
    fontFamily: {
      display: ['JetBrains mono', 'monospace'],
      roboto: ['var(--font-roboto-condensed)', 'JetBrains Mono', 'monospace'],
      title: ['var(--font-kanit)', 'JetBrains Mono', 'monospace'],
      'source-sans': ['var(--font-source-sans)', 'JetBrains Mono', 'monospace'],
      beaufort: ['var(--font-beaufort)', 'JetBrains Mono', 'monospace'],
    },
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    screens: {
      xs: '500px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1780px',
      '4xl': '2160px', // only need to control product grid mode in ultra 4k device
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-goldman-sans)', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: '#e2b714',
        body: '#95a5a6',
        title: '#fafafa',
        // dark: '#16191f',
        dark: 'rgb(9, 9, 11)',
        'light-dark': '#1f1f1f',
        primary: '#21252d',
        border: 'hsl(var(--border))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        muted: 'hsl(var(--muted))',
        background: 'hsl(var(--background))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      spacing: {
        13: '3.375rem',
      },
      margin: {
        '1/2': '50%',
      },
      padding: {
        full: '100%',
      },
      width: {
        'calc-320': 'calc(100% - 320px)',
        'calc-358': 'calc(100% - 358px)',
      },
      borderWidth: {
        3: '3px',
      },
      boxShadow: {
        sketch: '4px 4px 0px 0px rgba(0, 0, 0, 0.25)',
        main: '0px 6px 18px rgba(0, 0, 0, 0.04)',
        light: '0px 4px 4px rgba(0, 0, 0, 0.08)',
        large: '0px 8px 16px rgba(17, 24, 39, 0.1)',
        card: '0px 1px 2px rgba(0, 0, 0, 0.5)',
        transaction: '0px 8px 16px rgba(17, 24, 39, 0.06)',
        expand: '0px 0px 50px rgba(17, 24, 39, 0.2)',
        button:
          '0px 2px 4px rgba(0, 0, 0, 0.06), 0px 4px 6px rgba(0, 0, 0, 0.1)',
      },
      dropShadow: {
        main: '0px 4px 8px rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
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
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
