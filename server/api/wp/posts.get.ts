export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const base = process.env.WP_BASE_URL || 'https://mailgraf.com'

  const lang = (query.lang as string) || ''
  const page = parseInt((query.page as string) || '1', 10)
  const perPage = parseInt((query.per_page as string) || '10', 10)

  // Polylang/WPML gibi çok dilli kurulumlarda `lang=tr` genellikle çalışır.
  // Yoksa backend uygun parametreyle güncellenmelidir.
  const langParam = lang ? `&lang=${encodeURIComponent(lang)}` : ''

  // OR mantığıyla sağlam sayfalama: hedef dil + langsız setleri
  // sayfadan istenen aralığa (start..end) yetecek kadar topla.
  const start = (page - 1) * perPage
  const end = start + perPage
  const wpPerPage = 20
  const maxLoops = 8 // en fazla 8*20*2 ≈ 320 post inceler
  const mergedMap = new Map<number, any>()

  for (let i = 1; i <= maxLoops; i++) {
    const qs = `_embed=1&orderby=date&order=desc&per_page=${wpPerPage}&page=${i}`
    const urlTR = `${base}/wp-json/wp/v2/posts?${qs}${langParam}`
    const urlFB = `${base}/wp-json/wp/v2/posts?${qs}`
    let arrTR: any[] = []
    let arrFB: any[] = []
    try { arrTR = await $fetch<any[]>(urlTR) } catch { arrTR = [] }
    try { arrFB = await $fetch<any[]>(urlFB) } catch { arrFB = [] }

    const gotAny = (arrTR && arrTR.length) || (arrFB && arrFB.length)
    for (const p of [...(arrTR || []), ...(arrFB || [])]) {
      if (p?.id && !mergedMap.has(p.id)) mergedMap.set(p.id, p)
    }
    const mergedLen = mergedMap.size
    if (!gotAny) break // artık veri gelmiyor
    if (mergedLen >= end) break // istediğimiz pencereyi karşılayacak kadar veri var
  }

  const merged = Array.from(mergedMap.values())
    .sort((a, b) => new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime())
  const paged = merged.slice(start, end)

  // Edge cache: 60 sn taze, 5 dk SWR
  setHeader(event, 'Cache-Control', 's-maxage=60, stale-while-revalidate=300')

  return paged.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: sanitize(p.title?.rendered) || '',
    excerpt: sanitize(p.excerpt?.rendered) || '',
    date: p.date,
    image: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
  }))
})
import DOMPurify from 'isomorphic-dompurify'

const ALLOWED_TAGS = ['a','p','ul','ol','li','strong','em','br','span']
const ALLOWED_ATTR = ['href','title','rel','target']

function sanitize(html?: string) {
  if (!html) return ''
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR }) as string
}
