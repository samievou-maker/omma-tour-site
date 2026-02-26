# Security hardening for OMMA tour (Nuxt 3)

This Nuxt project includes layered frontend and backend protections.

## Implemented protections

- Strict input sanitization and validation in `composables/useContactForm.ts`.
- Server-side validation in `server/api/contact.post.ts`.
- In-memory IP-based rate limiting in `server/api/contact.post.ts`.
- Anti-bot honeypot field in `components/ContactSection.vue`.
- Security response headers in `nuxt.config.ts` via `nitro.routeRules`.
- Optional platform headers for static hosting:
  - Netlify/compatible: `_headers`
  - Apache: `.htaccess`

## Deployment rules

- Always use HTTPS in production.
- Keep Node and dependencies updated.
- If deploying behind proxy/CDN, forward client IP correctly for rate limits.
- Do not expose secrets in client code; keep them in server env variables.

## Recommended next level

- Add CAPTCHA (Cloudflare Turnstile or reCAPTCHA) to `/api/contact`.
- Replace in-memory rate limit with Redis for multi-instance deployments.
- Add request logging/monitoring and alerting for abuse patterns.
- Add CSRF token checks for any authenticated forms in future.
