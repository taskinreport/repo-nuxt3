# Agents Guide — Mailgraf (Nuxt 3)

Bu doküman, AI coding agent'ları ve katkıda bulunacak geliştiriciler için Mailgraf web sitesinin teknik tercihlerini, sınırlarını ve kabul kriterlerini tanımlar. Hedef: minimum baş ağrısı ile, Nuxt 3 tabanlı çok dilli (EN/TR) kurumsal site + WP headless blog ve ileride eklenecek basit bir dashboard.

## 1) Mimari ve Teknoloji Tercihleri

- Stack: Nuxt 3 (SSR/ISR, Nitro), TypeScript (hafif), Vercel deploy.
- UI: TailwindCSS + Nuxt UI v4 (ücretsiz, 100+ komponent) tercih edilir.
- i18n: Paket kullanmadan “folder‑based”. Varsayılan dil EN (prefix yok), TR `/tr` altında.
- İçerik: Blog verisi WordPress Headless (REST API) üzerinden gelir.
- Alan adları ve barındırma:
  - Uygulama (Nuxt): `mailgraf.com` (Cloudflare üzerinden, Vercel origin)
  - CMS (WordPress API - sadece API): hedef `cms.mailgraf.com` (Cloudflare üzerinden, WP origin)
  - Not: Şu an `cms.mailgraf.com` aktif değil; geçici olarak API `mailgraf.com` altından tüketilecek.
- Bağımlılıklar: Gereksiz paket eklemeyin. Özellikle `vue` ve `vue-router` bağımlılıklarını manuel eklemeyin (Nuxt getirir).
- Kod stili: Vue SFC + `<script setup>` Composition API. Minimum global state; gerektiğinde `composables/` yazın.

## 2) Klasör & Yönlendirme (Folder‑Based i18n)

- EN (default, prefix yok): `pages/**`
- TR (prefix’li): `pages/tr/**`
- Örnek:
  - `pages/index.vue` → en ana sayfa
  - `pages/about.vue` → en/about
  - `pages/tr/index.vue` → tr ana sayfa
  - `pages/tr/hakkimizda.vue` → tr/hakkımızda

### 2.1 İlk Ziyaret Dil Yönlendirmesi (Accept‑Language + Cookie)

Amaç: Kullanıcı ilk defa geliyorsa, tarayıcı diline göre `/tr`’ye 302 yönlendir; kullanıcı seçim yaptıysa cookie ile bunu koru.

Dosya: `middleware/locale-redirect.global.ts`

```ts
export default defineNuxtRouteMiddleware((to) => {
  // Kullanıcı seçim yapmışsa veya zaten /tr altındaysa dokunma
  const chosen = useCookie("locale", { sameSite: "lax" });
  if (chosen.value || to.path.startsWith("/tr")) return;

  // Sadece SSR isteğinde tarayıcı dilini okuyabiliriz
  const headers = useRequestHeaders(["accept-language"]);
  const pref = (headers["accept-language"] || "").toLowerCase();
  const wantsTR = pref.startsWith("tr") || pref.includes("tr-");

  if (wantsTR) {
    chosen.value = "tr";
    return navigateTo(`/tr${to.fullPath}`, { redirectCode: 302 });
  }
});
```

### 2.2 Dil Anahtarı (Path bazlı)

```ts
function switchLocalePath(target: "en" | "tr", currentPath: string) {
  if (target === "tr")
    return currentPath.startsWith("/tr") ? currentPath : `/tr${currentPath}`;
  // EN: /tr prefiksini kaldır
  const p = currentPath.replace(/^\/tr/, "");
  return p.length ? p : "/";
}

// Kullanım
const route = useRoute();
const cookie = useCookie("locale", { sameSite: "lax" });
function onLocaleChange(target: "en" | "tr") {
  cookie.value = target;
  return navigateTo(switchLocalePath(target, route.fullPath));
}
```

## 3) SEO Politikası (Basit ve Tutarlı)

- HTML lang: `layouts/default.vue` içinde path’e göre `en`/`tr` ayarlayın.

```ts
const route = useRoute();
const locale = computed(() => (route.path.startsWith("/tr") ? "tr" : "en"));
useHead({ htmlAttrs: { lang: locale } });
```

- Canonical + hreflang (en/tr/x-default): Her sayfada aynı pattern. `siteUrl` için runtime config kullanın.

