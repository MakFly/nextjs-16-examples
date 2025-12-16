# Next.js 16 Proxy Patterns for i18n

## Basic Locale Detection
```typescript
// proxy.ts
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

function getLocale(request) {
  const headers = Object.fromEntries(request.headers)
  const languages = new Negotiator({ headers }).languages()
  
  const locales = ['en', 'fr']
  const defaultLocale = 'en'
  
  return match(languages, locales, defaultLocale)
}

export function proxy(request) {
  const { pathname } = request.nextUrl
  const locale = getLocale(request)
  
  // Check if pathname already has locale
  const pathnameHasLocale = ['en', 'fr'].some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  )
  
  if (pathnameHasLocale) return
  
  // Redirect with locale prefix
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}
```

## Matcher Configuration
```typescript
export const config = {
  matcher: [
    // Skip all internal paths
    '/((?!api|_next/static|_next/image|_vercel|.*\\..*).*)',
  ]
}
```

## Advanced: Cookie-based Locale
```typescript
function getLocale(request) {
  // Check cookie first
  const cookie = request.cookies.get('locale')?.value
  if (cookie && ['en', 'fr'].includes(cookie)) {
    return cookie
  }
  
  // Fallback to Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  // ... negotiation logic
}
```
