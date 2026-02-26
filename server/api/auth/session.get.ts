import { getUserEmailFromSession } from '~/server/utils/userAuth'
import { readUsers } from '~/server/utils/userStore'

export default defineEventHandler(async (event) => {
  const email = getUserEmailFromSession(event)
  if (!email) {
    return { authenticated: false, user: null }
  }

  const users = await readUsers()
  const user = users.find((item) => item.email === email)
  if (!user) {
    return { authenticated: false, user: null }
  }

  return {
    authenticated: true,
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone ?? '',
      birthDate: user.birthDate ?? ''
    }
  }
})
