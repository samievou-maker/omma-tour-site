<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900 dark:from-slate-950 dark:to-slate-950 dark:text-slate-100">
    <AppHeader v-if="!isAdminRoute" />
    <main>
      <slot />
    </main>
    <footer
      v-if="!isAdminRoute"
      class="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950"
    >
      <div class="mx-auto w-[min(1200px,92%)] py-12">
        <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
          <div class="grid gap-6 md:grid-cols-[1.2fr_0.9fr_1fr] md:items-start">
            <section>
            <h3 class="text-xl font-extrabold text-slate-900 dark:text-slate-100">{{ footer.supportTitle }}</h3>
            <ul class="mt-4 space-y-2 text-base text-slate-700 dark:text-slate-300">
              <li>{{ footer.supportShortNumber }}</li>
              <li>{{ footer.supportPhone }}</li>
              <li>{{ footer.supportEmail }}</li>
            </ul>
            </section>

            <section>
            <div class="grid gap-1.5">
              <article
                v-for="item in currencyCards"
                :key="item.code"
                class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
              >
                <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ item.flag }} {{ item.code }}</p>
                <p class="text-sm font-extrabold text-slate-900 dark:text-slate-100">{{ item.value }}</p>
              </article>
            </div>
            </section>

            <section>
            <h3 class="text-xl font-extrabold text-slate-900 dark:text-slate-100">{{ footer.socialsTitle }}</h3>
            <div class="mt-4 flex flex-wrap gap-2">
              <a
                v-for="social in footer.socials"
                :key="social.id"
                :href="social.href"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-400 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
                :aria-label="social.label"
                :title="social.label"
              >
                <svg viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
                  <path :d="socialIconPath(social)" />
                </svg>
              </a>
            </div>
            </section>
          </div>
        </section>
      </div>

      <div class="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
        <div class="mx-auto w-[min(1200px,92%)] py-4 text-center text-sm text-slate-500 dark:text-slate-400">
          {{ footer.copyright }}
        </div>
      </div>
    </footer>

    <div v-if="!isAdminRoute" class="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      <button class="rounded-xl bg-brand-dark px-4 py-2 text-sm font-bold text-white shadow-soft" @click="openCallPopup = true">Заказать звонок</button>
      <a href="https://t.me/omma_tour_support_bot" target="_blank" rel="noopener noreferrer" class="rounded-xl bg-cyan-600 px-4 py-2 text-center text-sm font-bold text-white shadow-soft">
        Онлайн-чат
      </a>
    </div>

    <div v-if="openCallPopup" class="fixed inset-0 z-[90] grid place-items-center bg-slate-900/55 p-4">
      <div class="w-full max-w-md rounded-2xl bg-white p-5 shadow-soft dark:bg-slate-900">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-xl font-bold">Заказать звонок</h3>
          <button class="text-xl" @click="openCallPopup = false">×</button>
        </div>
        <form class="space-y-3" @submit.prevent="submitCallRequest">
          <input v-model="callForm.name" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Ваше имя">
          <input v-model="callForm.phone" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="+998 ...">
          <button class="w-full rounded-xl bg-brand-dark px-4 py-2 text-sm font-bold text-white">Отправить</button>
        </form>
        <p class="mt-2 text-sm font-semibold text-cyan-700">{{ callStatus }}</p>
      </div>
    </div>

    <div v-if="openSpecialPopup" class="fixed inset-0 z-[90] grid place-items-center bg-slate-900/55 p-4">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-2xl font-bold">Спецпредложение недели</h3>
          <button class="text-xl" @click="openSpecialPopup = false">×</button>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-300">Скидка 12% на направления Дубай, Бали и Мальдивы при бронировании до воскресенья.</p>
        <div class="mt-4 flex gap-2">
          <NuxtLink to="/tours?restType=горящий" class="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white" @click="openSpecialPopup = false">Смотреть туры</NuxtLink>
          <button class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700" @click="openSpecialPopup = false">Позже</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FooterSettings } from '~/types/tour'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const openCallPopup = ref(false)
const openSpecialPopup = ref(false)
const callForm = reactive({ name: '', phone: '' })
const callStatus = ref('')
type CurrencyCard = { code: string; value: string; flag: string }

const currencyCards = ref<CurrencyCard[]>([
  { code: 'USD', value: '1.0000', flag: '🇺🇸' },
  { code: 'EUR', value: '0.9200', flag: '🇪🇺' },
  { code: 'UZS', value: '12 600', flag: '🇺🇿' }
])