```ts
const config = useRuntimeConfig();
const base = config.public.siteUrl || "https://mailgraf.com";
const route = useRoute();
const isTR = route.path.startsWith("/tr");
const enHref = isTR
  ? base + route.path.replace(/^\/tr/, "")
  : base + route.path;
const trHref = isTR ? base + route.path : base + "/tr" + route.path;

useHead({
  link: [
    { rel: "canonical", href: isTR ? trHref : enHref },
    { rel: "alternate", hreflang: "en", href: enHref },
    { rel: "alternate", hreflang: "tr", href: trHref },
    { rel: "alternate", hreflang: "x-default", href: enHref },
  ],
});
```

- Modüller: `nuxt-simple-sitemap` (sitemap), `@nuxtjs/robots` (robots). EN ve TR rotaları ekleyin.
- OG/Twitter: Basit sayfalarda `useHead` ile; gerekirse `nuxt-og-image`.

## 4) WordPress Headless Entegrasyonu

Nuxt server üzerinden proxy’leyin. Cache için `s-maxage` ve SWR kullanın.

- Base URL ortam değişkeni:
  - Geliştirme/şu an: `WP_BASE_URL=https://mailgraf.com`
  - Hedef (subdomain yayına girince): `WP_BASE_URL=https://cms.mailgraf.com`
  - Cloudflare’da istenirse kural ile yalnızca `/wp-json/*` uçlarına izin verilebilir; diğer yollar engellenebilir.

### 4.1 Liste (server/api/wp/posts.get.ts)

```ts
export default defineEventHandler(async (event) => {
  const base = process.env.WP_BASE_URL || "https://mailgraf.com";
  const lang = getQuery(event).lang || "en";
  const url = `${base}/wp-json/wp/v2/posts?per_page=10&_embed=1&lang=${lang}`;
  const data = await $fetch<any[]>(url);
  setHeader(event, "Cache-Control", "s-maxage=60, stale-while-revalidate=300");
  return data.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title?.rendered,
    excerpt: p.excerpt?.rendered,
    date: p.date,
    image: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
  }));
});
```

### 4.2 Detay (server/api/wp/post/[slug].get.ts)

```ts
export default defineEventHandler(async (event) => {
  const { slug } = getRouterParams(event);
  const base = process.env.WP_BASE_URL || "https://mailgraf.com";
  const lang = getQuery(event).lang || "en";
  const url = `${base}/wp-json/wp/v2/posts?slug=${slug}&_embed=1&lang=${lang}`;
  const [post] = await $fetch<any[]>(url);
  if (!post) throw createError({ statusCode: 404 });

  setHeader(event, "Cache-Control", "s-maxage=60, stale-while-revalidate=300");
  return {
    id: post.id,
    slug: post.slug,
    title: post.title?.rendered,
    content: post.content?.rendered,
    date: post.date,
    image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
  };
});
```

### 4.3 Sayfa Kullanımı (SSR)

```ts
const route = useRoute();
const isTR = computed(() => route.path.startsWith("/tr"));
const { data: posts } = await useFetch("/api/wp/posts", {
  query: { lang: isTR.value ? "tr" : "en" },
  server: true,
});
```

### 4.4 Görsel Optimizasyonu

`@nuxt/image` kullanın ve WP domain’ini tanımlayın. Şimdilik `mailgraf.com`, subdomain aktif olduğunda `cms.mailgraf.com` da eklenir.

```ts
export default defineNuxtConfig({
  modules: ["@nuxt/image"],
  image: { domains: ["mailgraf.com", "cms.mailgraf.com"] },
});
```

### 4.5 CORS ve Çağrı Yönü

- Varsayılan mimaride WP çağrıları Nuxt server’dan yapılır (SSR) → CORS gerekmez.
- İstemci tarafında doğrudan WP API çağrısı yapılacaksa, Cloudflare üzerinden `Access-Control-Allow-Origin: https://mailgraf.com` (ve gerekirse preview domainleri) tanımlayın.

### 4.6 Cloudflare Önbellekleme Notları

- Nuxt server yanıtlarında `Cache-Control: s-maxage, stale-while-revalidate` başlıkları set edilir; Cloudflare bunları saygılar ve edge cache uygular.
- `/api/wp/**` için SWR uygundur; origin (WP) üzerindeki yük azalır.
- ISR üretilen sayfalarda HTML’yi Cloudflare tarafında agresif cache etmeyin; Vercel’in `isr` davranışını başlıklar yönetsin.

## 5) ISR/SWR ve Önbellek

Vercel üzerinde ISR/SWR için `routeRules` kullanın.

