export default defineNuxtConfig({
  components: true,
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss'
  ],

  i18n: {
    langDir: 'locales/',  // JSON dosyaları için doğru yol
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json'  // Ana dil dosyası
      },
      {
        code: 'tr',
        name: 'Türkçe',
        file: 'tr.json'  // Ana dil dosyası
      }
    ],
    lazy: true,  // Dil dosyalarını lazy loading ile yükle
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true,
      cookieSecure: process.env.NODE_ENV === 'production',
      cookieCrossOrigin: false
    },
    vueI18n: './i18n.config.ts'
  },

  compatibilityDate: '2025-03-02'
});
