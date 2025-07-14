/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#6366F1', // Indigo 500
        secondary: '#EC4899', // Pink 500
        dark: '#111827', // Gray 900
        light: '#F9FAFB', // Gray 50
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
