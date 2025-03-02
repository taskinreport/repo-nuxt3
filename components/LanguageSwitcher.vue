<template>
  <div class="flex gap-4 items-center p-4">
    <button
      @click="switchLocale('en')"
      :class="locale === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
      class="px-3 py-1 rounded"
    >
      English
    </button>
    <button
      @click="switchLocale('tr')"
      :class="locale === 'tr' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
      class="px-3 py-1 rounded"
    >
      Türkçe
    </button>
  </div>
</template>

<script setup>
const { locale } = useI18n();
const localePath = useLocalePath();
const switchLocale = async (newLocale) => {
  // Mevcut rotayı al
  const route = useRoute();
  // Aynı rotaya farklı dil ile yönlendir
  await navigateTo(localePath(route.fullPath, newLocale));
};
</script>
