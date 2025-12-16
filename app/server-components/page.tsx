'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CodeExample } from '@/components/code-example';
import { WhyWhenTabs } from '@/components/why-when-tabs';
import {
  Server,
  Monitor,
  Database,
  Clock,
  Users,
  TrendingUp,
  Loader2,
  HelpCircle
} from 'lucide-react';

const serverComponentsWhyWhen = {
  why: {
    title: "Pourquoi les Server Components ?",
    description: "Les React Server Components (RSC) représentent un changement de paradigme majeur. Ils permettent de rendre des composants entièrement sur le serveur, réduisant drastiquement le JavaScript envoyé au client tout en gardant accès direct aux ressources serveur (bases de données, système de fichiers, APIs internes).",
    benefits: [
      "Zero JavaScript envoyé au client pour les composants serveur",
      "Accès direct aux bases de données et APIs sans exposition côté client",
      "Meilleur SEO grâce au rendu HTML complet côté serveur",
      "Réduction significative du bundle JavaScript (jusqu'à 50-70%)",
      "Streaming et rendu progressif avec Suspense intégré",
      "Sécurité améliorée : secrets et tokens restent sur le serveur",
      "Colocation du data fetching avec les composants",
      "Meilleure performance initiale (Time to First Byte)"
    ],
    problemsSolved: [
      "Bundle JavaScript trop volumineux ralentissant le chargement",
      "Waterfall de requêtes API côté client",
      "Exposition de tokens/secrets dans le code client",
      "Double travail : SSR puis hydratation avec le même code",
      "Complexité de la synchronisation état serveur/client",
      "SEO limité avec les SPAs traditionnelles"
    ]
  },
  when: {
    idealCases: [
      {
        title: "Affichage de données statiques ou peu fréquemment mises à jour",
        description: "Listes de produits, articles de blog, pages de documentation - tout contenu qui ne nécessite pas d'interactivité immédiate.",
        example: "async function ProductList() { const products = await db.products.findMany(); return <ul>{...}</ul> }"
      },
      {
        title: "Pages nécessitant un accès direct à la base de données",
        description: "Au lieu d'une API route puis d'un fetch côté client, accédez directement à la DB dans le composant.",
        example: "const user = await prisma.user.findUnique({ where: { id } })"
      },
      {
        title: "Composants lourds côté rendu mais sans interactivité",
        description: "Graphiques statiques, tableaux de données, markdown rendu - pas besoin de JavaScript côté client.",
        example: "Composant de syntaxe highlighting, rendu MDX, tableaux read-only"
      },
      {
        title: "Contenus personnalisés par utilisateur (avec cookies/headers)",
        description: "Dashboards personnalisés, recommandations, contenus géolocalisés.",
        example: "const locale = cookies().get('locale'); const content = await getContent(locale)"
      }
    ],
    avoidCases: [
      {
        title: "Composants avec état interactif",
        description: "Formulaires, modals, dropdowns, accordéons - tout ce qui utilise useState, useReducer, ou des event handlers.",
        example: "Utilisez 'use client' pour onClick, onChange, useState"
      },
      {
        title: "Composants utilisant des hooks de browser",
        description: "useEffect pour des effets côté client, localStorage, window.addEventListener.",
        example: "useEffect(() => { window.scrollTo(0, 0) }, []) // Nécessite 'use client'"
      },
      {
        title: "Composants temps réel avec WebSockets",
        description: "Chat, notifications push, curseurs collaboratifs - nécessitent une connexion client persistante.",
        example: "useEffect(() => { socket.on('message', ...) }, [])"
      }
    ],
    realWorldExamples: [
      {
        title: "Page produit e-commerce",
        description: "Le détail produit (nom, prix, description) en Server Component, les boutons 'Ajouter au panier' et 'Favoris' en Client Component.",
        example: "Server: ProductDetails → Client: AddToCartButton, WishlistButton"
      },
      {
        title: "Dashboard analytics",
        description: "Les graphiques et statistiques calculés sur le serveur, les filtres interactifs en Client Component.",
        example: "Server: RevenueChart, UserStats → Client: DateRangePicker, FilterSidebar"
      },
      {
        title: "Blog avec commentaires",
        description: "L'article et la liste de commentaires en Server Component, le formulaire d'ajout en Client Component.",
        example: "Server: Article, CommentList → Client: CommentForm, LikeButton"
      },
      {
        title: "Système de recherche",
        description: "Les résultats de recherche en Server Component (SSR pour SEO), la barre de recherche avec autocomplete en Client Component.",
        example: "Server: SearchResults → Client: SearchInput avec debounce"
      },
      {
        title: "Page de profil utilisateur",
        description: "Les données du profil récupérées côté serveur, les boutons d'édition et upload de photo en Client Component.",
        example: "Server: ProfileInfo, ActivityFeed → Client: EditProfileForm, AvatarUpload"
      },
      {
        title: "Documentation technique",
        description: "Le contenu MDX rendu sur le serveur avec syntax highlighting, la table des matières interactive en Client.",
        example: "Server: MDXContent, CodeBlock → Client: TableOfContents, CopyButton"
      }
    ]
  }
};

