import { isAdminSession } from '~/server/utils/adminAuth'

export default defineEventHandler((event) => ({
  authenticated: isAdminSession(event)
}))
