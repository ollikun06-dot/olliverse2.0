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
          '0%': { opacity: '0', transform: 'translateY(20px) translateZ(0) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) translateZ(0) scale(1)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px) translateZ(0) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) translateZ(0) scale(1)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-30px) translateZ(0)' },
          '100%': { opacity: '1', transform: 'translateX(0) translateZ(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(30px) translateZ(0)' },
          '100%': { opacity: '1', transform: 'translateX(0) translateZ(0)' },
        },
        'slide-in-up-3d': {
          '0%': { opacity: '0', transform: 'translateY(40px) translateZ(-50px) rotateX(10deg)' },
          '100%': { opacity: '1', transform: 'translateY(0) translateZ(0) rotateX(0deg)' },
        },
        'flip-in': {
          '0%': { opacity: '0', transform: 'rotateY(-15deg) translateZ(-30px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'rotateY(0deg) translateZ(0) scale(1)' },
        },
        'zoom-in-3d': {
          '0%': { opacity: '0', transform: 'scale(0.8) translateZ(-100px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateZ(0)' },
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
          '50%': { transform: 'translateY(-10px) translateZ(0)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-6px) rotate(1deg)' },
          '66%': { transform: 'translateY(-3px) rotate(-1deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9) translateZ(0)' },
          '100%': { opacity: '1', transform: 'scale(1) translateZ(0)' },
        },
        'manga-reveal': {
          '0%': { clipPath: 'inset(0 100% 0 0)', opacity: '0' },
          '100%': { clipPath: 'inset(0 0% 0 0)', opacity: '1' },
        },
        'slide-up-stagger': {
          '0%': { opacity: '0', transform: 'translateY(30px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'rotate-in': {
          '0%': { opacity: '0', transform: 'rotate(-5deg) scale(0.95)' },
          '100%': { opacity: '1', transform: 'rotate(0deg) scale(1)' },
        },
        'bounce-in': {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        'energy-trail': {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateX(100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s cubic-bezier(0.16,1,0.3,1)',
        'accordion-up': 'accordion-up 0.2s cubic-bezier(0.16,1,0.3,1)',
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in-down': 'fade-in-down 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in-left': 'slide-in-left 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in-right': 'slide-in-right 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in-up-3d': 'slide-in-up-3d 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'flip-in': 'flip-in 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'zoom-in-3d': 'zoom-in-3d 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-glow': 'pulse-glow 4s cubic-bezier(0.4,0,0.6,1) infinite',
        shimmer: 'shimmer 2.5s ease-in-out infinite',
        float: 'float 6s cubic-bezier(0.4,0,0.6,1) infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'manga-reveal': 'manga-reveal 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-up-stagger': 'slide-up-stagger 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'rotate-in': 'rotate-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'energy-trail': 'energy-trail 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
