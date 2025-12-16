'use client'

import { Button } from '@/components/ui/button';
import { useLocale } from '@/components/locale-provider';
import { Languages } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function LanguageSwitcher() {
  const { locale, switchLocale } = useLocale();
  const t = useTranslations('common');

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'fr' : 'en';
    switchLocale(newLocale);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
    >
      <Languages className="h-4 w-4" />
      <span className="hidden sm:inline">
        {locale === 'en' ? 'Français' : 'English'}
      </span>
      <span className="sm:hidden">
        {locale === 'en' ? 'FR' : 'EN'}
      </span>
    </Button>
  );
}
