'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu, Moon, Sun, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useTranslations } from 'next-intl';

function useNavigation() {
  const t = useTranslations('common.navigation');

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('nextjs'), href: '/nextjs' },
    { name: t('zod'), href: '/zod' },
    { name: t('zustand'), href: '/zustand' },
  ];

  const moreNavigation = [
    { name: t('serverComponents'), href: '/server-components' },
    { name: t('serverActions'), href: '/server-actions' },
    { name: t('reactHookForm'), href: '/react-hook-form' },
    { name: t('tanstackQuery'), href: '/tanstack-query' },
    { name: t('tanstackTable'), href: '/tanstack-table' },
    { name: t('notifications'), href: '/notifications' },
    { name: t('useOptimistic'), href: '/use-optimistic' },
  ];

  return { navigation, moreNavigation, t };
}

export function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { navigation, moreNavigation, t } = useNavigation();
  const tA11y = useTranslations('common.accessibility');

  const isMoreActive = moreNavigation.some((item) => pathname === item.href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-foreground rounded flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-background text-xs font-bold font-mono">N</span>
            </div>
            <span className="font-medium text-sm hidden sm:block">
              {t('siteName')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  pathname === item.href
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                {item.name}
              </Link>
            ))}

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    isMoreActive
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  {t('more')}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                  {t('advancedTopics')}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {moreNavigation.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'w-full cursor-pointer',
                        pathname === item.href && 'bg-secondary'
                      )}
                    >
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-8 w-8"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">{tA11y('toggleTheme')}</span>
            </Button>

            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">{tA11y('toggleMenu')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
                        <span className="text-background text-xs font-bold font-mono">N</span>
                      </div>
                      <span className="font-medium text-sm">{t('siteName')}</span>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex-1 overflow-y-auto py-4">
                    <div className="px-2 space-y-1">
                      {[...navigation, ...moreNavigation].map((item, index) => (
                        <div key={item.href}>
                          {index === navigation.length && (
                            <div className="px-3 py-2 mt-2 mb-1">
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                {t('advanced')}
                              </span>
                            </div>
                          )}
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
                              pathname === item.href
                                ? 'bg-secondary text-foreground font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                            )}
                          >
                            {item.name}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </nav>

                  {/* Footer */}
                  <div className="p-4 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      {t('builtWith')}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
