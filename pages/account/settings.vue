<template>
  <div class="mx-auto w-[min(1200px,92%)] py-12">
    <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div class="border-b border-slate-200 bg-gradient-to-r from-slate-100 via-white to-cyan-50 px-6 py-8 text-slate-900 sm:px-8 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:text-white">
        <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-200">OMMA account</p>
        <h1 class="mt-2 font-serif text-5xl">Настройки</h1>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-200">Управление безопасностью и параметрами вашего аккаунта.</p>
      </div>

      <div class="px-6 py-4 sm:px-8">
        <AccountTabs />
      </div>

      <div class="grid gap-4 px-6 pb-8 sm:px-8 lg:grid-cols-2">
        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Профиль аккаунта</h2>
          <ul class="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"><strong>Имя:</strong> {{ session?.user?.name || '-' }}</li>
            <li class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"><strong>Email:</strong> {{ session?.user?.email || '-' }}</li>
            <li class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"><strong>Телефон:</strong> {{ session?.user?.phone || 'Не указан' }}</li>
          </ul>
          <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">Изменить личные данные можно во вкладке «Профиль».</p>
        </article>

        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Внешний вид</h2>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Выберите тему интерфейса.</p>
          <div class="mt-4 inline-flex rounded-xl border border-slate-300 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
            <button
              type="button"
              class="rounded-lg px-3 py-2 text-sm font-bold transition"
              :class="themeMode === 'light' ? 'bg-slate-900 text-white dark:bg-slate-700' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'"
              @click="setMode('light')"
            >
              Light mode
            </button>
            <button
              type="button"
              class="rounded-lg px-3 py-2 text-sm font-bold transition"
              :class="themeMode === 'dark' ? 'bg-slate-900 text-white dark:bg-slate-700' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'"
              @click="setMode('dark')"
            >
              Dark mode
            </button>
          </div>
        </article>

        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Безопасность</h2>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">Завершите текущую сессию на этом устройстве.</p>
          <button
            type="button"
            class="mt-4 inline-flex items-center rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700"
            @click="logoutUser"
          >
            Выйти из аккаунта
          </button>
          <p class="mt-3 min-h-5 text-sm font-semibold" :class="statusOk ? 'text-emerald-700' : 'text-rose-700'">{{ statusMessage }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
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
const { mode: themeMode, setMode } = useThemeMode()
const statusMessage = ref('')
const statusOk = ref(true)

const logoutUser = async (): Promise<void> => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await refreshNuxtData('auth-session')
    statusOk.value = true
    statusMessage.value = 'Сессия завершена. Перенаправляем...'
    await navigateTo('/auth')
  } catch {
    statusOk.value = false
    statusMessage.value = 'Не удалось выйти из аккаунта.'
  }
}

useSeoMeta({
  title: 'Кабинет: Настройки',
  description: 'Настройки и безопасность аккаунта пользователя.'
})
</script>