// Server Component - Simple Data Fetching
async function SimpleServerData() {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  const data = {
    timestamp: new Date().toISOString(),
    message: "This data was fetched on the server!"
  };
  
  return (
    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
      <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Server-side Data</h3>
      <p className="text-sm text-green-700 dark:text-green-300">Fetched at: {data.timestamp}</p>
      <p className="text-green-600 dark:text-green-400">{data.message}</p>
    </div>
  );
}

// Server Component - Complex Data with Multiple Sources
async function ComplexServerData() {
  // Simulate multiple API calls
  const [users, stats, trends] = await Promise.all([
    fetch('https://jsonplaceholder.typicode.com/users').then(res => res.json()).catch(() => []),
    new Promise(resolve => setTimeout(() => resolve({
      totalUsers: 1234,
      activeToday: 89,
      growth: '+12%'
    }), 800)),
    new Promise(resolve => setTimeout(() => resolve([
      { month: 'Jan', value: 400 },
      { month: 'Feb', value: 300 },
      { month: 'Mar', value: 600 },
      { month: 'Apr', value: 800 },
    ]), 1200))
  ]);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Users className="h-4 w-4 mr-2" />
            {t('users')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(stats as any).totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            {users.slice(0, 3).map((user: any) => user.name).join(', ')}...
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            {t('growth')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{(stats as any).growth}</div>
          <p className="text-xs text-muted-foreground">{t('vsLastMonth')}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            {t('activeToday')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(stats as any).activeToday}</div>
          <p className="text-xs text-muted-foreground">{t('onlineUsers')}</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading Component
function LoadingCard() {
  // Note: This is a client component, but we can't use translations here
  // as it's used in Suspense fallback. We'll keep it simple.
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading server data...</span>
      </div>
    </div>
  );
}

export default function ServerComponentsPage() {
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
      <Tabs defaultValue="why-when" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="why-when" className="flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Pourquoi/Quand</span>
            <span className="sm:hidden">?</span>
          </TabsTrigger>
          <TabsTrigger value="basics">{t('tabs.basics')}</TabsTrigger>
          <TabsTrigger value="simple">{t('tabs.simple')}</TabsTrigger>
          <TabsTrigger value="complex">{t('tabs.complex')}</TabsTrigger>
          <TabsTrigger value="patterns">{t('tabs.patterns')}</TabsTrigger>
        </TabsList>

        <TabsContent value="why-when">
          <WhyWhenTabs why={serverComponentsWhyWhen.why} when={serverComponentsWhyWhen.when} />
        </TabsContent>

        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="mr-2 h-5 w-5" />
                {t('serverVsClient')}
              </CardTitle>
              <CardDescription>
                {t('serverVsClientDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                  <div className="flex items-center mb-3">
                    <Server className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">{t('serverComponents')}</h3>
                  </div>
                  <ul className="text-sm space-y-1 text-blue-700 dark:text-blue-300">
                    <li>• {t('serverFeatures.render')}</li>
                    <li>• {t('serverFeatures.databases')}</li>
                    <li>• {t('serverFeatures.noJs')}</li>
                    <li>• {t('serverFeatures.noHooks')}</li>
                    <li>• {t('serverFeatures.seo')}</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-950">
                  <div className="flex items-center mb-3">
                    <Monitor className="h-5 w-5 text-orange-600 mr-2" />
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">{t('clientComponents')}</h3>
                  </div>
                  <ul className="text-sm space-y-1 text-orange-700 dark:text-orange-300">
                    <li>• {t('clientFeatures.render')}</li>
                    <li>• {t('clientFeatures.hooks')}</li>
                    <li>• {t('clientFeatures.interactions')}</li>
                    <li>• {t('clientFeatures.browserApis')}</li>
                    <li>• {t('clientFeatures.interactive')}</li>
                  </ul>
                </div>
              </div>

              <CodeExample
                title="Component Type Declaration"
                code={`// Server Component (default)
export default function ServerComponent() {
  // Can access databases, file system, etc.
  const data = await fetch('https://api.example.com/data');
  
  return <div>{data.title}</div>;
}

// Client Component
'use client';

import { useState } from 'react';

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('whenToUse')}</CardTitle>
              <CardDescription>
                {t('whenToUseDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-blue-600">{t('useServerFor')}</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      {t('dataFetching')}
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      {t('staticContent')}
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      {t('seoCritical')}
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      {t('largeDeps')}
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-orange-600">{t('useClientFor')}</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      {t('interactive')}
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      {t('stateManagement')}
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      {t('browserApis')}
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      {t('eventHandlers')}
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simple" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('simpleExample')}</CardTitle>
              <CardDescription>
                {t('simpleExampleDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Suspense fallback={<LoadingCard />}>
                <SimpleServerData />
              </Suspense>

              <CodeExample
                title="Simple Server Component"
                code={`// app/components/simple-server-data.tsx
async function SimpleServerData() {
  // This runs on the server
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const data = {
    timestamp: new Date().toISOString(),
    message: "This data was fetched on the server!"
  };
  
  return (
    <div className="p-4 bg-green-50 rounded-lg">
      <h3 className="font-semibold mb-2">Server-side Data</h3>
      <p>Fetched at: {data.timestamp}</p>
      <p>{data.message}</p>
    </div>
  );
}

// Usage in page
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SimpleServerData />
    </Suspense>
  );
}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complex" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('complexExample')}</CardTitle>
              <CardDescription>
                {t('complexExampleDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Suspense fallback={
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => <LoadingCard key={i} />)}
                </div>
              }>
                <ComplexServerData />
              </Suspense>

              <CodeExample
                title="Complex Server Component with Multiple Data Sources"
                code={`async function ComplexServerData() {
  // Parallel data fetching
  const [users, stats, trends] = await Promise.all([
    fetch('https://api.example.com/users').then(res => res.json()),
    fetchUserStats(),
    fetchTrendData()
  ]);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <StatsCard title="Users" value={stats.totalUsers} />
      <StatsCard title="Growth" value={stats.growth} />
      <StatsCard title="Active" value={stats.activeToday} />
    </div>
  );
}

// Helper functions (also server-side)
async function fetchUserStats() {
  // Database query or API call
  return {
    totalUsers: 1234,
    activeToday: 89,
    growth: '+12%'
  };
}

async function fetchTrendData() {
  // Another data source
  return [
    { month: 'Jan', value: 400 },
    { month: 'Feb', value: 300 },
    // ...
  ];
}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Patterns</CardTitle>
              <CardDescription>
                Best practices for Server Component architecture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="Composition Pattern"
                code={`// Server Component that composes other components
export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <Header />
      
      <div className="grid md:grid-cols-2 gap-6">
        <Suspense fallback={<SkeletonCard />}>
          <UserStats />
        </Suspense>
        
        <Suspense fallback={<SkeletonCard />}>
          <RecentActivity />
        </Suspense>
      </div>
      
      <Suspense fallback={<SkeletonTable />}>
        <DataTable />
      </Suspense>
    </div>
  );
}

// Each component can have its own data fetching
async function UserStats() {
  const stats = await fetchUserStats();
  return <StatsDisplay data={stats} />;
}

async function RecentActivity() {
  const activities = await fetchRecentActivities();
  return <ActivityList activities={activities} />;
}

async function DataTable() {
  const data = await fetchTableData();
  return <Table data={data} />;
}`}
              />

              <CodeExample
                title="Error Boundaries with Server Components"
                code={`// error.tsx - Handles errors in Server Components
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center py-8">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <button onClick={reset} className="btn-primary">
        Try again
      </button>
    </div>
  );
}

// Server Component with potential errors
async function DataComponent() {
  try {
    const data = await riskyApiCall();
    return <DataDisplay data={data} />;
  } catch (error) {
    // This will be caught by error.tsx
    throw new Error('Failed to fetch data');
  }
}`}
              />

              <CodeExample
                title="Streaming with Nested Suspense"
                code={`export default function StreamingPage() {
  return (
    <div>
      {/* Fast content loads immediately */}
      <Header />
      
      {/* Slow content streams in progressively */}
      <Suspense fallback={<HeaderSkeleton />}>
        <SlowHeader />
        
        <div className="grid md:grid-cols-2 gap-4">
          <Suspense fallback={<CardSkeleton />}>
            <SlowCard1 />
          </Suspense>
          
          <Suspense fallback={<CardSkeleton />}>
            <SlowCard2 />
          </Suspense>
        </div>
        
        <Suspense fallback={<TableSkeleton />}>
          <VerySlowTable />
        </Suspense>
      </Suspense>
    </div>
  );
}`}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}