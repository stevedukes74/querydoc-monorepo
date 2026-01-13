/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-1': 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        'gradient-1-inverse': 'linear-gradient(135deg, #c3cfe2 0%, #f5f7fa 100%)',
        'gradient-2': 'linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)',
        'gradient-2-inverse': 'linear-gradient(to bottom, #e3eeff 0%, #f3e7e9 99%, #f3e7e9 100%)',
        'gradient-3': 'radial-gradient(73% 147%, #EADFDF 59%, #ECE2DF 100%), radial-gradient(91% 146%, rgba(255,255,255,0.50) 47%, rgba(0,0,0,0.50) 100%)',
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}