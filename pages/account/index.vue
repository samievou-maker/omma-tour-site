<template>
  <div class="mx-auto w-[min(1200px,92%)] py-12">
    <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
      <div class="relative border-b border-slate-200 bg-slate-950 px-6 py-8 text-white sm:px-8">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.35),transparent_45%)]" />
        <div class="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-200">OMMA account</p>
            <h1 class="mt-2 font-serif text-5xl">Здравствуйте, {{ profile.name }}</h1>
            <p class="mt-2 text-sm text-slate-200">Управляйте личной информацией и быстрыми действиями из одного кабинета.</p>
          </div>
        </div>
      </div>

      <div class="px-6 py-4 sm:px-8">
        <AccountTabs />
      </div>

      <div class="grid gap-6 px-6 pb-8 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section class="rounded-2xl border border-slate-200 bg-white p-5">
          <div class="mb-4 flex items-center justify-between gap-3">
            <h2 class="text-3xl font-bold text-slate-900">Личная информация</h2>
            <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Аккаунт активен</span>
          </div>

          <form class="grid gap-3 md:grid-cols-2" @submit.prevent="saveProfile">
            <label class="text-sm font-semibold text-slate-700">
              Полное имя
              <input v-model="profile.name" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" required>
            </label>

            <label class="text-sm font-semibold text-slate-700">
              Email
              <input v-model="profile.email" type="email" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" required>
            </label>

            <label class="text-sm font-semibold text-slate-700">
              Телефон
              <input v-model="profile.phone" type="tel" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="+998 90 123 45 67">
            </label>

            <label class="text-sm font-semibold text-slate-700">
              Дата рождения
              <input v-model="profile.birthDate" type="date" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
            </label>

            <div class="md:col-span-2 flex flex-wrap items-center gap-2 pt-1">
              <button
                type="submit"
                class="rounded-xl bg-brand-dark px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-70"
                :disabled="saving"
              >
                {{ saving ? 'Сохраняем...' : 'Сохранить изменения' }}
              </button>
              <p class="text-sm font-semibold" :class="saveOk ? 'text-emerald-700' : 'text-rose-700'">{{ saveMessage }}</p>
            </div>
          </form>
        </section>

        <div class="space-y-4">
          <section class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p class="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Быстрые действия</p>
            <div class="mt-3 grid gap-2">
              <NuxtLink to="/tours" class="rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-soft">Подобрать новый тур</NuxtLink>
              <NuxtLink to="/news" class="rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-soft">Посмотреть новости</NuxtLink>
              <NuxtLink to="/contact" class="rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-soft">Связаться с менеджером</NuxtLink>
            </div>
          </section>

          <section class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p class="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">Контакты сервиса</p>
            <ul class="mt-3 space-y-2 text-sm text-slate-700">
              <li><strong>Телефон:</strong> {{ settings.contactPhone }}</li>
              <li><strong>Email:</strong> {{ settings.contactEmail }}</li>
              <li><strong>Адрес:</strong> {{ settings.contactAddress }}</li>
            </ul>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { SiteSettings } from '~/types/tour'

definePageMeta({
  middleware: 'auth-user'
})

const { data: sessionData } = await useFetch<{
  authenticated: boolean
  user: { name: string; email: string; phone?: string; birthDate?: string } | null
}>('/api/auth/session', {
  key: 'auth-session'
})

const session = computed(() => sessionData.value)

const { data: contentData } = await useSiteContent()
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
const settings = computed(() => contentData.value?.settings ?? fallbackSettings)

const profile = reactive({
  name: '',
  email: '',
  phone: '',
  birthDate: ''
})

watch(
  () => session.value?.user,
  (user) => {
    profile.name = user?.name ?? ''
    profile.email = user?.email ?? ''
    profile.phone = user?.phone ?? ''
    profile.birthDate = user?.birthDate ?? ''
  },
  { immediate: true }
)

const saving = ref(false)
const saveMessage = ref('')
const saveOk = ref(true)

const saveProfile = async (): Promise<void> => {
  saving.value = true
  saveMessage.value = ''

  try {
    await $fetch('/api/auth/profile', {
      method: 'PUT',
      body: {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        birthDate: profile.birthDate
      }
    })

    await refreshNuxtData('auth-session')
    saveOk.value = true
    saveMessage.value = 'Изменения сохранены.'
  } catch (error) {
    saveOk.value = false
    saveMessage.value = error instanceof Error ? error.message : 'Не удалось сохранить профиль.'
  } finally {
    saving.value = false
  }
}

useSeoMeta({
  title: 'Личный кабинет',
  description: 'Персональный кабинет пользователя OMMA tour.'
})
</script>
