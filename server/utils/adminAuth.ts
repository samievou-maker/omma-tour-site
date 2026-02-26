import { getCookie, setCookie } from 'h3'
import type { H3Event } from 'h3'

const COOKIE_NAME = 'omma_admin_session'

const signToken = (password: string, secret: string): string =>
  `${password}:${secret}`

export const isAdminSession = (event: H3Event): boolean => {
  const config = useRuntimeConfig(event)
  const cookieToken = getCookie(event, COOKIE_NAME)
  if (!cookieToken) {
    return false
  }

  const expectedToken = signToken(String(config.adminPassword), String(config.adminSessionSecret))
  return cookieToken === expectedToken
}

export const createAdminSession = (event: H3Event): void => {
  const config = useRuntimeConfig(event)
  const token = signToken(String(config.adminPassword), String(config.adminSessionSecret))

  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 8
  })
}

export const clearAdminSession = (event: H3Event): void => {
  setCookie(event, COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 0
  })
}
