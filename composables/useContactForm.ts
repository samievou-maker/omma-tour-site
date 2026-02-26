export interface ContactFormState {
  name: string
  phone: string
  destination: string
  company: string
}

const NAME_RE = /^[\p{L}\s'-]{2,60}$/u
const PHONE_RE = /^\+?[0-9()\s-]{9,24}$/
const DESTINATION_RE = /^[\p{L}0-9\s'.,:|$()~-]{2,140}$/u

const stripControlChars = (value: string): string =>
  [...value].filter((char) => {
    const code = char.charCodeAt(0)
    return !(code < 32 || code === 127)
  }).join('')

const sanitize = (value: string, maxLength: number): string =>
  stripControlChars(value.normalize('NFKC'))
    .replace(/[<>`]/g, '')
    .trim()
    .slice(0, maxLength)

export const useContactForm = () => {
  const route = useRoute()

  const state = reactive<ContactFormState>({
    name: '',
    phone: '',
    destination: '',
    company: ''
  })

  const loading = ref(false)
  const statusMessage = ref('')
  const lastAutoFill = ref('')

  const toInt = (value: unknown, fallbackValue: number): number => {
    const parsed = Number.parseInt(String(value ?? ''), 10)
    return Number.isNaN(parsed) ? fallbackValue : parsed
  }

  const applyBookingFromQuery = async (): Promise<void> => {
    const tourId = String(route.query.tour ?? '').trim()
    if (tourId === '') {
      return
    }

    let tourTitle = 'Выбранный тур'
    try {
      const selectedTour = await $fetch<{ title?: string }>(`/api/tours/${tourId}`)
      if (selectedTour?.title) {
        tourTitle = selectedTour.title
      }
    } catch {
      tourTitle = 'Выбранный тур'
    }
    const date = String(route.query.date ?? '').trim()
    const adults = Math.max(1, toInt(route.query.adults, 2))
    const children = Math.max(0, toInt(route.query.children, 0))
    const total = Math.max(0, toInt(route.query.total, 0))

    const details: string[] = [tourTitle]
    if (date !== '') details.push(`вылет ${date}`)
    details.push(`${adults} взр., ${children} дет.`)
    if (total > 0) details.push(`сумма ~${total}$`)

    const autoValue = details.join(' | ')
    if (state.destination === '' || state.destination === lastAutoFill.value) {
      state.destination = autoValue
      lastAutoFill.value = autoValue
    }
  }

  const validate = (): boolean => {
    const cleanName = sanitize(state.name, 60)
    const cleanPhone = sanitize(state.phone, 24)
    const cleanDestination = sanitize(state.destination, 140)

    state.name = cleanName
    state.phone = cleanPhone
    state.destination = cleanDestination

    if (state.company.trim() !== '') {
      statusMessage.value = 'Ошибка отправки. Попробуйте позже.'
      return false
    }

    if (!NAME_RE.test(state.name)) {
      statusMessage.value = 'Введите корректное имя (2-60 символов).'
      return false
    }

    if (!PHONE_RE.test(state.phone)) {
      statusMessage.value = 'Введите корректный номер телефона.'
      return false
    }

    if (state.destination !== '' && !DESTINATION_RE.test(state.destination)) {
      statusMessage.value = 'Проверьте поле направления.'
      return false
    }

    return true
  }

  const submit = async (): Promise<void> => {
    statusMessage.value = ''

    if (!validate() || loading.value) {
      return
    }

    loading.value = true

    try {
      await $fetch('/api/contact', {
        method: 'POST',
        body: {
          name: state.name,
          phone: state.phone,
          destination: state.destination,
          company: state.company
        }
      })
      statusMessage.value = 'Спасибо! Мы скоро с вами свяжемся.'
      state.name = ''
      state.phone = ''
      state.destination = ''
      state.company = ''
    } catch (error) {
      statusMessage.value =
        error instanceof Error ? error.message : 'Не удалось отправить заявку. Повторите позже.'
    } finally {
      loading.value = false
    }
  }

  watch(
    () => route.query,
    () => {
      void applyBookingFromQuery()
    },
    { immediate: true }
  )

  return { state, loading, statusMessage, submit }
}
