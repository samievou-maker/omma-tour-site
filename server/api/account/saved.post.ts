import { createError, readBody } from 'h3'
import { getUserEmailFromSession } from '~/server/utils/userAuth'
import { readUsers, writeUsers } from '~/server/utils/userStore'
import { getTourByIdFromStore } from '~/server/utils/contentStore'

interface ToggleSavedPayload {
  tourId?: string
}

export default defineEventHandler(async (event) => {
  const email = getUserEmailFromSession(event)
  if (!email) {
    throw createError({ statusCode: 401, statusMessage: 'Требуется вход в аккаунт.' })
  }

  const payload = await readBody<ToggleSavedPayload>(event)
  const tourId = String(payload.tourId ?? '').trim()
  if (!tourId) {
    throw createError({ statusCode: 400, statusMessage: 'Не передан ID тура.' })
  }

  const tour = await getTourByIdFromStore(tourId)
  if (!tour) {
    throw createError({ statusCode: 404, statusMessage: 'Тур не найден.' })
  }

  const users = await readUsers()
  const index = users.findIndex((item) => item.email === email)
  if (index < 0) {
    throw createError({ statusCode: 404, statusMessage: 'Пользователь не найден.' })
  }

  const user = users[index]
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'Пользователь не найден.' })
  }

  const saved = new Set(Array.isArray(user.savedTourIds) ? user.savedTourIds : [])
  let isSaved = false
  if (saved.has(tourId)) {
    saved.delete(tourId)
    isSaved = false
  } else {
    saved.add(tourId)
    isSaved = true
  }

  users[index] = {
    ...user,
    savedTourIds: [...saved],
    updatedAt: new Date().toISOString()
  }
  await writeUsers(users)

  return {
    ok: true,
    saved: isSaved,
    savedTourIds: [...saved]
  }
})
