<template>
  <div class="mx-auto w-[min(1240px,94%)] py-12">
    <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div class="border-b border-slate-200 bg-slate-950 px-6 py-8 text-white dark:border-slate-800 sm:px-8">
        <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-200">Secure payment</p>
        <h1 class="mt-2 font-serif text-5xl">Оплата заказа</h1>
        <p class="mt-2 text-sm text-slate-200">Проверьте данные карты и завершите оплату за бронирование.</p>
      </div>

      <div class="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="space-y-4">
          <article class="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/50">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Детали оплаты</h2>
            <div class="mt-3 grid gap-2 text-sm text-slate-700 dark:text-slate-300">
              <p><strong>Номер заказа:</strong> {{ orderIdLabel }}</p>
              <p><strong>Тур:</strong> {{ orderTitle }}</p>
              <p><strong>Email заказчика:</strong> {{ customerEmail }}</p>
              <p>
                <strong>Сумма:</strong>
                <span class="font-extrabold text-brand-dark dark:text-cyan-300">{{ totalLabel }}</span>
              </p>
            </div>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <p class="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
              Банк может списать средства в USD или UZS. Комиссия зависит от условий вашей карты.
            </p>

            <form class="space-y-4" @submit.prevent="submitPayment">
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Номер карты *
                <input
                  v-model="cardNumberInput"
                  inputmode="numeric"
                  autocomplete="cc-number"
                  maxlength="23"
                  placeholder="1234 5678 9012 3456"
                  class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
              </label>

              <div class="flex flex-wrap gap-2">
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-bold"
                  :class="cardType === 'unknown'
                    ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-300'"
                >
                  {{ cardTypeLabel }}
                </span>
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-bold"
                  :class="cardNumberLooksValid ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/25 dark:text-cyan-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/25 dark:text-rose-300'"
                >
                  {{ cardNumberLooksValid ? 'Номер корректный' : 'Проверьте номер карты' }}
                </span>
              </div>

              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Имя держателя карты *
                <input
                  v-model="form.cardholderName"
                  autocomplete="cc-name"
                  placeholder="OYBEK SAMIEV"
                  class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm uppercase text-slate-900 outline-none transition focus:border-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
              </label>

              <div class="grid gap-3 sm:grid-cols-3">
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Месяц *
                  <input
                    v-model="form.expiryMonth"
                    inputmode="numeric"
                    maxlength="2"
                    autocomplete="cc-exp-month"
                    placeholder="MM"
                    class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                </label>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Год *
                  <input
                    v-model="form.expiryYear"
                    inputmode="numeric"
                    maxlength="4"
                    autocomplete="cc-exp-year"
                    placeholder="YYYY"
                    class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                </label>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  CVC *
                  <input
                    v-model="form.cvc"
                    inputmode="numeric"
                    maxlength="4"
                    autocomplete="cc-csc"
                    placeholder="123"
                    class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                </label>
              </div>

              <label class="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input v-model="accepted" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-slate-300">
                <span>Я подтверждаю корректность данных и согласен с условиями оплаты.</span>
              </label>

              <button
                type="submit"
                :disabled="submitting || !accepted || !cardNumberLooksValid"
                class="w-full rounded-xl bg-brand-dark px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {{ submitting ? 'Оплачиваем...' : `Оплатить ${totalLabel}` }}
              </button>
            </form>

            <p class="mt-3 min-h-5 text-sm font-semibold" :class="statusOk ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'">
              {{ statusMessage }}
            </p>
          </article>
        </div>

        <aside class="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-800 to-slate-950 p-6 text-white shadow-soft dark:border-slate-700">
          <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-200">Card preview</p>
          <p class="mt-3 text-lg font-semibold text-cyan-100">{{ cardTypeLabel }}</p>
          <p class="mt-6 text-2xl font-semibold tracking-[0.16em]">{{ maskedCardPreview }}</p>

          <div class="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-slate-300">Держатель</p>
              <p class="mt-1 font-semibold">{{ holderPreview }}</p>
            </div>
            <div>
              <p class="text-slate-300">Действует до</p>
              <p class="mt-1 font-semibold">{{ expiryPreview }}</p>
            </div>
          </div>

          <div class="mt-8 rounded-2xl border border-cyan-300/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
            Безопасная обработка: номер проходит проверку типа карты и контрольную сумму.
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
type CardType = 'visa' | 'mastercard' | 'uzcard' | 'humo' | 'mir' | 'unionpay' | 'amex' | 'unknown'

