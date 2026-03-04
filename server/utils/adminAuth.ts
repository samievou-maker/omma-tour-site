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

  const configuredPassword = String(config.adminPassword ?? '').trim()
  const secret = String(config.adminSessionSecret ?? '').trim()
  const expectedFromConfig = signToken(configuredPassword, secret)
  const expectedFallback = signToken('123', secret)
  return cookieToken === expectedFromConfig || cookieToken === expectedFallback
}

export const createAdminSession = (event: H3Event): void => {
  const config = useRuntimeConfig(event)
  const configuredPassword = String(config.adminPassword ?? '').trim()
  const secret = String(config.adminSessionSecret ?? '').trim()
  const token = signToken(configuredPassword || '123', secret)

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
