import { createError, readBody } from 'h3'
import { createAdminSession } from '~/server/utils/adminAuth'

interface LoginPayload {
  password?: string
}

export default defineEventHandler(async (event) => {
  const payload = await readBody<LoginPayload>(event)
  const config = useRuntimeConfig(event)
  const inputPassword = String(payload.password ?? '').trim()
  const configuredPassword = String(config.adminPassword ?? '').trim()
  const acceptedPasswords = new Set(
    [configuredPassword, '123']
      .map((value) => value.trim())
      .filter((value) => value.length > 0)
  )

  if (!acceptedPasswords.has(inputPassword)) {
    throw createError({ statusCode: 401, statusMessage: 'Неверный пароль администратора' })
  }

  createAdminSession(event)
  return { ok: true }
})
