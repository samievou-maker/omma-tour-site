<template>
  <div class="mx-auto w-[min(1200px,92%)] py-12">
    <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
      <div class="border-b border-slate-200 bg-slate-950 px-6 py-8 text-white sm:px-8">
        <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-200">OMMA account</p>
        <h1 class="mt-2 font-serif text-5xl">Мои поездки</h1>
        <p class="mt-2 text-sm text-slate-200">Ваши активные и завершенные туры в одном месте.</p>
      </div>

      <div class="px-6 py-4 sm:px-8">
        <AccountTabs />
      </div>

      <div class="grid gap-4 px-6 pb-8 sm:px-8 lg:grid-cols-2">
        <article
          v-for="trip in upcomingTrips"
          :key="trip.id"
          class="rounded-2xl border border-slate-200 bg-slate-50 p-5"
        >
          <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-cyan-700">Активная поездка</p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900">{{ trip.title }}</h2>
          <p class="mt-1 text-sm text-slate-600">{{ trip.period }}</p>
          <p class="mt-1 text-sm text-slate-600">Туристов: {{ trip.travelers }}</p>
          <p class="mt-1 text-sm text-slate-600">
            Статус:
            <span class="font-bold" :class="trip.status === 'Оплачено' ? 'text-emerald-700' : 'text-amber-700'">{{ trip.status }}</span>
          </p>
          <div class="mt-4 flex flex-wrap gap-2">
            <NuxtLink to="/contact" class="rounded-xl bg-brand-dark px-4 py-2 text-sm font-bold text-white">Связаться с менеджером</NuxtLink>
            <NuxtLink to="/tours" class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">Добавить тур</NuxtLink>
          </div>
        </article>

        <article class="rounded-2xl border border-slate-200 bg-white p-5">
          <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">История поездок</p>
          <ul class="mt-3 space-y-3">
            <li v-for="item in historyTrips" :key="item.id" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p class="font-bold text-slate-900">{{ item.title }}</p>
              <p class="text-sm text-slate-600">{{ item.period }}</p>
            </li>
          </ul>
        </article>
      </div>

      <div class="px-6 pb-8 sm:px-8">
        <article class="rounded-2xl border border-slate-200 bg-white p-5">
          <div class="mb-3 flex items-center justify-between gap-3">
            <p class="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">Сохраненные туры</p>
            <NuxtLink to="/tours" class="text-sm font-bold text-brand-dark hover:text-brand">Перейти в каталог</NuxtLink>
          </div>

          <p v-if="savedTours.length === 0" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            У вас пока нет сохраненных туров. Нажмите «Сохранить» в карточке тура.
          </p>

          <div v-else class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <article v-for="tour in savedTours" :key="tour.id" class="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 class="text-lg font-bold text-slate-900">{{ tour.title }}</h3>
              <p class="mt-1 text-sm text-slate-600">{{ tour.shortDescription }}</p>
              <div class="mt-3 flex items-center justify-between">
                <span class="text-sm font-extrabold text-brand">от {{ tour.priceFromUsd }}$</span>
                <NuxtLink :to="`/tours/${tour.id}`" class="text-sm font-bold text-brand-dark hover:text-brand">Подробнее</NuxtLink>
              </div>
            </article>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { TourPackage } from '~/types/tour'

definePageMeta({
  middleware: 'auth-user'
})

const { data: bookingsData } = await useFetch<{
  bookings: Array<{
    id: string
    tourTitle: string
    departureDate: string
    adults: number
    children: number
    status: string
    createdAt: string
  }>
}>('/api/account/bookings')

const formatDate = (raw: string): string => {
  if (!raw) {
    return '-'
  }

  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(raw))
}

const upcomingTrips = computed(() =>
  (bookingsData.value?.bookings ?? []).slice(0, 3).map((booking) => ({
    id: booking.id,
    title: booking.tourTitle,
    period: booking.departureDate ? formatDate(booking.departureDate) : formatDate(booking.createdAt),
    travelers: booking.adults + booking.children,
    status: booking.status
  }))
)

const historyTrips = computed(() =>
  (bookingsData.value?.bookings ?? []).slice(3).map((booking) => ({
    id: booking.id,
    title: booking.tourTitle,
    period: booking.departureDate ? formatDate(booking.departureDate) : formatDate(booking.createdAt)
  }))
)

const { data: savedData } = await useFetch<{
  savedTourIds: string[]
  savedTours: TourPackage[]
}>('/api/account/saved')

const savedTours = computed(() => savedData.value?.savedTours ?? [])

useSeoMeta({
  title: 'Кабинет: Поездки',
  description: 'Активные и завершенные поездки пользователя.'
})
</script>
