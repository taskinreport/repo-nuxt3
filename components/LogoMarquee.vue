<template>
  <div class="bg-white py-12 border-y border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-2 font-sora">{{ t('home.trustedCompanies') }}</h2>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div class="marquee-wrapper relative">
        <!-- Left gradient mask -->
        <div class="absolute top-0 left-0 z-10 w-24 h-full bg-gradient-to-r from-white to-transparent"></div>
      
        <div class="marquee">
          <div class="logo-track" aria-hidden="true">
            <div class="logo-item" v-for="(logo, index) in logos" :key="`logo-${index}`">
              <div class="logo-placeholder">
                <div class="logo-icon">
                  <component :is="logoIcons[index % logoIcons.length]" />
                </div>
                <span class="logo-text">{{ logo }}</span>
              </div>
            </div>
          </div>
          <!-- Duplicate for seamless loop -->
          <div class="logo-track" aria-hidden="true">
            <div class="logo-item" v-for="(logo, index) in logos" :key="`logo-duplicate-${index}`">
              <div class="logo-placeholder">
                <div class="logo-icon">
                  <component :is="logoIcons[index % logoIcons.length]" />
                </div>
                <span class="logo-text">{{ logo }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right gradient mask -->
        <div class="absolute top-0 right-0 z-10 w-24 h-full bg-gradient-to-l from-white to-transparent"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
import { h, ref, onMounted, nextTick } from 'vue';

// Logo array - core set of logos
const baseLogos = ['Logo1', 'Logo2', 'Logo3', 'Logo4', 'Logo5', 'Logo6'];
// Creating a longer array by repeating the base logos to prevent gaps
const logos = ref([...baseLogos, ...baseLogos, ...baseLogos]);

// Adjust animation duration based on the number of logos
onMounted(() => {
  nextTick(() => {
    // Get all logo tracks and ensure they have the correct width
    const tracks = document.querySelectorAll('.logo-track');
    tracks.forEach(track => {
      // Make sure animation is smooth
      const items = track.querySelectorAll('.logo-item');
      if (items.length > 0) {
        // Adjust animation based on the number of items
        const duration = items.length * 2.5; // 2.5 seconds per logo item
        track.style.animationDuration = `${duration}s`;
      }
    });
  });
});

// Logo icons as Vue components
const logoIcons = [
  // Briefcase icon
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('rect', { x: '2', y: '7', width: '20', height: '14', rx: '2', ry: '2' }),
    h('path', { d: 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' })
  ]),
  // Building icon
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('rect', { x: '4', y: '2', width: '16', height: '20', rx: '2', ry: '2' }),
    h('line', { x1: '12', y1: '6', x2: '12', y2: '6.01' }),
    h('line', { x1: '12', y1: '10', x2: '12', y2: '10.01' }),
    h('line', { x1: '12', y1: '14', x2: '12', y2: '14.01' }),
    h('line', { x1: '12', y1: '18', x2: '12', y2: '18.01' })
  ]),
  // Star icon
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('polygon', { points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' })
  ]),
  // Zap icon
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('polygon', { points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' })
  ]),
  // Globe icon
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('circle', { cx: '12', cy: '12', r: '10' }),
    h('line', { x1: '2', y1: '12', x2: '22', y2: '12' }),
    h('path', { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' })
  ]),
  // Shield icon
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' })
  ])
];
</script>

<style scoped>

.marquee-wrapper {
  position: relative;
  width: 100%;
  max-width: 100%;
}

.marquee {
  display: flex;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.logo-track {
  display: flex;
  animation: marquee 30s linear infinite;
  white-space: nowrap;
  flex-shrink: 0;
  padding-right: 0;
}

.logo-item {
  margin-right: 4rem; /* Spacing between logos */
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  flex-shrink: 0; /* Prevent logos from shrinking */
}

.logo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  color: #666; /* Dark gray for icons */
  transition: all 0.3s ease;
}

.logo-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #666; /* Dark gray for logos */
  letter-spacing: 0.5px;
}

.logo-item:hover .logo-icon {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: #333;
}

.logo-item:hover .logo-text {
  color: #333;
}

@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* Pause animation on hover */
.marquee:hover .logo-track {
  animation-play-state: paused;
}

/* Media queries for responsive sizing */
@media (max-width: 768px) {
  .logo-icon {
    width: 36px;
    height: 36px;
  }
  
  .logo-text {
    font-size: 0.8125rem;
  }
  
  .logo-item {
    margin-right: 3rem;
  }
}

@media (max-width: 480px) {
  .logo-icon {
    width: 32px;
    height: 32px;
  }
  
  .logo-text {
    font-size: 0.75rem;
  }
  
  .logo-item {
    margin-right: 2.5rem;
    padding: 0.5rem 0.75rem;
  }
}
</style>