```ts
export default defineNuxtConfig({
  routeRules: {
    "/blog/**": { isr: 60 },
    "/tr/blog/**": { isr: 60 },
    "/api/wp/**": { swr: 60 },
  },
});
```

Not: Cloudflare proxy arkasında çalışırken, ISR/SWR başlıkları edge’de aynen korunmalıdır. Ek cache kuralı eklenmeden önce başlıkların devreye girdiği doğrulanmalıdır.

## 6) Nuxt UI v4 ve Stil

- Nuxt UI v4 + Tailwind temel UI setidir. Tutarlılığı önceliklendirin.
- Global CSS’ler `nuxt.config.ts` içindeki `css: []` ile yüklensin. Aynı CSS’i ayrıca SFC içinde `@import` etmeyin.

### 6.1 Prose‑First Tipografi
- CMS/Blog içeriklerinde Tailwind Typography (`@tailwindcss/typography`) kullanın. İçeriği `prose` ile sarmalayın:
  - Örnek: `<div class="wp-content prose prose-lg max-w-none" v-html="html" />`
- Global CSS dosyasında (örn. `assets/css/wp-content.css`) sadece küçük yardımcılar (alignleft/alignright/aligncenter, float clear) bırakın. Başlık/paragraf/list/blockquote gibi tipografi kurallarını burada tekrar tanımlamayın; `prose` gölgelenmesin.
- Prose varyantlarını tercih edin: `prose-headings:font-extrabold`, `prose-a:text-blue-600`, `prose-img:rounded-xl` vb.
- Typography plugin kurulumu: `npm i -D @tailwindcss/typography` ve `tailwind.config.js` → `plugins: [require('@tailwindcss/typography')]`.

## 7) Blog Listesi — Sayfalama ve Dil Birleştirme (Önemli)
- Amaç: TR etiketli yazıların yanı sıra dil etiketi olmayan eski yazıların da görünmesi.
- API stratejisi (server/api/wp/posts.get.ts):
  - Parametreler: `page` (1..), `per_page` (öneri: 12), `lang` (örn. `tr`).
  - Mantık: Hedef dil (örn. `lang=tr`) seti ile “langsız” fallback setini sayfa sayfa (20’lik gruplar) çek; id’ye göre birleştir; tarihi azalan sırala; istenen pencereyi `(page-1)*per_page .. +per_page` slice et.
  - Guard: En fazla 8 sayfa (TR+fallback) taranır (≈320 post). Gerekirse artırılabilir.
- İstemci: `/blog?page=1` query ile gezin; `hasNext = items.length === per_page` basit kontrolü uygula.
- Alternatif: WP’nin `X-WP-Total`/`X-WP-TotalPages` başlıkları okunarak daha kesin pagination yapılabilir (ofetch/headers ile); yeni projede tercih edilebilir.

## 8) Tekil Yazı — Lang Fallback ve Güvenlik
- Slug ile getirme: Önce `slug + lang` denenir, yoksa “langsız” fallback çağrısı yapılır.
- XSS güvenliği: `isomorphic-dompurify` ile `title`, `excerpt`, `content`, `faq.answer` sanitize edilir (ALLOWED_TAGS/ATTR ile whitelist).

## 9) FAQ JSON‑LD Politikası
- Headless sayfada Yoast’ın `<script type="application/ld+json">` çıktısı bulunmadığı için, çıkarılabilen her yazıda kendi FAQ JSON‑LD’mizi enjekte ederiz.
- Eğer ileride Yoast’ın JSON‑LD’sini bilinçli olarak sayfaya forward/enject edersek (edge include vb), çiftlemeyi önlemek için bizim tarafı kapatın.

## 10) SEO — useSeoMeta + Canonical/Hreflang + i18n Tarih
- `useSeoMeta` ile `title`, `description`, `og:*`, `twitter:*` alanlarını doldurun.
- Canonical ve `hreflang` (en/tr/x-default) linklerini her sayfada üretin.
- Tarih: `/tr` altı için `tr-TR`, aksi için `en-US` ile `toLocaleDateString`.

## 11) Yeni Proje İçin Özet Kontrol Listesi
- i18n: Folder‑based (default EN prefix yok, TR `/tr`).
- Blog: OR birleşimli liste API + slug fallback; pagination (query `page`, `per_page`).
- Güvenlik: DOMPurify (SSR) sanitize; allowed tags/attrs whitelist.
- Tipografi: Prose‑first + minimal global yardımcılar.
- SEO: useSeoMeta + canonical/hreflang + FAQ JSON‑LD (çakışma politikası).
- Cache: routeRules (ISR/SWR) + uygun edge/cache başlıkları.

