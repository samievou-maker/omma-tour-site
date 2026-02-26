import { createError, readBody } from 'h3'
import { createAdminSession } from '~/server/utils/adminAuth'

interface LoginPayload {
  password?: string
}

export default defineEventHandler(async (event) => {
  const payload = await readBody<LoginPayload>(event)
  const config = useRuntimeConfig(event)

  if (String(payload.password ?? '') !== String(config.adminPassword)) {
    throw createError({ statusCode: 401, statusMessage: 'Неверный пароль администратора' })
  }

  createAdminSession(event)
  return { ok: true }
})
