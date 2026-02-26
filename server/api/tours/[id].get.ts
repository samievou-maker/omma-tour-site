import { createError } from 'h3'
import { getTourByIdFromStore } from '~/server/utils/contentStore'

export default defineEventHandler(async (event) => {
  const id = String(getRouterParam(event, 'id') ?? '').trim()
  const tour = await getTourByIdFromStore(id)

  if (!tour) {
    throw createError({ statusCode: 404, statusMessage: 'Тур не найден' })
  }

  return tour
})
