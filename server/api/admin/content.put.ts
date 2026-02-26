import { createError, readBody } from 'h3'
import { isAdminSession } from '~/server/utils/adminAuth'
import { writeContent } from '~/server/utils/contentStore'
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

interface ContentPayload {
  settings?: SiteSettings
  footer?: FooterSettings
  tours?: TourPackage[]
  news?: NewsItem[]
  destinations?: DestinationItem[]
  reviews?: ReviewItem[]
  whyUs?: WhyUsItem[]
}

export default defineEventHandler(async (event) => {
  if (!isAdminSession(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Требуется вход администратора' })
  }

  const payload = await readBody<ContentPayload>(event)

  if (
    !payload.settings ||
    !payload.footer ||
    !Array.isArray(payload.tours) ||
    !Array.isArray(payload.news) ||
    !Array.isArray(payload.destinations) ||
    !Array.isArray(payload.reviews) ||
    !Array.isArray(payload.whyUs)
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Неверный формат данных' })
  }

  const nextContent: SiteContent = {
    settings: payload.settings,
    footer: payload.footer,
    tours: payload.tours,
    news: payload.news,
    destinations: payload.destinations,
    reviews: payload.reviews,
    whyUs: payload.whyUs,
    updatedAt: new Date().toISOString()
  }

  const saved = await writeContent(nextContent)
  return { ok: true, content: saved }
})
