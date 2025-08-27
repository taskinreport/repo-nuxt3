<template>
  <section
    class="bg-[#e9ecf0] w-full max-w-[95vw] md:max-w-4xl lg:max-w-5xl xl:max-w-[1280px] mx-auto my-5 rounded-[15px] py-8 px-4 md:py-12 md:px-8 flex flex-col items-center"
  >
    <div class="w-full text-center">
      <h2 class="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
        {{ t('emailStats.title') }}
      </h2>
      <p class="text-base md:text-lg text-gray-800 mb-10">
        {{ t('emailStats.desc') }}
      </p>
    </div>
    <div
      class="w-full flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 bg-transparent"
    >
      <div class="flex flex-col items-center">
        <span class="text-3xl md:text-4xl font-bold text-gray-900">
          %<Counter :target="99" />
        </span>
        <span class="text-sm md:text-base text-gray-800 mt-2">{{ t('emailStats.stats.0.label') }}</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-3xl md:text-4xl font-bold text-gray-900">
          %<Counter :target="98" />
        </span>
        <span class="text-sm md:text-base text-gray-800 mt-2">{{ t('emailStats.stats.1.label') }}</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-3xl md:text-4xl font-bold text-gray-900">
          <Counter :target="30" /> {{ t('emailStats.stats.2.value').replace(/\d+/, '').trim() }}
        </span>
        <span class="text-sm md:text-base text-gray-800 mt-2">{{ t('emailStats.stats.2.label') }}</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-3xl md:text-4xl font-bold text-gray-900">
          %<Counter :target="98" />
        </span>
        <span class="text-sm md:text-base text-gray-800 mt-2">{{ t('emailStats.stats.3.label') }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const Counter = defineComponent({
  props: {
    target: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      default: 1200 // ms
    }
  },
  setup(props) {
    const count = ref(0)
    let startTimestamp: number | null = null
    let frame: number

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / props.duration, 1)
      count.value = Math.floor(progress * props.target)
      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      } else {
        count.value = props.target
      }
    }

    onMounted(() => {
      frame = requestAnimationFrame(animate)
    })

    return () => count.value
  }
})
</script>

<style scoped>
</style>
