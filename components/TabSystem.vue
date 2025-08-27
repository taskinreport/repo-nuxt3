<template>
  <div class="mx-auto bg-transparent p-4 sm:p-6 rounded-lg" style="max-width: 1280px;">
    <!-- Tab Headers -->
    <div class="flex overflow-x-auto md:justify-between md:items-center space-x-4 md:space-x-0 mb-8 px-2 sm:px-4 pb-2 scrollbar-hide md:w-full">
      <div 
        v-for="(tab, index) in tabs" 
        :key="index"
        @click="activeTab = index"
        class="cursor-pointer transition-all duration-300 flex-shrink-0 text-center md:text-center whitespace-nowrap px-2 sm:px-4 py-3 font-euclid relative md:flex-1 md:mx-2"
        :class="activeTab === index ? 'opacity-100' : 'opacity-60 hover:opacity-80'"
      >
        <div class="mb-1 font-euclid" :class="[activeTab === index ? 'text-black' : 'text-gray-600', activeTab === index ? (isMobile ? 'text-[22px] font-medium' : 'text-[18px] font-medium') : (isMobile ? 'text-[14px]' : 'text-[18px]')]">{{ tab.number }}</div>
        <div v-if="activeTab === index || !isMobile" class="font-medium leading-tight" :class="[activeTab === index ? 'text-black' : 'text-gray-600', isMobile && activeTab === index ? 'text-[20px]' : 'text-[18px]']">
          {{ tab.title }}
        </div>
        <div v-if="activeTab === index || !isMobile" class="font-medium leading-tight" :class="[activeTab === index ? 'text-black' : 'text-gray-600', isMobile && activeTab === index ? 'text-[20px]' : 'text-[18px]']">
          {{ tab.subtitle }}
        </div>
        <div v-if="activeTab === index" class="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600"></div>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
      <div v-if="activeTab === 3" class="p-4 sm:p-6 bg-white rounded-lg shadow-sm">
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <div class="flex-1">
            <h3 class="text-2xl font-bold mb-4">{{ t('about.tabs.personalization.content.title') }}</h3>
            <p class="text-gray-700 mb-6">{{ t('about.tabs.personalization.content.description') }}</p>
            <button class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">{{ t('about.tabs.personalization.content.button') }}</button>
          </div>
          <div class="w-full md:w-1/2">
            <img src="https://via.placeholder.com/600x400" alt="Personalization" class="w-full h-auto rounded-lg">
          </div>
        </div>
      </div>
      <div v-else-if="activeTab === 4" class="insights-panel">
        <div class="text-xl font-semibold mb-4">Insights</div>
        
        <div class="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0 mb-6">
          <div class="border-b-2 border-blue-600 pb-2 text-sm font-medium">Membership</div>
          <div class="text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer">Earnings</div>
          <div class="text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer">Posts</div>
        </div>
        
        <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 mb-8">
          <div class="relative">
            <select class="w-full sm:w-auto bg-gray-50 border border-gray-300 rounded-md px-4 py-2 text-sm appearance-none cursor-pointer">
              <option>Past 30 days</option>
            </select>
          </div>
          <div class="relative">
            <select class="w-full sm:w-auto bg-gray-50 border border-gray-300 rounded-md px-4 py-2 text-sm appearance-none cursor-pointer">
              <option>Paid members</option>
            </select>
          </div>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <div>
            <div class="text-sm text-gray-500">Paid members</div>
            <div class="flex items-center">
              <div class="text-2xl font-bold">503</div>
              <div class="ml-2 text-green-500 text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                10
              </div>
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-500">New</div>
            <div class="text-2xl font-bold">25</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Cancelled</div>
            <div class="text-2xl font-bold">14</div>
          </div>
        </div>
        
        <div class="mb-4">
          <div class="text-sm mb-2">May 11, 2023</div>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 rounded-full bg-orange-500"></div>
            <div class="text-sm">Paid: 501</div>
          </div>
        </div>
        
        <div class="h-48 sm:h-64 bg-gray-50 rounded-lg relative overflow-hidden p-4 sm:p-6">
          <!-- Simplified chart representation -->
          <div class="absolute bottom-0 left-0 right-0 h-24 sm:h-32 flex items-end px-4 sm:px-6">
            <div class="w-full h-full relative">
              <svg viewBox="0 0 400 100" class="w-full h-full" preserveAspectRatio="none">
                <path d="M0,80 C20,70 40,90 60,75 C80,60 100,80 120,70 C140,60 160,40 180,50 C200,60 220,40 240,30 C260,20 280,40 300,30 C320,20 340,10 360,25 C380,40 400,20 400,30" 
                      fill="none" stroke="#f97316" stroke-width="2"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="h-48 sm:h-64 flex items-center justify-center text-gray-500 p-6 sm:p-8 text-center">
        {{ tabs[activeTab].title }} içeriği burada gösterilecek
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
const activeTab = ref(4); // Analytics & insights sekmesi ile başla
const isMobile = ref(false);

// Mobil cihaz kontrolü
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

// i18n kullanarak tab verilerini alıyoruz
const { t } = useI18n();

const tabs = [
  {
    number: t('about.tabs.multimedia.number'),
    title: t('about.tabs.multimedia.title'),
    subtitle: t('about.tabs.multimedia.subtitle')
  },
  {
    number: t('about.tabs.nativeVideo.number'),
    title: t('about.tabs.nativeVideo.title'),
    subtitle: t('about.tabs.nativeVideo.subtitle')
  },
  {
    number: t('about.tabs.podcast.number'),
    title: t('about.tabs.podcast.title'),
    subtitle: t('about.tabs.podcast.subtitle')
  },
  {
    number: t('about.tabs.personalization.number'),
    title: t('about.tabs.personalization.title'),
    subtitle: t('about.tabs.personalization.subtitle')
  },
  {
    number: t('about.tabs.analytics.number'),
    title: t('about.tabs.analytics.title'),
    subtitle: t('about.tabs.analytics.subtitle')
  }
];
</script>

<style scoped>
.insights-panel {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
