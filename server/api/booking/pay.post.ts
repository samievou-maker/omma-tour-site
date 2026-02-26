import { createError, readBody } from 'h3'
import { readBookings, writeBookings } from '~/server/utils/bookingStore'
import { getUserEmailFromSession } from '~/server/utils/userAuth'
import { validateCard } from '~/server/utils/cardValidation'

interface PayPayload {
  bookingId?: string
  customerEmail?: string
  cardNumber?: string
  cardholderName?: string
  expiryMonth?: string
  expiryYear?: string
  cvc?: string
}

const maskCardNumber = (digits: string): string => {
  const tail = digits.slice(-4)
  return `**** **** **** ${tail}`
}

export default defineEventHandler(async (event) => {
  const payload = await readBody<PayPayload>(event)
  const bookingId = String(payload.bookingId ?? '').trim()
  if (!bookingId) {
    throw createError({ statusCode: 400, statusMessage: 'Не передан ID бронирования.' })
  }

  const bookings = await readBookings()
  const booking = bookings.find((item) => item.id === bookingId)
  if (!booking) {
    throw createError({ statusCode: 404, statusMessage: 'Бронирование не найдено.' })
  }

  const sessionEmail = (getUserEmailFromSession(event) ?? '').toLowerCase()
  const payloadEmail = String(payload.customerEmail ?? '').trim().toLowerCase()
  const bookingEmail = booking.customerEmail.toLowerCase()

  if (sessionEmail) {
    const accountEmail = booking.accountEmail.toLowerCase()
    if (sessionEmail !== bookingEmail && sessionEmail !== accountEmail) {
      throw createError({ statusCode: 403, statusMessage: 'Нет доступа к этому бронированию.' })
    }
  } else if (!payloadEmail || payloadEmail !== bookingEmail) {
    throw createError({ statusCode: 403, statusMessage: 'Подтвердите email заказчика для оплаты.' })
  }

  if (booking.paymentStatus === 'Оплачено') {
    return {
      ok: true,
      booking: {
        id: booking.id,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paidAt: booking.paidAt
      }
    }
  }

  const cardholderName = String(payload.cardholderName ?? '').trim().toUpperCase()
  if (cardholderName.length < 3) {
    throw createError({ statusCode: 400, statusMessage: 'Введите имя держателя карты.' })
  }

  const check = validateCard(String(payload.cardNumber ?? ''))
  if (!check.valid) {
    throw createError({ statusCode: 400, statusMessage: check.reason ?? 'Некорректный номер карты.' })
  }

  const month = Number(payload.expiryMonth ?? '')
  const year = Number(payload.expiryYear ?? '')
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw createError({ statusCode: 400, statusMessage: 'Некорректный месяц карты.' })
  }
  if (!Number.isInteger(year) || year < 2024 || year > 2099) {
    throw createError({ statusCode: 400, statusMessage: 'Некорректный год карты.' })
  }

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    throw createError({ statusCode: 400, statusMessage: 'Срок действия карты истек.' })
  }

  const cvc = String(payload.cvc ?? '').replace(/\D/g, '')
  if (!/^\d{3,4}$/.test(cvc)) {
    throw createError({ statusCode: 400, statusMessage: 'Некорректный CVC/CVV.' })
  }

  const paidAt = new Date().toISOString()
  booking.paymentStatus = 'Оплачено'
  booking.status = 'Оплачено'
  booking.paymentMethod = maskCardNumber(check.normalized)
  booking.paymentCardType = check.type
  booking.paidAt = paidAt
  booking.refundAt = ''
  booking.refundReason = ''

  await writeBookings(bookings)

  return {
    ok: true,
    booking: {
      id: booking.id,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      paidAt: booking.paidAt,
      paymentMethod: booking.paymentMethod,
      paymentCardType: booking.paymentCardType
    }
  }
})
