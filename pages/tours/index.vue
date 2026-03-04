<template>
  <div class="mx-auto w-[min(1200px,92%)] py-12">
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-700">{{ t('catalog') }}</p>
        <h1 class="mt-2 font-serif text-5xl text-slate-900">{{ t('allTours') }}</h1>
      </div>
      <p class="text-sm font-semibold text-slate-500">{{ t('found') }}: {{ filteredTours.length }}</p>
    </div>

    <div class="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-3 lg:grid-cols-6">
      <label class="text-sm font-semibold text-slate-700">
        Страна
        <select v-model="filters.country" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
          <option value="">Все страны</option>
          <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
        </select>
      </label>
      <label class="text-sm font-semibold text-slate-700">
        Тип отдыха
        <select v-model="filters.restType" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
          <option value="">Любой</option>
          <option value="пляжный">Пляжный</option>
          <option value="экскурсионный">Экскурсионный</option>
          <option value="vip">VIP</option>
          <option value="горящий">Горящий</option>
        </select>
      </label>
      <label class="text-sm font-semibold text-slate-700">
        Дата вылета
        <input v-model="filters.departureDate" type="date" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
      </label>
      <label class="text-sm font-semibold text-slate-700">
        Продолжительность
        <select v-model.number="filters.duration" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
          <option :value="0">Любая</option>
          <option :value="3">от 3 ночей</option>
          <option :value="5">от 5 ночей</option>
          <option :value="7">от 7 ночей</option>
          <option :value="10">от 10 ночей</option>
        </select>
      </label>
      <label class="text-sm font-semibold text-slate-700 md:col-span-2">
        Бюджет до: <span class="text-brand-dark">${{ filters.maxBudget }}</span>
        <input v-model.number="filters.maxBudget" type="range" min="300" max="5000" step="50" class="mt-2 w-full">
      </label>
      <label class="text-sm font-semibold text-slate-700 md:col-span-2 lg:col-span-6">
        Поиск
        <input v-model="filters.destination" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Направление, город, описание...">
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
  country: String(route.query.country ?? ''),
  restType: String(route.query.restType ?? ''),
  departureDate: String(route.query.date ?? ''),
  duration: Number(route.query.duration ?? 0),
  maxBudget: Number(route.query.maxBudget ?? 2500)
})

const tours = computed<TourPackage[]>(() => data.value?.tours ?? [])
const countries = computed(() => Array.from(new Set(tours.value.map((tour) => tour.country))).sort())

const resolveRestType = (tour: TourPackage): string => {
  const source = `${tour.badge} ${tour.title} ${tour.description}`.toLowerCase()
  if (source.includes('горящ')) return 'горящий'
  if (source.includes('vip') || source.includes('premium') || source.includes('luxury')) return 'vip'
  if (source.includes('экскурс') || source.includes('city') || source.includes('европа')) return 'экскурсионный'
  return 'пляжный'
}

const filteredTours = computed(() => {
  return tours.value.filter((tour) => {
    const destinationMatch =
      filters.destination === '' ||
      `${tour.title} ${tour.country} ${tour.city} ${tour.description}`
        .toLocaleLowerCase()
        .includes(filters.destination.toLocaleLowerCase())
    const countryMatch = filters.country === '' || tour.country === filters.country
    const typeMatch = filters.restType === '' || resolveRestType(tour) === filters.restType
    const budgetMatch = tour.priceFromUsd <= filters.maxBudget
    const durationMatch = filters.duration === 0 || tour.durationNights >= filters.duration
    const departureMatch =
      filters.departureDate === '' ||
      tour.departures.some((departure) => new Date(departure.date).toDateString() === new Date(filters.departureDate).toDateString())

    return destinationMatch && countryMatch && typeMatch && budgetMatch && durationMatch && departureMatch
  })
})

useSeoMeta({
  title: 'Туры',
  description: 'Каталог туров OMMA tour с фильтрами по направлению и бюджету.'
})
</script>
