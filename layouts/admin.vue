<template>
  <div data-admin-layout="true" class="min-h-screen w-screen max-w-none bg-slate-100 text-slate-900">
    <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div class="flex w-full items-center justify-between px-4 py-3">
        <NuxtLink to="/" class="inline-flex items-baseline gap-1">
          <span class="font-serif text-3xl font-bold leading-none text-slate-900">OMMA</span>
          <span class="text-xs font-extrabold uppercase tracking-[0.2em] text-brand">tour</span>
        </NuxtLink>
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">На сайт</NuxtLink>
          <span class="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white">Admin</span>
        </div>
      </div>
    </header>

    <main class="w-full max-w-none px-0 py-4">
      <slot />
    </main>
  </div>
</template>
