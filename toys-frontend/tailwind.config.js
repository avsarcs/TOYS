import {addIconSelectors} from "@iconify/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      "main": ['"Open Sans", sans-serif']
    },
    extend: {},
  },
  plugins: [
      addIconSelectors(["solar"])
  ],
}

