# Next.js 16 i18n Key Changes

## Major Breaking Change: middleware → proxy

### Old Approach (Next.js <16)
```typescript
// middleware.ts ❌ DEPRECATED
import { NextResponse } from 'next/server'

export function middleware(request) {
  // i18n logic
}

export const config = {
  matcher: ['/((?!api|_next).*)']
}
```

### New Approach (Next.js 16+)
```typescript
// proxy.ts ✅ NEW
import { NextResponse } from 'next/server'

export function proxy(request) {
  // i18n logic same as middleware
}

export const config = {
  matcher: ['/((?!api|_next).*)']
}
```

## Migration Command
```bash
npx @next/codemod@canary middleware-to-proxy .
```

## Static Export Compatibility
⚠️ **IMPORTANT**: Proxy is NOT supported with static export

```javascript
// next.config.js
const nextConfig = {
  output: 'export', // ❌ Incompatible with proxy
  images: { unoptimized: true }
}
```

## Alternative for Static Export
Use client-side routing with next-intl:
```typescript
// app/layout.tsx
import {NextIntlClientProvider} from 'next-intl'

// No proxy.ts needed - handle i18n client-side
```

## i18n File Structure for Static Export
```
app/
├── layout.tsx           # Root with NextIntlClientProvider
├── [locale]/           # Optional - use if you want /en/ paths
│   ├── layout.tsx
│   └── page.tsx
├── page.tsx            # Default locale
└── about.tsx

messages/
├── en.json
└── fr.json
```
