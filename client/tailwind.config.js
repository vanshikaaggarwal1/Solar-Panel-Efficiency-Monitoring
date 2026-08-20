/** @type {import('tailwindcss').Config'} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warmBg: '#F4F1EA',
        sidebarBg: '#173D33',
        primaryText: '#173D33',
        secondaryText: '#356B5B',
        darkSecondary: '#7A8178',
        tertiaryText: '#7A8178',
        borderNeutral: '#D8D4CA',
        stoneBorder: '#C7C2B7',

        forest: {
          500: '#356B5B',
          600: '#245546',
          700: '#173D33'
        },

        sage: {
          400: '#9AA79D',
          500: '#7F9185',
          600: '#66766B'
        },

        olive: {
          500: '#8A8B68',
          600: '#707153'
        },

        pewter: {
          300: '#F1EEE6',
          400: '#D8D4CA',
          500: '#BDB8AA'
        },

        sand: {
          300: '#E9DFCD',
          400: '#D2C1A5',
          500: '#B9A27F'
        },

        copper: {
          500: '#B86F50',
          600: '#96553D'
        },

        port: {
          500: '#79505A',
          600: '#603C45'
        },

        charcoal: {
          800: '#245546',
          900: '#173D33'
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