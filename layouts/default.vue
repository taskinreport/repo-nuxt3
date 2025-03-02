<template>
  <div class="max-w-7xl mx-auto p-4">
    <nav
      class="bg-gray-100 p-4 mb-6 rounded-lg flex justify-between items-center"
    >
      <!-- Logo ve Navigasyon (Büyük Ekranlar) -->
      <div class="flex items-center gap-5">
        <NuxtLink :to="localePath('/')" class="flex items-center">
          <img src="/logotest.png" alt="Logo" class="h-10 w-auto" />
        </NuxtLink>
        <!-- Büyük ekranlarda görünür, küçük ekranlarda gizli -->
        <div class="hidden md:flex gap-4">
          <NuxtLink
            :to="localePath('/')"
            class="text-gray-700 hover:text-blue-500 transition-colors"
          >
            {{ t("nav.home") }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/about')"
            class="text-gray-700 hover:text-blue-500 transition-colors"
          >
            {{ t("nav.about") }}
          </NuxtLink>
        </div>
      </div>

      <!-- Dil Seçici (Büyük Ekranlar) -->
      <div class="hidden md:block">
        <select
          v-model="currentLocale"
          @change="switchLocale"
          class="p-2 border border-gray-300 rounded bg-white cursor-pointer focus:outline-none focus:border-blue-500"
        >
          <option value="en">English</option>
          <option value="tr">Turkish</option>
        </select>
      </div>

      <!-- Hamburger Menü Butonu (Küçük Ekranlar) -->
      <button
        @click="isMenuOpen = !isMenuOpen"
        class="md:hidden text-gray-700 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            v-if="!isMenuOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </nav>

    <!-- Mobil Menü (Küçük Ekranlar) -->
    <div v-if="isMenuOpen" class="md:hidden bg-gray-100 p-4 mb-6 rounded-lg">
      <div class="flex flex-col gap-4 mb-4">
        <NuxtLink
          :to="localePath('/')"
          class="text-gray-700 hover:text-blue-500 transition-colors"
          @click="isMenuOpen = false"
        >
          {{ t("nav.home") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/about')"
          class="text-gray-700 hover:text-blue-500 transition-colors"
          @click="isMenuOpen = false"
        >
          {{ t("nav.about") }}
        </NuxtLink>
      </div>
      <div class="border-t border-gray-300 pt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">{{
          t("nav.language")
        }}</label>
        <select
          v-model="currentLocale"
          @change="switchLocale"
          class="w-full p-2 border border-gray-300 rounded bg-white cursor-pointer focus:outline-none focus:border-blue-500"
        >
          <option value="en">English</option>
          <option value="tr">Turkish</option>
        </select>
      </div>
    </div>

    <slot />
  </div>
</template>

<script setup>
const { t, locale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

// Mobil menü durumu
const isMenuOpen = ref(false);

// Mevcut dili ref olarak tanımla ve başlangıç değerini ayarla
const currentLocale = ref(locale.value);

// Dil değiştiğinde bu fonksiyon çalışır
const switchLocale = async () => {
  // Eğer mevcut dil zaten seçilen dil ise işlem yapma
  if (locale.value === currentLocale.value) return;

  // Mobil menüyü kapat
  isMenuOpen.value = false;

  // Seçilen dile göre URL oluştur
  const targetPath =
    currentLocale.value === "en" ? "/" : `/${currentLocale.value}/`;

  // Yeni dile yönlendir
  await navigateTo(targetPath);
};

// Sayfa yüklendiğinde veya dil değiştiğinde dropdown'ı güncelle
watch(locale, (newLocale) => {
  currentLocale.value = newLocale;
});
</script>
