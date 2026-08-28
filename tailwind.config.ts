import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Frontier Angels brand palette — from the design system (frontier-angels-ds)
        navy: {
          50: '#edf4fb',
          100: '#d9e6f3',
          200: '#b4cae6',
          300: '#80a5d2',
          400: '#4f7fbf',
          500: '#255da5',
          600: '#1d4a88',
          700: '#163769',
          800: '#112c55',
          900: '#0C2140', // PRIMARY navy
          950: '#060f1e',
        },
        gold: {
          50: '#fdf6f0',
          100: '#f7ede3',
          200: '#eed9c8',
          300: '#e3c4ae',
          400: '#d6af8f',
          500: '#c99970',
          600: '#BB8956', // ACCENT gold
          700: '#9a6425',
          800: '#7a4f1e',
          900: '#5d3c17',
        },
        // Neutral grays
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        // Design system: Bitter (display) + Source Sans 3 (body) + Source Code Pro (mono)
        sans: ['var(--font-body)', '"Source Sans 3"', 'system-ui', 'sans-serif'],
        serif: ['var(--font-display)', 'Bitter', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'Source Code Pro', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '5.625rem', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '4.5rem', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '3.75rem', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em' }],
        'display-sm': ['1.875rem', { lineHeight: '2.375rem' }],
        'display-xs': ['1.5rem', { lineHeight: '2rem' }],
      },
      boxShadow: {
        // Design system: shadows are always navy-tinted, never black
        'card': '0 4px 6px rgba(12,33,64,0.08), 0 2px 4px rgba(12,33,64,0.06)',
        'card-hover': '0 20px 25px rgba(12,33,64,0.10), 0 4px 6px rgba(12,33,64,0.05)',
        'navy': '0 10px 15px rgba(12,33,64,0.08), 0 4px 6px rgba(12,33,64,0.05)',
        'gold': '0 0 0 3px rgba(187,137,86,0.30)',
        'focus': '0 0 0 3px rgba(187,137,86,0.50)',
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #0f2347 0%, #1a3a6b 50%, #2f4f9a 100%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(15, 35, 71, 0.85) 0%, rgba(26, 58, 107, 0.70) 100%)',
      },
      keyframes: {
        'tile-in': {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.94)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        // slight overshoot at the end for a "pop"
        'tile-in': 'tile-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
    },
  },
  plugins: [],
}

export default config
