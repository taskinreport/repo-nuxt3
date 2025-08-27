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
const switchLocalePath = useSwitchLocalePath();
const switchLocale = async (newLocale) => {
  await navigateTo(switchLocalePath(newLocale));
};
</script>