const route = useRoute()
const receiptState = useState<{
  id: string
  tourTitle: string
  customerName: string
  customerEmail: string
  customerPhone: string
  comment: string
  totalUsd: number
  status: string
  paymentStatus: string
  createdAt: string
} | null>('booking-receipt', () => null)

const bookingId = computed(() => String(route.query.bookingId ?? receiptState.value?.id ?? '').trim())
const customerEmail = computed(() => String(route.query.customerEmail ?? receiptState.value?.customerEmail ?? '').trim())

const { data: bookingsData } = await useFetch<{
  bookings: Array<{
    id: string
    tourTitle: string
    totalUsd: number
    status: string
    paymentStatus?: string
  }>
}>('/api/account/bookings', {
  key: 'account-bookings-for-payment'
})

const currentBooking = computed(() =>
  (bookingsData.value?.bookings ?? []).find((item) => item.id === bookingId.value)
)

const totalUsd = computed(() => {
  if (currentBooking.value?.totalUsd) {
    return currentBooking.value.totalUsd
  }
  return receiptState.value?.totalUsd ?? 0
})

const orderTitle = computed(() => currentBooking.value?.tourTitle || receiptState.value?.tourTitle || 'Тур')
const orderIdLabel = computed(() => (bookingId.value ? `#${bookingId.value.replace('booking-', '')}` : '-'))
const totalLabel = computed(() =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalUsd.value)
)

const form = reactive({
  cardholderName: '',
  expiryMonth: '',
  expiryYear: '',
  cvc: ''
})

const cardNumberInput = ref('')
const accepted = ref(false)
const statusMessage = ref('')
const statusOk = ref(true)
const submitting = ref(false)

const cleanDigits = (value: string): string => value.replace(/\D/g, '')

const formatCardNumber = (value: string): string => cleanDigits(value).slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ').trim()

watch(cardNumberInput, (next) => {
  const formatted = formatCardNumber(next)
  if (formatted !== next) {
    cardNumberInput.value = formatted
  }
})

watch(() => form.expiryMonth, (next) => {
  const normalized = cleanDigits(next).slice(0, 2)
  if (normalized !== next) {
    form.expiryMonth = normalized
  }
})

watch(() => form.expiryYear, (next) => {
  const normalized = cleanDigits(next).slice(0, 4)
  if (normalized !== next) {
    form.expiryYear = normalized
  }
})

watch(() => form.cvc, (next) => {
  const normalized = cleanDigits(next).slice(0, 4)
  if (normalized !== next) {
    form.cvc = normalized
  }
})

watch(() => form.cardholderName, (next) => {
  const normalized = next.replace(/[^a-zA-Z\s'-]/g, '').toUpperCase()
  if (normalized !== next) {
    form.cardholderName = normalized
  }
})

const detectCardType = (digits: string): CardType => {
  if (/^8600/.test(digits)) return 'uzcard'
  if (/^9860/.test(digits)) return 'humo'
  if (/^4/.test(digits)) return 'visa'
  if (/^(5[1-5]|2(2[2-9]|[3-6][0-9]|7[01]|720))/.test(digits)) return 'mastercard'
  if (/^220[0-4]/.test(digits)) return 'mir'
  if (/^62/.test(digits)) return 'unionpay'
  if (/^3[47]/.test(digits)) return 'amex'
  return 'unknown'
}

const cardType = computed<CardType>(() => detectCardType(cleanDigits(cardNumberInput.value)))
const cardTypeLabel = computed(() => {
  const labels: Record<CardType, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    uzcard: 'Uzcard',
    humo: 'Humo',
    mir: 'Mir',
    unionpay: 'UnionPay',
    amex: 'American Express',
    unknown: 'Тип карты не определен'
  }
  return labels[cardType.value]
})

const luhnCheck = (digits: string): boolean => {
  let checksum = 0
  let shouldDouble = false
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i])
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    checksum += digit
    shouldDouble = !shouldDouble
  }
  return checksum % 10 === 0
}

