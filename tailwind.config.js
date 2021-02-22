module.exports = {
  purge: ['./src/**/*.{vue,js,ts}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        red: {
          a100: '#ff8a80',
          a200: '#ff5252',
          a400: '#ff1744',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
