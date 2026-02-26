export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint'],
  devtools: { enabled: true },

  typescript: {
    strict: true,
    typeCheck: true,
    shim: false
  },

  css: ['~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },

  app: {
    head: {
      title: 'OMMA tour',
      titleTemplate: '%s | Премиальные туры',
      meta: [
        {
          name: 'description',
          content:
            'OMMA tour - подбор премиальных путешествий: готовые пакеты, персональный сервис и поддержка 24/7.'
        },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'referrer', content: 'strict-origin-when-cross-origin' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap'
        }
      ]
    }
  },

  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy':
            'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
          'Content-Security-Policy':
            "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com; connect-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests"
        }
      }
    }
  },

  eslint: {
    checker: true
  },

  runtimeConfig: {
    rateLimitWindowMs: 15000,
    rateLimitMaxRequests: 5,
    adminPassword: '123',
    adminSessionSecret: 'change-this-secret',
    userSessionSecret: 'change-this-user-secret',
    public: {
      brandName: 'OMMA tour'
    }
  },

  compatibilityDate: '2025-12-15'
})
