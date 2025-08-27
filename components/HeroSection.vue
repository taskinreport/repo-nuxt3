<template>
  <section class="hero-section full-width">
    <div class="hero-content">
      <h1 class="hero-title font-sora">{{ t('home.hero.title') }}</h1>
      <p class="hero-description font-inter">
        {{ t('home.hero.description') }}
      </p>
      <div class="hero-buttons">
        <button class="primary-button font-inter">{{ t('home.hero.tryFree') }}</button>
        <button class="secondary-button font-inter">{{ t('home.hero.contactSales') }}</button>
      </div>
      <p class="hero-note font-inter">{{ t('home.hero.note') }}</p>
    </div>
    <div class="hero-image-container">
      <img 
        :src="locale === 'tr' ? 'https://ik.imagekit.io/qcrgl3hz3q/mailgraf-e-posta-pazarlama-hizmeti.webp' : 'https://ik.imagekit.io/qcrgl3hz3q/mailgraf%20inter%20miami%20fc%20no%20logo.jpg?updatedAt=1751406759093'"
        :alt="locale === 'tr' ? 'Mailgraf e-posta pazarlama hizmeti' : 'Mailgraf email marketing service'"
        class="hero-image"
      />
    </div>
  </section>
</template>

<script setup>
const { t, locale } = useI18n();

// Debug için
console.log('i18n loaded:', t('home.hero.title'));
console.log('current locale:', locale.value);
</script>

<style scoped>
.hero-section {
  background-color: #dcf7dc; /* Light green background color matching the image */
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.full-width {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.hero-content {
  max-width: 1150px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 3rem; /* 4px */
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.hero-description {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 2rem;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.primary-button {
  background-color: #6b42e8; /* Purple button color from the image */
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.primary-button:hover {
  background-color: #5a36c9;
}

.secondary-button {
  background-color: transparent;
  color: #6b42e8;
  border: 1px solid #6b42e8;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.secondary-button:hover {
  background-color: rgba(107, 66, 232, 0.1);
}

.hero-note {
  font-size: 0.875rem;
  color: #666;
  margin-top: 1rem;
}

.hero-image-container {
  width: 100%;
  max-width: 1350px;
  margin: 2rem auto 0;
  padding: 0 1rem;
}

.hero-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 1200px) {
  .hero-title {
    font-size: 2.8rem; /* 45px */
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.25rem; /* 36px */
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>
