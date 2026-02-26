import { TOUR_PACKAGES } from '~/data/tours'
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

const STORAGE_KEY = 'site-content'

const defaultSettings = (): SiteSettings => ({
  brandMain: 'OMMA',
  brandSub: 'tour',
  heroTitle: 'Путешествия уровня luxury, доступные каждому',
  heroSubtitle:
    'Подбор туров с полным сопровождением: перелет, отель, страховка, трансфер и поддержка 24/7.',
  heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=80',
  contactPhone: '+998 90 123 45 67',
  contactEmail: 'hello@ommatour.uz',
  contactAddress: 'Ташкент, Узбекистан',
  aboutTitle: 'Агентство, которое думает за клиента',
  aboutText:
    'Мы не отправляем шаблонные варианты. Анализируем бюджет, даты и стиль отдыха, чтобы предложить поездку, которая действительно подходит вам.'
})

const defaultFooter = (): FooterSettings => ({
  supportTitle: 'Контакты и служба поддержки',
  supportShortNumber: 'Короткий номер: 1111',
  supportPhone: 'Телефон: (+998) 71 201-77-77',
  supportEmail: 'info@ommatour.uz',
  infoTitle: 'Информация',
  infoLinks: ['О компании', 'Вакансии', 'Адрес офиса', 'Условия бронирования'],
  mediaTitle: 'Медиа',
  mediaLinks: ['Новости', 'Архив акций', 'Блог путешествий', 'Пресс-центр'],
  partnersTitle: 'Партнерам',
  partnersLinks: ['Агентствам', 'Договор', 'Общие положения', 'Визовые правила', 'Корпоративным клиентам'],
  socialsTitle: 'Мы в социальных сетях',
  socials: [
    { id: 'facebook', label: 'Facebook', href: 'https://facebook.com' },
    { id: 'instagram', label: 'Instagram', href: 'https://instagram.com' },
    { id: 'telegram', label: 'Telegram', href: 'https://t.me' },
    { id: 'youtube', label: 'YouTube', href: 'https://youtube.com' }
  ],
  copyright: '© 2017 - 2026 Все права защищены OMMA tour'
})

const defaultDestinations = (): DestinationItem[] => [
  {
    id: 'maldives',
    title: 'Мальдивы',
    tagline: 'Белый песок и villas over water',
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80',
    linkedTourId: 'bali-relax-escape',
    description: 'Премиальный отдых с океаном и уединением.'
  },
  {
    id: 'cappadocia',
    title: 'Каппадокия',
    tagline: 'Полеты на шарах и долины рассвета',
    image: 'https://images.pexels.com/photos/4450337/pexels-photo-4450337.jpeg?auto=compress&cs=tinysrgb&w=1200',
    linkedTourId: 'europe-weekend',
    description: 'Незабываемые виды и атмосферные экскурсии.'
  },
  {
    id: 'dubai',
    title: 'Дубай',
    tagline: 'Skyline, luxury и яркий шопинг',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=900&q=80',
    linkedTourId: 'dubai-city-lights',
    description: 'Современный город и премиальный отдых.'
  },
  {
    id: 'bali',
    title: 'Бали',
    tagline: 'Океан, серфинг и private retreats',
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=900&q=80',
    linkedTourId: 'bali-relax-escape',
    description: 'Тропики и авторские маршруты по острову.'
  }
]

const defaultReviews = (): ReviewItem[] => [
  { id: 'madina-aziz', author: 'Мадина и Азиз', text: 'Уровень сервиса как в дорогих агентствах. Все четко и спокойно.' },
  { id: 'shahzod', author: 'Шахзод', text: 'Подобрали идеальный отель в Дубае, сэкономили время и деньги.' },
  { id: 'samira', author: 'Самира', text: 'Летали всей семьей, от трансфера до номера все совпало с обещанием.' }
]

