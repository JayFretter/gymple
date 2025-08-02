/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary-default)",
        },
        card: {
          DEFAULT: "var(--color-card-default)",
        },
        txt: {
          primary: "var(--color-txt-primary)",
          secondary: "var(--color-txt-secondary)",
        },
        highlight: {
          DEFAULT: "var(--color-highlight)",
          subtle: "var(--color-highlight-subtle)",
        }
      },
      fontFamily: {
        "cool-regular": ["Regular", "sans-serif"],
      }
    },
  },
  plugins: [],
}