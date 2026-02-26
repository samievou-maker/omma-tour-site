import { createError, readBody } from 'h3'
import { isAdminSession } from '~/server/utils/adminAuth'
import { normalizeEmail } from '~/server/utils/userAuth'
import { readUsers, writeUsers } from '~/server/utils/userStore'

interface AdminUserPayload {
  action?: 'update' | 'delete'
  id?: string
  name?: string
  email?: string
  phone?: string
  birthDate?: string
}

export default defineEventHandler(async (event) => {
  if (!isAdminSession(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Требуется вход администратора' })
  }

  const payload = await readBody<AdminUserPayload>(event)
  const action = payload.action
  const id = String(payload.id ?? '').trim()
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Не передан ID пользователя.' })
  }

  const users = await readUsers()
  const index = users.findIndex((user) => user.id === id)
  if (index < 0) {
    throw createError({ statusCode: 404, statusMessage: 'Пользователь не найден.' })
  }

  if (action === 'delete') {
    users.splice(index, 1)
    await writeUsers(users)
    return { ok: true }
  }

  if (action !== 'update') {
    throw createError({ statusCode: 400, statusMessage: 'Неизвестное действие.' })
  }

  const nextName = String(payload.name ?? '').trim()
  const nextEmail = normalizeEmail(String(payload.email ?? ''))
  const nextPhone = String(payload.phone ?? '').trim()
  const nextBirthDate = String(payload.birthDate ?? '').trim()

  if (nextName.length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'Имя должно быть минимум 2 символа.' })
  }
  if (!nextEmail.includes('@') || nextEmail.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Введите корректный email.' })
  }
  if (nextPhone.length > 0 && nextPhone.length < 7) {
    throw createError({ statusCode: 400, statusMessage: 'Телефон слишком короткий.' })
  }

  const emailTaken = users.some((user, userIndex) => userIndex !== index && user.email === nextEmail)
  if (emailTaken) {
    throw createError({ statusCode: 409, statusMessage: 'Email уже используется другим пользователем.' })
  }

  const target = users[index]
  if (!target) {
    throw createError({ statusCode: 404, statusMessage: 'Пользователь не найден.' })
  }

  users[index] = {
    ...target,
    name: nextName,
    email: nextEmail,
    phone: nextPhone,
    birthDate: nextBirthDate,
    updatedAt: new Date().toISOString()
  }
  await writeUsers(users)

  return { ok: true }
})

