<template>
  <div class="mx-auto w-[min(1200px,92%)] py-12">
    <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-700">{{ t('navNews') }}</p>
    <h1 class="mt-2 font-serif text-5xl text-slate-900">{{ t('newsTitle') }}</h1>

    <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="item in sortedNews"
        :key="item.id"
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft"
      >
        <img :src="item.image" :alt="item.title" class="h-48 w-full object-cover">
        <div class="p-4">
          <p class="text-xs font-bold uppercase tracking-[0.12em] text-cyan-700">{{ formatDate(item.publishedAt) }}</p>
          <h2 class="mt-2 text-xl font-bold text-slate-900">{{ item.title }}</h2>
          <p class="mt-2 text-sm text-slate-600">{{ item.excerpt }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NewsItem } from '~/types/tour'
const { t } = useSiteLanguage()

const { data } = await useSiteContent()
const sortedNews = computed<NewsItem[]>(() =>
  [...(data.value?.news ?? [])].sort((left, right) => (left.publishedAt < right.publishedAt ? 1 : -1))
)

const formatDate = (rawDate: string): string =>
  new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(rawDate))

useSeoMeta({
  title: 'Новости',
  description: 'Новости турфирмы OMMA tour.'
})
</script>
