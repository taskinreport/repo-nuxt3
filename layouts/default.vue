<template>
  <div class="min-h-screen flex flex-col bg-white">
    <nav
      class="bg-gray-100 p-4 rounded-lg flex justify-between items-center"
    >
      <!-- Logo ve Navigasyon (Büyük Ekranlar) -->
      <div class="flex items-center gap-5">
        <NuxtLink :to="localePath('/')" class="flex items-center">
          <img src="/logotest.png" alt="Logo" class="h-10 w-auto" />
        </NuxtLink>
        <!-- Büyük ekranlarda görünür, küçük ekranlarda gizli -->
        <div class="hidden md:flex gap-4 items-center">
          <NuxtLink
            :to="localePath('/')"
            class="text-gray-700 hover:text-blue-500 transition-colors py-2"
          >
            {{ $t("nav.home") }}
          </NuxtLink>

          <NuxtLink 
            :to="localePath('/about')" 
            class="text-gray-700 hover:text-blue-500 transition-colors py-2"
          >
            {{ $t('nav.about') }}
          </NuxtLink>

          <NuxtLink
            :to="localePath('/services')"
            class="text-gray-700 hover:text-blue-500 transition-colors py-2"
          >
            {{ $t("nav.services") }}
          </NuxtLink>
          
          <NuxtLink
            :to="localePath('/contact')"
            class="text-gray-700 hover:text-blue-500 transition-colors py-2"
          >
            {{ $t("nav.contact") }}
          </NuxtLink>
          
          <div class="relative group flex items-center">
            <button class="text-gray-700 hover:text-blue-500 transition-colors cursor-pointer py-2 flex items-center">
              {{ $t("nav.mega") }}
              <!-- Down arrow icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- Mega Menu -->
            <div class="absolute left-0 top-full pt-2 w-screen max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 origin-top-left z-50 hidden group-hover:block">
              <div class="p-6 grid grid-cols-3 gap-8">
                <!-- Column 1 -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-800 mb-3">{{ $t("nav.megaMenu.col1.title") }}</h3>
                  <ul class="space-y-2">
                    <li><a href="#" class="text-gray-600 hover:text-blue-500 block transition-colors">{{ $t("nav.megaMenu.col1.link1") }}</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-blue-500 block transition-colors">{{ $t("nav.megaMenu.col1.link2") }}</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-blue-500 block transition-colors">{{ $t("nav.megaMenu.col1.link3") }}</a></li>
                  </ul>
                </div>
                
                <!-- Column 2 -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-800 mb-3">{{ $t("nav.megaMenu.col2.title") }}</h3>
                  <ul class="space-y-2">
                    <li><a href="#" class="text-gray-600 hover:text-blue-500 block transition-colors">{{ $t("nav.megaMenu.col2.link1") }}</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-blue-500 block transition-colors">{{ $t("nav.megaMenu.col2.link2") }}</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-blue-500 block transition-colors">{{ $t("nav.megaMenu.col2.link3") }}</a></li>
                  </ul>
                </div>
                
                <!-- Column 3 -->
                <div>
                  <h3 class="text-lg font-semibold text-gray-800 mb-3">{{ $t("nav.megaMenu.col3.title") }}</h3>
                  <ul class="space-y-2">
                    <li><a href="#" class="text-gray-600 hover:text-blue-500 block transition-colors">{{ $t("nav.megaMenu.col3.link1") }}</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-blue-500 block transition-colors">{{ $t("nav.megaMenu.col3.link2") }}</a></li>
                    <li><a href="#" class="text-gray-600 hover:text-blue-500 block transition-colors">{{ $t("nav.megaMenu.col3.link3") }}</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
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
          class="text-gray-700 hover:text-blue-500 transition-colors py-2"
          @click="isMenuOpen = false"
        >
          {{ $t("nav.home") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/about')"
          class="text-gray-700 hover:text-blue-500 transition-colors py-2"
          @click="isMenuOpen = false"
        >
          {{ $t("nav.about") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/services')"
          class="text-gray-700 hover:text-blue-500 transition-colors py-2"
          @click="isMenuOpen = false"
        >
          {{ $t("nav.services") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/contact')"
          class="text-gray-700 hover:text-blue-500 transition-colors py-2"
          @click="isMenuOpen = false"
        >
          {{ $t("nav.contact") }}
        </NuxtLink>
        
        <!-- Mega Menu for Mobile -->
        <div class="border-t border-gray-200 pt-2">
          <button 
            @click="toggleMobileMegaMenu" 
            class="w-full flex items-center justify-between text-gray-700 hover:text-blue-500 transition-colors py-2 focus:outline-none"
          >
            <span>{{ $t("nav.mega") }}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-4 w-4 transition-transform duration-200" 
              :class="{'rotate-180': isMobileMegaMenuOpen}"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <!-- Mobile Mega Menu Content -->
          <div 
            v-if="isMobileMegaMenuOpen" 
            class="mt-2 bg-white rounded-lg p-4 border border-gray-200 shadow-sm transition-all duration-300 ease-in-out"
          >
            <!-- Column 1 -->
            <div class="mb-4">
              <h3 class="text-base font-semibold text-gray-800 mb-2">{{ $t("nav.megaMenu.col1.title") }}</h3>
              <ul class="space-y-2 pl-2">
                <li><a href="#" class="text-gray-600 hover:text-blue-500 block py-1 transition-colors">{{ $t("nav.megaMenu.col1.link1") }}</a></li>
                <li><a href="#" class="text-gray-600 hover:text-blue-500 block py-1 transition-colors">{{ $t("nav.megaMenu.col1.link2") }}</a></li>
                <li><a href="#" class="text-gray-600 hover:text-blue-500 block py-1 transition-colors">{{ $t("nav.megaMenu.col1.link3") }}</a></li>
              </ul>
            </div>
            
            <!-- Column 2 -->
            <div class="mb-4">
              <h3 class="text-base font-semibold text-gray-800 mb-2">{{ $t("nav.megaMenu.col2.title") }}</h3>
              <ul class="space-y-2 pl-2">
                <li><a href="#" class="text-gray-600 hover:text-blue-500 block py-1 transition-colors">{{ $t("nav.megaMenu.col2.link1") }}</a></li>
                <li><a href="#" class="text-gray-600 hover:text-blue-500 block py-1 transition-colors">{{ $t("nav.megaMenu.col2.link2") }}</a></li>
                <li><a href="#" class="text-gray-600 hover:text-blue-500 block py-1 transition-colors">{{ $t("nav.megaMenu.col2.link3") }}</a></li>
              </ul>
            </div>
            
            <!-- Column 3 -->
            <div>
              <h3 class="text-base font-semibold text-gray-800 mb-2">{{ $t("nav.megaMenu.col3.title") }}</h3>
              <ul class="space-y-2 pl-2">
                <li><a href="#" class="text-gray-600 hover:text-blue-500 block py-1 transition-colors">{{ $t("nav.megaMenu.col3.link1") }}</a></li>
                <li><a href="#" class="text-gray-600 hover:text-blue-500 block py-1 transition-colors">{{ $t("nav.megaMenu.col3.link2") }}</a></li>
                <li><a href="#" class="text-gray-600 hover:text-blue-500 block py-1 transition-colors">{{ $t("nav.megaMenu.col3.link3") }}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-300 pt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">{{
          $t("nav.language")
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

    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
const { locale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

// Mobil menü durumu
const isMenuOpen = ref(false);

// Mobil mega menü durumu
const isMobileMegaMenuOpen = ref(false);

// Mevcut dili ref olarak tanımla ve başlangıç değerini ayarla
const currentLocale = ref(locale.value);

// Mobil mega menüyü açıp kapatma fonksiyonu
const toggleMobileMegaMenu = () => {
  isMobileMegaMenuOpen.value = !isMobileMegaMenuOpen.value;
};

// Dil değiştiğinde bu fonksiyon çalışır
const switchLocale = async () => {
  // Eğer mevcut dil zaten seçilen dil ise işlem yapma
  if (locale.value === currentLocale.value) return;

  // Mobil menüyü kapat
  isMenuOpen.value = false;
  // Mobil mega menüyü kapat
  isMobileMegaMenuOpen.value = false;

  // switchLocalePath kullanarak otomatik dil değiştirme
  const switchLocalePath = useSwitchLocalePath();
  await navigateTo(switchLocalePath(currentLocale.value));
};

// Sayfa yüklendiğinde veya dil değiştiğinde dropdown'ı güncelle
watch(locale, (newLocale) => {
  currentLocale.value = newLocale;
});

// Sayfa değiştiginde tüm açık menüleri kapat
watch(() => route.path, () => {
  isMenuOpen.value = false;
  isMobileMegaMenuOpen.value = false;
});
</script>
