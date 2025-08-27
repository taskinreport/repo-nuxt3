<template>
  <div>
    <ContactHero />
    <ContactForm />
  </div>
</template>

<script setup>
// Contact sayfası bileşenleri
// useI18n zaten global olarak erişilebilir
// useHead ile SEO ayarları
useHead({
  title: useI18n().t('contact.title'),
  meta: [
    { 
      name: 'description', 
      content: useI18n().t('contact.subtitle')
    }
  ]
})
</script>
