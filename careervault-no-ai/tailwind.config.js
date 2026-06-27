/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        accent: '#5b5bd6',
        'accent-hover': '#4a4ac4',
        'accent-light': '#ededff',
        ink: '#1a1a2e',
        'ink-2': '#3d3d5c',
        'ink-3': '#7b7b9e',
        surface: '#f7f7fb',
        'surface-2': '#eeeef8',
      },
      fontFamily: {
        jp: ['Noto Sans JP', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
