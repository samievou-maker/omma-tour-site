<template>
  <article class="rounded-xl2 flex h-full w-full flex-col border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1">
    <div class="mb-3 flex items-start justify-between gap-2">
      <h3 class="clamp-2 h-14 text-xl font-semibold text-slate-900">{{ tour.title }}</h3>
      <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">{{ tour.badge }}</span>
    </div>
    <p class="clamp-2 h-[52px] text-sm text-slate-600">{{ tour.shortDescription }}</p>
    <ul class="mt-3 h-[108px] list-disc space-y-1 overflow-hidden pl-5 text-sm text-slate-500">
      <li v-for="item in tour.features.slice(0, 3)" :key="item">{{ item }}</li>
    </ul>

    <div class="mt-auto pt-5">
      <strong class="block text-4xl font-extrabold leading-none text-brand">
        {{ t('from') }} {{ tour.priceFromUsd }}$
      </strong>

      <div class="mt-3 flex items-center justify-between gap-3">
        <NuxtLink
          :to="`/tours/${tour.id}`"
          class="shrink-0 text-sm font-semibold text-brand-dark hover:text-brand"
        >
          {{ t('details') }}
        </NuxtLink>

        <button
          type="button"
          class="inline-flex min-w-[132px] items-center justify-center rounded-xl border px-4 py-2 text-sm font-bold transition"
          :class="saved ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-300 text-slate-700 hover:border-brand hover:text-brand'"
          @click="toggle"
        >
          {{ saved ? 'Сохранено' : 'Сохранить' }}
        </button>
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
