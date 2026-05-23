import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // Keep this but we won't use the 'dark' class
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light Theme - Professional SaaS Design
        // Backgrounds
        'bg-base': '#f8f9fc',
        'bg-surface': '#ffffff',
        'bg-elevated': '#ffffff',
        'bg-muted': '#f1f3f9',
        
        // Brand - Professional Blue
        'brand': '#4f46e5',
        'brand-dim': '#6366f1',
        'brand-glow': 'rgba(79, 70, 229, 0.1)',
        'brand-subtle': 'rgba(79, 70, 229, 0.05)',
        
        // Text
        'text-primary': '#1e293b',
        'text-secondary': '#64748b',
        'text-muted': '#94a3b8',
        
        // Semantic
        'success': '#10b981',
        'warning': '#f59e0b',
        'danger': '#ef4444',
        'info': '#3b82f6',
        
        // Borders
        'border': '#e2e8f0',
        'border-hover': 'rgba(79, 70, 229, 0.3)',
        
        // Match scores
        'match-high': '#10b981',
        'match-mid': '#f59e0b',
        'match-low': '#ef4444',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
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
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
      },
    },
  },
  plugins: [],
};
export default config;
