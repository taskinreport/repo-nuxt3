<template>
  <article class="min-h-screen">
    <!-- Hero (düz arkaplan) -->
    <header>
      <div class="max-w-3xl mx-auto px-4 pt-10 pb-6">
        <p class="text-sm text-gray-500 mb-2">Blog</p>
        <h1
          class="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight"
        >
          <span v-html="post?.title"></span>
        </h1>
        <div class="mt-3 flex items-center gap-3 text-gray-600 text-sm">
          <span>{{ formattedDate }}</span>
          <span v-if="readingTime" aria-hidden>•</span>
          <span v-if="readingTime">{{ readingTime }} min read</span>
        </div>
      </div>
    </header>

    <!-- Cover Image (düz, arka plan yok) -->
    <div v-if="post?.image">
      <div class="max-w-5xl mx-auto px-4">
        <img
          :src="post.image"
          alt=""
          class="w-full rounded-xl my-6 aspect-video object-cover"
        />
      </div>
    </div>

    <!-- Content + FAQ -->
    <div class="max-w-3xl mx-auto px-4 pb-20">
      <div class="wp-content prose prose-lg max-w-none prose-headings:font-extrabold prose-a:text-blue-600 prose-img:rounded-xl prose-img:shadow-md" v-html="post?.content"></div>

      <section v-if="faq?.length && !hasEmbeddedFaq" class="mt-16">
        <h2 class="text-2xl font-bold mb-6">Sık Sorulan Sorular</h2>
        <div class="grid gap-4">
          <div v-for="(qa, i) in faq" :key="i" class="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 class="text-lg font-semibold mb-3">{{ qa.question }}</h3>
            <div class="answer wp-content prose prose-sm max-w-none text-gray-700" v-html="qa.answer"></div>
          </div>
        </div>
      </section>
    </div>
  </article>
</template>

<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();
const slug = route.params.slug as string;

type WPPost = {
  id: number
  slug: string
  title: string
  content: string
  excerpt: string
  date: string
  image: string | null
  faq: { question: string; answer: string }[]
  hasYoastFaqJsonLd?: boolean
}

const isTR = computed(() => route.path.startsWith('/tr'))
const lang = computed(() => isTR.value ? 'tr' : 'en')

const { data, pending, error } = await useFetch<WPPost>(`/api/wp/post/${slug}`, {
  query: { lang },
  watch: [lang],
  server: true,
});

const post = computed(() => data.value);
const faq = computed(() => post.value?.faq ?? []);
const hasEmbeddedFaq = computed(() =>
  /wp-block-yoast-.*faq/i.test(post.value?.content || "")
);

const formattedDate = computed(() => {
  const d = post.value?.date;
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString(isTR.value ? 'tr-TR' : 'en-US', {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  } catch {
    return d;
  }
});

// Basit okuma süresi (yaklaşık): 200 wpm
const readingTime = computed(() => {
  const html = post.value?.content || "";
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
});

useSeoMeta(() => {
  const title = post.value?.title ? `${stripHtml(post.value.title)} — Mailgraf Blog` : 'Blog — Mailgraf'
  const desc = post.value?.excerpt ? stripHtml(post.value.excerpt).slice(0, 200) : undefined
  const base = (config.public as any)?.siteUrl || ''
  const img = post.value?.image || `${base}/favicon.ico`
  return {
    title,
    description: desc,
    ogTitle: title,
    ogDescription: desc,
    ogType: 'article',
    ogImage: img,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: desc,
    twitterImage: img
  }
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

function stripHtml(s: string) {
  return s.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ");
}

// JSON-LD FAQ schema (Yoast’tan geleni sayfaya da yansıtıyoruz)
useHead(() => {
  // Yoast JSON-LD WP tarafında olsa bile headless sayfada bulunmaz;
  // Bu nedenle FAQ verisi çıkarabildiğimiz her durumda JSON-LD enjekte ediyoruz.
  if (!faq.value?.length) return {};
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.value.map((qa: any) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: { "@type": "Answer", text: stripHtml(qa.answer) },
    })),
  };
  return {
    script: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  };
});
</script>

<style scoped>
</style>
