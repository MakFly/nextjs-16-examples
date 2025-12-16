'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Zap,
  Database,
  Server,
  FormInput,
  Bell,
  ArrowRight,
  Code2,
  Table
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const tutorialKeys = [
  { key: 'nextjs', icon: Code2, href: '/nextjs' },
  { key: 'zod', icon: Zap, href: '/zod' },
  { key: 'zustand', icon: Database, href: '/zustand' },
  { key: 'serverComponents', icon: Server, href: '/server-components' },
  { key: 'serverActions', icon: FormInput, href: '/server-actions' },
  { key: 'reactHookForm', icon: FormInput, href: '/react-hook-form' },
  { key: 'tanstackQuery', icon: Database, href: '/tanstack-query' },
  { key: 'tanstackTable', icon: Table, href: '/tanstack-table' },
  { key: 'notifications', icon: Bell, href: '/notifications' },
  { key: 'useOptimistic', icon: Zap, href: '/use-optimistic' },
] as const;

export function HomePage() {
  const tHero = useTranslations('home.hero');
  const tTutorials = useTranslations('home.tutorials');
  const tLearn = useTranslations('home.whatYoullLearn');
  const tButtons = useTranslations('common.buttons');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {tHero('title')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {tHero('description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {tutorialKeys.map((tutorial) => {
          const Icon = tutorial.icon;
          return (
            <Card key={tutorial.key} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary">{tTutorials(`${tutorial.key}.badge`)}</Badge>
                </div>
                <CardTitle>
                  {tTutorials(`${tutorial.key}.title`)}
                </CardTitle>
                <CardDescription>{tTutorials(`${tutorial.key}.description`)}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full group">
                  <Link href={tutorial.href}>
                    {tButtons('startLearning')}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <BookOpen className="mr-3 h-8 w-8" />
            {tLearn('title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">{tLearn('coreConcepts')}</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• {tLearn('coreList.item1')}</li>
              <li>• {tLearn('coreList.item2')}</li>
              <li>• {tLearn('coreList.item3')}</li>
              <li>• {tLearn('coreList.item4')}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">{tLearn('advancedPatterns')}</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• {tLearn('advancedList.item1')}</li>
              <li>• {tLearn('advancedList.item2')}</li>
              <li>• {tLearn('advancedList.item3')}</li>
              <li>• {tLearn('advancedList.item4')}</li>
              <li>• {tLearn('advancedList.item5')}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
