import { createError, readBody } from 'h3'
import { createUserSession, normalizeEmail, verifyPassword } from '~/server/utils/userAuth'
import { readUsers } from '~/server/utils/userStore'

interface LoginPayload {
  email?: string
  password?: string
}

export default defineEventHandler(async (event) => {
  const payload = await readBody<LoginPayload>(event)
  const email = normalizeEmail(String(payload.email ?? ''))
  const password = String(payload.password ?? '')

  const users = await readUsers()
  const user = users.find((item) => item.email === email)
  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw createError({ statusCode: 401, statusMessage: 'Неверный email или пароль.' })
  }

  createUserSession(event, user.email)
  return {
    ok: true,
    user: { name: user.name, email: user.email }
  }
})
