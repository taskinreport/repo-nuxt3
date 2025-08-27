<template>
  <div class="w-full max-w-[1360px] mx-auto px-4">
    <div class="flex flex-col lg:flex-row gap-12">
      <!-- Sol Tab Menüsü -->
      <div class="w-full lg:w-1/2">
        <div class="flex flex-col space-y-4">
          <div
            v-for="(tab, index) in marketingTabs"
            :key="index"
            @click="activeTab = index"
            class="cursor-pointer group transform transition-all duration-300 hover:scale-[1.01]"
          >
            <div
              class="relative p-6 transition-all duration-300 rounded-xl border"
              :class="[
                activeTab === index
                  ? 'bg-[#EEF2F5] border-transparent'
                  : 'border-[#EEF2F5] hover:border-gray-300',
              ]"
            >
              <h3
                class="text-[28px] font-medium transition-all duration-300"
                :class="[
                  activeTab === index
                    ? 'text-blue-900 mb-4 transform translate-x-0'
                    : 'text-gray-600 group-hover:text-gray-800 transform translate-x-0',
                ]"
              >
                {{ tab.title }}
              </h3>

              <div
                v-show="activeTab === index"
                class="space-y-4"
                :style="{
                  visibility: activeTab === index ? 'visible' : 'hidden',
                  height: activeTab === index ? 'auto' : '0',
                  overflow: 'hidden',
                }"
              >
                <p class="text-gray-600 leading-relaxed">
                  {{ tab.description }}
                </p>
                <a
                  href="#"
                  class="text-blue-600 hover:text-blue-700 inline-flex items-center space-x-2"
                >
                  <span>{{ tab.linkText }}</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sağ İçerik Alanı - Sadece Görsel -->
      <div class="w-full lg:w-1/2">
        <div class="relative min-h-[300px]">
          <div
            v-for="(tab, index) in marketingTabs"
            :key="index"
            class="w-full absolute inset-0 transition-all duration-500 ease-out"
            :class="[
              activeTab === index
                ? 'translate-y-0 opacity-100 z-10'
                : 'translate-y-8 opacity-0 -z-10',
            ]"
          >
            <img :src="tab.flowImage" :alt="tab.title" class="w-full h-auto" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const activeTab = ref(0);

// Tab içerikleri
const marketingTabs = [
  {
    title: "Personalization at its finest",
    description:
      "Create unique and personalized experiences that resonate with your audience and drive better engagement.",
    linkText: "Discover multi-channel personalization",
    flowImage:
      "https://ik.imagekit.io/qcrgl3hz3q/mailgraf-e-posta-pazarlama-hizmeti.webp",
  },
  {
    title: "Stay ahead of the curve",
    description:
      "Keep track of customer behavior and optimize your strategy with real-time analytics and insights.",
    linkText: "Discover analytics features",
    flowImage:
      "https://ik.imagekit.io/qcrgl3hz3q/mailgraf-e-posta-pazarlama-hizmeti.webp",
  },
  {
    title: "Tailored customer journeys",
    description:
      "Craft diverse and intricate customer journeys that mirror the complexity of your clientele, providing them with experiences that exceed expectations.",
    linkText: "Discover multi-channel customer journeys",
    flowImage:
      "https://ik.imagekit.io/qcrgl3hz3q/mailgraf-e-posta-pazarlama-hizmeti.webp",
  },
];
</script>

<style scoped></style>
