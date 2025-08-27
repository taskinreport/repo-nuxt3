import DOMPurify from 'isomorphic-dompurify'

const ALLOWED_TAGS = [
  'a','p','ul','ol','li','strong','em','h2','h3','h4','pre','code','img',
  'table','thead','tbody','th','tr','td','figure','figcaption','blockquote','hr','br','span'
]
const ALLOWED_ATTR = ['href','title','alt','src','rel','target']

function sanitize(html?: string) {
  if (!html) return ''
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR }) as string
}

export default defineEventHandler(async (event) => {
  const { slug } = getRouterParams(event)
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug' })
  }

  const query = getQuery(event)
  const base = process.env.WP_BASE_URL || 'https://mailgraf.com'
  const lang = (query.lang as string) || ''
  const langParam = lang ? `&lang=${encodeURIComponent(lang)}` : ''

  const urlTr = `${base}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1${langParam}`
  const urlFb = `${base}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`

  let arr = [] as any[]
  try { arr = await $fetch<any[]>(urlTr) } catch { arr = [] }
  let post = Array.isArray(arr) ? arr[0] : null
  if (!post && lang) {
    try { const fb = await $fetch<any[]>(urlFb); post = Array.isArray(fb) ? fb[0] : null } catch {}
  }
  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }

  setHeader(event, 'Cache-Control', 's-maxage=60, stale-while-revalidate=300')

  const faq = extractFaq(post).map((qa) => ({
    question: sanitize(qa.question),
    answer: sanitize(qa.answer)
  }))
  const safeTitle = sanitize(post.title?.rendered)
  const safeExcerpt = sanitize(post.excerpt?.rendered)
  const safeContent = sanitize(post.content?.rendered)
  const hasYoastFaqJsonLd = detectYoastFaq(post)

  return {
    id: post.id,
    slug: post.slug,
    title: safeTitle,
    content: safeContent,
    excerpt: safeExcerpt,
    date: post.date,
    image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
    faq,
    hasYoastFaqJsonLd,
  }
})

function extractFaq(post: any): Array<{ question: string; answer: string }> {
  // 1) Tercihen yoast_head_json üzerinden topla
  const viaJson = extractFromYoastJson(post?.yoast_head_json)
  if (viaJson.length) return viaJson

  // 2) Alternatif: yoast_head (HTML head string) içindeki JSON-LD scriptlerini tara
  const viaHead = extractFromYoastHeadString(post?.yoast_head)
  if (viaHead.length) return viaHead

  return []
}

function extractFromYoastJson(yoast: any): Array<{ question: string; answer: string }> {
  try {
    const graph = yoast?.schema?.['@graph']
    if (!Array.isArray(graph)) return []

    // Tüm Question nodelarını tara (FAQPage varyasyonlarına karşı daha dayanıklı)
    const questions: Array<{ question: string; answer: string }> = []
    for (const node of graph) {
      const t = node?.['@type']
      if (t === 'Question' || (Array.isArray(t) && t.includes('Question'))) {
        const q = node?.name || ''
        const a = node?.acceptedAnswer?.text || ''
        if (q && a) questions.push({ question: q, answer: a })
      }
      // Bazı şemalarda FAQPage.mainEntity Question listesi taşır
      if (t === 'FAQPage' || (Array.isArray(t) && t.includes('FAQPage'))) {
        const entities = node?.mainEntity
        if (Array.isArray(entities)) {
          for (const ent of entities) {
            const q = ent?.name || ''
            const a = ent?.acceptedAnswer?.text || ''
            if (q && a) questions.push({ question: q, answer: a })
          }
        }
      }
    }
    return questions
  } catch {
    return []
  }
}

function extractFromYoastHeadString(headHtml?: string): Array<{ question: string; answer: string }> {
  if (!headHtml || typeof headHtml !== 'string') return []
  try {
    const scripts = Array.from(headHtml.matchAll(/<script[^>]*type=\"application\/ld\+json\"[^>]*>([\s\S]*?)<\/script>/gi))
    for (const m of scripts) {
      const jsonText = (m[1] || '').trim()
      if (!jsonText) continue
      try {
        const parsed = JSON.parse(jsonText)
        const graph = Array.isArray(parsed?.['@graph']) ? parsed['@graph'] : Array.isArray(parsed) ? parsed : []
        const qas: Array<{ question: string; answer: string }> = []
        for (const node of graph) {
          const t = node?.['@type']
          if (t === 'Question' || (Array.isArray(t) && t.includes('Question'))) {
            const q = node?.name || ''
            const a = node?.acceptedAnswer?.text || ''
            if (q && a) qas.push({ question: q, answer: a })
          }
          if (t === 'FAQPage' || (Array.isArray(t) && t.includes('FAQPage'))) {
            const entities = node?.mainEntity
            if (Array.isArray(entities)) {
              for (const ent of entities) {
                const q = ent?.name || ''
                const a = ent?.acceptedAnswer?.text || ''
                if (q && a) qas.push({ question: q, answer: a })
              }
            }
          }
        }
        if (qas.length) return qas
      } catch {
        continue
      }
    }
    return []
  } catch {
    return []
  }
}

function detectYoastFaq(post: any): boolean {
  try {
    // JSON tarafında var mı?
    const json = extractFromYoastJson(post?.yoast_head_json)
    if (json.length) return true
    // Head string tarafında var mı?
    const head = extractFromYoastHeadString(post?.yoast_head)
    return head.length > 0
  } catch {
    return false
  }
}
