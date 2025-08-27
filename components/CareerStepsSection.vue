<template>
  <section class="career-steps-section full-width">
    <div class="container">
      <div class="tag-line">
        <span class="easy-process">+ {{ t('home.careerSteps.tagline') }}</span>
      </div>
      <h2 class="section-title font-sora">{{ t('home.careerSteps.title') }}</h2>
      <p class="section-description font-inter">
        {{ t('home.careerSteps.description') }}
      </p>
      
      <div class="steps-container">
        <!-- Step 1: Create profile -->
        <div class="step-card">
          <div class="icon-container">
            <div class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
          <h3 class="step-title font-sora">{{ t('home.careerSteps.steps.profile.title') }}</h3>
          <p class="step-description font-inter">
            {{ t('home.careerSteps.steps.profile.description') }}
          </p>
          <div class="step-placeholder"></div>
        </div>
        
        <!-- Step 2: Job insights -->
        <div class="step-card">
          <div class="icon-container">
            <div class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
          </div>
          <h3 class="step-title font-sora">{{ t('home.careerSteps.steps.insights.title') }}</h3>
          <p class="step-description font-inter">
            {{ t('home.careerSteps.steps.insights.description') }}
          </p>
          <div class="step-placeholder"></div>
        </div>
        
        <!-- Step 3: Bookmark jobs -->
        <div class="step-card">
          <div class="icon-container">
            <div class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
          </div>
          <h3 class="step-title font-sora">{{ t('home.careerSteps.steps.bookmarks.title') }}</h3>
          <p class="step-description font-inter">
            {{ t('home.careerSteps.steps.bookmarks.description') }}
          </p>
          <div class="step-placeholder"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { t } = useI18n()
// i18n kullanımı (useI18n zaten global olarak erişilebilir)
</script>

<style scoped>
.career-steps-section {
  padding: 5rem 1.5rem;
  background-color: #fff;
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

.container {
  max-width: 1150px;
  margin: 0 auto;
  width: 100%;
}

.tag-line {
  margin-bottom: 1rem;
}

.easy-process {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  background-color: #e5f0ff;
  color: #3b82f6;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: #111827;
}

.section-description {
  max-width: 700px;
  margin: 0 auto 3.5rem;
  color: #4b5563;
  line-height: 1.6;
  font-size: 1.125rem;
}

.steps-container {
  display: flex;
  gap: 2rem;
  justify-content: space-between;
  margin: 0 auto;
  width: 100%;
}

.step-card {
  flex: 1;
  min-width: 0; /* Allow cards to shrink below min-width */
  max-width: calc(33.333% - 1.5rem);
  background-color: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-align: left;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.icon-container {
  margin-bottom: 1.25rem;
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  color: #3b82f6;
  background-color: #e5f0ff;
}

.step-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #111827;
}

.step-description {
  color: #4b5563;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.step-placeholder {
  height: 180px;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  margin-top: 1.5rem;
}

@media (max-width: 1200px) {
  .section-title {
    font-size: 2.25rem;
  }
  
  .step-card {
    padding: 1.25rem;
  }
}

@media (max-width: 1024px) {
  .steps-container {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  
  .step-card {
    max-width: 100%;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .career-steps-section {
    padding: 4rem 1.25rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-description {
    font-size: 1rem;
    margin-bottom: 2.5rem;
  }
  
  .step-placeholder {
    height: 150px;
  }
}

@media (max-width: 480px) {
  .career-steps-section {
    padding: 3rem 1rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .step-card {
    min-width: auto;
    padding: 1rem;
  }
  
  .step-placeholder {
    height: 120px;
  }
}
</style>
