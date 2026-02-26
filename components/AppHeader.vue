<template>
  <header class="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/90">
    <div class="mx-auto flex w-[min(1160px,92%)] items-center justify-between py-4">
      <NuxtLink to="/" class="inline-flex items-baseline gap-1">
        <span class="font-serif text-4xl font-bold leading-none text-slate-900">{{ settings.brandMain }}</span>
        <span class="text-xs font-extrabold uppercase tracking-[0.2em] text-brand">{{ settings.brandSub }}</span>
      </NuxtLink>

      <button
        class="inline-flex rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        type="button"
        :aria-expanded="menuOpened"
        aria-controls="main-nav"
        @click="menuOpened = !menuOpened"
      >
        {{ t('menu') }}
      </button>

      <nav
        id="main-nav"
        class="absolute right-4 top-16 hidden w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-soft md:static md:block md:w-auto md:border-0 md:bg-transparent md:p-0 md:shadow-none dark:border-slate-700 dark:bg-slate-900/95"
        :class="{ '!block': menuOpened }"
      >
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
          <ul class="flex flex-col gap-3 text-sm font-semibold text-slate-900 md:flex-row md:items-center md:gap-7 dark:text-slate-100">
            <li><NuxtLink to="/" @click="closeMenu">{{ t('navHome') }}</NuxtLink></li>
            <li><NuxtLink to="/tours" @click="closeMenu">{{ t('navTours') }}</NuxtLink></li>
            <li><NuxtLink to="/news" @click="closeMenu">{{ t('navNews') }}</NuxtLink></li>
            <li><NuxtLink to="/about" @click="closeMenu">{{ t('navAbout') }}</NuxtLink></li>
            <li><NuxtLink to="/contact" @click="closeMenu">{{ t('navContact') }}</NuxtLink></li>
          </ul>

          <NuxtLink
            v-if="!authSession?.authenticated"
            to="/auth"
            class="text-sm font-bold text-slate-800 hover:text-brand-dark dark:text-slate-100 dark:hover:text-cyan-300"
            @click="closeMenu"
          >
            {{ t('authLogin') }}
          </NuxtLink>

          <div v-else class="flex items-center gap-2">
            <NuxtLink
              to="/account"
              class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
              @click="closeMenu"
            >
              <svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
                <path
                  class="fill-current"
                  d="M12 12c2.76 0 5-2.24 5-5S14.76 2 12 2S7 4.24 7 7s2.24 5 5 5Zm0 2c-3.87 0-7 2.24-7 5v1h14v-1c0-2.76-3.13-5-7-5Z"
                />
              </svg>
              <span>{{ t('myProfile') }}</span>
            </NuxtLink>
          </div>

          <div class="relative md:ml-2 md:pl-1">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg bg-transparent px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100/70 dark:text-slate-100 dark:hover:bg-slate-800"
              :aria-expanded="languageMenuOpen"
              @click="languageMenuOpen = !languageMenuOpen"
            >
              <svg viewBox="0 0 24 24" class="h-4 w-4 text-slate-700 dark:text-slate-300" aria-hidden="true">
                <path
                  class="fill-current"
                  d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm7.9 9h-3.1a16.8 16.8 0 0 0-1.3-6 8.1 8.1 0 0 1 4.4 6ZM12 4.1c.9 1.2 2 3.5 2.4 6.9H9.6c.4-3.4 1.5-5.7 2.4-6.9ZM4.1 13h3.1a16.8 16.8 0 0 0 1.3 6 8.1 8.1 0 0 1-4.4-6Zm3.1-2H4.1a8.1 8.1 0 0 1 4.4-6 16.8 16.8 0 0 0-1.3 6Zm4.8 8.9c-.9-1.2-2-3.5-2.4-6.9h4.8c-.4 3.4-1.5 5.7-2.4 6.9Zm3.5-.9a16.8 16.8 0 0 0 1.3-6h3.1a8.1 8.1 0 0 1-4.4 6Z"
                />
              </svg>
              <span>{{ currentLanguageLabel }}</span>
              <span class="text-[10px] text-slate-500 dark:text-slate-400">▼</span>
            </button>

            <div
              v-if="languageMenuOpen"
              class="absolute right-0 z-20 mt-2 min-w-[88px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-soft dark:border-slate-700 dark:bg-slate-900"
            >
              <button
                v-for="option in languageOptions"
                :key="option.code"
                type="button"
                class="block w-full rounded-lg px-2 py-1.5 text-left text-xs font-bold transition"
                :class="language === option.code ? 'bg-slate-900 text-white dark:bg-slate-700' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'"
                @click="changeLanguage(option.code)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <NuxtLink to="/contact" class="hidden rounded-xl bg-brand-dark px-4 py-2 text-sm font-bold text-white shadow-soft md:inline-block dark:bg-cyan-700 dark:hover:bg-cyan-600">
        {{ t('leaveRequest') }}
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { SiteSettings } from '~/types/tour'
import type { SiteLanguage } from '~/composables/useSiteLanguage'

const menuOpened = ref(false)

const closeMenu = (): void => {
  menuOpened.value = false
}

const { language, setLanguage, t } = useSiteLanguage()
const languageMenuOpen = ref(false)

const languageOptions: Array<{ code: SiteLanguage; label: string }> = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'oz', label: 'OZ' }
]

const currentLanguageLabel = computed(() => language.value.toUpperCase())

const changeLanguage = (next: SiteLanguage): void => {
  setLanguage(next)
  languageMenuOpen.value = false
}

const fallbackSettings: SiteSettings = {
  brandMain: 'OMMA',
  brandSub: 'tour',
  heroTitle: '',
  heroSubtitle: '',
  heroImage: '',
  contactPhone: '',
  contactEmail: '',
  contactAddress: '',
  aboutTitle: '',
  aboutText: ''
}

const { data } = await useSiteContent()
const settings = computed(() => data.value?.settings ?? fallbackSettings)

const { data: authSessionData } = await useFetch<{
  authenticated: boolean
  user: { name: string; email: string } | null
}>('/api/auth/session', {
  key: 'auth-session'
})

const authSession = computed(() => authSessionData.value)
</script>
