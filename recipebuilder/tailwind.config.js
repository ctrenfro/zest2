/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,}"],
  theme: {
    extend: {
      backgroundColor: {
        lightpink: "rgb(255, 182, 193)",
        opaque: "rgba(0,0,0,0.4)",
      },
      textColor: {
        firebrick: "rgb(178, 34, 34)",
        red: "rgb(255, 0, 0)",
        limegreen: "rgb(50, 205, 50)",
      },
      colors: {
        red: "rgb(255, 0, 0)",
        limegreen: "rgb(50, 205, 50)",
      },
    },
  },

  plugins: [],
};
