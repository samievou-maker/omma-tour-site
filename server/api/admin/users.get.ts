import { createError } from 'h3'
import { isAdminSession } from '~/server/utils/adminAuth'
import { readUsers } from '~/server/utils/userStore'
import { readBookings } from '~/server/utils/bookingStore'

export default defineEventHandler(async (event) => {
  if (!isAdminSession(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Требуется вход администратора' })
  }

  const [users, bookings] = await Promise.all([readUsers(), readBookings()])

  return {
    users: users.map((user) => {
      const userBookings = bookings.filter((booking) => booking.accountEmail === user.email || booking.customerEmail === user.email)
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
        birthDate: user.birthDate ?? '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt ?? user.createdAt,
        savedCount: user.savedTourIds?.length ?? 0,
        bookingsCount: userBookings.length
      }
    })
  }
})

