import { createError, readBody } from 'h3'
import { isAdminSession } from '~/server/utils/adminAuth'
import { readBookings, writeBookings } from '~/server/utils/bookingStore'

interface AdminBookingPayload {
  action?: 'setStatus' | 'setPaymentStatus' | 'refund'
  bookingId?: string
  status?: string
  paymentStatus?: 'Не оплачено' | 'Оплачено'
  refundReason?: string
}

export default defineEventHandler(async (event) => {
  if (!isAdminSession(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Требуется вход администратора' })
  }

  const payload = await readBody<AdminBookingPayload>(event)
  const action = payload.action
  const bookingId = String(payload.bookingId ?? '').trim()
  if (!bookingId) {
    throw createError({ statusCode: 400, statusMessage: 'Не передан ID бронирования.' })
  }

  const bookings = await readBookings()
  const booking = bookings.find((item) => item.id === bookingId)
  if (!booking) {
    throw createError({ statusCode: 404, statusMessage: 'Бронирование не найдено.' })
  }

  if (action === 'setStatus') {
    const nextStatus = String(payload.status ?? '').trim()
    if (!nextStatus) {
      throw createError({ statusCode: 400, statusMessage: 'Не передан новый статус.' })
    }
    booking.status = nextStatus
  } else if (action === 'setPaymentStatus') {
    const nextPayment = payload.paymentStatus
    if (nextPayment !== 'Не оплачено' && nextPayment !== 'Оплачено') {
      throw createError({ statusCode: 400, statusMessage: 'Некорректный платежный статус.' })
    }
    booking.paymentStatus = nextPayment
    if (nextPayment === 'Оплачено') {
      booking.status = 'Оплачено'
      booking.paidAt = booking.paidAt || new Date().toISOString()
    } else {
      booking.paidAt = ''
      if (booking.status === 'Оплачено') {
        booking.status = 'Новый'
      }
    }
  } else if (action === 'refund') {
    booking.paymentStatus = 'Не оплачено'
    booking.status = 'Возврат'
    booking.refundAt = new Date().toISOString()
    booking.refundReason = String(payload.refundReason ?? '').trim()
    booking.paidAt = ''
  } else {
    throw createError({ statusCode: 400, statusMessage: 'Неизвестное действие.' })
  }

  await writeBookings(bookings)

  return {
    ok: true,
    booking
  }
})

