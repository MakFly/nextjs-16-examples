import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { Navigation } from '@/components/navigation';
import { LocaleProvider } from '@/components/locale-provider';
import { NextIntlProvider } from '@/components/next-intl-provider';

// Load messages for NextIntlClientProvider
// For static export, we'll use a simpler approach
// The messages will be loaded dynamically client-side

export const metadata: Metadata = {
  title: 'Next.js 16 Tutorials',
  description: 'A comprehensive tutorial series covering Next.js App Router, React Server Components, Zod, Zustand, TanStack Query, and modern React patterns.',
  keywords: ['Next.js', 'React', 'Tutorial', 'App Router', 'Server Components', 'TypeScript'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <LocaleProvider>
          <NextIntlProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="relative min-h-screen bg-background">
                <Navigation />
                <main>
                  {children}
                </main>
              </div>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    fontFamily: 'var(--font-sans)',
                  },
                  classNames: {
                    toast: 'border border-border shadow-lg',
                    title: 'font-medium',
                    description: 'text-muted-foreground',
                  },
                }}
              />
            </ThemeProvider>
          </NextIntlProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
