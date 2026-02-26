import { getCookie, setCookie } from 'h3'
import type { H3Event } from 'h3'

const COOKIE_NAME = 'omma_user_session'

export const normalizeEmail = (value: string): string => value.trim().toLowerCase()

const hashString = (input: string): string => {
  let hashA = 2166136261
  let hashB = 16777619

  for (let index = 0; index < input.length; index += 1) {
    const code = input.charCodeAt(index)
    hashA ^= code
    hashA = Math.imul(hashA, 16777619)
    hashB ^= code + index
    hashB = Math.imul(hashB, 2246822519)
  }

  return `${(hashA >>> 0).toString(16)}${(hashB >>> 0).toString(16)}`
}

const secureEqual = (left: string, right: string): boolean => {
  if (left.length !== right.length) {
    return false
  }

  let diff = 0
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }

  return diff === 0
}

export const hashPassword = (password: string): string => {
  const salt = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`
  const derived = hashString(`${salt}:${password}`)
  return `${salt}:${derived}`
}

export const verifyPassword = (password: string, storedHash: string): boolean => {
  const [salt, stored] = storedHash.split(':')
  if (!salt || !stored) {
    return false
  }

  const candidate = hashString(`${salt}:${password}`)
  return secureEqual(candidate, stored)
}

const signPayload = (payload: string, secret: string): string => hashString(`${payload}|${secret}`)

const buildToken = (email: string, expiresAt: number, secret: string): string => {
  const payload = `${email}|${expiresAt}`
  const signature = signPayload(payload, secret)
  return `${encodeURIComponent(payload)}.${signature}`
}

const splitToken = (token: string): { payloadEncoded: string; signature: string } | null => {
  const separatorIndex = token.lastIndexOf('.')
  if (separatorIndex <= 0 || separatorIndex >= token.length - 1) {
    return null
  }

  const payloadEncoded = token.slice(0, separatorIndex)
  const signature = token.slice(separatorIndex + 1)
  return { payloadEncoded, signature }
}

const parseToken = (payloadEncoded: string): { payload: string; email: string; expiresAt: number } | null => {
  let payload = ''
  try {
    payload = decodeURIComponent(payloadEncoded)
  } catch {
    return null
  }

  const [email, expiresRaw] = payload.split('|')
  const expiresAt = Number(expiresRaw)
  if (!email || !Number.isFinite(expiresAt)) {
    return null
  }

  return { payload, email, expiresAt }
}

export const createUserSession = (event: H3Event, email: string): void => {
  const config = useRuntimeConfig(event)
  const secret = String(config.userSessionSecret)
  const maxAgeSeconds = 60 * 60 * 24 * 7
  const expiresAt = Date.now() + maxAgeSeconds * 1000
  const token = buildToken(email, expiresAt, secret)

  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: maxAgeSeconds
  })
}

export const clearUserSession = (event: H3Event): void => {
  setCookie(event, COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 0
  })
}

export const getUserEmailFromSession = (event: H3Event): string | null => {
  const token = getCookie(event, COOKIE_NAME)
  if (!token) {
    return null
  }

  const split = splitToken(token)
  if (!split) {
    return null
  }

  const parsed = parseToken(split.payloadEncoded)
  if (!parsed) {
    return null
  }

  if (parsed.expiresAt < Date.now()) {
    return null
  }

  const config = useRuntimeConfig(event)
  const secret = String(config.userSessionSecret)
  const expectedSignature = signPayload(parsed.payload, secret)
  if (!secureEqual(split.signature, expectedSignature)) {
    return null
  }

  return parsed.email
}
