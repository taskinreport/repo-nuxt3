<template>
  <div class="py-12">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Ana Başlık -->
      <h1 class="text-4xl font-bold text-center mb-4">
        {{ t("services.title") }}
      </h1>

      <!-- Alt Başlık -->
      <h2 class="text-2xl text-gray-600 text-center mb-8">
        {{ t("services.subtitle") }}
      </h2>

      <!-- Giriş Metni -->
      <p class="text-lg text-center mb-12">
        {{ t("services.intro") }}
      </p>

      <!-- Servis Bölümleri -->
      <div class="grid md:grid-cols-2 gap-8 mb-12">
        <!-- Web Geliştirme -->
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold mb-4">
            {{ t("services.sections.web.title") }}
          </h3>
          <p class="text-gray-600">
            {{ t("services.sections.web.description") }}
          </p>
        </div>

        <!-- Mobil Geliştirme -->
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold mb-4">
            {{ t("services.sections.mobile.title") }}
          </h3>
          <p class="text-gray-600">
            {{ t("services.sections.mobile.description") }}
          </p>
        </div>
      </div>

      <!-- CTA Bölümü -->
      <div class="text-center">
        <p class="text-lg mb-4">{{ t("services.cta.text") }}</p>
        <button
          class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          {{ t("services.cta.button") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Global i18n kullanılıyor
const { t } = useI18n();

useHead({
  title: "Services - Multilingual Nuxt3 App",
  meta: [
    {
      name: "description",
      content:
        "Explore our comprehensive range of web and mobile development services",
    },
  ],
});
</script>
