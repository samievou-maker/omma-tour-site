import type {
  DestinationItem,
  FooterSettings,
  NewsItem,
  ReviewItem,
  SiteContent,
  SiteSettings,
  TourPackage,
  WhyUsItem
} from '~/types/tour'

type SiteLanguage = 'ru' | 'en' | 'oz'

const CACHE_KEY = 'translation-cache-v1'
const SOURCE_LANG = 'ru'

type CacheMap = Record<string, string>

const isProbablyUrl = (value: string): boolean => /^https?:\/\//i.test(value)

const getCache = async (): Promise<CacheMap> => {
  const storage = useStorage('data')
  const cached = await storage.getItem<CacheMap>(CACHE_KEY)
  if (!cached || typeof cached !== 'object') {
    return {}
  }

  return cached
}

const setCache = async (cache: CacheMap): Promise<void> => {
  const storage = useStorage('data')
  await storage.setItem(CACHE_KEY, cache)
}

const translateWithGoogle = async (text: string, targetLang: 'en' | 'oz'): Promise<string> => {
  const response = await $fetch<unknown>('https://translate.googleapis.com/translate_a/single', {
    query: {
      client: 'gtx',
      sl: SOURCE_LANG,
      tl: targetLang === 'oz' ? 'uz' : targetLang,
      dt: 't',
      q: text
    }
  })

  if (!Array.isArray(response) || !Array.isArray(response[0])) {
    return text
  }

  const parts = response[0] as Array<Array<unknown>>
  const translated = parts
    .map((item) => String(item[0] ?? ''))
    .join('')
    .trim()

  return translated || text
}

const translateText = async (text: string, targetLang: 'en' | 'oz', cache: CacheMap): Promise<string> => {
  const normalized = String(text ?? '').trim()
  if (!normalized) return normalized
  if (isProbablyUrl(normalized)) return normalized

  const key = `${SOURCE_LANG}:${targetLang}:${normalized}`
  if (cache[key]) {
    return cache[key]
  }

  try {
    const translated = await translateWithGoogle(normalized, targetLang)
    cache[key] = translated
    return translated
  } catch {
    cache[key] = normalized
    return normalized
  }
}

const translateArray = async (items: string[], targetLang: 'en' | 'oz', cache: CacheMap): Promise<string[]> =>
  Promise.all(items.map((item) => translateText(item, targetLang, cache)))

const translateSettings = async (settings: SiteSettings, targetLang: 'en' | 'oz', cache: CacheMap): Promise<SiteSettings> => ({
  ...settings,
  heroTitle: await translateText(settings.heroTitle, targetLang, cache),
  heroSubtitle: await translateText(settings.heroSubtitle, targetLang, cache),
  contactAddress: await translateText(settings.contactAddress, targetLang, cache),
  aboutTitle: await translateText(settings.aboutTitle, targetLang, cache),
  aboutText: await translateText(settings.aboutText, targetLang, cache)
})

const translateFooter = async (footer: FooterSettings, targetLang: 'en' | 'oz', cache: CacheMap): Promise<FooterSettings> => ({
  ...footer,
  supportTitle: await translateText(footer.supportTitle, targetLang, cache),
  supportShortNumber: await translateText(footer.supportShortNumber, targetLang, cache),
  supportPhone: await translateText(footer.supportPhone, targetLang, cache),
  infoTitle: await translateText(footer.infoTitle, targetLang, cache),
  infoLinks: await translateArray(footer.infoLinks, targetLang, cache),
  mediaTitle: await translateText(footer.mediaTitle, targetLang, cache),
  mediaLinks: await translateArray(footer.mediaLinks, targetLang, cache),
  partnersTitle: await translateText(footer.partnersTitle, targetLang, cache),
  partnersLinks: await translateArray(footer.partnersLinks, targetLang, cache),
  socialsTitle: await translateText(footer.socialsTitle, targetLang, cache),
  copyright: await translateText(footer.copyright, targetLang, cache)
})

