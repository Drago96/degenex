const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: colors.gray[100],
          dark: colors.gray[800],
          contrastText: {
            DEFAULT: colors.black,
            dark: colors.gray[50],
          },
        },
        secondary: {
          DEFAULT: "#2489e0",
          contrastText: {
            DEFAULT: colors.white,
          },
        },
        error: {
          DEFAULT: colors.red[600],
          dark: colors.red[300]
        },
        transparent: {
          DEFAULT: colors.gray[100],
          dark: colors.gray[700],
          contrastText: {
            DEFAULT: colors.gray[400],
          },
        },
        background: {
          DEFAULT: colors.white,
          dark: colors.black,
        },
      },
    },
  },
  plugins: [],
};
