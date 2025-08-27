<template>
  <section class="bg-[#FEF6F5] py-20 px-4 sm:px-6 lg:px-8 rounded-[10px] mb-[40px]">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div class="text-left">
        <h2 class="text-4xl font-bold text-[#5B0E2D] sm:text-5xl">
          {{ locale === 'tr' ? 'Yükselin. İlerleyin.' : 'Skill up. Move up.' }}
        </h2>
        <p class="mt-4 text-lg text-gray-700">
          {{ locale === 'tr' ? 'İşbirliğine dayalı İş Yönetimi Sertifika programı ile sertifika alın ve kendi hedeflerinize ulaşırken işletmenizin de hedeflerine ulaşmasına yardımcı olun.' : 'Get certified with the Collaborative Work Management Certification program and help your business reach its goals while you achieve your own.' }}
        </p>
        <div class="mt-8">
          <a
            href="#"
            class="inline-block bg-[#5B0E2D] text-white font-semibold px-8 py-3 rounded-full hover:bg-opacity-90 transition-colors"
          >
            {{ locale === 'tr' ? 'Sertifika Alın' : 'Get certified' }}
          </a>
        </div>
      </div>
      <div class="flex items-center justify-center p-8">
        <div class="relative w-full max-w-xs h-60">
          <div class="absolute w-full h-full bg-pink-200 rounded-3xl transform rotate-12 transition-transform duration-500 hover:rotate-6"></div>
          <div class="absolute w-full h-full bg-red-300 rounded-3xl transform -rotate-12 transition-transform duration-500 hover:-rotate-6"></div>
          <div class="absolute w-full h-full bg-[#F3A0A0] rounded-3xl transform rotate-6 transition-transform duration-500 hover:rotate-0"></div>
          <div class="absolute w-4/5 h-4/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#5B0E2D] rounded-2xl flex items-center justify-center shadow-2xl">
            <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
</script>
