export default defineEventHandler(async () => {
  const fallback = {
    USD: 1,
    UZS: 12600,
    EUR: 0.92,
    RUB: 92,
    TRY: 32,
    AED: 3.67,
    GBP: 0.79,
    JPY: 151.4,
    CNY: 7.2
  }

  try {
    const response = await $fetch<{ rates?: Record<string, number> }>('https://open.er-api.com/v6/latest/USD')
    const rates = response?.rates
    if (rates) {
      const normalize = (code: keyof typeof fallback): number => {
        const value = rates[code]
        return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback[code]
      }

      return {
        base: 'USD',
        rates: {
          USD: 1,
          UZS: Math.round(normalize('UZS')),
          EUR: Number(normalize('EUR').toFixed(4)),
          RUB: Number(normalize('RUB').toFixed(4)),
          TRY: Number(normalize('TRY').toFixed(4)),
          AED: Number(normalize('AED').toFixed(4)),
          GBP: Number(normalize('GBP').toFixed(4)),
          JPY: Number(normalize('JPY').toFixed(4)),
          CNY: Number(normalize('CNY').toFixed(4))
        }
      }
    }
  } catch {
    // Keep fallback rates
  }

  return {
    base: 'USD',
    rates: fallback
  }
})
