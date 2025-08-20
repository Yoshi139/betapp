// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f6fbff',
          100: '#eaf6ff',
          300: '#7cc0ff',
          500: '#2b7cff',
          700: '#1557c7'
        },
        glass: 'rgba(255,255,255,0.06)',
        muted: '#9AA4B2'
      },
      borderRadius: {
        'xl-2': '1.25rem'
      },
      boxShadow: {
        soft: '0 6px 18px rgba(17,24,39,0.08)',
        lift: '0 10px 30px rgba(2,6,23,0.12)'
      },
    },
  },
  plugins: [],
}
