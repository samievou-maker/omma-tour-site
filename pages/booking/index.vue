<template>
  <div class="mx-auto w-[min(1200px,92%)] py-12">
    <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
      <div class="border-b border-slate-200 bg-slate-950 px-6 py-8 text-white sm:px-8">
        <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-200">OMMA booking</p>
        <h1 class="mt-2 font-serif text-5xl">Бронирование тура</h1>
        <p class="mt-2 text-sm text-slate-200">Заполните данные и отправьте заявку, менеджер подтвердит бронь и свяжется с вами.</p>
      </div>

      <div class="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div class="space-y-5">
          <article class="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 class="text-2xl font-bold text-slate-900">Данные покупателя</h2>
            <div class="mt-4 grid gap-3 md:grid-cols-2">
              <label class="text-sm font-semibold text-slate-700">ФИО *
                <input v-model="form.customerName" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" required>
              </label>
              <label class="text-sm font-semibold text-slate-700">Email *
                <input v-model="form.customerEmail" type="email" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" required>
              </label>
              <label class="text-sm font-semibold text-slate-700 md:col-span-2">Номер телефона *
                <input v-model="form.customerPhone" type="tel" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" required>
              </label>
            </div>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 class="text-2xl font-bold text-slate-900">Данные пассажира</h2>
            <p class="mt-1 text-sm text-slate-500">Поля заполняются латиницей, как в паспорте.</p>
            <div class="mt-4 grid gap-3 md:grid-cols-2">
              <label class="text-sm font-semibold text-slate-700">Фамилия *
                <input v-model="form.passengerLastName" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" required>
              </label>
              <label class="text-sm font-semibold text-slate-700">Имя *
                <input v-model="form.passengerFirstName" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" required>
              </label>
              <label class="text-sm font-semibold text-slate-700">Дата рождения *
                <input v-model="form.passengerBirthDate" type="date" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" required>
              </label>
              <label class="text-sm font-semibold text-slate-700">Пол *
                <select v-model="form.passengerGender" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" required>
                  <option value="">Выберите пол</option>
                  <option value="male">Мужской</option>
                  <option value="female">Женский</option>
                </select>
              </label>
              <label class="text-sm font-semibold text-slate-700">Гражданство *
                <input v-model="form.passengerCitizenship" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" required>
              </label>
              <label class="text-sm font-semibold text-slate-700">Серия и № паспорта *
                <input v-model="form.passengerPassport" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" required>
              </label>
              <label class="text-sm font-semibold text-slate-700 md:col-span-2">Срок действия паспорта *
                <input v-model="form.passportExpiry" type="date" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" required>
              </label>
            </div>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 class="text-2xl font-bold text-slate-900">Дополнительно</h2>
            <div class="mt-4 grid gap-3">
              <label class="text-sm font-semibold text-slate-700">Telegram
                <input v-model="form.telegram" placeholder="@username" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
              </label>
              <label class="text-sm font-semibold text-slate-700">Комментарий
                <textarea v-model="form.comment" rows="3" placeholder="Пожелания по рейсу, номеру, питанию и т.д." class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              </label>
            </div>
          </article>
        </div>

        <aside class="space-y-4">
          <article class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p class="text-xs font-extrabold uppercase tracking-[0.14em] text-cyan-700">Итог заявки</p>
            <h3 class="mt-2 text-2xl font-bold text-slate-900">{{ selectedTour?.title || 'Выберите тур' }}</h3>
            <ul class="mt-3 space-y-2 text-sm text-slate-700">
              <li><strong>Направление:</strong> {{ selectedTour ? `${selectedTour.country}, ${selectedTour.city}` : '-' }}</li>
              <li><strong>Дата вылета:</strong> {{ form.departureDate || '-' }}</li>
              <li><strong>Туристы:</strong> {{ form.adults }} взрослых, {{ form.children }} детей</li>
              <li><strong>Стоимость:</strong> <span class="font-extrabold text-brand-dark">{{ totalLabel }}</span></li>
            </ul>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <label class="flex items-start gap-2 text-sm text-slate-700">
              <input v-model="form.accepted" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-slate-300">
              <span>Я принимаю условия бронирования и подтверждаю корректность введенных данных.</span>
            </label>
            <button
              type="button"
              class="mt-4 w-full rounded-xl bg-brand-dark px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="submitting"
              @click="submitBooking"
            >
              {{ submitting ? 'Отправляем...' : 'Забронировать' }}
            </button>
            <p class="mt-3 min-h-5 text-sm font-semibold" :class="statusOk ? 'text-emerald-700' : 'text-rose-700'">{{ statusMessage }}</p>
          </article>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { TourPackage } from '~/types/tour'

