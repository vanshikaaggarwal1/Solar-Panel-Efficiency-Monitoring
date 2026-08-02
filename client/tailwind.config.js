/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warmBg: '#F7F5F2',
        sidebarBg: '#1F1F1F',
        primaryText: '#1A1A1A',
        secondaryText: '#6B7280',
        borderNeutral: '#E5E7EB',
        forest: {
          500: '#2E5E4E',
          600: '#244B3E',
          700: '#1A382E'
        },
        olive: {
          500: '#6B8E23',
          600: '#55721C'
        },
        sand: {
          300: '#EADBC8',
          400: '#D8C3A5',
          500: '#C4AB89'
        },
        copper: {
          500: '#B87333',
          600: '#995F29'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px'
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'card': '0 2px 6px 0 rgba(0, 0, 0, 0.04)',
        'dropdown': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)'
      }
    },
  },
  plugins: [],
}
