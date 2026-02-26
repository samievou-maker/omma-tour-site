# OMMA tour (Nuxt 3 + Admin)

Production-ready starter for travel agency website:

- Nuxt 3 + TypeScript (strict)
- Tailwind CSS
- ESLint (strict rules)
- Server API endpoint with input validation and rate limiting
- Built-in admin panel for tours/news/prices

## Setup

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run check
```

## Admin panel

- URL: `/admin`
- Default password: `omma-admin-2026`
- Change credentials in production via env vars:

```bash
NUXT_ADMIN_PASSWORD=your-strong-password
NUXT_ADMIN_SESSION_SECRET=your-random-long-secret
```

## Project structure

- `pages/` - route pages
- `components/` - reusable UI components
- `composables/` - reusable logic
- `server/api/` - server endpoints
- `server/utils/` - storage/auth helpers
- `useStorage('data')` - editable content storage backend
- `types/` - shared TypeScript types
