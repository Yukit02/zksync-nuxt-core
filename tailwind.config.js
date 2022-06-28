const tailwindDefault = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    enabled: process.env.NODE_ENV === "production",
    content: ["components/**/*.vue", "blocks/**/*.vue", "blocks/**/*.vue", "layouts/**/*.vue", "pages/**/*.vue", "plugins/**/*.{js,ts}", "nuxt.config.ts"],
  },
  theme: {
    borderColor: {
      gray: "rgba(158,174,187,0.3)",
    },
    backgroundColor: {
      white: "#FFFFFF",
      light: "#f3f4f7",
      dark: "#11142b",
      darkViolet: "#171a49",
    },
    textColor: {
      white: "#FFFFFF",
      gray: "rgba(158,174,187,0.3)",
      black: "#343a40",
      violet: "#8c8dfc",
      red: "#F25F5C",
      yellow: "#fbbf24",
      green: "#057A55",
    },
    fontFamily: {
      ...tailwindDefault.fontFamily,
      firaCode: ["Fira Code", "sans-serif"],
      firaSans: ["Fira Sans", "sans-serif"],
    },
    screens: {
      ...tailwindDefault.screens,
      lg: "1101px",
    },
    extend: {
      width: {
        "max-content": "max-content",
      },
    },
  },
  variants: {
    extend: {
      display: ["dark"],
    },
  },
  plugins: [],
};
