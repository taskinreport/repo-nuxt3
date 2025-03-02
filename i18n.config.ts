export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      nav: {
        home: 'Home',
        about: 'About',
        language: 'Language'
      },
      home: {
        title: 'Home Page',
        welcome: 'Welcome to our website',
        description: 'This is a multilingual Nuxt3 application example'
      },
      about: {
        title: 'About Us',
        description: 'We are a team dedicated to creating amazing web applications with Nuxt3 and Vue.js'
      }
    },
    tr: {
      nav: {
        home: 'Ana Sayfa',
        about: 'Hakkımızda',
        language: 'Dil'
      },
      home: {
        title: 'Ana Sayfa',
        welcome: 'Web sitemize hoş geldiniz',
        description: 'Bu bir çok dilli Nuxt3 uygulama örneğidir'
      },
      about: {
        title: 'Hakkımızda',
        description: 'Biz Nuxt3 ve Vue.js ile harika web uygulamaları oluşturmaya adanmış bir ekibiz'
      }
    }
  }
}))