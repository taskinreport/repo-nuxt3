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
      <div class="blog-content-wrapper" v-html="cleanedContent"></div>

      <!--       <section v-if="faq?.length && !hasEmbeddedFaq" class="mt-16">
<h2 class="faq-title">{{ isTR ? 'Sık Sorulan Sorular' : 'Frequently Asked Questions' }}</h2>
        <div class="faq-container">
          <div v-for="(qa, i) in faq" :key="i" class="faq-item">
            <h3 class="faq-question">{{ qa.question }}</h3>
            <div class="faq-answer wp-content" v-html="qa.answer"></div>
          </div>
        </div>
      </section> -->
    </div>
  </article>
</template>

<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();
const slug = route.params.slug as string;

type WPPost = {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  image: string | null;
  faq: { question: string; answer: string }[];
  hasYoastFaqJsonLd?: boolean;
};

const isTR = computed(() => route.path.startsWith("/tr"));
const lang = computed(() => (isTR.value ? "tr" : "en"));

const { data, pending, error } = await useFetch<WPPost>(
  `/api/wp/post/${slug}`,
  {
    query: { lang },
    watch: [lang],
    server: true,
  }
);

const post = computed(() => data.value);
const faq = computed(() => post.value?.faq ?? []);
const hasEmbeddedFaq = computed(() =>
  /wp-block-yoast-.*faq/i.test(post.value?.content || "")
);

// FAQ blokları temizlenmiş content
const cleanedContent = computed(() => {
  const content = post.value?.content || "";

  // Yoast FAQ bloklarını kaldır
  return content;
  /*  .replace(
      /<div[^>]*class="[^"]*wp-block-yoast[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
      ""
    )
    .replace(/<div[^>]*class="[^"]*faq[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(
      /<section[^>]*class="[^"]*faq[^"]*"[^>]*>[\s\S]*?<\/section>/gi,
      ""
    )
    .replace(/<!--\s*wp:yoast-seo\/faq-block[\s\S]*?-->/gi, "")
    .replace(/<!--\s*\/wp:yoast-seo\/faq-block\s*-->/gi, "")
    .replace(
      /<h[1-6][^>]*>.*?(sık\s+sorulan\s+sorular|frequently\s+asked\s+questions).*?<\/h[1-6]>/gi,
      ""
    )
    .trim(); */
});

