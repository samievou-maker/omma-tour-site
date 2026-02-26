<template>
  <div class="mx-auto w-[min(1200px,92%)] py-12">
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-700">{{ t('catalog') }}</p>
        <h1 class="mt-2 font-serif text-5xl text-slate-900">{{ t('allTours') }}</h1>
      </div>
      <p class="text-sm font-semibold text-slate-500">{{ t('found') }}: {{ filteredTours.length }}</p>
    </div>

    <div class="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-3">
      <label class="text-sm font-semibold text-slate-700">
        {{ t('direction') }}
        <input v-model="filters.destination" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
      </label>
      <label class="text-sm font-semibold text-slate-700">
        {{ t('budget') }}
        <select v-model="filters.budget" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
          <option value="">{{ t('any') }}</option>
          <option value="до 700$">{{ t('from700') }}</option>
          <option value="700$ - 1000$">{{ t('from700to1000') }}</option>
          <option value="1000$+">{{ t('from1000') }}</option>
        </select>
      </label>
      <label class="text-sm font-semibold text-slate-700">
        {{ t('month') }}
        <input v-model="filters.month" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Июнь">
      </label>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <TourCard v-for="tour in filteredTours" :key="tour.id" :tour="tour" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TourPackage } from '~/types/tour'
const { t } = useSiteLanguage()

const route = useRoute()
const { data } = await useSiteContent()

const filters = reactive({
  destination: String(route.query.destination ?? ''),
  budget: String(route.query.budget ?? ''),
  month: String(route.query.month ?? '')
})

const tours = computed<TourPackage[]>(() => data.value?.tours ?? [])

const filteredTours = computed(() => {
  return tours.value.filter((tour) => {
    const destinationMatch =
      filters.destination === '' ||
      `${tour.title} ${tour.country} ${tour.city} ${tour.description}`
        .toLocaleLowerCase()
        .includes(filters.destination.toLocaleLowerCase())

    const budgetMatch =
      filters.budget === '' ||
      (filters.budget === 'до 700$' && tour.priceFromUsd <= 700) ||
      (filters.budget === '700$ - 1000$' && tour.priceFromUsd > 700 && tour.priceFromUsd <= 1000) ||
      (filters.budget === '1000$+' && tour.priceFromUsd > 1000)

    const monthMatch =
      filters.month === '' ||
      tour.departures.some((departure) =>
        new Intl.DateTimeFormat('ru-RU', { month: 'long' })
          .format(new Date(departure.date))
          .toLocaleLowerCase()
          .includes(filters.month.toLocaleLowerCase())
      )

    return destinationMatch && budgetMatch && monthMatch
  })
})

useSeoMeta({
  title: 'Туры',
  description: 'Каталог туров OMMA tour с фильтрами по направлению и бюджету.'
})
</script>
