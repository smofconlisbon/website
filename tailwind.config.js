/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";

export default {
  content: ["./index.html", "./**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      white: colors.white,
      black: colors.black,
      gray: colors.gray,
      teal: {
        500: "#000000",
      },
      yellow: {
        500: "rgb(255, 199, 41)",
      },
    },
  },
  plugins: [],
};
