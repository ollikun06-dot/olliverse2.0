import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)'],
        mono: ['var(--font-geist-mono)'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px) translateZ(0)' },
          '100%': { opacity: '1', transform: 'translateY(0) translateZ(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px) translateZ(0)' },
          '100%': { opacity: '1', transform: 'translateX(0) translateZ(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px hsl(185 100% 55% / 0.2)' },
          '50%': { boxShadow: '0 0 35px hsl(185 100% 55% / 0.35), 0 0 60px hsl(330 90% 65% / 0.1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateZ(0)' },
          '50%': { transform: 'translateY(-8px) translateZ(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95) translateZ(0)' },
          '100%': { opacity: '1', transform: 'scale(1) translateZ(0)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'slide-up-fade': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'blur-in': {
          '0%': { opacity: '0', filter: 'blur(12px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s cubic-bezier(0.16,1,0.3,1)',
        'accordion-up': 'accordion-up 0.2s cubic-bezier(0.16,1,0.3,1)',
        'fade-in-up': 'fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in-left': 'slide-in-left 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-glow': 'pulse-glow 4s cubic-bezier(0.4,0,0.6,1) infinite',
        shimmer: 'shimmer 2.5s ease-in-out infinite',
        float: 'float 7s cubic-bezier(0.4,0,0.6,1) infinite',
        'glow-pulse': 'glow-pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'scale-in': 'scale-in 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'spin-slow': 'spin-slow 20s linear infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'slide-up-fade': 'slide-up-fade 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'blur-in': 'blur-in 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
