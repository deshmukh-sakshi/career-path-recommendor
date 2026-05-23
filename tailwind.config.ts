import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-base': '#0a0e17',
        'bg-surface': '#0f1623',
        'bg-elevated': '#161e2e',
        'bg-muted': '#1c2535',
        
        // Brand - Electric teal
        'brand': '#00d4aa',
        'brand-dim': '#00a884',
        'brand-glow': 'rgba(0, 212, 170, 0.15)',
        'brand-subtle': 'rgba(0, 212, 170, 0.08)',
        
        // Text
        'text-primary': '#f0f4f8',
        'text-secondary': '#8a99b0',
        'text-muted': '#4a5568',
        
        // Semantic
        'success': '#10b981',
        'warning': '#f59e0b',
        'danger': '#ef4444',
        'info': '#3b82f6',
        
        // Borders
        'border': 'rgba(255,255,255,0.07)',
        'border-hover': 'rgba(0, 212, 170, 0.3)',
        
        // Match scores
        'match-high': '#00d4aa',
        'match-mid': '#f59e0b',
        'match-low': '#ef4444',
      },
      fontFamily: {
        display: ['DM Serif Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        'standard': '8px',
        'card': '12px',
        'pill': '24px',
      },
      backdropBlur: {
        'card': '12px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.5s ease-out',
      },
    },
  },
  plugins: [],
};
export default config;
