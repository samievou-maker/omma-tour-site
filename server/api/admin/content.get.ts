import { createError } from 'h3'
import { isAdminSession } from '~/server/utils/adminAuth'
import { readContent } from '~/server/utils/contentStore'

export default defineEventHandler(async (event) => {
  if (!isAdminSession(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Требуется вход администратора' })
  }

  return readContent()
})
