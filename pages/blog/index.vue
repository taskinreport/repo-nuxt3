<template>
  <div class="min-h-screen py-10">
    <div class="max-w-6xl mx-auto px-4">
      <header class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Blog</h1>
        <p class="mt-2 text-gray-600">Son yazılarımızdan öne çıkan içerikler</p>
      </header>

      <div v-if="pending" class="text-gray-500">Loading posts…</div>
      <div v-else-if="error" class="text-red-600">Failed to load posts.</div>

      <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        <article
          v-for="post in posts"
          :key="post.id"
          class="blog-card group"
        >
          <NuxtLink :to="postLink(post.slug)" class="block h-full">
            <div class="blog-thumb" v-if="post.image">
              <img :src="post.image" :alt="post.title" class="w-full h-full object-cover" />
              <div class="blog-overlay"></div>
            </div>
            <div class="blog-content">
              <div class="blog-meta">
                <time class="blog-date">{{ formatDate(post.date) }}</time>
                <span class="blog-category">Blog</span>
              </div>
              <h2 class="blog-title group-hover:text-blue-600 transition-colors duration-300">
                <span v-html="post.title"></span>
              </h2>
              <p class="blog-excerpt" v-html="post.excerpt"></p>
              <div class="blog-read-more">
                <span>{{ isTR ? 'Devamını Oku' : 'Read More' }}</span>
                <svg class="blog-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>

      <!-- Pagination -->
      <nav class="flex items-center justify-center gap-3 mt-10">
        <button
          class="px-3 py-2 rounded border text-sm disabled:opacity-50"
          :disabled="!hasPrev || pending"
          @click="goTo(page - 1)"
        >
          ← Previous
        </button>
        <span class="text-sm text-gray-600">Page {{ page }}</span>
        <button
          class="px-3 py-2 rounded border text-sm disabled:opacity-50"
          :disabled="!hasNext || pending"
          @click="goTo(page + 1)"
        >
          Next →
        </button>
      </nav>
    </div>
  </div>
  
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const router = useRouter()
const route = useRoute()

type WPListItem = {
  id: number
  slug: string
  title: string
  excerpt: string
  date: string
  image: string | null
}

const perPage = 12
const page = computed(() => {
  const p = Number(route.query.page || 1)
  return Number.isFinite(p) && p > 0 ? p : 1
})

const isTR = computed(() => route.path.startsWith('/tr'))
const lang = computed(() => isTR.value ? 'tr' : 'en')

const { data, pending, error } = await useFetch<WPListItem[]>('/api/wp/posts', {
  query: { lang, per_page: perPage, page },
  watch: [page, lang],
  server: true
})

const posts = computed(() => data.value || [])

function postLink(slug: string) {
  // i18n prefix’i otomatik uygular; TR locale aktifse /tr/blog/slug olur
  return localePath(`/blog/${slug}`)
}

const hasPrev = computed(() => page.value > 1)
const hasNext = computed(() => posts.value.length === perPage)

function goTo(newPage: number) {
  if (newPage < 1) return
  router.push({ path: route.path, query: { ...route.query, page: newPage } })
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
  } catch {
    return dateStr
  }
}

const config = useRuntimeConfig()
useSeoMeta({
  title: 'Blog — Mailgraf',
  ogTitle: 'Blog — Mailgraf',
  twitterCard: 'summary_large_image'
})

// canonical + hreflang
useHead(() => {
  const base = (config.public as any)?.siteUrl || ''
  const isTR = route.path.startsWith('/tr')
  const enHref = isTR ? base + route.path.replace(/^\/tr/, '') : base + route.path
  const trHref = isTR ? base + route.path : base + '/tr' + route.path
  return {
    link: [
      { rel: 'canonical', href: isTR ? trHref : enHref },
      { rel: 'alternate', hreflang: 'en', href: enHref },
      { rel: 'alternate', hreflang: 'tr', href: trHref },
      { rel: 'alternate', hreflang: 'x-default', href: enHref }
    ]
  }
})
</script>

<style scoped>
/* 🎨 Premium Blog Cards */
.blog-card {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  height: 100%;
}

.blog-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.12);
}

/* 🖼️ Thumbnail */
.blog-thumb {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.blog-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.blog-card:hover .blog-thumb img {
  transform: scale(1.1);
}

.blog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.blog-card:hover .blog-overlay {
  opacity: 1;
}

/* 📝 Content */
.blog-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.blog-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.blog-date {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.blog-category {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* 🏷️ Title */
.blog-title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.4;
  color: #111827;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 📄 Excerpt */
.blog-excerpt {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 🔗 Read More */
.blog-read-more {
  display: flex;
  align-items: center;
  color: #3b82f6;
  font-weight: 600;
  font-size: 0.875rem;
  margin-top: auto;
  transition: all 0.3s ease;
}

.blog-arrow {
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
}

.blog-card:hover .blog-read-more {
  color: #1d4ed8;
}

.blog-card:hover .blog-arrow {
  transform: translateX(4px);
}

/* 📱 Responsive */
@media (max-width: 768px) {
  .blog-content {
    padding: 1.25rem;
  }
  
  .blog-title {
    font-size: 1.125rem;
  }
}

/* 🎭 Hover animations */
@media (prefers-reduced-motion: no-preference) {
  .blog-card {
    transform-origin: center;
  }
  
  .blog-card:hover {
    animation: subtle-bounce 0.6s ease-out;
  }
}

@keyframes subtle-bounce {
  0% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(-8px); }
}
</style>