### 6.2 Not
- Design Overlay denemesi kaldırıldı; yeni projede ihtiyaç olursa tekrar eklenebilir.

## 7) Dashboard (Gelecek Yol Haritası)

- Rotalar: `pages/dashboard/**`
- Auth: Basit senaryoda WP JWT (HttpOnly cookie). Alternatif: `sidebase/nuxt-auth` veya 3P (Clerk/Auth0/Supabase).
- Koruma: `middleware/auth.global.ts` ile `/dashboard` altında auth kontrolü.

## 8) Güvenlik ve XSS

- WP’den gelen HTML içerik `v-html` ile render edilecekse dikkatli olun. Tercihen içerik WP tarafında sanitize edilmiş olsun.
- Gerekirse sunucuda sanitize edin veya sıkı CSP kullanın. Kritik alanlarda düz metne sınırlama getirin.

## 9) Nuxt Config Notları

- `runtimeConfig.public.siteUrl` tanımlayın (örn. `https://mailgraf.com`) ve SEO linklerinde bunu kullanın.
- Gereksiz bağımlılık eklemeyin; özellikle `vue`/`vue-router` paketlerini elle eklemeyin.
- i18n modülü kullanmayacağız (folder-based). Eklenmişse kaldırın veya devre dışı bırakın.
- WP API tabanı için `WP_BASE_URL` kullanın. Şu an: `https://mailgraf.com`, gelecekte: `https://cms.mailgraf.com`.

## 10) PR Kontrol Listesi (Agent İçin)

- i18n: EN prefix yok, TR `/tr` altında mı? Redirect cookie mantığı var mı?
- SEO: `html[lang]`, canonical ve hreflang (en/tr/x-default) doğru mu?
- WP: Server API proxy’leri `s-maxage + SWR` ile cache’leniyor mu? Hatalar 404/500 doğru dönüyor mu?
- ISR/SWR: `routeRules` blog ve API rotaları için tanımlı mı?
- UI: Nuxt UI v4 + Tailwind tutarlı mı? Gereksiz CSS import yok mu?
- Güvenlik: WP HTML render’ı güvenli mi? Gerekirse sanitize edildi mi?
- Ayarlar: `runtimeConfig.public.siteUrl` ve `WP_BASE_URL` ortam değişkenleri belirlendi mi?

## 11) Örnek Nuxt Config Parçası

```ts
export default defineNuxtConfig({
  modules: [
    "@nuxt/image",
    "nuxt-simple-sitemap",
    "@nuxtjs/robots",
    // Nuxt UI v4 eklendiğinde ilgili modülü buraya ekleyin
  ],
  runtimeConfig: {
    public: {
      siteUrl: process.env.SITE_URL || "https://mailgraf.com",
    },
  },
  routeRules: {
    "/blog/**": { isr: 60 },
    "/tr/blog/**": { isr: 60 },
    "/api/wp/**": { swr: 60 },
  },
  image: {
    domains: ["mailgraf.com", "cms.mailgraf.com"],
  },
});
```

---

Kısa Özet:

- Nuxt + folder‑based i18n (default EN prefix yok, TR `/tr`).
- SEO: `html[lang]`, canonical + hreflang, sitemap/robots.
- WP headless: server proxy + SWR/ISR.
- UI: Nuxt UI v4 + Tailwind. Minimal bağımlılık, sade mimari.

## 12) Bu Repoda Yapılan Migration (Özet)
- i18n modülü kaldırıldı; folder‑based i18n’e geçildi (EN root, TR `/tr`).
- Fazlalıklar silindi: `i18n.config.ts`, `i18n/locales/*`, TR slug’lı sayfalar (`pages/tr/hakkimizda.vue`, `tr/iletisim.vue`, `tr/hizmetler.vue`).
- Yeni composables: `useLocale`, `useI18n` (JSON tabanlı çeviri), `useLocalePath`, `useSwitchLocalePath`.
- Global `$t`: `plugins/i18n-global.ts` ile template’lerde `$t('...')` çalışır.
- TR sayfaları İngilizce slug ile eklendi: `pages/tr/index.vue`, `pages/tr/about.vue`, `pages/tr/services.vue`, `pages/tr/contact.vue`, `pages/tr/blog/**`.
- Blog: Dil tespiti path’e göre; `/blog` EN içerik, `/tr/blog` TR içerik. Liste ve tekil sayfalarda `lang` query dinamik.