const fallbackFooter: FooterSettings = {
  supportTitle: 'Контакты и служба поддержки',
  supportShortNumber: 'Короткий номер: 1111',
  supportPhone: 'Телефон: (+998) 71 201-77-77',
  supportEmail: 'info@ommatour.uz',
  infoTitle: 'Информация',
  infoLinks: ['О компании', 'Вакансии', 'Адрес офиса'],
  mediaTitle: 'Медиа',
  mediaLinks: ['Новости', 'Архив акций', 'Стать агентом'],
  partnersTitle: 'Партнерам',
  partnersLinks: ['Агентствам', 'Договор', 'Общие положения', 'Визовые правила'],
  socialsTitle: 'Мы в социальных сетях',
  socials: [
    { id: 'facebook', label: 'Facebook', href: 'https://facebook.com' },
    { id: 'instagram', label: 'Instagram', href: 'https://instagram.com' },
    { id: 'telegram', label: 'Telegram', href: 'https://t.me' },
    { id: 'youtube', label: 'YouTube', href: 'https://youtube.com' }
  ],
  copyright: '© 2017 - 2026 Все права защищены OMMA tour'
}

const { data } = await useSiteContent()
const footer = computed(() => data.value?.footer ?? fallbackFooter)
const iconByKey: Record<string, string> = {
  facebook: 'M13.5 9H16V6h-2.5C10.5 6 9 7.7 9 10.6V13H6v3h3v6h3.4v-6h2.9l.5-3h-3.4v-2.1c0-1 .3-1.9 1.1-1.9Z',
  instagram:
    'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 2.3A1.7 1.7 0 0 0 5.3 7v10c0 .9.8 1.7 1.7 1.7h10c.9 0 1.7-.8 1.7-1.7V7c0-.9-.8-1.7-1.7-1.7H7Zm11.1 1.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Z',
  telegram: 'M21.6 4.6 3.8 11.4c-1.2.5-1.2 1.2-.2 1.5l4.6 1.5 1.8 5.6c.2.6.1.8.8.8.5 0 .7-.2 1-.5l2.2-2.1 4.7 3.5c.9.5 1.5.2 1.7-.8l3-14.2c.3-1.2-.4-1.7-1.3-1.3Z',
  youtube:
    'M21.6 8.3a3.2 3.2 0 0 0-2.2-2.2C17.4 5.5 12 5.5 12 5.5s-5.4 0-7.4.6A3.2 3.2 0 0 0 2.4 8.3 34 34 0 0 0 2 12a34 34 0 0 0 .4 3.7 3.2 3.2 0 0 0 2.2 2.2c2 .6 7.4.6 7.4.6s5.4 0 7.4-.6a3.2 3.2 0 0 0 2.2-2.2A34 34 0 0 0 22 12a34 34 0 0 0-.4-3.7ZM10 15.2V8.8L15.5 12 10 15.2Z'
}

const socialIconPath = (social: FooterSettings['socials'][number]): string => {
  const normalized = `${social.id} ${social.label}`.toLowerCase()
  const instagram = iconByKey.instagram ?? ''
  const telegram = iconByKey.telegram ?? instagram
  const facebook = iconByKey.facebook ?? instagram
  const youtube = iconByKey.youtube ?? instagram

  if (normalized.includes('insta')) return instagram
  if (normalized.includes('teleg')) return telegram
  if (normalized.includes('face')) return facebook
  if (normalized.includes('you')) return youtube

  return instagram
}

const submitCallRequest = async (): Promise<void> => {
  if (!callForm.name || !callForm.phone) {
    callStatus.value = 'Заполните имя и телефон.'
    return
  }
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: { name: callForm.name, phone: callForm.phone, destination: 'Заказать звонок (popup)' }
    })
    callStatus.value = 'Заявка отправлена.'
    callForm.name = ''
    callForm.phone = ''
  } catch {
    callStatus.value = 'Ошибка отправки.'
  }
}

const loadCurrencyRates = async (): Promise<void> => {
  try {
    const response = await $fetch<{
      base: string
      rates: { UZS: number; EUR: number; RUB: number; TRY: number; AED: number; GBP: number; JPY: number; CNY: number }
    }>('/api/currency')
    currencyCards.value = [
      { code: 'USD', value: '1.0000', flag: '🇺🇸' },
      { code: 'EUR', value: response.rates.EUR.toFixed(4), flag: '🇪🇺' },
      { code: 'UZS', value: new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(response.rates.UZS), flag: '🇺🇿' }
    ]
  } catch {
    currencyCards.value = [
      { code: 'USD', value: '1.0000', flag: '🇺🇸' },
      { code: 'EUR', value: '0.9200', flag: '🇪🇺' },
      { code: 'UZS', value: '12 600', flag: '🇺🇿' }
    ]
  }
}

let currencyInterval: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  setTimeout(() => {
    openSpecialPopup.value = true
  }, 3000)

  await loadCurrencyRates()
  currencyInterval = setInterval(() => {
    void loadCurrencyRates()
  }, 30000)
})

onBeforeUnmount(() => {
  if (currencyInterval) {
    clearInterval(currencyInterval)
    currencyInterval = null
  }
})
</script>
