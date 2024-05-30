/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.{vue,js}',
    './pages/**/*.{vue,js}',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        'surface-light': '#F2F2F2',
        'purple': '#CBAEE9',
        'yellow': '#F8E4D0',
        'green': '#B6E6AD',
        'lavender': '#8F9CDB',
        'blue': '#AEE6F8',
        'purple-gray': '#B4B4DE',
        'gray-dark': '#273444',
        'gray': '#8492a6',
        'gray-light': '#d3dce6',
      },
    },
  },
  plugins: [],
};

