<template>
  <div>
    <section class="relative overflow-hidden border-b border-slate-200 bg-slate-900 py-20 text-white">
      <img :src="settings.heroImage" alt="Главный баннер" class="hero-sea-image absolute inset-0 h-full w-full object-cover opacity-45">
      <div class="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/55 to-cyan-900/40" />
      <div class="hero-wave-overlay absolute inset-0" />

      <div data-hero-content class="relative mx-auto w-[min(1200px,92%)]">
        <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-200">{{ settings.brandMain }} {{ settings.brandSub }}</p>
        <h1 class="mt-3 max-w-[14ch] font-serif text-6xl leading-[0.92] md:text-7xl">{{ settings.heroTitle }}</h1>
        <p class="mt-5 max-w-2xl text-base text-slate-100 md:text-lg">{{ settings.heroSubtitle }}</p>

        <div class="mt-8">
          <TourSearchBar @submit="handleSearch" />
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <NuxtLink to="/tours" class="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-soft">{{ t('allTours') }}</NuxtLink>
          <NuxtLink to="/contact" class="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white">{{ t('leaveRequest') }}</NuxtLink>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="mx-auto w-[min(1200px,92%)]">
        <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-700">Направления</p>
            <h2 class="mt-2 font-serif text-5xl text-slate-900">Выберите место для следующей поездки</h2>
          </div>
          <NuxtLink to="/tours" class="text-sm font-bold text-brand-dark hover:text-brand">Смотреть все туры</NuxtLink>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <NuxtLink
            v-for="item in destinations"
            :key="item.id"
            :to="`/tours/${item.linkedTourId}`"
            class="group relative min-h-64 overflow-hidden rounded-3xl border border-slate-200 shadow-soft"
          >
            <img :src="item.image" :alt="item.title" class="h-full w-full object-cover transition duration-500 group-hover:scale-105">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/10 to-transparent" />
            <div class="absolute bottom-0 p-4 text-white">
              <h3 class="text-xl font-bold">{{ item.title }}</h3>
              <p class="text-sm text-slate-100">{{ item.tagline }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="border-y border-slate-200 bg-white py-16">
      <div class="mx-auto w-[min(1200px,92%)]">
        <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-700">Популярное</p>
            <h2 class="mt-2 font-serif text-5xl text-slate-900">Туры, которые выбирают чаще всего</h2>
          </div>
          <NuxtLink to="/tours" class="text-sm font-bold text-brand-dark hover:text-brand">Все туры</NuxtLink>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <TourCard v-for="tour in featuredTours" :key="tour.id" :tour="tour" />
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="mx-auto w-[min(1200px,92%)]">
        <div class="mb-5 flex items-end justify-between">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-700">Новости</p>
            <h2 class="mt-2 font-serif text-5xl text-slate-900">Актуальное от {{ settings.brandMain }} {{ settings.brandSub }}</h2>
          </div>
          <NuxtLink to="/news" class="text-sm font-bold text-brand-dark hover:text-brand">Все новости</NuxtLink>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <article v-for="item in latestNews" :key="item.id" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
            <img :src="item.image" :alt="item.title" class="h-40 w-full object-cover">
            <div class="p-4">
              <p class="text-xs font-bold uppercase tracking-[0.12em] text-cyan-700">{{ formatDate(item.publishedAt) }}</p>
              <h3 class="mt-2 text-lg font-bold text-slate-900">{{ item.title }}</h3>
              <p class="mt-2 text-sm text-slate-600">{{ item.excerpt }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="bg-white py-16">
      <div class="mx-auto w-[min(1200px,92%)]">
        <div class="mb-10 text-center">
          <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-700">Преимущества</p>
          <h2 class="mt-2 font-serif text-5xl text-blue-600">Почему мы</h2>
          <div class="mx-auto mt-3 h-1 w-24 rounded-full bg-blue-500" />
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="item in whyUs"
            :key="item.id"
            class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"
          >
            <div class="-mx-5 -mt-5 mb-4 h-1 rounded-t-2xl bg-blue-500" />
            <div class="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-600">
              {{ item.icon || '✦' }}
            </div>
            <h3 class="text-2xl font-bold text-slate-900">{{ item.title }}</h3>
            <p class="mt-2 text-base leading-relaxed text-slate-600">{{ item.description }}</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { DestinationItem, NewsItem, SiteSettings, TourPackage, WhyUsItem } from '~/types/tour'
const { t } = useSiteLanguage()

interface SearchPayload {
  destination: string
  month: string
  budget: string
  travelers: number
}

const { data: contentData } = await useSiteContent()

const fallbackSettings: SiteSettings = {
  brandMain: 'OMMA',
  brandSub: 'tour',
  heroTitle: 'Путешествия уровня luxury, доступные каждому',
  heroSubtitle: 'Подбор туров с полным сопровождением.',
  heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=80',
  contactPhone: '',
  contactEmail: '',
  contactAddress: '',
  aboutTitle: '',
  aboutText: ''
}

const settings = computed(() => contentData.value?.settings ?? fallbackSettings)
const tours = computed<TourPackage[]>(() => contentData.value?.tours ?? [])
const destinations = computed<DestinationItem[]>(() => contentData.value?.destinations ?? [])
const news = computed<NewsItem[]>(() => contentData.value?.news ?? [])
const whyUs = computed<WhyUsItem[]>(() => contentData.value?.whyUs ?? [])

const featuredTours = computed(() => tours.value.slice(0, 3))
const latestNews = computed(() =>
  [...news.value]
    .sort((left, right) => (left.publishedAt < right.publishedAt ? 1 : -1))
    .slice(0, 3)
)

const handleSearch = (payload: SearchPayload): void => {
  const query = new URLSearchParams()
  if (payload.destination) query.set('destination', payload.destination)
  if (payload.month) query.set('month', payload.month)
  if (payload.budget) query.set('budget', payload.budget)
  query.set('travelers', String(payload.travelers))

  void navigateTo(`/tours?${query.toString()}`)
}

const formatDate = (rawDate: string): string =>
  new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(rawDate))

onMounted(() => {
  const blocks = document.querySelectorAll('[data-hero-content]')
  if (blocks.length > 1) {
    blocks.forEach((block, index) => {
      if (index > 0) {
        block.remove()
      }
    })
  }
})

useSeoMeta({
  title: 'Главная',
  ogTitle: 'OMMA tour - премиальные туры',
  description:
    'Турфирма OMMA tour: поиск туров, направления с фото, персональный подбор и поддержка 24/7.',
  ogDescription:
    'Турфирма OMMA tour: поиск туров, направления с фото, персональный подбор и поддержка 24/7.'
})
</script>

<style scoped>
.hero-sea-image {
  transform-origin: center;
  will-change: transform, filter;
  animation: sea-pan 10s ease-in-out infinite alternate;
}

.hero-wave-overlay {
  background:
    radial-gradient(1200px 300px at 20% 110%, rgb(34 211 238 / 0.18), transparent 55%),
    radial-gradient(900px 260px at 80% 105%, rgb(56 189 248 / 0.16), transparent 55%);
  mix-blend-mode: screen;
  animation: wave-drift 8s ease-in-out infinite alternate;
}

@keyframes sea-pan {
  0% {
    transform: scale(1.07) translate3d(-1.5%, 0.4%, 0);
    filter: saturate(1) brightness(1);
  }

  100% {
    transform: scale(1.15) translate3d(1.4%, -1.8%, 0);
    filter: saturate(1.12) brightness(1.04);
  }
}

@keyframes wave-drift {
  0% {
    transform: translateX(-2%);
    opacity: 0.45;
  }

  100% {
    transform: translateX(2%);
    opacity: 0.75;
  }
}
</style>