const defaultWhyUs = (): WhyUsItem[] => [
  {
    id: 'professional-team',
    title: 'Профессионализм и опыт',
    description:
      'Команда состоит из квалифицированных специалистов с многолетним опытом в туристической индустрии.',
    icon: '🏁'
  },
  {
    id: 'wide-service-range',
    title: 'Широкий спектр услуг',
    description:
      'Предлагаем как готовые турпакеты, так и индивидуальные туры, учитывающие все пожелания клиентов.',
    icon: '🧭'
  },
  {
    id: 'safety-and-reliability',
    title: 'Надежность и безопасность',
    description:
      'Особое внимание безопасности и комфорту клиентов, работаем только с проверенными партнерами.',
    icon: '🛡️'
  },
  {
    id: 'best-prices',
    title: 'Конкурентные цены',
    description:
      'Прямые договоры с поставщиками и гибкая ценовая политика позволяют давать выгодные предложения.',
    icon: '💼'
  }
]

const defaultNews = (): NewsItem[] => [
  {
    id: 'visa-tips-2026',
    title: 'Визовые изменения на сезон 2026',
    excerpt: 'Подготовили краткий гайд по популярным направлениям и срокам оформления.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-02-01'
  },
  {
    id: 'summer-sales',
    title: 'Раннее бронирование на лето',
    excerpt: 'Открыли спеццены на июнь-август по Турции, Дубаю и Бали.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-02-10'
  }
]

const cloneTours = (): TourPackage[] =>
  TOUR_PACKAGES.map((tour) => ({
    ...tour,
    features: [...tour.features],
    included: [...tour.included],
    notIncluded: [...tour.notIncluded],
    itinerary: [...tour.itinerary],
    gallery: [...tour.gallery],
    departures: tour.departures.map((departure) => ({ ...departure }))
  }))

const defaultContent = (): SiteContent => ({
  settings: defaultSettings(),
  footer: defaultFooter(),
  tours: cloneTours(),
  news: defaultNews(),
  destinations: defaultDestinations(),
  reviews: defaultReviews(),
  whyUs: defaultWhyUs(),
  updatedAt: new Date().toISOString()
})

const normalizeStringArray = (items: unknown): string[] => {
  if (!Array.isArray(items)) {
    return []
  }

  return items.map((item) => String(item).trim()).filter((item) => item.length > 0)
}

const sanitizeTour = (rawTour: Partial<TourPackage>): TourPackage => {
  const id = String(rawTour.id ?? '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') || `tour-${Date.now()}`

  return {
    id,
    title: String(rawTour.title ?? 'Без названия').trim(),
    badge: String(rawTour.badge ?? '').trim(),
    country: String(rawTour.country ?? '').trim(),
    city: String(rawTour.city ?? '').trim(),
    description: String(rawTour.description ?? '').trim(),
    shortDescription: String(rawTour.shortDescription ?? '').trim(),
    features: normalizeStringArray(rawTour.features),
    included: normalizeStringArray(rawTour.included),
    notIncluded: normalizeStringArray(rawTour.notIncluded),
    itinerary: normalizeStringArray(rawTour.itinerary),
    heroImage: String(rawTour.heroImage ?? '').trim(),
    gallery: normalizeStringArray(rawTour.gallery),
    durationNights: Math.max(1, Number(rawTour.durationNights ?? 1)),
    hotelClass: String(rawTour.hotelClass ?? '').trim(),
    availableFrom: String(rawTour.availableFrom ?? '').trim(),
    availableTo: String(rawTour.availableTo ?? '').trim(),
    departures: Array.isArray(rawTour.departures)
      ? rawTour.departures.map((departure) => ({
          date: String(departure.date ?? '').trim(),
          nights: Math.max(1, Number(departure.nights ?? 1)),
          hotel: String(departure.hotel ?? '').trim(),
          mealPlan: String(departure.mealPlan ?? '').trim(),
          seatsLeft: Math.max(0, Number(departure.seatsLeft ?? 0)),
          priceFromUsd: Math.max(0, Number(departure.priceFromUsd ?? 0))
        }))
      : [],
    priceFromUsd: Math.max(0, Number(rawTour.priceFromUsd ?? 0)),
    bestFor: String(rawTour.bestFor ?? '').trim(),
    visaInfo: String(rawTour.visaInfo ?? '').trim(),
    flightInfo: String(rawTour.flightInfo ?? '').trim(),
    transferInfo: String(rawTour.transferInfo ?? '').trim(),
    cancellationPolicy: String(rawTour.cancellationPolicy ?? '').trim(),
    importantNotes: normalizeStringArray(rawTour.importantNotes),
    faq: normalizeStringArray(rawTour.faq)
  }
}

