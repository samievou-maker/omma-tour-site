export interface BookingRecord {
  id: string
  tourId: string
  tourTitle: string
  departureDate: string
  adults: number
  children: number
  totalUsd: number
  customerName: string
  customerEmail: string
  customerPhone: string
  passengerLastName: string
  passengerFirstName: string
  passengerBirthDate: string
  passengerGender: string
  passengerCitizenship: string
  passengerPassport: string
  passportExpiry: string
  telegram: string
  comment: string
  accountEmail: string
  status: string
  paymentStatus: 'Не оплачено' | 'Оплачено'
  paymentMethod: string
  paymentCardType: string
  paidAt: string
  refundAt: string
  refundReason: string
  createdAt: string
}

const BOOKINGS_KEY = 'bookings'

export const readBookings = async (): Promise<BookingRecord[]> => {
  const storage = useStorage('data')
  const raw = await storage.getItem<BookingRecord[]>(BOOKINGS_KEY)
  if (!Array.isArray(raw)) {
    return []
  }

  return raw.map((item) => ({
    ...item,
    paymentStatus: item.paymentStatus ?? 'Не оплачено',
    paymentMethod: item.paymentMethod ?? '',
    paymentCardType: item.paymentCardType ?? '',
    paidAt: item.paidAt ?? '',
    refundAt: item.refundAt ?? '',
    refundReason: item.refundReason ?? ''
  }))
}

export const writeBookings = async (bookings: BookingRecord[]): Promise<void> => {
  const storage = useStorage('data')
  await storage.setItem(BOOKINGS_KEY, bookings)
}
