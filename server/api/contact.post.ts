import { createError, getRequestIP, readBody } from 'h3'

interface ContactPayload {
  name: string
  phone: string
  destination?: string
  company?: string
}

interface RateBucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateBucket>()

const NAME_RE = /^[\p{L}\s'-]{2,60}$/u
const PHONE_RE = /^\+?[0-9()\s-]{9,24}$/
const DESTINATION_RE = /^[\p{L}0-9\s'.,:|$()~-]{2,140}$/u

const stripControlChars = (value: string): string =>
  [...value].filter((char) => {
    const code = char.charCodeAt(0)
    return !(code < 32 || code === 127)
  }).join('')

const clean = (value: string, maxLength: number): string =>
  stripControlChars(value.normalize('NFKC'))
    .replace(/[<>`]/g, '')
    .trim()
    .slice(0, maxLength)

const checkRateLimit = (ip: string, windowMs: number, maxRequests: number): boolean => {
  const now = Date.now()
  const bucket = buckets.get(ip)

  if (!bucket || bucket.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (bucket.count >= maxRequests) {
    return false
  }

  bucket.count += 1
  return true
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const windowMs = Number(config.rateLimitWindowMs) || 15000
  const maxRequests = Number(config.rateLimitMaxRequests) || 5

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (!checkRateLimit(ip, windowMs, maxRequests)) {
    throw createError({ statusCode: 429, statusMessage: 'Слишком много запросов. Попробуйте позже.' })
  }

  const body = await readBody<ContactPayload>(event)

  const name = clean(body.name ?? '', 60)
  const phone = clean(body.phone ?? '', 24)
  const destination = clean(body.destination ?? '', 140)
  const company = clean(body.company ?? '', 50)

  if (company !== '') {
    throw createError({ statusCode: 400, statusMessage: 'Ошибка валидации.' })
  }

  if (!NAME_RE.test(name)) {
    throw createError({ statusCode: 400, statusMessage: 'Некорректное имя.' })
  }

  if (!PHONE_RE.test(phone)) {
    throw createError({ statusCode: 400, statusMessage: 'Некорректный телефон.' })
  }

  if (destination !== '' && !DESTINATION_RE.test(destination)) {
    throw createError({ statusCode: 400, statusMessage: 'Некорректное направление.' })
  }

  console.warn('[contact-request]', {
    createdAt: new Date().toISOString(),
    ip,
    name,
    phone,
    destination
  })

  return {
    ok: true,
    message: 'Заявка принята'
  }
})
