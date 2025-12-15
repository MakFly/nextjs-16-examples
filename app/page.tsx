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

const tutorials = [
  {
    title: 'Next.js App Router',
    description: 'Learn the fundamentals of App Router, layouts, loading states, and error boundaries',
    icon: Code2,
    href: '/nextjs',
    badge: 'Core',
    color: 'bg-blue-500'
  },
  {
    title: 'Zod Validation',
    description: 'Schema validation, form validation, and type safety with Zod',
    icon: Zap,
    href: '/zod',
    badge: 'Validation',
    color: 'bg-green-500'
  },
  {
    title: 'Zustand State Management',
    description: 'Simple, scalable state management with Zustand',
    icon: Database,
    href: '/zustand',
    badge: 'State',
    color: 'bg-purple-500'
  },
  {
    title: 'Server Components',
    description: 'Server vs Client Components, data fetching, and optimization',
    icon: Server,
    href: '/server-components',
    badge: 'Architecture',
    color: 'bg-orange-500'
  },
  {
    title: 'Server Actions',
    description: 'Form handling, mutations, and server-side logic',
    icon: FormInput,
    href: '/server-actions',
    badge: 'Actions',
    color: 'bg-red-500'
  },
  {
    title: 'React Hook Form',
    description: 'Advanced form handling with validation and performance',
    icon: FormInput,
    href: '/react-hook-form',
    badge: 'Forms',
    color: 'bg-cyan-500'
  },
  {
    title: 'TanStack Query',
    description: 'Server state management, caching, and synchronization',
    icon: Database,
    href: '/tanstack-query',
    badge: 'Data',
    color: 'bg-indigo-500'
  },
  {
    title: 'TanStack Table',
    description: 'Advanced tables with sorting, filtering, pagination, and grouping',
    icon: Table,
    href: '/tanstack-table',
    badge: 'Tables',
    color: 'bg-emerald-500'
  },
  {
    title: 'Toast Notifications',
    description: 'Sonner integration and custom notification systems',
    icon: Bell,
    href: '/notifications',
    badge: 'UI/UX',
    color: 'bg-pink-500'
  },
  {
    title: 'useOptimistic',
    description: 'Optimistic updates for reactive user interfaces',
    icon: Zap,
    href: '/use-optimistic',
    badge: 'React',
    color: 'bg-yellow-500'
  }
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
          Next.js App Router Tutorial
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Master modern React development with this comprehensive tutorial covering Next.js App Router, 
          state management, form handling, and advanced patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {tutorials.map((tutorial, index) => {
          const Icon = tutorial.icon;
          return (
            <Card key={tutorial.title} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${tutorial.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary">{tutorial.badge}</Badge>
                </div>
                <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tutorial.title}
                </CardTitle>
                <CardDescription>{tutorial.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full group">
                  <Link href={tutorial.href}>
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <BookOpen className="mr-3 h-8 w-8" />
            What You'll Learn
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Core Concepts</h3>
            <ul className="space-y-2 text-blue-100">
              <li>• App Router fundamentals and file conventions</li>
              <li>• Server and Client Components architecture</li>
              <li>• Data fetching and streaming</li>
              <li>• Error boundaries and loading states</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Advanced Patterns</h3>
            <ul className="space-y-2 text-blue-100">
              <li>• Form validation with Zod schemas</li>
              <li>• Global state management with Zustand</li>
              <li>• Server state with TanStack Query</li>
              <li>• Advanced tables with TanStack Table</li>
              <li>• Toast notifications and user feedback</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}