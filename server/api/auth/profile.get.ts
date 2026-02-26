import { createError } from 'h3'
import { getUserEmailFromSession } from '~/server/utils/userAuth'
import { readUsers } from '~/server/utils/userStore'

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

  return {
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone ?? '',
      birthDate: user.birthDate ?? ''
    }
  }
})
