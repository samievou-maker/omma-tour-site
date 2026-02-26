<template>
  <div class="mx-auto w-[min(1200px,92%)] py-12">
    <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-700">{{ t('aboutCompany') }}</p>
    <h1 class="mt-2 font-serif text-5xl text-slate-900">{{ settings.aboutTitle }}</h1>
    <p class="mt-4 max-w-3xl text-lg text-slate-600">{{ settings.aboutText }}</p>

    <section class="mt-8 grid gap-4 md:grid-cols-3">
      <article
        v-for="item in reviews"
        :key="item.id"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"
      >
        <p class="text-slate-600">«{{ item.text }}»</p>
        <p class="mt-3 text-sm font-bold text-brand-dark">{{ item.author }}</p>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ReviewItem, SiteSettings } from '~/types/tour'
const { t } = useSiteLanguage()

const { data } = await useSiteContent()

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
const reviews = computed<ReviewItem[]>(() => data.value?.reviews ?? [])

useSeoMeta({
  title: 'О нас',
  description: 'Информация о турфирме OMMA tour и отзывы клиентов.'
})
</script>
