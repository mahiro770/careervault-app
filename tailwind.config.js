/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Primary accent (lavender-blue)
        accent:           '#5e6ad2',
        'accent-hover':   '#4a56c4',
        'accent-light':   '#ededff',
        // Text hierarchy
        ink:              '#1a1a2e',
        'ink-2':          '#3d3d5c',
        'ink-3':          '#7b7b9e',
        'ink-4':          '#aeaec8',
        // Surface ladder — warm cream theme
        canvas:           '#fef9ee',
        surface:          '#ffffff',
        'surface-2':      '#fdf4e0',
        'surface-3':      '#f9edd0',
        // Borders
        hairline:         '#e8d9bc',
        'hairline-strong':'#d4c4a0',
        // Semantic
        success:          '#27a644',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
        jp:   ['Noto Sans JP', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.05em',
      },
    },
  },
  plugins: [],
}
