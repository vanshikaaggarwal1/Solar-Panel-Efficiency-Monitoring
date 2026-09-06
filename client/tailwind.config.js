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
        // Main colors requested by user
        tealMain: '#1B3D3D',
        iceBlue: '#D5E5F2',
        darkBg: '#121212',
        darkSurface: '#1E242B',
        darkBorder: '#283038',
        lightGreyBg: '#F9FAFB',
        lightGreyBorder: '#E5E7EB',
        lightGreyText: '#6B7280',
        blackText: '#111827',

        // Standardized brand color mappings
        brand: {
          50: '#F0F5F5',
          100: '#DDE9E9',
          200: '#BED4D4',
          300: '#95B8B8',
          400: '#649494',
          500: '#1B3D3D', // Light Mode Main Color
          600: '#153131',
          700: '#102424',
          800: '#0C1A1A',
          900: '#071010'
        },

        // Dark mode main accent color palette
        darkAccent: {
          50: '#F4F9FD',
          100: '#E6F1FA',
          200: '#D5E5F2', // Dark Mode Main Color
          300: '#A9CBDF',
          400: '#7BAECC',
          500: '#5291B5',
          600: '#3D7494'
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
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'dropdown': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)'
      }
    },
  },
  plugins: [],
}