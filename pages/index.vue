<template>
  <div>
    <section class="relative overflow-hidden border-b border-slate-200 bg-slate-900 py-24 text-white">
      <video
        class="absolute inset-0 h-full w-full object-cover opacity-45"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        poster="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=80"
      >
        <source :src="heroVideoSrc" type="video/mp4">
        <source src="https://cdn.pixabay.com/video/2021/08/04/83816-585301901_large.mp4" type="video/mp4">
        <source src="https://cdn.coverr.co/videos/coverr-sea-waves-at-sunset-1579/1080p.mp4" type="video/mp4">
        <source src="https://player.vimeo.com/external/517827716.sd.mp4?s=03f44f527c88b7d8f7f35e59f6f530f0ecf6ed6e&profile_id=164&oauth2_token_id=57447761" type="video/mp4">
      </video>
      <div class="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-cyan-900/45" />
      <div class="relative mx-auto w-[min(1200px,92%)]">
        <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-200">{{ settings.brandMain }} {{ settings.brandSub }}</p>
        <h1 class="mt-3 max-w-[17ch] font-serif text-6xl leading-[0.92] md:text-7xl">Гарантированные туры с вылетом из Ташкента</h1>
        <p class="mt-5 max-w-3xl text-base text-slate-100 md:text-lg">
          Подберем маршрут под ваш бюджет и стиль отдыха. Фиксированные вылеты, поддержка 24/7 и прозрачные условия бронирования.
        </p>
        <div class="mt-8">
          <TourSearchBar @submit="handleSearch" />
        </div>
        <div class="mt-6 flex flex-wrap gap-3">
          <NuxtLink to="/tours" class="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-soft">Подобрать тур</NuxtLink>
          <NuxtLink to="/tours?restType=горящий" class="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white">Горящие туры</NuxtLink>
        </div>
        <div class="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article v-for="item in heroBenefits" :key="item.title" class="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm">
            <p class="font-bold">{{ item.icon }} {{ item.title }}</p>
            <p class="text-cyan-100">{{ item.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="border-b border-slate-200 bg-white py-16">
      <div class="mx-auto w-[min(1200px,92%)]">
        <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-rose-600">Спецпредложения</p>
            <h2 class="mt-2 font-serif text-5xl text-slate-900">Горящие туры</h2>
          </div>
          <div class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">
            До конца акции: {{ promoCountdown }}
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <TourCard v-for="tour in hotTours" :key="tour.id" :tour="tour" />
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
            <img :src="item.image" :alt="item.title" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" @error="onDestinationImageError">
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

    <section class="bg-slate-50 py-16">
      <div class="mx-auto w-[min(1200px,92%)]">
        <div class="mb-8 text-center">
          <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-700">Trust block</p>
          <h2 class="mt-2 font-serif text-5xl text-slate-900">Нам доверяют реальные туристы</h2>
          <p class="mt-3 text-slate-600">Отзывы, рейтинг, видео и документы компании в открытом доступе.</p>
        </div>
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article v-for="review in trustReviews" :key="review.id" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
            <div class="mb-3 flex items-center gap-3">
              <img :src="review.photo" :alt="review.author" class="h-12 w-12 rounded-full object-cover">
              <div>
                <p class="font-bold text-slate-900">{{ review.author }}</p>
                <p class="text-xs text-amber-500">★★★★★</p>
              </div>
            </div>
            <p class="text-sm text-slate-600">{{ review.text }}</p>
          </article>
        </div>
        <div class="mt-6 grid gap-4 lg:grid-cols-2">
          <div class="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-soft">
            <iframe
              class="h-72 w-full"
              src="https://www.youtube.com/embed/Scxs7L0vhZ4"
              title="Видео-отзыв туриста"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            />
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <article v-for="item in certificates" :key="item.title" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
              <img :src="item.image" :alt="item.title" class="h-36 w-full object-cover">
              <p class="px-3 py-2 text-sm font-semibold text-slate-700">{{ item.title }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white py-16">
      <div class="mx-auto w-[min(1200px,92%)]">
        <div class="mb-10 text-center">
          <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-700">Преимущества</p>
          <h2 class="mt-2 font-serif text-5xl text-blue-600">Почему мы</h2>
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

    <section class="pb-16">
      <div class="mx-auto w-[min(1200px,92%)] rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-950 to-slate-800 p-8 text-white">
        <h2 class="font-serif text-5xl">Нужна консультация перед бронированием?</h2>
        <p class="mt-3 text-slate-200">Оставьте номер, перезвоним и подберем 3 лучших варианта под ваш бюджет.</p>
        <form class="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]" @submit.prevent="submitCallback">
          <input v-model="callback.name" placeholder="Ваше имя" class="rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm outline-none">
          <input v-model="callback.phone" placeholder="+998 ..." class="rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm outline-none">
          <button class="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white">Заказать звонок</button>
        </form>
        <p class="mt-3 text-sm text-cyan-200">{{ callbackStatus }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { DestinationItem, SiteSettings, TourPackage, WhyUsItem } from '~/types/tour'

interface SearchPayload {
  destination: string
  month: string
  budget: string
  travelers: number
}

const { data: contentData } = await useSiteContent()
const heroVideoSrc = '/videos/283533.mp4'

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
const whyUs = computed<WhyUsItem[]>(() => contentData.value?.whyUs ?? [])

const featuredTours = computed(() => tours.value.slice(0, 3))
const hotTours = computed(() => {
  const matched = tours.value.filter((tour) => `${tour.badge} ${tour.title}`.toLowerCase().includes('горящ')).slice(0, 3)
  return matched.length > 0 ? matched : tours.value.slice(0, 3)
})

const heroBenefits = [
  { icon: '📅', title: 'Работаем с 2016 года', text: 'Стабильная экспертиза и проверенные маршруты.' },
  { icon: '🕐', title: 'Поддержка 24/7', text: 'На связи до, во время и после поездки.' },
  { icon: '⭐', title: '1000+ туристов', text: 'Реальные отзывы и повторные обращения.' },
  { icon: '🛡️', title: 'Лицензированный туроператор', text: 'Официальные договоры и прозрачные условия.' }
]

const trustReviews = [
  { id: 'r1', author: 'Мадина Х.', text: 'Все как обещали: перелет, отель и трансфер без сюрпризов.', photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80' },
  { id: 'r2', author: 'Азиз Б.', text: 'Сэкономили бюджет и дали 3 варианта отелей на выбор.', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
  { id: 'r3', author: 'Самира К.', text: 'С детьми все прошло спокойно, менеджер был на связи.', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { id: 'r4', author: 'Дилшод Р.', text: 'Быстро оформили документы и подобрали удобный вылет.', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: 'r5', author: 'Нилуфар Т.', text: 'Отель совпал с фото, сервис на отличном уровне.', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
  { id: 'r6', author: 'Шахзод М.', text: 'Бронь и оплата удобно через личный кабинет.', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80' }
]

const certificates = [
  { title: 'Лицензия туроператора', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Сертификат партнера авиалиний', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Сертификат качества сервиса', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Аккредитация международных отелей', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1200&q=80' }
]

const promoEndsAt = new Date()
promoEndsAt.setDate(promoEndsAt.getDate() + 3)
const promoCountdown = ref('')
const updateCountdown = (): void => {
  const diff = Math.max(0, promoEndsAt.getTime() - Date.now())
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  promoCountdown.value = `${days}д ${hours}ч ${minutes}м`
}
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  updateCountdown()
  timer = setInterval(updateCountdown, 60000)
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

const callback = reactive({ name: '', phone: '' })
const callbackStatus = ref('')

const submitCallback = async (): Promise<void> => {
  if (!callback.name || !callback.phone) {
    callbackStatus.value = 'Заполните имя и телефон.'
    return
  }
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: { name: callback.name, phone: callback.phone, destination: 'Заказать звонок' }
    })
    callbackStatus.value = 'Заявка отправлена. Перезвоним в ближайшее время.'
    callback.name = ''
    callback.phone = ''
  } catch {
    callbackStatus.value = 'Не удалось отправить заявку. Попробуйте позже.'
  }
}

const handleSearch = (payload: SearchPayload): void => {
  const query = new URLSearchParams()
  if (payload.destination) query.set('destination', payload.destination)
  if (payload.month) query.set('month', payload.month)
  if (payload.budget) query.set('budget', payload.budget)
  query.set('travelers', String(payload.travelers))
  void navigateTo(`/tours?${query.toString()}`)
}

const onDestinationImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement | null
  if (!target) {
    return
  }
  if (target.src !== '/images/tours/fallback-thumb.svg') {
    target.src = '/images/tours/fallback-thumb.svg'
  }
}

useSeoMeta({
  title: 'Главная',
  ogTitle: 'OMMA tour - премиальные туры',
  description: 'Гарантированные туры с вылетом из Ташкента: горящие предложения, отзывы, сертификаты и быстрый подбор.',
  ogDescription: 'Гарантированные туры с вылетом из Ташкента: горящие предложения, отзывы, сертификаты и быстрый подбор.'
})
</script>
