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
        text_primary: {
          DEFAULT: "var(--color-text_primary-default)",
        },
        text_secondary: {
          DEFAULT: "var(--color-text_secondary-default)",
        },
      },
    },
  },
  plugins: [],
}