import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Dark theme background colors
        dark: {
          900: '#0a0f0f',
          800: '#0f1419',
          700: '#1a2b2b',
          600: '#233333',
          500: '#2d4040',
        },
        // Primary brand colors - Teal/Cyan
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf', // Main brand color
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Accent colors - Cyan variations
        accent: {
          300: '#67e8f9',
          400: '#22d3ee', // Bright accent
          500: '#06b6d4',
          600: '#0891b2',
        },
        // Semantic colors for dark theme
        success: '#00D4AA',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#22d3ee',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #2dd4bf, #22d3ee)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(45, 212, 191, 0.15)',
        'glow-lg': '0 0 40px rgba(45, 212, 191, 0.2)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.05)',
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;