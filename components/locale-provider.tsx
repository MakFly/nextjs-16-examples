'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

interface LocaleContextType {
  locale: string
  switchLocale: (newLocale: string) => void
  isHydrated: boolean
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

interface LocaleProviderProps {
  children: ReactNode
}

function getInitialLocale(): string {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const saved = localStorage.getItem('locale')
  if (saved && ['en', 'fr'].includes(saved)) {
    return saved
  }

  // Auto-detect from browser
  const browserLocale = navigator.language.split('-')[0]
  return ['en', 'fr'].includes(browserLocale) ? browserLocale : 'en'
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  // Start with 'en' on server, then hydrate to actual locale on client
  const [locale, setLocale] = useState('en')
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate locale on client
  useEffect(() => {
    const initialLocale = getInitialLocale()
    setLocale(initialLocale)
    document.documentElement.lang = initialLocale

    // Set cookie for server-side detection
    document.cookie = `locale=${initialLocale};path=/;max-age=31536000;samesite=lax`

    setIsHydrated(true)
  }, [])

  const switchLocale = useCallback((newLocale: string) => {
    if (['en', 'fr'].includes(newLocale)) {
      setLocale(newLocale)
      localStorage.setItem('locale', newLocale)
      document.documentElement.lang = newLocale

      // Set cookie for server-side detection
      document.cookie = `locale=${newLocale};path=/;max-age=31536000;samesite=lax`

      // No reload needed - React state update will trigger re-render
      // and NextIntlClientProvider will receive the new locale/messages
    }
  }, [])

  return (
    <LocaleContext.Provider value={{ locale, switchLocale, isHydrated }}>
      {children}
    </LocaleContext.Provider>
  )
}

export const useLocale = () => {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}
