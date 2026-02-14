/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#263D42',
          50: '#E8EEEF',
          100: '#D1DCDE',
          200: '#A3B9BD',
          300: '#75969C',
          400: '#4D6E75',
          500: '#263D42',
          600: '#1F3338',
          700: '#19292D',
          800: '#121F23',
          900: '#0C1518',
        },
        secondary: {
          DEFAULT: '#CCDBDC',
          light: '#E8EEEF',
          dark: '#A8C2C4',
          50: '#F5F8F8',
          100: '#EBF1F1',
          200: '#CCDBDC',
          300: '#A8C2C4',
          400: '#84A9AC',
          500: '#609094',
          600: '#4D7377',
          700: '#3A565A',
          800: '#273A3C',
          900: '#131D1E',
        },
        accent: '#F59E0B',
        danger: '#DC2626',
        success: '#16A34A',
        warning: '#D97706',
        surface: '#FFFFFF',
        background: '#CCDBDC',
        'text-main': '#263D42',
        'text-muted': '#4D6E75',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
