'use client'

import { useEffect, useState, ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'

interface TranslatedPageProps {
  locale: string
  children: ReactNode
}

interface Messages {
  [key: string]: any
}

export function TranslatedPage({ locale, children }: TranslatedPageProps) {
  const [messages, setMessages] = useState<Messages | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`/messages/${locale}.json`)
        if (response.ok) {
          const messagesData = await response.json()
          setMessages(messagesData)
        } else {
          // Fallback to English
          const enResponse = await fetch('/messages/en.json')
          if (enResponse.ok) {
            const enMessages = await enResponse.json()
            setMessages(enMessages)
          }
        }
      } catch (error) {
        console.error('Failed to load messages:', error)
        // Set empty messages to prevent infinite loading
        setMessages({} as Messages)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [locale])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
