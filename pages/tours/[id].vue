<template>
  <div v-if="tour" class="pb-12">
    <section class="relative overflow-hidden border-b border-slate-200 bg-slate-900 py-16 text-white">
      <img :src="tour.heroImage || fallbackTourImage" :alt="tour.title" class="absolute inset-0 h-full w-full object-cover opacity-45" @error="onTourImageError">
      <div class="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/65 to-cyan-900/45" />
      <div class="relative mx-auto w-[min(1200px,92%)]">
        <NuxtLink to="/tours" class="inline-flex items-center text-sm font-semibold text-cyan-200 hover:text-white">← Назад к турам</NuxtLink>
        <div class="mt-4 flex flex-wrap items-center gap-3">
          <span class="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em]">{{ tour.badge }}</span>
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
      </div>
    </section>

    <section class="py-10">
      <div class="mx-auto w-[min(1200px,92%)]">
        <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <img :src="currentGalleryImage || fallbackTourImage" :alt="tour.title" class="h-[360px] w-full object-cover" @error="onTourImageError">
        </div>
        <div class="mt-3 grid gap-3 md:grid-cols-5">
          <button v-for="(image, index) in tour.gallery" :key="image" class="overflow-hidden rounded-xl border" :class="index===galleryIndex ? 'border-brand' : 'border-slate-200'" @click="galleryIndex = index">
            <img :src="image || fallbackTourImage" :alt="`${tour.title} ${index + 1}`" class="h-20 w-full object-cover" @error="onTourImageError">
          </button>
        </div>
      </div>
    </section>

    <section class="pb-8">
      <div class="mx-auto grid w-[min(1200px,92%)] gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div class="space-y-6">
          <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 class="font-serif text-4xl text-slate-900">Подбор вылета и цены</h2>
            <div class="mt-4 grid gap-3 md:grid-cols-3">
              <label class="text-sm font-semibold text-slate-700">Дата вылета
                <input v-model="selectedDate" type="date" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
              </label>
              <label class="text-sm font-semibold text-slate-700">Взрослые
                <input v-model.number="adults" type="number" min="1" max="8" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
              </label>
              <label class="text-sm font-semibold text-slate-700">Дети
                <input v-model.number="children" type="number" min="0" max="6" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
              </label>
            </div>
            <div class="mt-4 overflow-x-auto">
              <table class="min-w-full border-collapse text-sm">
                <thead>
                  <tr class="border-b border-slate-200 text-left text-slate-500">
                    <th class="px-2 py-2 font-semibold">Вылет</th>
                    <th class="px-2 py-2 font-semibold">Ночи</th>
                    <th class="px-2 py-2 font-semibold">Отель</th>
                    <th class="px-2 py-2 font-semibold">Цена</th>
                    <th class="px-2 py-2 font-semibold">Итого</th>
                    <th class="px-2 py-2 font-semibold">Действие</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="departure in filteredDepartures" :key="departure.date" class="border-b border-slate-100">
                    <td class="px-2 py-3">{{ formatDate(departure.date) }}</td>
                    <td class="px-2 py-3">{{ departure.nights }}</td>
                    <td class="px-2 py-3">{{ departure.hotel }}</td>
                    <td class="px-2 py-3">{{ formatMoney(departure.priceFromUsd) }}</td>
                    <td class="px-2 py-3 font-bold text-brand-dark">{{ formatMoney(getTotalPrice(departure)) }}</td>
                    <td class="px-2 py-3"><button class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold" @click="selectedDepartureDate = departure.date">Выбрать</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 class="font-serif text-4xl text-slate-900">Программа по дням</h2>
            <div class="mt-4 space-y-2">
              <div v-for="(day, index) in tour.itinerary" :key="day" class="overflow-hidden rounded-xl border border-slate-200">
                <button class="flex w-full items-center justify-between bg-slate-50 px-4 py-3 text-left text-sm font-bold text-slate-800" @click="toggleDay(index)">
                  <span>День {{ index + 1 }}</span>
                  <span>{{ openDays[index] ? '−' : '+' }}</span>
                </button>
                <p v-if="openDays[index]" class="px-4 py-3 text-sm text-slate-600">{{ day }}</p>
              </div>
            </div>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 class="font-serif text-4xl text-slate-900">Что включено</h2>
            <ul class="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              <li v-for="item in tour.included" :key="item" class="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">✓ {{ item }}</li>
            </ul>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 class="font-serif text-4xl text-slate-900">Что не включено</h2>
            <ul class="mt-4 grid gap-2 text-sm text-slate-700">
              <li v-for="item in tour.notIncluded" :key="item" class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2">• {{ item }}</li>
            </ul>
          </article>

          <article class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
            <h2 class="px-6 pt-6 font-serif text-4xl text-slate-900">Карта маршрута</h2>
            <iframe
              :src="routeMapEmbedUrl"
              :title="`Карта маршрута ${tour.title}`"
              class="mt-4 h-80 w-full border-0"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen
            />
            <div class="px-6 py-4">
              <a :href="routeMapOpenUrl" target="_blank" rel="noopener noreferrer" class="inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-brand hover:text-brand">
                Открыть маршрут в карте
              </a>
            </div>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 class="font-serif text-4xl text-slate-900">Отзывы по туру</h2>
            <div class="mt-4 grid gap-3 md:grid-cols-2">
              <article v-for="review in tourReviews" :key="review.id" class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div class="mb-2 flex items-center gap-2">
                  <img :src="review.photo" :alt="review.author" class="h-9 w-9 rounded-full object-cover" @error="onAvatarError">
                  <div>
                    <p class="text-sm font-bold text-slate-900">{{ review.author }}</p>
                    <p class="text-xs text-amber-500">★★★★★</p>
                  </div>
                </div>
                <p class="text-sm text-slate-600">{{ review.text }}</p>
              </article>
            </div>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 class="font-serif text-4xl text-slate-900">Оставить заявку</h2>
            <form class="mt-4 grid gap-3 md:grid-cols-2" @submit.prevent="submitQuickRequest">
              <input v-model="quickForm.name" placeholder="Имя" class="rounded-xl border border-slate-300 px-3 py-2 text-sm">
              <input v-model="quickForm.phone" placeholder="Телефон" class="rounded-xl border border-slate-300 px-3 py-2 text-sm">
              <input v-model="quickForm.date" type="date" class="rounded-xl border border-slate-300 px-3 py-2 text-sm">
              <input v-model.number="quickForm.people" type="number" min="1" max="12" placeholder="Кол-во человек" class="rounded-xl border border-slate-300 px-3 py-2 text-sm">
              <button class="rounded-xl bg-brand-dark px-4 py-3 text-sm font-bold text-white md:col-span-2">Оставить заявку</button>
            </form>
            <p class="mt-3 min-h-5 text-sm font-semibold text-cyan-700">{{ quickFormStatus }}</p>
          </article>
        </div>

        <aside class="space-y-4">
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h3 class="text-xl font-bold text-slate-900">Итог по бронированию</h3>
            <ul v-if="activeDeparture" class="mt-4 space-y-2 text-sm text-slate-700">
              <li><strong>Тур:</strong> {{ tour.title }}</li>
              <li><strong>Вылет:</strong> {{ formatDate(activeDeparture.date) }}</li>
              <li><strong>Отель:</strong> {{ activeDeparture.hotel }}</li>
              <li><strong>Состав:</strong> {{ adults }} взрослых, {{ children }} детей</li>
              <li><strong>Сумма:</strong> <span class="font-extrabold text-brand-dark">{{ formatMoney(getTotalPrice(activeDeparture)) }}</span></li>
            </ul>
            <div class="mt-4 grid gap-2">
              <NuxtLink :to="bookingLink" class="inline-flex w-full items-center justify-center rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white">Забронировать</NuxtLink>
              <NuxtLink to="/contact" class="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700">Оставить заявку</NuxtLink>
            </div>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-soft">
            <p class="text-xs font-extrabold uppercase tracking-[0.14em] text-cyan-200">Trust</p>
            <h3 class="mt-2 text-2xl font-bold">Лицензия и проверенные партнеры</h3>
            <p class="mt-2 text-sm text-slate-200">Каждый тур оформляется официально, с подтверждением брони и прозрачным договором.</p>
            <div class="mt-3 grid gap-2">
              <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80" alt="Скан лицензии" class="h-24 w-full rounded-xl object-cover" @error="onTourImageError">
              <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80" alt="Сертификат" class="h-24 w-full rounded-xl object-cover" @error="onTourImageError">
            </div>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { TourDeparture, TourPackage } from '~/types/tour'