const sanitizeNews = (rawNews: Partial<NewsItem>): NewsItem => ({
  id: String(rawNews.id ?? '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') || `news-${Date.now()}`,
  title: String(rawNews.title ?? 'Без названия').trim(),
  excerpt: String(rawNews.excerpt ?? '').trim(),
  image: String(rawNews.image ?? '').trim(),
  publishedAt: String(rawNews.publishedAt ?? '').trim()
})

const sanitizeDestination = (raw: Partial<DestinationItem>): DestinationItem => ({
  id: String(raw.id ?? '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') || `destination-${Date.now()}`,
  title: String(raw.title ?? '').trim(),
  tagline: String(raw.tagline ?? '').trim(),
  image: String(raw.image ?? '').trim(),
  linkedTourId: String(raw.linkedTourId ?? '').trim(),
  description: String(raw.description ?? '').trim()
})

const sanitizeReview = (raw: Partial<ReviewItem>): ReviewItem => ({
  id: String(raw.id ?? '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') || `review-${Date.now()}`,
  author: String(raw.author ?? '').trim(),
  text: String(raw.text ?? '').trim()
})

const sanitizeWhyUs = (raw: Partial<WhyUsItem>): WhyUsItem => ({
  id: String(raw.id ?? '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') || `why-us-${Date.now()}`,
  title: String(raw.title ?? '').trim(),
  description: String(raw.description ?? '').trim(),
  icon: String(raw.icon ?? '').trim()
})

const sanitizeSettings = (raw: Partial<SiteSettings> | undefined): SiteSettings => {
  const defaults = defaultSettings()

  return {
    brandMain: String(raw?.brandMain ?? defaults.brandMain).trim(),
    brandSub: String(raw?.brandSub ?? defaults.brandSub).trim(),
    heroTitle: String(raw?.heroTitle ?? defaults.heroTitle).trim(),
    heroSubtitle: String(raw?.heroSubtitle ?? defaults.heroSubtitle).trim(),
    heroImage: String(raw?.heroImage ?? defaults.heroImage).trim(),
    contactPhone: String(raw?.contactPhone ?? defaults.contactPhone).trim(),
    contactEmail: String(raw?.contactEmail ?? defaults.contactEmail).trim(),
    contactAddress: String(raw?.contactAddress ?? defaults.contactAddress).trim(),
    aboutTitle: String(raw?.aboutTitle ?? defaults.aboutTitle).trim(),
    aboutText: String(raw?.aboutText ?? defaults.aboutText).trim()
  }
}

const sanitizeFooter = (raw: Partial<FooterSettings> | undefined): FooterSettings => {
  const defaults = defaultFooter()
  const useText = (value: unknown, fallback: string): string => {
    const normalized = String(value ?? '').trim()
    return normalized || fallback
  }
  const sanitizeSocial = (item: unknown, index: number) => {
    const rawItem = typeof item === 'object' && item ? (item as Record<string, unknown>) : {}
    const id = String(rawItem.id ?? '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') || `social-${index + 1}`

    return {
      id,
      label: String(rawItem.label ?? '').trim() || `Ссылка ${index + 1}`,
      href: String(rawItem.href ?? '').trim() || '#'
    }
  }

  return {
    supportTitle: useText(raw?.supportTitle, defaults.supportTitle),
    supportShortNumber: useText(raw?.supportShortNumber, defaults.supportShortNumber),
    supportPhone: useText(raw?.supportPhone, defaults.supportPhone),
    supportEmail: useText(raw?.supportEmail, defaults.supportEmail),
    infoTitle: useText(raw?.infoTitle, defaults.infoTitle),
    infoLinks: normalizeStringArray(raw?.infoLinks).length > 0 ? normalizeStringArray(raw?.infoLinks) : defaults.infoLinks,
    mediaTitle: useText(raw?.mediaTitle, defaults.mediaTitle),
    mediaLinks: normalizeStringArray(raw?.mediaLinks).length > 0 ? normalizeStringArray(raw?.mediaLinks) : defaults.mediaLinks,
    partnersTitle: useText(raw?.partnersTitle, defaults.partnersTitle),
    partnersLinks:
      normalizeStringArray(raw?.partnersLinks).length > 0 ? normalizeStringArray(raw?.partnersLinks) : defaults.partnersLinks,
    socialsTitle: useText(raw?.socialsTitle, defaults.socialsTitle),
    socials:
      Array.isArray(raw?.socials) && raw.socials.length > 0
        ? raw.socials.map((item, index) => sanitizeSocial(item, index))
        : defaults.socials,
    copyright: useText(raw?.copyright, defaults.copyright)
  }
}

