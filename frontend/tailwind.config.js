/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ClickUp inspired color palette
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899', // Main brand pink
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        // Column status colors
        status: {
          todo: '#6b7280', // Gray
          progress: '#3b82f6', // Blue
          review: '#f59e0b', // Amber
          done: '#10b981', // Emerald
        },
        // Priority colors
        priority: {
          low: '#10b981', // Green
          medium: '#f59e0b', // Amber
          high: '#f97316', // Orange
          urgent: '#ef4444', // Red
        },
        // Item type colors
        item: {
          task: '#6b7280', // Gray
          bug: '#ef4444', // Red
          feature: '#3b82f6', // Blue
          enhancement: '#8b5cf6', // Purple
          productA: '#10b981', // Green
          productB: '#06b6d4', // Cyan
        },
        // Background variations
        surface: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover':
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-dragging':
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        card: '8px',
        button: '6px',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
    },
  },
  plugins: [],
};
