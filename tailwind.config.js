/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#220051",
        secondary: "rgba(34, 0, 81, 0.87)",
        tertiary: "#0C098C",
        purple: "#68419F",
        green: "#04FF47",
        red: "#FF0000",
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

