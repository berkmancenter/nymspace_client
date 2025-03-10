const colors = require('tailwindcss/colors')

module.exports = {
  // remove unused styles in production
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'harvard-red': '#A41D30',
        ...colors
      },
      fontSize: {
        sm: ['14px', '20px']
      },
      height: {
        screen: '100svh'
      },
      maxHeight: {
        screen: '100svh'
      },
      minHeight: {
        screen: '100svh'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