const route = useRoute()
const config = useRuntimeConfig()
const googleMapsApiKey = String(config.public.googleMapsApiKey ?? '').trim()
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
const galleryIndex = ref(0)
const openDays = ref<boolean[]>([])

const currentGalleryImage = computed(() => tour.value?.gallery[galleryIndex.value] ?? tour.value?.heroImage ?? '')

const formatDate = (rawDate: string): string =>
  new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(rawDate))
const formatMoney = (amount: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
const getTotalPrice = (departure: TourDeparture): number => departure.priceFromUsd * Math.max(1, adults.value) + departure.priceFromUsd * 0.7 * Math.max(0, children.value)

const filteredDepartures = computed<readonly TourDeparture[]>(() => {
  if (!tour.value) return []
  if (!selectedDate.value) return tour.value.departures
  return tour.value.departures.filter((item) => new Date(item.date) >= new Date(selectedDate.value))
})
const activeDeparture = computed<TourDeparture | null>(() => filteredDepartures.value.find((item) => item.date === selectedDepartureDate.value) ?? filteredDepartures.value[0] ?? null)

const formattedPeriod = computed(() => {
  if (!tour.value) return ''
  return `${formatDate(tour.value.availableFrom)} - ${formatDate(tour.value.availableTo)}`
})

const bookingLink = computed(() => {
  if (!tour.value || !activeDeparture.value) return { path: '/contact' }
  return {
    path: '/booking',
    query: {
      tour: tour.value.id,
      date: activeDeparture.value.date,
      adults: String(Math.max(1, adults.value)),
      children: String(Math.max(0, children.value)),
      total: String(Math.round(getTotalPrice(activeDeparture.value)))
    }
  }
})

const cityCoords: Record<string, { lat: number; lng: number }> = {
  dubai: { lat: 25.2048, lng: 55.2708 },
  maldives: { lat: 3.2028, lng: 73.2207 },
  bali: { lat: -8.4095, lng: 115.1889 },
  cappadocia: { lat: 38.6431, lng: 34.8307 },
  tbilisi: { lat: 41.7151, lng: 44.8271 },
  georgia: { lat: 42.3154, lng: 43.3569 },
  turkey: { lat: 38.9637, lng: 35.2433 },
  egypt: { lat: 26.8206, lng: 30.8025 },
  europe: { lat: 48.8566, lng: 2.3522 }
}

const routeMapOpenUrl = computed(() => {
  const key = `${tour.value?.city ?? ''} ${tour.value?.country ?? ''}`.toLowerCase()
  const match =
    Object.entries(cityCoords).find(([token]) => key.includes(token))?.[1] ??
    { lat: 41.3111, lng: 69.2797 }
  return `https://www.google.com/maps?q=${match.lat},${match.lng}`
})

const routeMapEmbedUrl = computed(() => {
  const key = `${tour.value?.city ?? ''} ${tour.value?.country ?? ''}`.toLowerCase()
  const match =
    Object.entries(cityCoords).find(([token]) => key.includes(token))?.[1] ??
    { lat: 41.3111, lng: 69.2797 }
  const q = `${match.lat},${match.lng}`
  return googleMapsApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(googleMapsApiKey)}&q=${encodeURIComponent(q)}&zoom=10`
    : `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=10&output=embed`
})

const tourReviews = computed(() => [
  { id: `${tourId}-r1`, author: 'Гузаль', text: 'Тур продуман по дням, организация отличная.', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' },
  { id: `${tourId}-r2`, author: 'Бобур', text: 'Отель и трансфер совпали с описанием, все четко.', photo: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=200&q=80' },
  { id: `${tourId}-r3`, author: 'Ситора', text: 'Удобный вылет и быстрая поддержка менеджера.', photo: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=200&q=80' }
])

const quickForm = reactive({
  name: '',
  phone: '',
  date: '',
  people: 2
})
const quickFormStatus = ref('')
const submitQuickRequest = async (): Promise<void> => {
  if (!quickForm.name || !quickForm.phone) {
    quickFormStatus.value = 'Укажите имя и телефон.'
    return
  }
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: quickForm.name,
        phone: quickForm.phone,
        destination: `${tour.value?.title ?? 'Тур'} / ${quickForm.date || 'дата не выбрана'} / ${quickForm.people} чел.`
      }
    })
    quickFormStatus.value = 'Заявка отправлена. Менеджер свяжется с вами.'
    quickForm.name = ''
    quickForm.phone = ''
    quickForm.date = ''
    quickForm.people = 2
  } catch {
    quickFormStatus.value = 'Ошибка отправки заявки.'
  }
}

const toggleDay = (index: number): void => {
  openDays.value[index] = !openDays.value[index]
}

const fallbackTourImage = '/images/tours/fallback-hero.svg'
const fallbackAvatar = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'

const onTourImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement | null
  if (!target) {
    return
  }
  if (target.src !== fallbackTourImage) {
    target.src = fallbackTourImage
  }
}

const onAvatarError = (event: Event): void => {
  const target = event.target as HTMLImageElement | null
  if (!target) {
    return
  }
  if (target.src !== fallbackAvatar) {
    target.src = fallbackAvatar
  }
}

watch(filteredDepartures, (list) => {
  if (list.length === 0) {
    selectedDepartureDate.value = ''
    return
  }
  if (!list.some((item) => item.date === selectedDepartureDate.value)) {
    const first = list[0]
    if (first) selectedDepartureDate.value = first.date
  }
}, { immediate: true })

watch(tour, () => {
  if (!tour.value) return
  openDays.value = tour.value.itinerary.map((_, index) => index === 0)
  galleryIndex.value = 0
}, { immediate: true })

useSeoMeta({
  title: tourData.value?.title ?? 'Тур',
  description: tourData.value?.description ?? '',
  ogTitle: `${tourData.value?.title ?? 'Тур'} | OMMA tour`,
  ogDescription: tourData.value?.shortDescription ?? '',
  ogImage: tourData.value?.heroImage ?? ''
})
</script>