const formattedDate = computed(() => {
  const d = post.value?.date;
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString(isTR.value ? "tr-TR" : "en-US", {
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
  const title = post.value?.title
    ? `${stripHtml(post.value.title)} — Mailgraf Blog`
    : "Blog — Mailgraf";
  const desc = post.value?.excerpt
    ? stripHtml(post.value.excerpt).slice(0, 200)
    : undefined;
  const base = (config.public as any)?.siteUrl || "";
  const img = post.value?.image || `${base}/favicon.ico`;
  return {
    title,
    description: desc,
    ogTitle: title,
    ogDescription: desc,
    ogType: "article",
    ogImage: img,
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: desc,
    twitterImage: img,
  };
});

// canonical + hreflang
useHead(() => {
  const base = (config.public as any)?.siteUrl || "";
  const isTR = route.path.startsWith("/tr");
  const enHref = isTR
    ? base + route.path.replace(/^\/tr/, "")
    : base + route.path;
  const trHref = isTR ? base + route.path : base + "/tr" + route.path;
  return {
    link: [
      { rel: "canonical", href: isTR ? trHref : enHref },
      { rel: "alternate", hreflang: "en", href: enHref },
      { rel: "alternate", hreflang: "tr", href: trHref },
      { rel: "alternate", hreflang: "x-default", href: enHref },
    ],
  };
});

function stripHtml(s: string) {
  return s.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ");
}

// JSON-LD FAQ schema (Yoast’tan geleni sayfaya da yansıtıyoruz)
/* useHead(() => {
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
}); */
</script>

<style scoped>
/* 📖 Blog Content Styling */
.blog-content-wrapper {
  color: #374151;
  line-height: 1.8;
  font-size: 1.125rem;
}

/* Başlıklar */
.blog-content-wrapper :deep(h1),
.blog-content-wrapper :deep(h2),
.blog-content-wrapper :deep(h3),
.blog-content-wrapper :deep(h4),
.blog-content-wrapper :deep(h5),
.blog-content-wrapper :deep(h6) {
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  font-weight: 700;
  line-height: 1.3;
  color: #1a202c;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
}

.blog-content-wrapper :deep(h1) {
  font-size: 3rem;
  margin-top: 0;
  margin-bottom: 2rem;
}

.blog-content-wrapper :deep(h2) {
  font-size: 2.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid #e2e8f0;
  margin-bottom: 2rem;
  margin-top: 4rem;
}

.blog-content-wrapper :deep(h3) {
  font-size: 2rem;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
}

.blog-content-wrapper :deep(h4) {
  font-size: 1.5rem;
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;
}

.blog-content-wrapper :deep(h5) {
  font-size: 1.25rem;
  margin-top: 2rem;
}

.blog-content-wrapper :deep(h6) {
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 2rem;
}

/* Paragraflar */
.blog-content-wrapper :deep(p) {
  margin-bottom: 2rem;
  line-height: 1.8;
  font-size: 1.125rem;
}

.blog-content-wrapper :deep(p:last-child) {
  margin-bottom: 0;
}

/* Linkler */
.blog-content-wrapper :deep(a) {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.blog-content-wrapper :deep(a:hover) {
  color: #1d4ed8;
  border-bottom-color: #3b82f6;
}

/* Listeler */
.blog-content-wrapper :deep(ul),
.blog-content-wrapper :deep(ol) {
  margin: 2rem 0;
  padding-left: 2rem;
}

.blog-content-wrapper :deep(li) {
  margin-bottom: 0.75rem;
  line-height: 1.7;
}

/* Resimler */
.blog-content-wrapper :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 2rem auto;
  display: block;
}

/* Blockquote */
.blog-content-wrapper :deep(blockquote) {
  border-left: 4px solid #3b82f6;
  padding: 1.5rem 2rem;
  margin: 2.5rem 0;
  background: #f8fafc;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: #475569;
  font-size: 1.1rem;
}

/* Code */
.blog-content-wrapper :deep(code) {
  background: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9em;
  color: #e11d48;
}

.blog-content-wrapper :deep(pre) {
  background: #1e293b;
  color: #f1f5f9;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 2rem 0;
}

/* ❌ Yoast FAQ Blokları Gizleme (SEO güvenli) */
.blog-content-wrapper :deep(.wp-block-yoast-faq-block),
.blog-content-wrapper :deep(.wp-block-yoast-how-to-block),
.blog-content-wrapper :deep(.schema-faq),
.blog-content-wrapper :deep(.yoast-faq),
.blog-content-wrapper :deep(.faq-question),
.blog-content-wrapper :deep(.faq-answer),
.blog-content-wrapper :deep([class*="faq"]),
.blog-content-wrapper :deep([class*="wp-block-yoast"]),
.blog-content-wrapper :deep([data-block-name*="yoast"]),
.blog-content-wrapper :deep([id*="faq"]),
.blog-content-wrapper :deep(div[class*="yoast"]) {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
}

/* JSON-LD ve schema markup'ı koruyalım */
.blog-content-wrapper :deep(script[type="application/ld+json"]) {
  display: block !important;
}

/* Mobil */
@media (max-width: 768px) {
  .blog-content-wrapper {
    font-size: 1rem;
  }

  .blog-content-wrapper :deep(h1) {
    font-size: 2.25rem;
    margin-bottom: 1.5rem;
  }
  .blog-content-wrapper :deep(h2) {
    font-size: 1.875rem;
    margin-top: 3rem;
    margin-bottom: 1.5rem;
  }
  .blog-content-wrapper :deep(h3) {
    font-size: 1.5rem;
    margin-top: 2.5rem;
  }
  .blog-content-wrapper :deep(h4) {
    font-size: 1.25rem;
    margin-top: 2rem;
  }

  .blog-content-wrapper :deep(p) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
}

/* 📖 FAQ Styling */
.faq-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
}

.faq-title::after {
  content: "";
  display: block;
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 1rem auto 0;
  border-radius: 2px;
}

.faq-container {
  display: grid;
  gap: 1.5rem;
}

.faq-item {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.faq-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.faq-question {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;
}

.faq-question::before {
  content: "?";
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 1rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.faq-answer {
  color: #475569;
  line-height: 1.7;
}

.faq-answer p {
  margin-bottom: 1rem;
}

.faq-answer p:last-child {
  margin-bottom: 0;
}

/* 📱 Responsive FAQ */
@media (max-width: 768px) {
  .faq-item {
    padding: 1.5rem;
  }

  .faq-question {
    font-size: 1.125rem;
  }

  .faq-title {
    font-size: 1.75rem;
  }
}
</style>