const isTrivialNumber = (digits: string): boolean => /^(\d)\1+$/.test(digits)

const cardNumberLooksValid = computed(() => {
  const digits = cleanDigits(cardNumberInput.value)
  if (digits.length < 13) return false
  if (isTrivialNumber(digits)) return false

  switch (cardType.value) {
    case 'visa':
      return [13, 16, 19].includes(digits.length) && luhnCheck(digits)
    case 'mastercard':
      return digits.length === 16 && luhnCheck(digits)
    case 'uzcard':
    case 'humo':
      return digits.length === 16
    case 'mir':
      return digits.length === 16 && luhnCheck(digits)
    case 'unionpay':
      return [16, 17, 18, 19].includes(digits.length)
    case 'amex':
      return digits.length === 15 && luhnCheck(digits)
    default:
      return false
  }
})

const maskedCardPreview = computed(() => {
  const digits = cleanDigits(cardNumberInput.value)
  if (!digits) return '•••• •••• •••• ••••'
  const masked = digits.padEnd(16, '•').split('')
  for (let i = 0; i < masked.length - 4; i += 1) {
    masked[i] = '•'
  }
  return masked.join('').replace(/(.{4})/g, '$1 ').trim()
})

const holderPreview = computed(() => form.cardholderName.trim().toUpperCase() || 'CARD HOLDER')
const expiryPreview = computed(() => `${form.expiryMonth || 'MM'}/${form.expiryYear ? form.expiryYear.slice(-2) : 'YY'}`)

const submitPayment = async (): Promise<void> => {
  statusMessage.value = ''
  statusOk.value = true

  if (!bookingId.value) {
    statusOk.value = false
    statusMessage.value = 'Не найден ID бронирования.'
    return
  }

  if (!customerEmail.value) {
    statusOk.value = false
    statusMessage.value = 'Не найден email заказчика.'
    return
  }

  if (!cardNumberLooksValid.value) {
    statusOk.value = false
    statusMessage.value = 'Введите корректный номер карты.'
    return
  }

  submitting.value = true
  try {
    const response = await $fetch<{
      ok: boolean
      booking: {
        id: string
        status: string
        paymentStatus: string
        paidAt: string
      }
    }>('/api/booking/pay', {
      method: 'POST',
      body: {
        bookingId: bookingId.value,
        customerEmail: customerEmail.value,
        cardNumber: cleanDigits(cardNumberInput.value),
        cardholderName: form.cardholderName,
        expiryMonth: form.expiryMonth,
        expiryYear: form.expiryYear,
        cvc: form.cvc
      }
    })

    if (receiptState.value && receiptState.value.id === response.booking.id) {
      receiptState.value = {
        ...receiptState.value,
        status: response.booking.status,
        paymentStatus: response.booking.paymentStatus
      }
    }

    statusMessage.value = 'Оплата прошла успешно. Переводим в раздел платежей...'
    await navigateTo(`/account/payments?paid=${encodeURIComponent(response.booking.id)}`, { replace: true })
  } catch (error) {
    statusOk.value = false
    const data = (error as { data?: { statusMessage?: string } }).data
    statusMessage.value = data?.statusMessage ?? (error instanceof Error ? error.message : 'Не удалось провести оплату.')
  } finally {
    submitting.value = false
  }
}

useSeoMeta({
  title: 'Оплата бронирования',
  description: 'Безопасная оплата туристического заказа в OMMA tour.'
})
</script>
