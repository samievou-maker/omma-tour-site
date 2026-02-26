<template>
  <div v-if="tour" class="pb-12">
    <section class="relative overflow-hidden border-b border-slate-200 bg-slate-900 py-16 text-white">
      <img :src="tour.heroImage" :alt="tour.title" class="absolute inset-0 h-full w-full object-cover opacity-45">
      <div class="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/65 to-cyan-900/45" />

      <div class="relative mx-auto w-[min(1200px,92%)]">
        <NuxtLink to="/tours" class="inline-flex items-center text-sm font-semibold text-cyan-200 hover:text-white">
          ← Назад к турпакетам
        </NuxtLink>

        <div class="mt-4 flex flex-wrap items-center gap-3">
          <span class="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em]">
            {{ tour.badge }}
          </span>
          <span class="text-sm font-medium text-cyan-100">{{ tour.country }} · {{ tour.city }}</span>
        </div>

        <h1 class="mt-3 max-w-[16ch] font-serif text-5xl leading-[0.94] md:text-6xl">{{ tour.title }}</h1>
        <p class="mt-4 max-w-3xl text-slate-100">{{ tour.description }}</p>

        <div class="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-xl border border-white/25 bg-white/10 px-4 py-3">
            <p class="text-cyan-100">Цена</p>
            <p class="text-xl font-extrabold text-white">от {{ tour.priceFromUsd }}$</p>
          </div>
          <div class="rounded-xl border border-white/25 bg-white/10 px-4 py-3">
            <p class="text-cyan-100">Длительность</p>
            <p class="text-xl font-extrabold text-white">{{ tour.durationNights }} ночей</p>
          </div>
          <div class="rounded-xl border border-white/25 bg-white/10 px-4 py-3">
            <p class="text-cyan-100">Отель</p>
            <p class="text-xl font-extrabold text-white">{{ tour.hotelClass }}</p>
          </div>
          <div class="rounded-xl border border-white/25 bg-white/10 px-4 py-3">
            <p class="text-cyan-100">Даты</p>
            <p class="text-sm font-bold text-white">{{ formattedPeriod }}</p>
          </div>
        </div>

        <div class="mt-4">
          <button
            type="button"
            class="rounded-xl border px-4 py-2 text-sm font-bold transition"
            :class="saved ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-white/40 bg-white/10 text-white hover:bg-white/20'"
            @click="toggleSaveCurrentTour"
          >
            {{ saved ? 'Сохранено в кабинете' : 'Сохранить тур в кабинет' }}
          </button>
        </div>
      </div>
    </section>

    <section class="py-10">
      <div class="mx-auto grid w-[min(1200px,92%)] gap-4 md:grid-cols-3">
        <article
          v-for="(image, index) in tour.gallery"
          :key="image"
          class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft"
        >
          <img :src="image" :alt="`${tour.title} фото ${index + 1}`" class="h-56 w-full object-cover">
        </article>
      </div>
    </section>

    <section class="pb-8">
      <div class="mx-auto grid w-[min(1200px,92%)] gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div class="space-y-6">
          <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 class="font-serif text-4xl text-slate-900">Подбор вылета и цены</h2>

            <div class="mt-4 grid gap-3 md:grid-cols-3">
              <label class="text-sm font-semibold text-slate-700">
                Дата вылета
                <input
                  v-model="selectedDate"
                  type="date"
                  class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-brand-mint/40 focus:ring-2"
                >
              </label>

              <label class="text-sm font-semibold text-slate-700">
                Взрослые
                <input
                  v-model.number="adults"
                  type="number"
                  min="1"
                  max="8"
                  class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-brand-mint/40 focus:ring-2"
                >
              </label>

              <label class="text-sm font-semibold text-slate-700">
                Дети
                <input
                  v-model.number="children"
                  type="number"
                  min="0"
                  max="6"
                  class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-brand-mint/40 focus:ring-2"
                >
              </label>
            </div>

            <p class="mt-3 text-sm text-slate-500">
              Детский тариф в расчете: 70% от цены взрослого.
            </p>

            <div class="mt-4 overflow-x-auto">
              <table class="min-w-full border-collapse text-sm">
                <thead>
                  <tr class="border-b border-slate-200 text-left text-slate-500">
                    <th class="px-2 py-2 font-semibold">Вылет</th>
                    <th class="px-2 py-2 font-semibold">Ночи</th>
                    <th class="px-2 py-2 font-semibold">Отель</th>
                    <th class="px-2 py-2 font-semibold">Питание</th>
                    <th class="px-2 py-2 font-semibold">Мест</th>
                    <th class="px-2 py-2 font-semibold">За 1 взрослого</th>
                    <th class="px-2 py-2 font-semibold">Итого</th>
                    <th class="px-2 py-2 font-semibold">Действие</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="departure in filteredDepartures" :key="departure.date" class="border-b border-slate-100">
                    <td class="px-2 py-3">{{ formatDate(departure.date) }}</td>
                    <td class="px-2 py-3">{{ departure.nights }}</td>
                    <td class="px-2 py-3">{{ departure.hotel }}</td>
                    <td class="px-2 py-3">{{ departure.mealPlan }}</td>
                    <td class="px-2 py-3">{{ departure.seatsLeft }}</td>
                    <td class="px-2 py-3">{{ formatMoney(departure.priceFromUsd) }}</td>
                    <td class="px-2 py-3 font-bold text-brand-dark">{{ formatMoney(getTotalPrice(departure)) }}</td>
                    <td class="px-2 py-3">
                      <button
                        class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-800 hover:border-brand hover:text-brand"
                        type="button"
                        @click="selectedDepartureDate = departure.date"
                      >
                        Выбрать
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p v-if="filteredDepartures.length === 0" class="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Нет доступных вылетов под выбранную дату. Попробуйте убрать фильтр по дате.
            </p>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 class="font-serif text-4xl text-slate-900">Что включено</h2>
            <ul class="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              <li
                v-for="item in tour.included"
                :key="item"
                class="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-700/60 dark:bg-emerald-900/20 dark:text-emerald-100"
              >
                ✓ {{ item }}
              </li>
            </ul>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 class="font-serif text-4xl text-slate-900">Что не включено</h2>
            <ul class="mt-4 grid gap-2 text-sm text-slate-700">
              <li
                v-for="item in tour.notIncluded"
                :key="item"
                class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 dark:border-rose-700/60 dark:bg-rose-900/20 dark:text-rose-100"
              >
                • {{ item }}
              </li>
            </ul>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 class="font-serif text-4xl text-slate-900">Программа тура</h2>
            <ol class="mt-4 space-y-2 text-sm text-slate-700">
              <li
                v-for="(step, index) in tour.itinerary"
                :key="step"
                class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
              >
                <span class="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-dark text-xs font-bold text-white">{{ index + 1 }}</span>
                {{ step }}
              </li>
            </ol>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 class="font-serif text-4xl text-slate-900">Важная информация</h2>
            <ul class="mt-4 space-y-2 text-sm text-slate-700">
              <li v-for="item in notesList" :key="item" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                • {{ item }}
              </li>
            </ul>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 class="font-serif text-4xl text-slate-900">FAQ</h2>
            <ul class="mt-4 space-y-2 text-sm text-slate-700">
              <li v-for="item in faqList" :key="item" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                • {{ item }}
              </li>
            </ul>
          </article>
        </div>

        <aside class="space-y-4">
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h3 class="text-xl font-bold text-slate-900">Итог по бронированию</h3>
            <p class="mt-2 text-sm text-slate-600">{{ tour.shortDescription }}</p>

            <ul v-if="activeDeparture" class="mt-4 space-y-2 text-sm text-slate-700">
              <li><strong>Тур:</strong> {{ tour.title }}</li>
              <li><strong>Вылет:</strong> {{ formatDate(activeDeparture.date) }}</li>
              <li><strong>Отель:</strong> {{ activeDeparture.hotel }}</li>
              <li><strong>Ночи:</strong> {{ activeDeparture.nights }}</li>
              <li><strong>Питание:</strong> {{ activeDeparture.mealPlan }}</li>
              <li><strong>Состав:</strong> {{ adults }} взрослых, {{ children }} детей</li>
              <li><strong>Сумма:</strong> <span class="font-extrabold text-brand-dark">{{ formatMoney(getTotalPrice(activeDeparture)) }}</span></li>
              <li><strong>Для кого:</strong> {{ tour.bestFor || 'Пары, семьи, друзья' }}</li>
              <li><strong>Виза:</strong> {{ tour.visaInfo || 'По правилам страны назначения' }}</li>
              <li><strong>Перелет:</strong> {{ tour.flightInfo || 'Регулярный/чартерный рейс' }}</li>
              <li><strong>Трансфер:</strong> {{ tour.transferInfo || 'Групповой трансфер' }}</li>
              <li><strong>Отмена:</strong> {{ tour.cancellationPolicy || 'Согласно условиям договора' }}</li>
            </ul>

            <NuxtLink
              :to="bookingLink"
              class="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              Забронировать этот тур
            </NuxtLink>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-soft">
            <p class="text-xs font-extrabold uppercase tracking-[0.14em] text-cyan-200">OMMA concierge</p>
            <h3 class="mt-2 text-2xl font-bold">Нужна персональная версия этого тура?</h3>
            <p class="mt-2 text-sm text-slate-200">Адаптируем отель, даты и программу под ваш бюджет и пожелания.</p>
            <NuxtLink :to="bookingLink" class="mt-4 inline-block text-sm font-bold text-cyan-200 hover:text-white">
              Оставить заявку →
            </NuxtLink>
          </div>
        </aside>
      </div>
    </section>

    <section class="pb-12">
      <div class="mx-auto w-[min(1200px,92%)]">
        <div class="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-soft sm:p-8">
          <p class="text-xs font-extrabold uppercase tracking-[0.14em] text-cyan-200">Final step</p>
          <h2 class="mt-2 font-serif text-5xl">Готовы забронировать этот тур?</h2>
          <p class="mt-3 max-w-3xl text-sm text-slate-200">
            Проверьте выбранный вылет и состав туристов, затем переходите к оформлению. Менеджер подтвердит бронь и детали оплаты.
          </p>
          <div class="mt-5 flex flex-wrap gap-2">
            <NuxtLink
              :to="bookingLink"
              class="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              Перейти к бронированию
            </NuxtLink>
            <NuxtLink
              to="/contact"
              class="rounded-xl border border-white/30 px-5 py-3 text-sm font-bold text-white/90 transition hover:bg-white/10"
            >
              Нужна помощь менеджера
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { TourDeparture, TourPackage } from '~/types/tour'

