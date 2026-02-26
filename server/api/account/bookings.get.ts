import { createError } from 'h3'
import { getUserEmailFromSession } from '~/server/utils/userAuth'
import { readBookings } from '~/server/utils/bookingStore'

export default defineEventHandler(async (event) => {
  const email = getUserEmailFromSession(event)
  if (!email) {
    throw createError({ statusCode: 401, statusMessage: 'Требуется вход в аккаунт.' })
  }

  const bookings = await readBookings()
  const myBookings = bookings.filter((item) => item.accountEmail === email || item.customerEmail === email)

  return {
    bookings: myBookings
  }
})
