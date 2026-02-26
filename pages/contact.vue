<template>
  <div class="py-10">
    <div class="mx-auto mb-4 w-[min(1160px,92%)]">
      <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-700">{{ t('contacts') }}</p>
      <h1 class="mt-2 font-serif text-5xl text-slate-900">{{ t('contactUs') }}</h1>
      <p class="mt-3 text-slate-600">{{ t('contactSubtitle') }}</p>
    </div>
    <ContactSection />
  </div>
</template>

<script setup lang="ts">
const { t } = useSiteLanguage()

useSeoMeta({
  title: 'Контакты',
  description: 'Контакты и форма заявки OMMA tour.'
})
</script>
