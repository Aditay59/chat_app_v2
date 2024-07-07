/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '9w':'90vw',
      },
      height: {
        '9h':'90vh'
      },
      backgroundColor: {
        'darkB': 'rgba(17, 25, 40, 0.75)',
        'greyB': 'rgba(17, 25, 40, 0.3)',
      },
      borderColor:{
        'blurW': 'rgba(255, 255, 255, 0.125)'
      },
      flexBasis: {
        '1/5': '20%',
        '1/2': '50%',
        '3/10': '25%',
        '4/10': '40%',
      }
    },
  },
  plugins: [],
}