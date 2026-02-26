<template>
  <div class="mx-auto w-[min(1200px,92%)] py-12">
    <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
      <div class="border-b border-slate-200 bg-slate-950 px-6 py-8 text-white sm:px-8">
        <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-200">OMMA account</p>
        <h1 class="mt-2 font-serif text-5xl">Платежи</h1>
        <p class="mt-2 text-sm text-slate-200">История оплат, статусы и суммы по вашим бронированиям.</p>
      </div>

      <div class="px-6 py-4 sm:px-8">
        <AccountTabs />
      </div>

      <div class="px-6 pb-8 sm:px-8">
        <p
          v-if="paidMessage"
          class="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
        >
          {{ paidMessage }}
        </p>

        <div class="overflow-x-auto rounded-2xl border border-slate-200">
          <table class="min-w-full text-sm">
            <thead class="bg-slate-100 text-left text-slate-600">
              <tr>
                <th class="px-4 py-3 font-bold">Дата</th>
                <th class="px-4 py-3 font-bold">Тур</th>
                <th class="px-4 py-3 font-bold">Сумма</th>
                <th class="px-4 py-3 font-bold">Статус</th>
                <th class="px-4 py-3 font-bold">Действие</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="payment in payments" :key="payment.id" class="border-t border-slate-100">
                <td class="px-4 py-3">{{ payment.date }}</td>
                <td class="px-4 py-3 font-semibold text-slate-900">{{ payment.tour }}</td>
                <td class="px-4 py-3">{{ payment.amount }}</td>
                <td class="px-4 py-3">
                  <span
                    class="rounded-full px-2.5 py-1 text-xs font-bold"
                    :class="payment.status === 'Оплачено' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
                  >
                    {{ payment.status }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <NuxtLink
                    v-if="payment.status !== 'Оплачено'"
                    :to="`/booking/payment?bookingId=${encodeURIComponent(payment.id)}&customerEmail=${encodeURIComponent(payment.customerEmail)}`"
                    class="rounded-lg bg-brand-dark px-3 py-1.5 text-xs font-bold text-white"
                  >
                    Оплатить
                  </NuxtLink>
                  <span v-else class="text-xs font-semibold text-emerald-700">Готово</span>
                </td>
              </tr>
              <tr v-if="payments.length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-slate-500">У вас пока нет бронирований для оплаты.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth-user'
})

const route = useRoute()
const { data: bookingsData } = await useFetch<{
  bookings: Array<{
    id: string
    tourTitle: string
    customerEmail: string
    totalUsd: number
    paymentStatus?: string
    createdAt: string
    paidAt?: string
  }>
}>('/api/account/bookings')

const formatDate = (raw: string): string => {
  if (!raw) {
    return '-'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(raw))
}

const formatUsd = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)

const payments = computed(() =>
  (bookingsData.value?.bookings ?? []).map((booking) => ({
    id: booking.id,
    date: formatDate(booking.paidAt || booking.createdAt),
    tour: booking.tourTitle,
    amount: formatUsd(booking.totalUsd),
    status: booking.paymentStatus === 'Оплачено' ? 'Оплачено' : 'Ожидает',
    customerEmail: booking.customerEmail
  }))
)

const paidId = computed(() => String(route.query.paid ?? '').trim())
const paidMessage = computed(() =>
  paidId.value ? `Оплата заказа #${paidId.value.replace('booking-', '')} успешно проведена.` : ''
)

useSeoMeta({
  title: 'Кабинет: Платежи',
  description: 'Платежи и статусы бронирований пользователя.'
})
</script>
