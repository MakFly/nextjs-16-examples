import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async () => {
  // For static export, we need to determine locale from cookies or headers
  let locale: Locale = defaultLocale;

  try {
    // Try to get locale from cookie
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get('locale')?.value;
    if (localeCookie && locales.includes(localeCookie as Locale)) {
      locale = localeCookie as Locale;
    } else {
      // Fallback to Accept-Language header
      const headerStore = await headers();
      const acceptLanguage = headerStore.get('accept-language');
      if (acceptLanguage) {
        const browserLocale = acceptLanguage.split(',')[0].split('-')[0];
        if (locales.includes(browserLocale as Locale)) {
          locale = browserLocale as Locale;
        }
      }
    }
  } catch {
    // During static generation, cookies/headers may not be available
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
