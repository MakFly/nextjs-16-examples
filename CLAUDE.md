# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (already running, don't start)
npm run build    # Build for production (static export)
npm run lint     # Run ESLint
```

## Architecture

### Tech Stack
- **Next.js 16** with App Router and static export (`output: 'export'`)
- **React 19** with Server Components
- **TypeScript 5.2**
- **Tailwind CSS 4** with `@tailwindcss/postcss`
- **shadcn/ui** components in `components/ui/`
- **next-intl 4.6** for i18n (client-side only due to static export)

### i18n Setup (Static Export Constraints)

Since `output: 'export'` is enabled, proxy/middleware-based i18n is not supported. The implementation uses client-side locale switching:

- `i18n/request.ts` - next-intl server config (wrapped by plugin in `next.config.js`)
- `components/locale-provider.tsx` - React context for locale state (persisted to localStorage + cookie)
- `components/next-intl-provider.tsx` - Wraps app with `NextIntlClientProvider`, loads messages based on locale context
- `messages/en.json`, `messages/fr.json` - Translation files

**Key Pattern**: Pages needing translations must be client components using `useTranslations()`:
```tsx
'use client';
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('namespace');
  return <h1>{t('key')}</h1>;
}
```

### Provider Hierarchy (app/layout.tsx)
```
LocaleProvider → NextIntlProvider → ThemeProvider → Navigation + children
```

### Key Directories
- `app/` - Pages (tutorials for Next.js, Zod, Zustand, TanStack Query/Table, etc.)
- `components/ui/` - shadcn/ui primitives
- `components/` - App components (navigation, locale providers, home-page)
- `messages/` - i18n JSON files
- `AI-DD/` - Documentation about Next.js 16 i18n patterns

### Styling
- Uses `cn()` utility from `lib/utils.ts` for class merging (clsx + tailwind-merge)
- CSS variables for theming defined in `app/globals.css`
- Fonts: DM Sans (sans), Instrument Serif (display), JetBrains Mono (mono)

## Important Notes

- **Never start dev server** - assume it's already running with hot-reload
- Static export means no server-side features (API routes, SSR, middleware/proxy)
- All dynamic features must be client-side
