<template>
  <div class="mx-auto w-[min(1200px,92%)] py-12">
    <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div class="border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white sm:px-8">
        <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-100">Booking complete</p>
        <h1 class="mt-2 font-serif text-5xl">Ваша заявка принята</h1>
        <p class="mt-2 text-sm text-cyan-100">Проверьте детали заказа и перейдите к оплате.</p>
      </div>

      <div class="grid gap-5 px-6 py-6 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
        <article class="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Информация о заказчике</h2>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
              <p class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Имя</p>
              <p class="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{{ receipt.customerName }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
              <p class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Дата создания</p>
              <p class="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{{ createdAtLabel }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
              <p class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Телефон</p>
              <p class="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{{ receipt.customerPhone }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
              <p class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Email</p>
              <p class="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{{ receipt.customerEmail }}</p>
            </div>
          </div>

          <div class="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
            <p class="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Комментарий</p>
            <p class="mt-1 text-base text-slate-700 dark:text-slate-300">{{ receipt.comment || 'Комментарий не указан.' }}</p>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <NuxtLink
              :to="paymentLink"
              class="rounded-xl bg-brand-dark px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              Перейти к оплате
            </NuxtLink>
            <NuxtLink to="/account/payments" class="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 dark:border-slate-600 dark:text-slate-200">
              Перейти к оплатам
            </NuxtLink>
          </div>
        </article>

        <aside class="space-y-4">
          <article class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100">Реквизиты брони</h3>
            <ul class="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li><strong>Номер заказа:</strong> {{ shortOrderId }}</li>
              <li><strong>Тур:</strong> {{ receipt.tourTitle }}</li>
              <li><strong>Статус:</strong> <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-300">{{ receipt.status }}</span></li>
              <li>
                <strong>Оплата:</strong>
                <span
                  class="rounded-full px-2 py-0.5"
                  :class="receipt.paymentStatus === 'Оплачено'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/25 dark:text-rose-300'"
                >
                  {{ receipt.paymentStatus }}
                </span>
              </li>
              <li><strong>Сумма:</strong> <span class="font-extrabold text-brand-dark dark:text-cyan-300">{{ totalUsdLabel }}</span></li>
            </ul>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
            <p class="text-sm text-slate-700 dark:text-slate-300">
              Следующий шаг: завершите оплату и проверьте статус заказа в личном кабинете.
            </p>
            <div class="mt-4 grid gap-2">
              <NuxtLink to="/account/trips" class="rounded-xl bg-white px-4 py-2.5 text-center text-sm font-bold text-slate-900 shadow-soft dark:bg-slate-900 dark:text-slate-100">
                Перейти в мои поездки
              </NuxtLink>
              <NuxtLink to="/account/payments" class="rounded-xl bg-white px-4 py-2.5 text-center text-sm font-bold text-slate-900 shadow-soft dark:bg-slate-900 dark:text-slate-100">
                Открыть оплату
              </NuxtLink>
              <NuxtLink to="/tours" class="rounded-xl border border-slate-300 px-4 py-2.5 text-center text-sm font-bold text-slate-700 dark:border-slate-600 dark:text-slate-200">
                Смотреть другие туры
              </NuxtLink>
            </div>
          </article>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
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

if (!receiptState.value && route.query.id) {
  receiptState.value = {
    id: String(route.query.id ?? `booking-${Date.now()}`),
    tourTitle: String(route.query.tourTitle ?? 'Тур'),
    customerName: String(route.query.customerName ?? 'Гость'),
    customerEmail: String(route.query.customerEmail ?? 'not-provided@ommatour.local'),
    customerPhone: String(route.query.customerPhone ?? '-'),
    comment: String(route.query.comment ?? ''),
    totalUsd: Number(route.query.totalUsd ?? 0),
    status: String(route.query.status ?? 'Новый'),
    paymentStatus: String(route.query.paymentStatus ?? 'Не оплачено'),
    createdAt: String(route.query.createdAt ?? new Date().toISOString())
  }
}

if (!receiptState.value) {
  receiptState.value = {
    id: `booking-${Date.now()}`,
    tourTitle: 'Тур',
    customerName: 'Гость',
    customerEmail: 'not-provided@ommatour.local',
    customerPhone: '-',
    comment: '',
    totalUsd: 0,
    status: 'Новый',
    paymentStatus: 'Не оплачено',
    createdAt: new Date().toISOString()
  }
}

const receipt = computed(() => receiptState.value!)

const createdAtLabel = computed(() =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(receipt.value.createdAt))
)

const shortOrderId = computed(() => `#${receipt.value.id.replace('booking-', '')}`)
const totalUsdLabel = computed(() =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(receipt.value.totalUsd)
)
const paymentLink = computed(() => {
  const query = new URLSearchParams({
    bookingId: receipt.value.id,
    customerEmail: receipt.value.customerEmail
  })
  return `/booking/payment?${query.toString()}`
})

useSeoMeta({
  title: 'Бронирование: подтверждение',
  description: 'Детали созданной заявки на бронирование.'
})
</script>
