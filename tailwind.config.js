/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Linear design system — primary accent (lavender-blue)
        accent:           '#5e6ad2',
        'accent-hover':   '#828fff',
        'accent-light':   '#1c1f48',  // subtle lavender on dark canvas
        // Text hierarchy
        ink:              '#f7f8f8',
        'ink-2':          '#d0d6e0',
        'ink-3':          '#8a8f98',
        'ink-4':          '#62666d',
        // Surface ladder
        canvas:           '#0d1b35',
        surface:          '#102040',
        'surface-2':      '#162850',
        'surface-3':      '#1c3060',
        // Borders
        hairline:         '#1e3358',
        'hairline-strong':'#2a4270',
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
