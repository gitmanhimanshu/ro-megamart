/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Real Romegamart brand palette ──────────────────────────────
        // Primary = deep royal blue #031273 (the logo background, set via
        // the live site's custom-style.css override). Accents mirror the
        // logo's sky-blue water drop and lime-green leaf.
        navy: {
          50: '#eceefb',
          100: '#cfd4f5',
          200: '#b3bcef',
          300: '#9aa3e8', // light tint — used for borders/dividers on dark panels
          400: '#5c68cf',
          500: '#3344bb',
          600: '#1c2bb0',
          700: '#0a1789',
          800: '#031273', // brand primary (royal blue)
          900: '#020b4d', // deepest sections
        },
        // Sky blue — the logo's water drop
        aqua: {
          50: '#e8f7fd',
          100: '#c5ecfb',
          200: '#9fe0f8',
          300: '#6bcef3',
          400: '#38baec',
          500: '#14a4e0',
          600: '#0a86c4',
          700: '#0c6a9e',
          800: '#135776',
          900: '#154964',
        },
        // Lime green — the logo's leaf (used as the fresh accent / success color)
        accent: {
          50: '#f3faec',
          100: '#e3f4d2',
          200: '#cce9ac',
          300: '#b9e081',
          400: '#a3d957',
          500: '#8cc63f',
          600: '#6fa82c',
          700: '#578521',
        },
      },
      fontFamily: {
        // Geometric sans for headings, clean sans for body
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -4px rgba(3, 18, 115, 0.12)',
        lift: '0 18px 40px -12px rgba(3, 18, 115, 0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'kenburns': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.01)' },
        },
        'progress-fill': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'marquee': 'marquee 28s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'kenburns': 'kenburns 4.5s ease-out forwards',
        'progress-fill': 'progress-fill 4.5s linear forwards',
      },
    },
  },
  plugins: [],
}
