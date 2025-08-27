<template>
  <div class="min-h-screen py-16">
    <div class="max-w-4xl mx-auto mb-12 p-6">
      <h1 class="text-2xl font-bold mb-4 text-center">{{ t("about.title") }}</h1>
      <p class="text-center">{{ t("about.description") }}</p>
    </div>
    
    <div class="py-8 sm:py-16 md:py-20">
      <TabSystem class="mx-auto w-full px-4 sm:px-0" />
    </div>
  </div>
</template>

<script setup>
// Global i18n kullanılıyor
import { ref } from 'vue';
const { t } = useI18n();
import TabSystem from '~/components/TabSystem.vue';

definePageMeta({
  name: 'about'
})
</script>
