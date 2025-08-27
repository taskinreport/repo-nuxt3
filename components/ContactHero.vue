<template>
  <section class="contact-hero">
    <div class="hero-content">
      <h1 class="hero-title font-sora">{{ t('contact.title') }}</h1>
      <p class="hero-description font-inter">
        {{ t('contact.subtitle') }}
      </p>
      <div class="breadcrumbs font-inter">
        {{ t('contact.breadcrumb') }}
      </div>
    </div>
    <div class="curve-shape"></div>
  </section>
</template>

<script setup>
const { t } = useI18n()
</script>

<style scoped>
.contact-hero {
  background-color: #0c2547;
  background-image: linear-gradient(135deg, #0c2547, #0f3060);
  color: white;
  padding: 5rem 2rem 7rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 2.75rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
}

.hero-description {
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.9;
}

.breadcrumbs {
  font-size: 0.9rem;
  opacity: 0.7;
}

.curve-shape {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18.2 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z' opacity='.25' fill='%23FFFFFF'/%3E%3C/svg%3E") no-repeat;
  background-size: cover;
  opacity: 0.1;
  z-index: 1;
}

@media (max-width: 768px) {
  .contact-hero {
    padding: 4rem 1.5rem 6rem;
  }

  .hero-title {
    font-size: 2.25rem;
  }

  .hero-description {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .contact-hero {
    padding: 3.5rem 1rem 5rem;
  }

  .hero-title {
    font-size: 1.875rem;
  }
}
</style>
