'use client'

import { NextIntlClientProvider } from 'next-intl'
import { useLocale } from './locale-provider'
import { ReactNode, useMemo } from 'react'
import enMessages from '@/messages/en.json'
import frMessages from '@/messages/fr.json'

const messages = {
  en: enMessages,
  fr: frMessages,
}

interface NextIntlProviderProps {
  children: ReactNode
}

export function NextIntlProvider({ children }: NextIntlProviderProps) {
  const { locale, isHydrated } = useLocale()

  const localeMessages = useMemo(() => {
    return messages[locale as keyof typeof messages] || messages.en
  }, [locale])

  // Always render with current locale state
  // The locale will start as 'en' on server and first render,
  // then update to actual locale after hydration
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={localeMessages}
      timeZone="Europe/Paris"
    >
      {children}
    </NextIntlClientProvider>
  )
}