const translateTour = async (tour: TourPackage, targetLang: 'en' | 'oz', cache: CacheMap): Promise<TourPackage> => ({
  ...tour,
  title: await translateText(tour.title, targetLang, cache),
  badge: await translateText(tour.badge, targetLang, cache),
  country: await translateText(tour.country, targetLang, cache),
  city: await translateText(tour.city, targetLang, cache),
  shortDescription: await translateText(tour.shortDescription, targetLang, cache),
  description: await translateText(tour.description, targetLang, cache),
  features: await translateArray(tour.features, targetLang, cache),
  included: await translateArray(tour.included, targetLang, cache),
  notIncluded: await translateArray(tour.notIncluded, targetLang, cache),
  itinerary: await translateArray(tour.itinerary, targetLang, cache),
  hotelClass: await translateText(tour.hotelClass, targetLang, cache),
  departures: await Promise.all(
    tour.departures.map(async (departure) => ({
      ...departure,
      hotel: await translateText(departure.hotel, targetLang, cache),
      mealPlan: await translateText(departure.mealPlan, targetLang, cache)
    }))
  ),
  bestFor: await translateText(tour.bestFor ?? '', targetLang, cache),
  visaInfo: await translateText(tour.visaInfo ?? '', targetLang, cache),
  flightInfo: await translateText(tour.flightInfo ?? '', targetLang, cache),
  transferInfo: await translateText(tour.transferInfo ?? '', targetLang, cache),
  cancellationPolicy: await translateText(tour.cancellationPolicy ?? '', targetLang, cache),
  importantNotes: await translateArray(tour.importantNotes ?? [], targetLang, cache),
  faq: await translateArray(tour.faq ?? [], targetLang, cache)
})

const translateDestination = async (
  item: DestinationItem,
  targetLang: 'en' | 'oz',
  cache: CacheMap
): Promise<DestinationItem> => ({
  ...item,
  title: await translateText(item.title, targetLang, cache),
  tagline: await translateText(item.tagline, targetLang, cache),
  description: await translateText(item.description, targetLang, cache)
})

const translateReview = async (item: ReviewItem, targetLang: 'en' | 'oz', cache: CacheMap): Promise<ReviewItem> => ({
  ...item,
  text: await translateText(item.text, targetLang, cache)
})

const translateWhyUs = async (item: WhyUsItem, targetLang: 'en' | 'oz', cache: CacheMap): Promise<WhyUsItem> => ({
  ...item,
  title: await translateText(item.title, targetLang, cache),
  description: await translateText(item.description, targetLang, cache)
})

const translateNews = async (item: NewsItem, targetLang: 'en' | 'oz', cache: CacheMap): Promise<NewsItem> => ({
  ...item,
  title: await translateText(item.title, targetLang, cache),
  excerpt: await translateText(item.excerpt, targetLang, cache)
})

export const localizeTour = async (tour: TourPackage, language: SiteLanguage): Promise<TourPackage> => {
  if (language === 'ru') {
    return tour
  }

  const cache = await getCache()
  const localized = await translateTour(tour, language, cache)
  await setCache(cache)
  return localized
}

export const localizeTours = async (tours: TourPackage[], language: SiteLanguage): Promise<TourPackage[]> => {
  if (language === 'ru') {
    return tours
  }

  const cache = await getCache()
  const localized = await Promise.all(tours.map((tour) => translateTour(tour, language, cache)))
  await setCache(cache)
  return localized
}

export const localizeSiteContent = async (content: SiteContent, language: SiteLanguage): Promise<SiteContent> => {
  if (language === 'ru') {
    return content
  }

  const targetLang = language as 'en' | 'oz'
  const cache = await getCache()

  const localized: SiteContent = {
    settings: await translateSettings(content.settings, targetLang, cache),
    footer: await translateFooter(content.footer, targetLang, cache),
    tours: await Promise.all(content.tours.map((tour) => translateTour(tour, targetLang, cache))),
    news: await Promise.all(content.news.map((item) => translateNews(item, targetLang, cache))),
    destinations: await Promise.all(content.destinations.map((item) => translateDestination(item, targetLang, cache))),
    reviews: await Promise.all(content.reviews.map((item) => translateReview(item, targetLang, cache))),
    whyUs: await Promise.all(content.whyUs.map((item) => translateWhyUs(item, targetLang, cache))),
    updatedAt: content.updatedAt
  }

  await setCache(cache)
  return localized
}
