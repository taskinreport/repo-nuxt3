<template>
  <section class="contact-form-section">
    <div class="container">
      <div class="contact-container">
        <!-- Form Column -->
        <div class="form-column">
          <div class="form-tag">{{ t('contact.form.tag') }}</div>
          <h2 class="form-title font-sora">{{ t('contact.form.title') }}</h2>
          <p class="form-subtitle font-inter">{{ t('contact.form.subtitle') }}</p>
          
          <form class="contact-form" @submit.prevent="handleSubmit">
            <!-- Form Alert if there's a message -->
            <div v-if="formStatus" :class="['form-alert', formStatus === 'success' ? 'success' : 'error']">
              {{ formMessage }}
            </div>
            
            <!-- Name Field -->
            <div class="form-group">
              <label for="name" class="form-label">{{ t('contact.form.name') }}</label>
              <input 
                type="text" 
                id="name" 
                v-model="formData.name" 
                class="form-control" 
                :placeholder="t('contact.form.name')" 
                required
              />
            </div>
            
            <!-- Email Field -->
            <div class="form-group">
              <label for="email" class="form-label">{{ t('contact.form.email') }}</label>
              <input 
                type="email" 
                id="email" 
                v-model="formData.email" 
                class="form-control" 
                :placeholder="t('contact.form.email')" 
                required
              />
            </div>
            
            <!-- Message Field -->
            <div class="form-group">
              <label for="message" class="form-label">{{ t('contact.form.message') }}</label>
              <textarea 
                id="message" 
                v-model="formData.message" 
                class="form-control" 
                :placeholder="t('contact.form.message')" 
                rows="5" 
                required
              ></textarea>
            </div>
            
            <!-- Submit Button -->
            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="loading-spinner"></span>
              <span>{{ t('contact.form.submit') }}</span>
            </button>
          </form>
        </div>
        
        <!-- Testimonial Column with Image -->
        <div class="testimonial-column">
          <div class="image-wrapper">
            <!-- Placeholder for the testimonial image -->
            <div class="image-placeholder">
              <!-- You can replace this with an actual image -->
            </div>
            
            <!-- Testimonial Quote -->
            <div class="testimonial-content">
              <p class="testimonial-text">
                "{{ t('contact.testimonial.text') }}"
              </p>
              <div class="testimonial-author">
                <p class="author-name">{{ t('contact.testimonial.name') }}</p>
                <p class="author-location">{{ t('contact.testimonial.location') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { t } = useI18n()
import { ref } from 'vue';

// Form data
const formData = ref({
  name: '',
  email: '',
  message: ''
});

// Form submission state
const isSubmitting = ref(false);
const formStatus = ref(null); // 'success' or 'error' or null
const formMessage = ref('');

// Form submission handler
const handleSubmit = async () => {
  isSubmitting.value = true;
  formStatus.value = null;
  
  try {
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For now just log the form data
    console.log('Form submission:', formData.value);
    
    // Success message
    formStatus.value = 'success';
    formMessage.value = t('contact.form.success');
    
    // Clear form
    formData.value = {
      name: '',
      email: '',
      message: ''
    };
    
    // In a real application, you would send this data to your backend
    // using fetch or axios
    
  } catch (error) {
    console.error('Form submission error:', error);
    formStatus.value = 'error';
    formMessage.value = t('contact.form.error');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.contact-form-section {
  padding: 0 2rem 5rem;
  background-color: #fff;
}

.container {
  max-width: 1150px;
  margin: 0 auto;
}

.contact-container {
  display: flex;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  margin-top: -5rem;
  position: relative;
  z-index: 10;
}

/* Form Column */
.form-column {
  flex: 1;
  padding: 2.5rem;
}

.form-tag {
  display: inline-block;
  background-color: #e5f0ff;
  color: #3b82f6;
  padding: 0.35rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.form-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: #f9fafb;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

.submit-btn {
  margin-top: 0.5rem;
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  min-height: 48px;
}

.submit-btn:hover {
  background-color: #2563eb;
}

.submit-btn:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.form-alert {
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.form-alert.success {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.form-alert.error {
  background-color: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

/* Testimonial Column */
.testimonial-column {
  flex: 1;
  position: relative;
  min-height: 100%;
  display: flex;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f3f4f6;
  background-image: url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80');
  background-size: cover;
  background-position: center;
}

.testimonial-content {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  right: 2rem;
  padding: 1.5rem;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.testimonial-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #374151;
  margin-bottom: 1rem;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: #111827;
  font-size: 0.95rem;
}

.author-location {
  font-size: 0.85rem;
  color: #6b7280;
}

/* Responsive Design */
@media (max-width: 992px) {
  .contact-container {
    flex-direction: column;
  }
  
  .testimonial-column {
    min-height: 350px;
  }
}

@media (max-width: 768px) {
  .contact-form-section {
    padding: 0 1.5rem 4rem;
  }
  
  .form-column {
    padding: 2rem 1.5rem;
  }
  
  .testimonial-content {
    left: 1.5rem;
    right: 1.5rem;
    bottom: 1.5rem;
  }
}

@media (max-width: 480px) {
  .form-column {
    padding: 1.5rem 1rem;
  }
  
  .testimonial-column {
    min-height: 300px;
  }
  
  .testimonial-content {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    padding: 1rem;
  }
}
</style>
