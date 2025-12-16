'use client'

import { useEffect, useState } from 'react'

// Client-side messages loading
export function useClientMessages(locale: string) {
  const [messages, setMessages] = useState(null)
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
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [locale])

  return { messages, loading }
}