export const readContent = async (): Promise<SiteContent> => {
  const storage = useStorage('data')
  const parsed = await storage.getItem<SiteContent>(STORAGE_KEY)

  if (!parsed) {
    const seed = defaultContent()
    await storage.setItem(STORAGE_KEY, seed)
    return seed
  }

  return {
    settings: sanitizeSettings(parsed.settings),
    footer: sanitizeFooter(parsed.footer),
    tours: Array.isArray(parsed.tours) ? parsed.tours.map((tour) => sanitizeTour(tour)) : cloneTours(),
    news: Array.isArray(parsed.news) ? parsed.news.map((item) => sanitizeNews(item)) : defaultNews(),
    destinations: Array.isArray(parsed.destinations)
      ? parsed.destinations.map((item) => sanitizeDestination(item))
      : defaultDestinations(),
    reviews: Array.isArray(parsed.reviews)
      ? parsed.reviews.map((item) => sanitizeReview(item))
      : defaultReviews(),
    whyUs: Array.isArray(parsed.whyUs) ? parsed.whyUs.map((item) => sanitizeWhyUs(item)) : defaultWhyUs(),
    updatedAt: String(parsed.updatedAt ?? new Date().toISOString())
  }
}

export const writeContent = async (content: SiteContent): Promise<SiteContent> => {
  const uniqueTourMap = new Map<string, TourPackage>()
  content.tours.map((tour) => sanitizeTour(tour)).forEach((tour) => uniqueTourMap.set(tour.id, tour))

  const uniqueNewsMap = new Map<string, NewsItem>()
  content.news.map((item) => sanitizeNews(item)).forEach((item) => uniqueNewsMap.set(item.id, item))

  const uniqueDestinationsMap = new Map<string, DestinationItem>()
  content.destinations
    .map((item) => sanitizeDestination(item))
    .forEach((item) => uniqueDestinationsMap.set(item.id, item))

  const uniqueReviewsMap = new Map<string, ReviewItem>()
  content.reviews.map((item) => sanitizeReview(item)).forEach((item) => uniqueReviewsMap.set(item.id, item))

  const uniqueWhyUsMap = new Map<string, WhyUsItem>()
  content.whyUs.map((item) => sanitizeWhyUs(item)).forEach((item) => uniqueWhyUsMap.set(item.id, item))

  const normalized: SiteContent = {
    settings: sanitizeSettings(content.settings),
    footer: sanitizeFooter(content.footer),
    tours: [...uniqueTourMap.values()],
    news: [...uniqueNewsMap.values()],
    destinations: [...uniqueDestinationsMap.values()],
    reviews: [...uniqueReviewsMap.values()],
    whyUs: [...uniqueWhyUsMap.values()],
    updatedAt: new Date().toISOString()
  }

  const storage = useStorage('data')
  await storage.setItem(STORAGE_KEY, normalized)
  return normalized
}

export const getTourByIdFromStore = async (id: string): Promise<TourPackage | undefined> => {
  const content = await readContent()
  return content.tours.find((tour) => tour.id === id)
}
