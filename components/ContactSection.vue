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
          <p><a :href="`tel:${settings.contactPhone.replace(/\\s+/g, '')}`" class="hover:text-cyan-200">{{ settings.contactPhone }}</a></p>
          <p><a :href="`mailto:${settings.contactEmail}`" class="hover:text-cyan-200">{{ settings.contactEmail }}</a></p>
          <p class="text-cyan-200">{{ settings.contactAddress }}</p>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <a
            href="https://t.me/omma_tour_support_bot"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-xl bg-white/20 px-3 py-2 text-xs font-bold"
          >
            Telegram
          </a>
          <a
            href="https://wa.me/998901234567"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-xl bg-white/20 px-3 py-2 text-xs font-bold"
          >
            WhatsApp
          </a>
          <a
            href="https://t.me/omma_tour_support_bot"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-xl border border-white/40 px-3 py-2 text-xs font-bold"
          >
            Онлайн-чат (Telegram Bot)
          </a>
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

    <div class="mx-auto mt-6 w-[min(1160px,92%)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
      <iframe
        :src="officeMapEmbedUrl"
        title="Карта офиса OMMA tour"
        class="h-80 w-full border-0"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
      />
      <div class="border-t border-slate-200 px-4 py-3">
        <a
          :href="officeMapOpenUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-brand hover:text-brand"
        >
          Открыть карту офиса
        </a>
      </div>
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
const config = useRuntimeConfig()
const googleMapsApiKey = String(config.public.googleMapsApiKey ?? '').trim()

const officeCoords = { lat: 41.3111, lng: 69.2797 } // Ташкент
const officeQuery = `${officeCoords.lat},${officeCoords.lng}`
const officeMapOpenUrl = computed(() => `https://www.google.com/maps?q=${officeQuery}`)
const officeMapEmbedUrl = computed(() =>
  googleMapsApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(googleMapsApiKey)}&q=${encodeURIComponent(officeQuery)}&zoom=14`
    : `https://www.google.com/maps?q=${encodeURIComponent(officeQuery)}&z=14&output=embed`
)
</script>
