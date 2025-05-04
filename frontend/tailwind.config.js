/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deepTeal: "#003E3E",
        oceanGreen: "#02615A",
        aquaMint: "#A8DADC",
        skyBlue: "#61C0BF",
        white: "#FFFFFF",
      },
      backgroundImage: {
        gradientFade: "linear-gradient(to bottom, #E0F4F3, #F8F8F8)",
      },
    },    
  },
  plugins: [],
}