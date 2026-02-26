<template>
  <section id="contact" class="py-10">
    <div class="mx-auto grid w-[min(1160px,92%)] gap-6 rounded-3xl bg-gradient-to-br from-blue-900 to-cyan-700 p-8 text-white shadow-soft md:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-100">{{ t('contacts') }}</p>
        <h2 class="mt-2 font-serif text-5xl leading-tight">{{ t('contactUs') }}</h2>
        <p class="mt-3 max-w-xl text-cyan-50/90">
          {{ t('contactSubtitle') }}
        </p>
        <div class="mt-4 space-y-1 font-semibold">
          <p>{{ settings.contactPhone }}</p>
          <p>{{ settings.contactEmail }}</p>
          <p class="text-cyan-200">{{ settings.contactAddress }}</p>
        </div>
      </div>

      <form class="rounded-2xl border border-white/30 bg-white/15 p-5" novalidate @submit.prevent="submit">
        <label class="mb-3 block text-sm font-semibold">
          Ваше имя
          <input
            v-model="state.name"
            class="mt-1 w-full rounded-xl border border-white/50 bg-white px-3 py-2 text-slate-900 outline-none ring-brand-mint/40 focus:ring-2"
            name="name"
            maxlength="60"
            autocomplete="name"
            required
          >
        </label>

        <label class="mb-3 block text-sm font-semibold">
          Телефон
          <input
            v-model="state.phone"
            class="mt-1 w-full rounded-xl border border-white/50 bg-white px-3 py-2 text-slate-900 outline-none ring-brand-mint/40 focus:ring-2"
            name="phone"
            maxlength="24"
            autocomplete="tel"
            required
          >
        </label>

        <label class="mb-3 block text-sm font-semibold">
          Куда хотите поехать
          <input
            v-model="state.destination"
            class="mt-1 w-full rounded-xl border border-white/50 bg-white px-3 py-2 text-slate-900 outline-none ring-brand-mint/40 focus:ring-2"
            name="destination"
            maxlength="140"
          >
        </label>

        <label class="sr-only" aria-hidden="true">
          Не заполняйте это поле
          <input v-model="state.company" name="company" tabindex="-1" autocomplete="off">
        </label>

        <button
          class="w-full rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          :disabled="loading"
        >
          {{ loading ? '...' : t('leaveRequest') }}
        </button>

        <p class="mt-3 min-h-5 text-sm font-semibold text-cyan-100" aria-live="polite">{{ statusMessage }}</p>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { SiteSettings } from '~/types/tour'
const { t } = useSiteLanguage()

const { state, loading, statusMessage, submit } = useContactForm()

const fallbackSettings: SiteSettings = {
  brandMain: 'OMMA',
  brandSub: 'tour',
  heroTitle: '',
  heroSubtitle: '',
  heroImage: '',
  contactPhone: '+998 90 123 45 67',
  contactEmail: 'hello@ommatour.uz',
  contactAddress: 'Ташкент, Узбекистан',
  aboutTitle: '',
  aboutText: ''
}

const { data } = await useSiteContent()
const settings = computed(() => data.value?.settings ?? fallbackSettings)
</script>
