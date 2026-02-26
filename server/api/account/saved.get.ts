import { createError } from 'h3'
import { getUserEmailFromSession } from '~/server/utils/userAuth'
import { readUsers } from '~/server/utils/userStore'
import { getTourByIdFromStore } from '~/server/utils/contentStore'
import type { TourPackage } from '~/types/tour'

export default defineEventHandler(async (event) => {
  const email = getUserEmailFromSession(event)
  if (!email) {
    throw createError({ statusCode: 401, statusMessage: 'Требуется вход в аккаунт.' })
  }

  const users = await readUsers()
  const user = users.find((item) => item.email === email)
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'Пользователь не найден.' })
  }

  const savedTourIds = Array.isArray(user.savedTourIds) ? user.savedTourIds : []
  const savedTours: TourPackage[] = []

  for (const id of savedTourIds) {
    const tour = await getTourByIdFromStore(id)
    if (tour) {
      savedTours.push(tour)
    }
  }

  return {
    savedTourIds,
    savedTours
  }
})
