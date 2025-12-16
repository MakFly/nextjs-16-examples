'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { ServerComponentsTabs } from './server-components-tabs';

export function ServerComponentsPageClient({
  simpleServerData,
  complexServerData,
}: {
  simpleServerData: React.ReactNode;
  complexServerData: React.ReactNode;
}) {
  const t = useTranslations('serverComponents');
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 text-xs tracking-wider uppercase">
              {t('badge')}
            </Badge>
            <h1 className="mb-4">{t('title')}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('description')}
            </p>
            <div className="w-12 h-1 bg-accent mt-6" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <ServerComponentsTabs 
          simpleServerData={simpleServerData}
          complexServerData={complexServerData}
        />
      </div>
    </div>
  );
}
