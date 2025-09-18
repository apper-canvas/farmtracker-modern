/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      spacing: {
        '128': '32rem',
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#2D5016',
          600: '#234011',
          700: '#1a300c'
        },
        secondary: {
          50: '#f7fee7',
          100: '#ecfccb',
          500: '#8BC34A',
          600: '#7cb342',
          700: '#689f38'
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#FF9800',
          600: '#f57c00',
          700: '#ef6c00'
        },
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}