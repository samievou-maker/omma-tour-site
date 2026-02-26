import { createError, readBody } from 'h3'
import { createUserSession, getUserEmailFromSession, normalizeEmail } from '~/server/utils/userAuth'
import { readUsers, writeUsers } from '~/server/utils/userStore'

interface ProfilePayload {
  name?: string
  email?: string
  phone?: string
  birthDate?: string
}

export default defineEventHandler(async (event) => {
  const sessionEmail = getUserEmailFromSession(event)
  if (!sessionEmail) {
    throw createError({ statusCode: 401, statusMessage: 'Требуется вход в аккаунт.' })
  }

  const payload = await readBody<ProfilePayload>(event)
  const name = String(payload.name ?? '').trim()
  const email = normalizeEmail(String(payload.email ?? ''))
  const phone = String(payload.phone ?? '').trim()
  const birthDate = String(payload.birthDate ?? '').trim()

  if (name.length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'Имя должно быть минимум 2 символа.' })
  }

  if (!email.includes('@') || email.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Введите корректный email.' })
  }

  if (phone.length > 0 && phone.length < 7) {
    throw createError({ statusCode: 400, statusMessage: 'Телефон слишком короткий.' })
  }

  const users = await readUsers()
  const currentIndex = users.findIndex((item) => item.email === sessionEmail)
  if (currentIndex < 0) {
    throw createError({ statusCode: 404, statusMessage: 'Пользователь не найден.' })
  }

  const emailTaken = users.some((item, index) => index !== currentIndex && item.email === email)
  if (emailTaken) {
    throw createError({ statusCode: 409, statusMessage: 'Этот email уже используется.' })
  }

  const current = users[currentIndex]
  if (!current) {
    throw createError({ statusCode: 404, statusMessage: 'Пользователь не найден.' })
  }

  users[currentIndex] = {
    ...current,
    name,
    email,
    phone,
    birthDate,
    updatedAt: new Date().toISOString()
  }

  await writeUsers(users)
  createUserSession(event, email)

  return {
    ok: true,
    user: {
      name,
      email,
      phone,
      birthDate
    }
  }
})
