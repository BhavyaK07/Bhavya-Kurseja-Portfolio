/** @type {import('tailwindcss').Config} */
// Design tokens adapted from DESIGN.md: layered surfaces, tiered text, a single
// scarce accent, and a display type scale with negative tracking.
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces (darkest to lightest)
        'dark-bg': '#000000',
        'dark-card': '#0b0b0d',
        'dark-elevated': '#16161a',
        // Borders
        'dark-border': '#1f1f23',
        'hairline-strong': '#2e2e34',
        // Text
        ink: '#fafafa',
        body: '#d4d4d8',
        muted: '#a1a1aa',
        'muted-soft': '#71717a',
        // Accent: CTAs, links and active states only
        accent: '#3b82f6',
        'accent-active': '#2563eb',
        award: '#e8a55a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'display-md': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-sm': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
      },
    },
  },
  plugins: [],
}
