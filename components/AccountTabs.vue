<template>
  <div class="grid gap-2 rounded-2xl bg-slate-100 p-1 md:grid-cols-5">
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.to"
      :to="tab.to"
      class="rounded-xl px-3 py-2 text-center text-sm font-semibold transition"
      :class="isActive(tab.to) ? 'bg-white font-bold text-slate-900 shadow-soft' : 'text-slate-500 hover:bg-white/70'"
    >
      {{ tab.label }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { t } = useSiteLanguage()

const tabs = computed(() => [
  { to: '/account', label: t('accountProfile') },
  { to: '/account/trips', label: t('accountTrips') },
  { to: '/account/payments', label: t('accountPayments') },
  { to: '/account/support', label: t('accountSupport') },
  { to: '/account/settings', label: t('accountSettings') }
])

const isActive = (path: string): boolean => route.path === path
</script>
