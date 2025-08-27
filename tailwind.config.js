/** @type {import('tailwindcss').Config} */
// Typography plugin opsiyonel: paket kurulu değilse build'i kırmaması için güvenli require
const typography = (() => {
  try { return require('@tailwindcss/typography') } catch { return null }
})()

module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    typography && typography
  ].filter(Boolean),
}
