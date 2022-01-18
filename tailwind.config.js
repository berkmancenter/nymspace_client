module.exports = {
  // remove unused styles in production
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "harvard-red": "#890309",
      },
      fontSize: {
        sm: ["14px", "20px"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