const route = useRoute()
const tourId = String(route.params.id ?? '')
const { data: tourData } = await useFetch<TourPackage>(`/api/tours/${tourId}`)
const tour = computed(() => tourData.value)

if (!tourData.value) {
  await navigateTo('/tours')
}

const selectedDate = ref('')
const selectedDepartureDate = ref('')
const adults = ref(2)
const children = ref(0)
const { ensureLoaded, isSaved, toggleSaved } = useSavedTours()

const formatDate = (rawDate: string): string =>
  new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(rawDate))

const formatMoney = (amount: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)

const getTotalPrice = (departure: TourDeparture): number => {
  const safeAdults = Math.max(1, adults.value)
  const safeChildren = Math.max(0, children.value)
  return departure.priceFromUsd * safeAdults + departure.priceFromUsd * 0.7 * safeChildren
}

const filteredDepartures = computed<readonly TourDeparture[]>(() => {
  if (!tour.value) {
    return []
  }

  if (selectedDate.value === '') {
    return tour.value.departures
  }

  const from = new Date(selectedDate.value)
  return tour.value.departures.filter((item) => new Date(item.date) >= from)
})

const activeDeparture = computed<TourDeparture | null>(() => {
  if (!tour.value) {
    return null
  }

  const selected = filteredDepartures.value.find((item) => item.date === selectedDepartureDate.value)
  return selected ?? filteredDepartures.value[0] ?? tour.value.departures[0] ?? null
})

