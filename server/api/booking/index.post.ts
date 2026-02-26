import { createError, readBody } from 'h3'
import { getUserEmailFromSession } from '~/server/utils/userAuth'
import { getTourByIdFromStore } from '~/server/utils/contentStore'
import { readBookings, writeBookings } from '~/server/utils/bookingStore'

interface BookingPayload {
  tourId?: string
  departureDate?: string
  adults?: number
  children?: number
  totalUsd?: number
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  passengerLastName?: string
  passengerFirstName?: string
  passengerBirthDate?: string
  passengerGender?: string
  passengerCitizenship?: string
  passengerPassport?: string
  passportExpiry?: string
  telegram?: string
  comment?: string
  accepted?: boolean
}

export default defineEventHandler(async (event) => {
  const payload = await readBody<BookingPayload>(event)
  const tourId = String(payload.tourId ?? '').trim()
  const tour = await getTourByIdFromStore(tourId)
  if (!tour) {
    throw createError({ statusCode: 404, statusMessage: 'Тур не найден.' })
  }

  const customerName = String(payload.customerName ?? '').trim() || 'Гость'
  const customerEmail = String(payload.customerEmail ?? '').trim().toLowerCase() || 'not-provided@ommatour.local'
  const customerPhone = String(payload.customerPhone ?? '').trim() || '-'

  const passengerLastName = String(payload.passengerLastName ?? '').trim() || customerName.split(' ').slice(-1)[0] || 'GUEST'
  const passengerFirstName = String(payload.passengerFirstName ?? '').trim() || customerName.split(' ')[0] || 'GUEST'
  const passengerBirthDate = String(payload.passengerBirthDate ?? '').trim() || '1990-01-01'
  const passengerGender = String(payload.passengerGender ?? '').trim() || 'male'
  const passengerCitizenship = String(payload.passengerCitizenship ?? '').trim() || 'UZB'
  const passengerPassport = String(payload.passengerPassport ?? '').trim() || 'AA0000000'
  const passportExpiry = String(payload.passportExpiry ?? '').trim() || '2035-01-01'

  if (!payload.accepted) {
    throw createError({ statusCode: 400, statusMessage: 'Нужно принять условия бронирования.' })
  }

  const accountEmail = getUserEmailFromSession(event) ?? ''
  const bookings = await readBookings()
  const booking = {
    id: `booking-${Date.now()}`,
    tourId: tour.id,
    tourTitle: tour.title,
    departureDate: String(payload.departureDate ?? '').trim(),
    adults: Math.max(1, Number(payload.adults ?? 1)),
    children: Math.max(0, Number(payload.children ?? 0)),
    totalUsd: Math.max(
      0,
      Number(payload.totalUsd ?? 0) ||
      tour.priceFromUsd * Math.max(1, Number(payload.adults ?? 1)) + tour.priceFromUsd * 0.7 * Math.max(0, Number(payload.children ?? 0))
    ),
    customerName,
    customerEmail,
    customerPhone,
    passengerLastName,
    passengerFirstName,
    passengerBirthDate,
    passengerGender,
    passengerCitizenship,
    passengerPassport,
    passportExpiry,
    telegram: String(payload.telegram ?? '').trim(),
    comment: String(payload.comment ?? '').trim(),
    accountEmail,
    status: 'Новый',
    paymentStatus: 'Не оплачено' as const,
    paymentMethod: '',
    paymentCardType: '',
    paidAt: '',
    refundAt: '',
    refundReason: '',
    createdAt: new Date().toISOString()
  }

  bookings.unshift(booking)
  await writeBookings(bookings)

  return {
    ok: true,
    booking: {
      id: booking.id,
      tourTitle: booking.tourTitle,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      comment: booking.comment,
      totalUsd: booking.totalUsd,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt
    }
  }
})
