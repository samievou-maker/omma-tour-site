export default defineNuxtRouteMiddleware(async () => {
  const session = await $fetch<{
    authenticated: boolean
    user: { name: string; email: string } | null
  }>('/api/auth/session')

  if (!session.authenticated) {
    return navigateTo('/auth')
  }
})
