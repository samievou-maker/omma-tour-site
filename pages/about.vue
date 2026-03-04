<template>
  <div class="mx-auto w-[min(1200px,92%)] py-12">
    <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-700">О компании</p>
    <h1 class="mt-2 font-serif text-5xl text-slate-900">{{ settings.aboutTitle }}</h1>
    <p class="mt-4 max-w-3xl text-lg text-slate-600">{{ settings.aboutText }}</p>

    <section class="mt-8 grid gap-4 md:grid-cols-3">
      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <p class="text-xs font-bold uppercase tracking-[0.12em] text-cyan-700">Дата основания</p>
        <p class="mt-2 text-3xl font-extrabold text-slate-900">2016</p>
      </article>
      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <p class="text-xs font-bold uppercase tracking-[0.12em] text-cyan-700">Миссия</p>
        <p class="mt-2 text-sm text-slate-600">Делать путешествия безопасными, прозрачными и персональными для каждого клиента.</p>
      </article>
      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <p class="text-xs font-bold uppercase tracking-[0.12em] text-cyan-700">Ценности</p>
        <p class="mt-2 text-sm text-slate-600">Честность в цене, ответственность, оперативная поддержка и качество сервиса.</p>
      </article>
    </section>

    <section class="mt-8">
      <h2 class="font-serif text-4xl text-slate-900">История компании</h2>
      <div class="mt-4 grid gap-3 md:grid-cols-2">
        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <p class="text-sm text-slate-600">Начали как агентство индивидуальных туров в Ташкенте и сфокусировались на сервисе полного цикла.</p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <p class="text-sm text-slate-600">Сегодня сопровождаем клиентов от выбора маршрута до возвращения домой и ведем более 20 направлений.</p>
        </article>
      </div>
    </section>

    <section class="mt-10">
      <h2 class="font-serif text-4xl text-slate-900">Команда</h2>
      <div class="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article v-for="member in team" :key="member.name" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <img :src="member.photo" :alt="member.name" class="h-44 w-full object-cover" @error="onMemberImageError">
          <div class="p-4">
            <p class="font-bold text-slate-900">{{ member.name }}</p>
            <p class="text-sm text-slate-600">{{ member.role }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="mt-10">
      <h2 class="font-serif text-4xl text-slate-900">Партнеры</h2>
      <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <article v-for="partner in partners" :key="partner.name" class="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-soft">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">{{ partner.icon }}</div>
          <p class="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">{{ partner.name }}</p>
        </article>
      </div>
    </section>

    <section class="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div class="p-6">
        <h2 class="font-serif text-4xl text-slate-900">Офис в Ташкенте</h2>
        <p class="mt-2 text-slate-600">г. Ташкент, Мирабадский район, ул. Шахрисабз, 16А</p>
      </div>
      <iframe
        :src="officeMapEmbedUrl"
        title="Локация офиса в Ташкенте"
        class="h-72 w-full border-0"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
      />
      <div class="border-t border-slate-200 px-6 py-4">
        <a
          :href="officeMapOpenUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-brand hover:text-brand"
        >
          Открыть локацию в карте
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { SiteSettings } from '~/types/tour'

const { data } = await useSiteContent()
const config = useRuntimeConfig()
const googleMapsApiKey = String(config.public.googleMapsApiKey ?? '').trim()
const officeCoords = { lat: 41.3111, lng: 69.2797 }
const officeQuery = `${officeCoords.lat},${officeCoords.lng}`
const officeMapOpenUrl = computed(() => `https://www.google.com/maps?q=${officeQuery}`)
const officeMapEmbedUrl = computed(() =>
  googleMapsApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(googleMapsApiKey)}&q=${encodeURIComponent(officeQuery)}&zoom=14`
    : `https://www.google.com/maps?q=${encodeURIComponent(officeQuery)}&z=14&output=embed`
)

const fallbackSettings: SiteSettings = {
  brandMain: 'OMMA',
  brandSub: 'tour',
  heroTitle: '',
  heroSubtitle: '',
  heroImage: '',
  contactPhone: '',
  contactEmail: '',
  contactAddress: '',
  aboutTitle: 'О нас',
  aboutText: ''
}

const settings = computed(() => data.value?.settings ?? fallbackSettings)
const team = [
  { name: 'Мадина Азизова', role: 'Руководитель отдела продаж', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80' },
  { name: 'Шахзод Каримов', role: 'Travel-консультант', photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80' },
  { name: 'Самира Нурова', role: 'Визовый специалист', photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80' },
  { name: 'Ислом Рахимов', role: 'Куратор VIP-направлений', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' }
]
const partners = [
  { name: 'Turkish Airlines', icon: '✈️' },
  { name: 'Qatar Airways', icon: '🛫' },
  { name: 'Hilton Hotels', icon: '🏨' },
  { name: 'Rixos', icon: '🌴' },
  { name: 'Hyatt', icon: '🧳' }
]

const onMemberImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement | null
  if (!target) {
    return
  }
  target.src = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80'
}

useSeoMeta({
  title: 'О компании',
  description: 'История OMMA tour, команда, миссия и ключевые партнеры.'
})
</script>
