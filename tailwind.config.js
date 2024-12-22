/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#220051",
        secondary: "#361861",
        tertiary: "#0C098C",
        purple: "#68419F",
        green: "#04FF47",
        red: "#FF0000",
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(0%)' },
          '33%': { transform: 'translateX(-100%)' },
          '66%': { transform: 'translateX(-200%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
      animation: {
        slide: 'slide 6s infinite',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

