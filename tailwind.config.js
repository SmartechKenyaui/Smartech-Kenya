/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Accent: warm amber-gold  (was green)
        accent: {
          950: '#1A0E03',
          900: '#2A1A07',
          800: '#3D260C',
          700: '#513213',
          600: '#8B5A1A',   // ← primary CTA
          500: '#A36820',
          400: '#C4872C',
          300: '#D9A050',
          200: '#ECC07A',
          100: '#F5DFB0',
        },
        // Keep forest alias pointing to accent so old classes still work
        forest: {
          950: '#1A0E03',
          900: '#2A1A07',
          800: '#3D260C',
          700: '#513213',
          600: '#8B5A1A',
          500: '#A36820',
          400: '#C4872C',
          300: '#D9A050',
        },
        cream: {
          DEFAULT: '#FFFFFF',
          warm:    '#F0F0F0',
          muted:   '#9AA0A6',
          dark:    '#5F6368',
        },
        price: {
          DEFAULT: '#0066FF',
          dim:     '#9AA0A6',
        },
        amber: {
          luxe:  '#C4902A',
          light: '#E0B84A',
          pale:  '#F5E8C0',
        },
        ink: {
          DEFAULT: '#0C0C0C',
          soft:    '#1A1A1A',
          muted:   '#3A3A3A',
          faint:   '#6B6B6B',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(3.5rem,8vw,7rem)',   { lineHeight: '1.0',  letterSpacing: '-0.03em'  }],
        'display-xl':  ['clamp(2.5rem,5vw,4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display-lg':  ['clamp(2rem,4vw,3.2rem)',   { lineHeight: '1.1',  letterSpacing: '-0.02em'  }],
        'display-md':  ['clamp(1.5rem,3vw,2.2rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
      },
      backgroundImage: {
        'forest-gradient': 'linear-gradient(135deg, #1A0E03 0%, #3D260C 50%, #2A1A07 100%)',
        'cream-gradient':  'linear-gradient(180deg, #FFFFFF 0%, #F7F7F7 100%)',
        'amber-shimmer':   'linear-gradient(90deg, transparent 25%, rgba(196,144,42,0.12) 50%, transparent 75%)',
      },
      keyframes: {
        'fade-up':  { from: { opacity: '0', transform: 'translateY(28px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer:    { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'scale-in': { from: { opacity: '0', transform: 'scale(0.96) translateY(-4px)' }, to: { opacity: '1', transform: 'scale(1) translateY(0)' } },
        'fade-in':  { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'fade-up':  'fade-up 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        shimmer:    'shimmer 1.8s ease-in-out infinite',
        'scale-in': 'scale-in 0.18s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in':  'fade-in 0.3s ease forwards',
      },
    },
  },
  plugins: [],
};
