<template>
  <article class="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1">
    <div class="relative h-52 w-full">
      <picture>
        <source :srcset="webpImage" type="image/webp">
        <img :src="tour.heroImage || fallbackImage" :alt="tour.title" class="h-full w-full object-cover" @error="onImageError">
      </picture>
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
      <span class="absolute left-3 top-3 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">{{ tour.badge }}</span>
      <p class="absolute bottom-3 left-3 text-xs font-bold uppercase tracking-[0.12em] text-white">{{ tour.country }} · {{ tour.city }}</p>
    </div>

    <div class="flex h-full flex-col p-5">
      <h3 class="clamp-2 min-h-14 text-2xl font-semibold text-slate-900">{{ tour.title }}</h3>
      <p class="mt-2 text-sm text-slate-600">{{ tour.shortDescription }}</p>

      <div class="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
        <p class="rounded-lg bg-slate-50 px-2 py-1.5">⏱ {{ tour.durationNights }} ночей</p>
        <p class="rounded-lg bg-slate-50 px-2 py-1.5">📅 {{ nextDepartureLabel }}</p>
      </div>

      <ul class="mt-3 h-[84px] list-disc space-y-1 overflow-hidden pl-5 text-sm text-slate-500">
        <li v-for="item in tour.features.slice(0, 2)" :key="item">{{ item }}</li>
      </ul>

      <div class="mt-auto pt-4">
        <strong class="block text-4xl font-extrabold leading-none text-brand">
          {{ t('from') }} {{ tour.priceFromUsd }}$
        </strong>

        <div class="mt-3 grid gap-2">
          <NuxtLink
            :to="`/tours/${tour.id}`"
            class="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800 transition hover:border-brand hover:text-brand"
          >
            Подробнее
          </NuxtLink>
          <NuxtLink
            :to="bookingLink"
            class="inline-flex items-center justify-center rounded-xl bg-brand-dark px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5"
          >
            Забронировать
          </NuxtLink>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-bold transition"
            :class="saved ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-300 text-slate-700 hover:border-brand hover:text-brand'"
            @click="toggle"
          >
            {{ saved ? 'Сохранено' : 'Сохранить' }}
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { TourPackage } from '~/types/tour'

const { t } = useSiteLanguage()
const { ensureLoaded, isSaved, toggleSaved } = useSavedTours()

const props = defineProps<{
  tour: TourPackage
}>()

onMounted(async () => {
  await ensureLoaded()
})

const saved = computed(() => isSaved(props.tour.id))

const nextDepartureLabel = computed(() => {
  const first = props.tour.departures[0]
  if (!first) {
    return 'По запросу'
  }
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit' }).format(new Date(first.date))
})

const bookingLink = computed(() => {
  const first = props.tour.departures[0]
  return {
    path: '/booking',
    query: {
      tour: props.tour.id,
      date: first?.date ?? '',
      adults: '2',
      children: '0',
      total: String((first?.priceFromUsd ?? props.tour.priceFromUsd) * 2)
    }
  }
})

const webpImage = computed(() => {
  if (props.tour.heroImage.includes('unsplash.com')) {
    return `${props.tour.heroImage}${props.tour.heroImage.includes('?') ? '&' : '?'}fm=webp`
  }
  if (props.tour.heroImage.includes('pexels.com')) {
    return `${props.tour.heroImage}${props.tour.heroImage.includes('?') ? '&' : '?'}fm=webp`
  }
  return props.tour.heroImage
})

const fallbackImage = '/images/tours/fallback-thumb.svg'

const onImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement | null
  if (!target) {
    return
  }
  if (target.src !== fallbackImage) {
    target.src = fallbackImage
  }
}

const toggle = async (): Promise<void> => {
  await toggleSaved(props.tour.id)
}
</script>

<style scoped>
.clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
