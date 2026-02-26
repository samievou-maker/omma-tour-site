import { clearUserSession } from '~/server/utils/userAuth'

export default defineEventHandler((event) => {
  clearUserSession(event)
  return { ok: true }
})
