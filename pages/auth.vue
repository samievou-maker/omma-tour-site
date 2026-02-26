<template>
  <div class="mx-auto w-[min(560px,92%)] py-14">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
      <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-700">Личный кабинет</p>
      <h1 class="mt-2 font-serif text-5xl text-slate-900">Вход в учетную запись</h1>
      <p class="mt-3 text-sm text-slate-600">Войдите в существующий аккаунт или создайте новый за 1 минуту.</p>

      <div class="mt-6 grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          class="rounded-lg px-3 py-2 text-sm font-bold transition"
          :class="mode === 'login' ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-600'"
          @click="mode = 'login'"
        >
          Вход
        </button>
        <button
          type="button"
          class="rounded-lg px-3 py-2 text-sm font-bold transition"
          :class="mode === 'register' ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-600'"
          @click="mode = 'register'"
        >
          Регистрация
        </button>
      </div>

      <form class="mt-5 space-y-3" @submit.prevent="submit">
        <label v-if="mode === 'register'" class="block text-sm font-semibold text-slate-700">
          Имя
          <input
            v-model="form.name"
            type="text"
            maxlength="60"
            class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            required
          >
        </label>

        <label class="block text-sm font-semibold text-slate-700">
          Email
          <input
            v-model="form.email"
            type="email"
            maxlength="120"
            class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            required
          >
        </label>

        <label class="block text-sm font-semibold text-slate-700">
          Пароль
          <input
            v-model="form.password"
            type="password"
            minlength="6"
            class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            required
          >
        </label>

        <button
          class="w-full rounded-xl bg-brand-dark px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-70"
          type="submit"
          :disabled="loading"
        >
          {{ loading ? 'Подождите...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться' }}
        </button>
      </form>

      <p class="mt-3 min-h-5 text-sm font-semibold" :class="statusOk ? 'text-emerald-700' : 'text-rose-700'">{{ statusMessage }}</p>

      <p v-if="mode === 'login'" class="mt-5 text-sm text-slate-600">
        У вас нет учетной записи?
        <button type="button" class="font-bold text-brand hover:text-brand-dark" @click="mode = 'register'">
          Зарегистрироваться
        </button>
      </p>
      <p v-else class="mt-5 text-sm text-slate-600">
        Уже есть учетная запись?
        <button type="button" class="font-bold text-brand hover:text-brand-dark" @click="mode = 'login'">
          Войти
        </button>
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
type Mode = 'login' | 'register'

const mode = ref<Mode>('login')
const loading = ref(false)
const statusMessage = ref('')
const statusOk = ref(true)

const form = reactive({
  name: '',
  email: '',
  password: ''
})

const extractErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error && 'data' in error) {
    const data = (error as { data?: { statusMessage?: string } }).data
    if (data?.statusMessage) {
      return data.statusMessage
    }
  }

  return error instanceof Error ? error.message : 'Ошибка авторизации.'
}

const submit = async (): Promise<void> => {
  loading.value = true
  statusMessage.value = ''

  try {
    if (mode.value === 'register') {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          name: form.name,
          email: form.email,
          password: form.password
        }
      })
    } else {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: form.email,
          password: form.password
        }
      })
    }

    await refreshNuxtData('auth-session')
    statusOk.value = true
    statusMessage.value = 'Успешно. Перенаправляем...'
    await navigateTo('/account')
  } catch (error) {
    statusOk.value = false
    statusMessage.value = extractErrorMessage(error)
  } finally {
    loading.value = false
  }
}

const { data: sessionData } = await useFetch<{
  authenticated: boolean
  user: { name: string; email: string } | null
}>('/api/auth/session', { key: 'auth-session' })

if (sessionData.value?.authenticated) {
  await navigateTo('/account')
}

useSeoMeta({
  title: 'Вход',
  description: 'Авторизация и регистрация пользователя OMMA tour.'
})
</script>