const route = useRoute()
const { data: contentData } = await useSiteContent()
const tours = computed(() => contentData.value?.tours ?? [])

const selectedTourId = computed(() => String(route.query.tour ?? ''))
const selectedTour = computed<TourPackage | null>(() => tours.value.find((item) => item.id === selectedTourId.value) ?? null)

const { data: sessionData } = await useFetch<{
  authenticated: boolean
  user: { name: string; email: string; phone?: string; birthDate?: string } | null
}>('/api/auth/session', { key: 'auth-session' })

const form = reactive({
  tourId: selectedTourId.value,
  departureDate: String(route.query.date ?? ''),
  adults: Math.max(1, Number(route.query.adults ?? 2)),
  children: Math.max(0, Number(route.query.children ?? 0)),
  totalUsd: Number(route.query.total ?? 0),
  customerName: sessionData.value?.user?.name ?? '',
  customerEmail: sessionData.value?.user?.email ?? '',
  customerPhone: sessionData.value?.user?.phone ?? '',
  passengerLastName: '',
  passengerFirstName: '',
  passengerBirthDate: '',
  passengerGender: '',
  passengerCitizenship: '',
  passengerPassport: '',
  passportExpiry: '',
  telegram: '',
  comment: '',
  accepted: true
})

watch(selectedTourId, (next) => {
  form.tourId = next
}, { immediate: true })

const totalLabel = computed(() => {
  if (form.totalUsd > 0) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(form.totalUsd)
  }

  const from = selectedTour.value?.priceFromUsd ?? 0
  const value = from * form.adults + from * 0.7 * form.children
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
})

const submitting = ref(false)
const statusMessage = ref('')
const statusOk = ref(true)
const bookingReceipt = useState<{
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

const redirectToSuccess = async (): Promise<void> => {
  if (!bookingReceipt.value) {
    return
  }

  const query = new URLSearchParams({
    id: bookingReceipt.value.id,
    tourTitle: bookingReceipt.value.tourTitle,
    customerName: bookingReceipt.value.customerName,
    customerEmail: bookingReceipt.value.customerEmail,
    customerPhone: bookingReceipt.value.customerPhone,
    comment: bookingReceipt.value.comment,
    totalUsd: String(bookingReceipt.value.totalUsd),
    status: bookingReceipt.value.status,
    paymentStatus: bookingReceipt.value.paymentStatus,
    createdAt: bookingReceipt.value.createdAt
  })

  try {
    await navigateTo(`/booking/success?${query.toString()}`, { replace: true })
  } finally {
    if (import.meta.client && window.location.pathname !== '/booking/success') {
      window.location.assign(`/booking/success?${query.toString()}`)
    }
  }
}

const submitBooking = async (): Promise<void> => {
  submitting.value = true
  statusMessage.value = ''
  statusOk.value = true

  try {
    if (!form.accepted) {
      throw new Error('Подтвердите условия бронирования, чтобы продолжить.')
    }

    const totalFromLabel = Number(totalLabel.value.replace(/[^0-9.]/g, '')) || 0
    const response = await $fetch<{
      ok: boolean
      booking: {
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
      }
    }>('/api/booking', {
      method: 'POST',
      body: {
        ...form,
        totalUsd: form.totalUsd > 0 ? form.totalUsd : totalFromLabel
      }
    })

    bookingReceipt.value = response.booking

    await redirectToSuccess()
  } catch (error) {
    statusOk.value = false
    const data = (error as { data?: { statusMessage?: string } }).data
    statusMessage.value = data?.statusMessage ?? (error instanceof Error ? error.message : 'Не удалось отправить бронирование.')
  } finally {
    submitting.value = false
  }
}

useSeoMeta({
  title: 'Бронирование',
  description: 'Оформление бронирования тура OMMA tour.'
})
</script>
