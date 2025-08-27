<template>
  <div class="min-h-screen py-10">
    <div class="max-w-6xl mx-auto px-4">
      <header class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Blog</h1>
        <p class="mt-2 text-gray-600">Son yazılarımızdan öne çıkan içerikler</p>
      </header>

      <div v-if="pending" class="text-gray-500">Loading posts…</div>
      <div v-else-if="error" class="text-red-600">Failed to load posts.</div>

      <div v-else class="grid gap-6 md:grid-cols-2">
        <NuxtLink
          v-for="post in posts"
          :key="post.id"
          :to="postLink(post.slug)"
          class="card group"
        >
          <div class="thumb" v-if="post.image">
            <img :src="post.image" alt="" class="w-full h-full object-cover" />
          </div>
          <div class="p-5">
            <div class="text-xs text-gray-500">{{ formatDate(post.date) }}</div>
            <h2 class="mt-2 text-xl font-semibold leading-snug group-hover:text-blue-600 transition-colors">
              <span v-html="post.title"></span>
            </h2>
            <p class="mt-2 text-gray-600 line-clamp-3" v-html="post.excerpt"></p>
            <div class="mt-4 flex items-center text-sm text-blue-600 font-medium">
              Read more
              <svg class="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </NuxtLink>
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
.card {
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb; /* gray-200 */
  border-radius: 0.75rem;
  overflow: hidden;
  background: #fff;
  transition: box-shadow .2s ease, transform .2s ease, border-color .2s ease;
}
.card:hover { box-shadow: 0 10px 30px rgba(2,6,23,0.08); border-color: #e2e8f0; }
.thumb { aspect-ratio: 16/9; overflow: hidden; }
.thumb img { transition: transform .35s ease; }
.card:hover .thumb img { transform: scale(1.03); }

/* line clamp helper */
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
</style>
