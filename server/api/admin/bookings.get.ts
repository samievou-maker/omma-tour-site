import { createError } from 'h3'
import { isAdminSession } from '~/server/utils/adminAuth'
import { readBookings } from '~/server/utils/bookingStore'

export default defineEventHandler(async (event) => {
  if (!isAdminSession(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Требуется вход администратора' })
  }

  const bookings = await readBookings()
  return {
    bookings
  }
})

