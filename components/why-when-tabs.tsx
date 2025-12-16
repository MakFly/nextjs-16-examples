'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  HelpCircle,
  Clock,
  CheckCircle,
  XCircle,
  Lightbulb,
  Target,
  AlertTriangle
} from 'lucide-react';

interface UseCase {
  title: string;
  description: string;
  example?: string;
}

interface WhyWhenTabsProps {
  why: {
    title: string;
    description: string;
    benefits: string[];
    problemsSolved: string[];
  };
  when: {
    idealCases: UseCase[];
    avoidCases: UseCase[];
    realWorldExamples: UseCase[];
  };
}

export function WhyWhenTabs({ why, when }: WhyWhenTabsProps) {
  return (
    <Tabs defaultValue="why" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="why" className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          Pourquoi ?
        </TabsTrigger>
        <TabsTrigger value="when" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Quand utiliser ?
        </TabsTrigger>
      </TabsList>

      <TabsContent value="why" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              {why.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              {why.description}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Avantages
                </h3>
                <ul className="space-y-2">
                  {why.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-1">+</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  Problèmes résolus
                </h3>
                <ul className="space-y-2">
                  {why.problemsSolved.map((problem, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-500 mt-1">-</span>
                      <span>{problem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="when" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Cas d'utilisation idéaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {when.idealCases.map((useCase, index) => (
                <div key={index} className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Recommandé
                    </Badge>
                    <h4 className="font-semibold">{useCase.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{useCase.description}</p>
                  {useCase.example && (
                    <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
                      {useCase.example}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Cas à éviter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {when.avoidCases.map((useCase, index) => (
                <div key={index} className="p-4 border rounded-lg bg-orange-50/50 dark:bg-orange-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      À éviter
                    </Badge>
                    <h4 className="font-semibold">{useCase.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{useCase.description}</p>
                  {useCase.example && (
                    <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
                      {useCase.example}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              Exemples concrets du monde réel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {when.realWorldExamples.map((example, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-300">
                      {index + 1}
                    </span>
                    {example.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{example.description}</p>
                  {example.example && (
                    <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
                      {example.example}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
