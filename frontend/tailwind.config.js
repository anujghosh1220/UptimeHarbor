/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#020617',
          secondary: '#0f172a',
          tertiary: '#1e293b',
        },
        border: {
          primary: '#1e293b',
          secondary: '#334155',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#e2e8f0',
          tertiary: '#94a3b8',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        accent: '#6366f1',
        'accent-hover': '#4f46e5',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
      },
    },
  },
  plugins: [],
}
