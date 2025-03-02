export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss'
  ],

  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',  // sadece kök URL'de yönlendirme yapar
      alwaysRedirect: true,
      cookieSecure: process.env.NODE_ENV === 'production',
      cookieCrossOrigin: false
    },
    locales: [
      {
        code: 'en',
        name: 'English'
      },
      {
        code: 'tr',
        name: 'Türkçe'
      }
    ],
    vueI18n: './i18n.config.ts'
  },

  compatibilityDate: '2025-03-02',
});