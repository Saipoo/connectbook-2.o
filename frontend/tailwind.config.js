/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  safelist: [
    // Real-Time Updates category colors
    'bg-blue-100', 'bg-blue-600', 'text-blue-800', 'text-blue-600', 'border-blue-300', 'hover:bg-blue-50',
    'bg-purple-100', 'bg-purple-600', 'text-purple-800', 'text-purple-600', 'border-purple-300', 'hover:bg-purple-50',
    'bg-green-100', 'bg-green-600', 'text-green-800', 'text-green-600', 'border-green-300', 'hover:bg-green-50',
    'bg-pink-100', 'bg-pink-600', 'text-pink-800', 'text-pink-600', 'border-pink-300', 'hover:bg-pink-50',
    'bg-orange-100', 'bg-orange-600', 'text-orange-800', 'text-orange-600', 'border-orange-300', 'hover:bg-orange-50',
    'bg-yellow-100', 'bg-yellow-600', 'text-yellow-800', 'text-yellow-600', 'border-yellow-300', 'hover:bg-yellow-50',
    'bg-indigo-100', 'bg-indigo-600', 'text-indigo-800', 'text-indigo-600', 'border-indigo-300', 'hover:bg-indigo-50',
    'bg-gray-100', 'bg-gray-600', 'text-gray-800', 'text-gray-600', 'border-gray-300', 'hover:bg-gray-50',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        accent: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
