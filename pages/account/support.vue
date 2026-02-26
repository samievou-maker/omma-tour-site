<template>
  <div class="mx-auto w-[min(1200px,92%)] py-12">
    <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
      <div class="border-b border-slate-200 bg-slate-950 px-6 py-8 text-white sm:px-8">
        <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-200">OMMA account</p>
        <h1 class="mt-2 font-serif text-5xl">Поддержка</h1>
        <p class="mt-2 text-sm text-slate-200">Получите помощь от менеджера по любому вопросу.</p>
      </div>

      <div class="px-6 py-4 sm:px-8">
        <AccountTabs />
      </div>

      <div class="grid gap-4 px-6 pb-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <article class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 class="text-2xl font-bold text-slate-900">Частые вопросы</h2>
          <ul class="mt-3 space-y-2 text-sm text-slate-700">
            <li class="rounded-xl border border-slate-200 bg-white px-3 py-2">Как изменить дату вылета после бронирования?</li>
            <li class="rounded-xl border border-slate-200 bg-white px-3 py-2">Можно ли добавить туриста в уже оформленный заказ?</li>
            <li class="rounded-xl border border-slate-200 bg-white px-3 py-2">Какие документы нужны для визы?</li>
          </ul>
        </article>

        <article class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 class="text-2xl font-bold text-slate-900">Связь с менеджером</h2>
          <p class="mt-2 text-sm text-slate-600">Выберите удобный канал и мы ответим в ближайшее время.</p>
          <div class="mt-4 grid gap-2">
            <a href="tel:+998901234567" class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900">
              Позвонить: +998 90 123 45 67
            </a>
            <a href="mailto:hello@ommatour.uz" class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900">
              Email: hello@ommatour.uz
            </a>
            <NuxtLink to="/contact" class="rounded-xl bg-brand-dark px-4 py-3 text-center text-sm font-bold text-white">
              Оставить заявку через форму
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth-user'
})

useSeoMeta({
  title: 'Кабинет: Поддержка',
  description: 'Поддержка пользователя и связь с менеджером.'
})
</script>
