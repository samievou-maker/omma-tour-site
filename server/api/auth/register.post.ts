import { createError, readBody } from 'h3'
import { createUserSession, hashPassword, normalizeEmail } from '~/server/utils/userAuth'
import { readUsers, writeUsers } from '~/server/utils/userStore'

interface RegisterPayload {
  name?: string
  email?: string
  password?: string
}

export default defineEventHandler(async (event) => {
  const payload = await readBody<RegisterPayload>(event)
  const name = String(payload.name ?? '').trim()
  const email = normalizeEmail(String(payload.email ?? ''))
  const password = String(payload.password ?? '')

  if (name.length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'Введите имя (минимум 2 символа).' })
  }

  if (!email.includes('@') || email.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Введите корректный email.' })
  }

  if (password.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Пароль должен быть минимум 6 символов.' })
  }

  const users = await readUsers()
  if (users.some((user) => user.email === email)) {
    throw createError({ statusCode: 409, statusMessage: 'Этот email уже зарегистрирован.' })
  }

  users.push({
    id: `user-${Date.now()}`,
    name,
    email,
    passwordHash: hashPassword(password),
    phone: '',
    birthDate: '',
    savedTourIds: [],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  })

  await writeUsers(users)
  createUserSession(event, email)

  return {
    ok: true,
    user: { name, email }
  }
})