const notesList = computed<string[]>(() => {
  const fallback = [
    'Проверьте срок действия загранпаспорта заранее.',
    'Рекомендуем оформить расширенную страховку.',
    'В высокий сезон стоимость может меняться.'
  ]
  return tour.value?.importantNotes && tour.value.importantNotes.length > 0 ? tour.value.importantNotes : fallback
})

const faqList = computed<string[]>(() => {
  const fallback = [
    'Можно ли изменить даты? Да, по доступности и условиям тарифа.',
    'Можно ли с детьми? Да, менеджер подберет семейный вариант.',
    'Есть ли рассрочка? Уточняйте при бронировании у менеджера.'
  ]
  return tour.value?.faq && tour.value.faq.length > 0 ? tour.value.faq : fallback
})

const formattedPeriod = computed(() => {
  if (!tourData.value) {
    return ''
  }

  return `${formatDate(tourData.value.availableFrom)} - ${formatDate(tourData.value.availableTo)}`
})

const bookingLink = computed(() => {
  if (!tourData.value || !activeDeparture.value) {
    return { path: '/contact' }
  }

  return {
    path: '/booking',
    query: {
      tour: tourData.value.id,
      date: activeDeparture.value.date,
      adults: String(Math.max(1, adults.value)),
      children: String(Math.max(0, children.value)),
      total: String(Math.round(getTotalPrice(activeDeparture.value)))
    }
  }
})

const saved = computed(() => {
  if (!tour.value) {
    return false
  }

  return isSaved(tour.value.id)
})

const toggleSaveCurrentTour = async (): Promise<void> => {
  if (!tour.value) {
    return
  }

  await toggleSaved(tour.value.id)
}

watch([adults, children], () => {
  adults.value = Math.min(8, Math.max(1, adults.value || 1))
  children.value = Math.min(6, Math.max(0, children.value || 0))
})

watch(filteredDepartures, (list) => {
  if (list.length === 0) {
    selectedDepartureDate.value = ''
    return
  }

  const firstDeparture = list[0]
  if (!firstDeparture) {
    return
  }

  if (!list.some((item) => item.date === selectedDepartureDate.value)) {
    selectedDepartureDate.value = firstDeparture.date
  }
}, { immediate: true })

onMounted(async () => {
  await ensureLoaded()
})

useSeoMeta({
  title: tourData.value?.title ?? 'Тур',
  description: tourData.value?.description ?? '',
  ogTitle: `${tourData.value?.title ?? 'Тур'} | OMMA tour`,
  ogDescription: tourData.value?.shortDescription ?? '',
  ogImage: tourData.value?.heroImage ?? ''
})
</script>
