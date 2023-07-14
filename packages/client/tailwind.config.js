const { join } = require("path");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    join(
      __dirname,
      "{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}"
    ),
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
          disabled: {
            DEFAULT: "#228ebc",
          },
          contrastText: {
            DEFAULT: colors.white,
          },
        },
        accent: {
          DEFAULT: colors.gray[200],
          dark: colors.gray[700],
        },
        error: {
          DEFAULT: colors.red[600],
          dark: colors.red[300],
        },
        success: {
          DEFAULT: colors.green[600],
          dark: colors.green[300],
        },
        loading: {
          DEFAULT: colors.slate[200],
        },
        muted: {
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
  plugins: [require("@headlessui/tailwindcss")],
};
