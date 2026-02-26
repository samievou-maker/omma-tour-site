export type CardType =
  | 'visa'
  | 'mastercard'
  | 'uzcard'
  | 'humo'
  | 'mir'
  | 'unionpay'
  | 'amex'
  | 'unknown'

interface CardPattern {
  type: CardType
  prefixes: RegExp[]
  lengths: number[]
  luhn: boolean
}

const CARD_PATTERNS: CardPattern[] = [
  { type: 'uzcard', prefixes: [/^8600/], lengths: [16], luhn: false },
  { type: 'humo', prefixes: [/^9860/], lengths: [16], luhn: false },
  { type: 'visa', prefixes: [/^4/], lengths: [13, 16, 19], luhn: true },
  { type: 'mastercard', prefixes: [/^5[1-5]/, /^2(2[2-9]|[3-6][0-9]|7[01]|720)/], lengths: [16], luhn: true },
  { type: 'mir', prefixes: [/^220[0-4]/], lengths: [16], luhn: true },
  { type: 'unionpay', prefixes: [/^62/], lengths: [16, 17, 18, 19], luhn: false },
  { type: 'amex', prefixes: [/^3[47]/], lengths: [15], luhn: true }
]

const digitsOnly = (value: string): string => value.replace(/\D/g, '')

export const detectCardType = (rawNumber: string): CardType => {
  const digits = digitsOnly(rawNumber)
  const detected = CARD_PATTERNS.find((pattern) => pattern.prefixes.some((prefix) => prefix.test(digits)))
  return detected?.type ?? 'unknown'
}

const isTrivialNumber = (digits: string): boolean => {
  if (/^(\d)\1+$/.test(digits)) {
    return true
  }

  if (digits.length >= 8) {
    let asc = true
    let desc = true
    for (let i = 1; i < digits.length; i += 1) {
      const prev = Number(digits[i - 1])
      const curr = Number(digits[i])
      if ((prev + 1) % 10 !== curr) {
        asc = false
      }
      if ((prev + 9) % 10 !== curr) {
        desc = false
      }
    }
    if (asc || desc) {
      return true
    }
  }

  return false
}

export const luhnCheck = (rawNumber: string): boolean => {
  const digits = digitsOnly(rawNumber)
  let checksum = 0
  let shouldDouble = false

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i])
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    checksum += digit
    shouldDouble = !shouldDouble
  }

  return checksum % 10 === 0
}

export const validateCard = (cardNumberRaw: string): { valid: boolean; type: CardType; normalized: string; reason?: string } => {
  const normalized = digitsOnly(cardNumberRaw)
  const type = detectCardType(normalized)
  if (type === 'unknown') {
    return { valid: false, type, normalized, reason: 'Не удалось определить тип карты.' }
  }

  const pattern = CARD_PATTERNS.find((item) => item.type === type)
  if (!pattern || !pattern.lengths.includes(normalized.length)) {
    return { valid: false, type, normalized, reason: 'Некорректная длина номера карты.' }
  }

  if (isTrivialNumber(normalized)) {
    return { valid: false, type, normalized, reason: 'Введите реальный номер карты.' }
  }

  if (pattern.luhn && !luhnCheck(normalized)) {
    return { valid: false, type, normalized, reason: 'Неверная контрольная сумма карты.' }
  }

  return { valid: true, type, normalized }
}

