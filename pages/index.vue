<template>
  <main class="main-container">
    <HeroSection />
    <EmailMarketingStats />
    <LogoMarquee />
    <MarketingTabs class="my-20" />
    <CareerStepsSection />
    <HomeCta />
  </main>
</template>

<script setup>
// Global i18n kullanılıyor
</script>

<style scoped>
.content-container {
  max-width: 1150px;
  margin: 0 auto;
  padding: 3rem 2rem;
  text-align: center;
}

@media (max-width: 768px) {
  .content-container {
    padding: 2rem 1.5rem;
  }
}
</style>
