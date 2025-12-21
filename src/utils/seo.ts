// Base URL for generating absolute URLs
const BASE_URL = import.meta.env.VITE_APP_URL || 'https://promptvalley.ai'

// Default OG image dimensions (1200x630 is recommended for social)
const OG_IMAGE_WIDTH = 1200
const OG_IMAGE_HEIGHT = 630

export type SeoOptions = {
  title: string
  description?: string
  image?: string
  keywords?: string
  url?: string
  type?: 'website' | 'article'
  siteName?: string
  twitterCard?: 'summary' | 'summary_large_image'
  noIndex?: boolean
}

/**
 * Generate meta tags for SEO and social sharing
 * Uses proper `property` for OG tags and `name` for Twitter/standard tags
 */
export function seo({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  siteName = 'Prompt Valley',
  twitterCard = 'summary_large_image',
  noIndex = false,
}: SeoOptions) {
  // Ensure image is absolute URL
  const absoluteImage = image
    ? image.startsWith('http')
      ? image
      : `${BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`
    : `${BASE_URL}/og/default.png`

  const absoluteUrl = url
    ? url.startsWith('http')
      ? url
      : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`
    : undefined

  const fullTitle = title.includes('Prompt Valley')
    ? title
    : `${title} | Prompt Valley`

  return [
    // Standard meta
    { title: fullTitle },
    { name: 'description', content: description },
    ...(keywords ? [{ name: 'keywords', content: keywords }] : []),
    ...(noIndex ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),

    // Open Graph (use property, not name)
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: siteName },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: absoluteImage },
    { property: 'og:image:width', content: String(OG_IMAGE_WIDTH) },
    { property: 'og:image:height', content: String(OG_IMAGE_HEIGHT) },
    { property: 'og:image:alt', content: title },
    ...(absoluteUrl ? [{ property: 'og:url', content: absoluteUrl }] : []),

    // Twitter Card
    { name: 'twitter:card', content: twitterCard },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: absoluteImage },
    { name: 'twitter:image:alt', content: title },
  ]
}

/**
 * Get static OG image path based on page type
 * For prompts with images, use the actual prompt image
 * Otherwise fall back to static branded images
 */
export function getStaticOgImage(
  type:
    | 'default'
    | 'prompt'
    | 'category'
    | 'tag'
    | 'model'
    | 'pricing'
    | 'contact'
    | 'search'
    | 'legal',
): string {
  const images: Record<typeof type, string> = {
    default: '/og/default.png',
    prompt: '/og/prompt.png',
    category: '/og/category.png',
    tag: '/og/tag.png',
    model: '/og/model.png',
    pricing: '/og/pricing.png',
    contact: '/og/contact.png',
    search: '/og/search.png',
    legal: '/og/legal.png',
  }
  return images[type] || images.default
}
