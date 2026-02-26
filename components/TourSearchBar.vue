<template>
  <form
    class="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-[1.3fr_1fr_1fr_1fr_auto] md:items-end"
    @submit.prevent="onSubmit"
  >
    <label class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
      {{ t('where') }}
      <input
        v-model="form.destination"
        type="text"
        maxlength="60"
        placeholder="Турция, Бали, Дубай..."
        class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-brand-mint/40 focus:ring-2"
      >
    </label>

    <label class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
      {{ t('month') }}
      <select
        v-model="form.month"
        class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-brand-mint/40 focus:ring-2"
      >
        <option value="">{{ t('any') }}</option>
        <option value="Март">Март</option>
        <option value="Апрель">Апрель</option>
        <option value="Май">Май</option>
        <option value="Июнь">Июнь</option>
        <option value="Июль">Июль</option>
        <option value="Август">Август</option>
      </select>
    </label>

    <label class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
      {{ t('budget') }}
      <select
        v-model="form.budget"
        class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-brand-mint/40 focus:ring-2"
      >
        <option value="">{{ t('any') }}</option>
        <option value="до 700$">{{ t('from700') }}</option>
        <option value="700$ - 1000$">{{ t('from700to1000') }}</option>
        <option value="1000$+">{{ t('from1000') }}</option>
      </select>
    </label>

    <label class="block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
      {{ t('tourists') }}
      <select
        v-model.number="form.travelers"
        class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-brand-mint/40 focus:ring-2"
      >
        <option :value="1">1</option>
        <option :value="2">2</option>
        <option :value="3">3</option>
        <option :value="4">4+</option>
      </select>
    </label>

    <button
      type="submit"
      class="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
    >
      {{ t('findTour') }}
    </button>
  </form>
</template>

<script setup lang="ts">
interface SearchPayload {
  destination: string
  month: string
  budget: string
  travelers: number
}

const emit = defineEmits<{
  submit: [payload: SearchPayload]
}>()
const { t } = useSiteLanguage()

const form = reactive<SearchPayload>({
  destination: '',
  month: '',
  budget: '',
  travelers: 2
})

const onSubmit = (): void => {
  const payload: SearchPayload = {
    destination: form.destination.trim(),
    month: form.month,
    budget: form.budget,
    travelers: form.travelers
  }

  emit('submit', payload)
}
</script>
