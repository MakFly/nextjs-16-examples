import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CodeExample } from '@/components/code-example';
import { FileTree } from '@/components/file-tree';
import { WhyWhenTabs } from '@/components/why-when-tabs';
import {
  FolderIcon,
  FileIcon,
  Layout,
  Route,
  Loader,
  AlertTriangle,
  ShoppingCart,
  User,
  Settings,
  BookOpen,
  Globe,
  Database,
  Clock,
  ExternalLink,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

const nextjsWhyWhen = {
  why: {
    title: "Pourquoi Next.js App Router ?",
    description: "Next.js App Router représente une évolution majeure du framework, offrant une architecture basée sur React Server Components, un routing plus intuitif basé sur les fichiers, et des fonctionnalités avancées comme le streaming et les layouts imbriqués. C'est le choix idéal pour construire des applications web modernes, performantes et évolutives.",
    benefits: [
      "Server Components par défaut : réduction drastique du JavaScript envoyé au client",
      "Routing intuitif basé sur les dossiers et fichiers",
      "Layouts imbriqués avec conservation de l'état entre les navigations",
      "Streaming et Suspense intégrés pour un chargement progressif",
      "Métadonnées et SEO optimisés avec l'API metadata",
      "Support natif de TypeScript avec typage automatique des routes",
      "Optimisation automatique des images, fonts et scripts",
      "Middleware puissant pour la gestion des requêtes"
    ],
    problemsSolved: [
      "Complexité du routing dans les grandes applications React",
      "Performance initiale lente due au bundle JavaScript volumineux",
      "Gestion manuelle du SEO et des métadonnées",
      "Configuration complexe du Server-Side Rendering",
      "État partagé difficile entre les pages",
      "Chargement en cascade des données (waterfall)",
      "Manque de conventions dans la structure des projets React"
    ]
  },
  when: {
    idealCases: [
      {
        title: "Sites web et applications avec SEO critique",
        description: "E-commerce, blogs, sites marketing où le référencement naturel est crucial. Le SSR et les métadonnées optimisées garantissent une indexation parfaite.",
        example: "Site e-commerce avec pages produits indexées, blog d'entreprise, landing pages marketing"
      },
      {
        title: "Applications avec beaucoup de contenu dynamique",
        description: "Dashboards, portails clients, applications SaaS où le contenu change fréquemment et doit être à jour.",
        example: "Dashboard analytics, plateforme de gestion de projet, CRM"
      },
      {
        title: "Projets nécessitant des performances optimales",
        description: "Applications où le Time to First Byte (TTFB) et le Largest Contentful Paint (LCP) sont critiques.",
        example: "Applications mobiles web (PWA), sites à fort trafic, applications temps réel"
      },
      {
        title: "Équipes cherchant des conventions établies",
        description: "Projets d'équipe où une structure claire et des conventions réduisent les frictions et accélèrent le développement.",
        example: "Startups en croissance, équipes enterprise, projets open source"
      }
    ],
    avoidCases: [
      {
        title: "Applications purement client-side (SPA)",
        description: "Si vous n'avez pas besoin de SEO et que tout se passe côté client, un framework plus léger comme Vite + React peut suffire.",
        example: "Outils internes, applications derrière authentification, dashboards privés"
      },
      {
        title: "Prototypes très simples",
        description: "Pour un MVP rapide d'une seule page sans complexité de routing, Next.js peut être overkill.",
        example: "Landing page statique simple, prototype de démo"
      },
      {
        title: "Applications nécessitant un contrôle total du serveur",
        description: "Si vous avez besoin d'un backend personnalisé complexe, considérez une architecture séparée frontend/backend.",
        example: "API complexes avec microservices, applications temps réel avec WebSockets intensifs"
      }
    ],
    realWorldExamples: [
      {
        title: "Blog/CMS (comme ce tutoriel)",
        description: "Routing dynamique [slug], métadonnées automatiques, génération statique des pages populaires, ISR pour le contenu mis à jour.",
        example: "/blog/[slug] → SSG + ISR"
      },
      {
        title: "E-commerce",
        description: "Pages produits avec SSR pour le SEO, panier côté client, checkout avec Server Actions, recherche avec streaming.",
        example: "/products/[id] → SSR, /cart → Client, /checkout → Server Actions"
      },
      {
        title: "Dashboard SaaS",
        description: "Layout avec sidebar persistante, pages de données avec Suspense, formulaires avec validation Zod et Server Actions.",
        example: "/(dashboard)/analytics → Parallel Routes, /(dashboard)/settings → Forms"
      },
      {
        title: "Marketplace",
        description: "Listings avec filtres (searchParams), profils vendeurs, messagerie temps réel, paiements sécurisés.",
        example: "/listings?category=X&price=Y → SSR avec searchParams"
      },
      {
        title: "Application multi-tenant",
        description: "Subdomains ou paths par tenant, layouts personnalisés, isolation des données.",
        example: "/[tenant]/dashboard → Middleware + Dynamic Routes"
      },
      {
        title: "Documentation technique",
        description: "MDX pour le contenu, navigation latérale, recherche full-text, versioning.",
        example: "/docs/[...slug] → Catch-all routes + MDX"
      }
    ]
  }
};

// Simulated data fetching components
async function BlogPosts() {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const posts = [
    { id: 1, title: "Getting Started with Next.js 16", slug: "getting-started-nextjs-16", excerpt: "Learn the basics of Next.js App Router", date: "2024-01-15" },
    { id: 2, title: "Advanced Server Components", slug: "advanced-server-components", excerpt: "Deep dive into server-side rendering", date: "2024-01-10" },
    { id: 3, title: "Building Modern Web Apps", slug: "building-modern-web-apps", excerpt: "Best practices for modern development", date: "2024-01-05" }
  ];

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
          <p className="text-muted-foreground text-sm mb-3">{post.excerpt}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{post.date}</span>
            <Button size="sm" variant="outline">Read More</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

async function UserProfile() {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    role: "Developer",
    joinDate: "January 2024"
  };

  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg">
      <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full" />
      <div>
        <h3 className="font-semibold">{user.name}</h3>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <div className="flex items-center space-x-2 mt-1">
          <Badge variant="secondary">{user.role}</Badge>
          <span className="text-xs text-muted-foreground">Joined {user.joinDate}</span>
        </div>
      </div>
    </div>
  );
}

async function ProductGrid() {
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const products = [
    { id: 1, name: "Wireless Headphones", price: 99.99, image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" },
    { id: 2, name: "Smart Watch", price: 199.99, image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" },
    { id: 3, name: "Laptop Stand", price: 49.99, image: "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop" }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {products.map(product => (
        <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
          <div className="p-4">
            <h3 className="font-semibold mb-2">{product.name}</h3>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-green-600">${product.price}</span>
              <Button size="sm">Add to Cart</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Loading components
function BlogSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="p-4 border rounded-lg animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function UserSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="border rounded-lg overflow-hidden animate-pulse">
          <div className="w-full h-40 bg-gray-200"></div>
          <div className="p-4">
            <div className="h-5 bg-gray-200 rounded mb-2"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NextjsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 text-xs tracking-wider uppercase">
              Core
            </Badge>
            <h1 className="mb-4">Next.js App Router</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Exemples concrets d&apos;utilisation de Next.js App Router avec des cas d&apos;usage réels :
              blog, e-commerce, dashboard, et plus encore.
            </p>
            <div className="w-12 h-1 bg-accent mt-6" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
      <Tabs defaultValue="why-when" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="why-when" className="flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Pourquoi/Quand</span>
            <span className="sm:hidden">?</span>
          </TabsTrigger>
          <TabsTrigger value="routing">Routing</TabsTrigger>
          <TabsTrigger value="layouts">Layouts</TabsTrigger>
          <TabsTrigger value="loading">Loading</TabsTrigger>
          <TabsTrigger value="examples">Exemples</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="why-when">
          <WhyWhenTabs why={nextjsWhyWhen.why} when={nextjsWhyWhen.when} />
        </TabsContent>

        <TabsContent value="routing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Route className="mr-2 h-5 w-5" />
                Routing Basé sur les Fichiers
              </CardTitle>
              <CardDescription>
                Structure de fichiers pour différents types d'applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Blog Application
                  </h3>
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center"><FolderIcon className="h-4 w-4 mr-2 text-blue-600" />app</div>
                      <div className="flex items-center pl-4"><FileIcon className="h-4 w-4 mr-2" />layout.tsx</div>
                      <div className="flex items-center pl-4"><FileIcon className="h-4 w-4 mr-2" />page.tsx</div>
                      <div className="flex items-center pl-4"><FolderIcon className="h-4 w-4 mr-2 text-blue-600" />blog</div>
                      <div className="flex items-center pl-8"><FileIcon className="h-4 w-4 mr-2" />page.tsx</div>
                      <div className="flex items-center pl-8"><FolderIcon className="h-4 w-4 mr-2 text-blue-600" />[slug]</div>
                      <div className="flex items-center pl-12"><FileIcon className="h-4 w-4 mr-2" />page.tsx</div>
                      <div className="flex items-center pl-8"><FolderIcon className="h-4 w-4 mr-2 text-blue-600" />category</div>
                      <div className="flex items-center pl-12"><FolderIcon className="h-4 w-4 mr-2 text-blue-600" />[category]</div>
                      <div className="flex items-center pl-16"><FileIcon className="h-4 w-4 mr-2" />page.tsx</div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>• <code>/blog</code> - Liste des articles</p>
                    <p>• <code>/blog/mon-article</code> - Article spécifique</p>
                    <p>• <code>/blog/category/tech</code> - Articles par catégorie</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    E-commerce Application
                  </h3>
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center"><FolderIcon className="h-4 w-4 mr-2 text-blue-600" />app</div>
                      <div className="flex items-center pl-4"><FolderIcon className="h-4 w-4 mr-2 text-blue-600" />products</div>
                      <div className="flex items-center pl-8"><FileIcon className="h-4 w-4 mr-2" />page.tsx</div>
                      <div className="flex items-center pl-8"><FolderIcon className="h-4 w-4 mr-2 text-blue-600" />[id]</div>
                      <div className="flex items-center pl-12"><FileIcon className="h-4 w-4 mr-2" />page.tsx</div>
                      <div className="flex items-center pl-4"><FolderIcon className="h-4 w-4 mr-2 text-blue-600" />cart</div>
                      <div className="flex items-center pl-8"><FileIcon className="h-4 w-4 mr-2" />page.tsx</div>
                      <div className="flex items-center pl-4"><FolderIcon className="h-4 w-4 mr-2 text-blue-600" />checkout</div>
                      <div className="flex items-center pl-8"><FileIcon className="h-4 w-4 mr-2" />page.tsx</div>
                      <div className="flex items-center pl-8"><FolderIcon className="h-4 w-4 mr-2 text-blue-600" />success</div>
                      <div className="flex items-center pl-12"><FileIcon className="h-4 w-4 mr-2" />page.tsx</div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>• <code>/products</code> - Catalogue produits</p>
                    <p>• <code>/products/123</code> - Détail produit</p>
                    <p>• <code>/cart</code> - Panier</p>
                    <p>• <code>/checkout/success</code> - Confirmation</p>
                  </div>
                </div>
              </div>

              <CodeExample
                title="Route Dynamique avec Paramètres Multiples"
                code={`// app/blog/[category]/[slug]/page.tsx
interface PageProps {
  params: {
    category: string;
    slug: string;
  };
  searchParams: {
    ref?: string;
    utm_source?: string;
  };
}

export default function BlogPost({ params, searchParams }: PageProps) {
  const { category, slug } = params;
  const { ref, utm_source } = searchParams;

  return (
    <article>
      <div className="mb-4">
        <Badge>{category}</Badge>
        {ref && <Badge variant="outline">Ref: {ref}</Badge>}
      </div>
      <h1>Article: {slug}</h1>
      {utm_source && (
        <p className="text-sm text-muted-foreground">
          Source: {utm_source}
        </p>
      )}
    </article>
  );
}

// Génération des métadonnées dynamiques
export async function generateMetadata({ params }: PageProps) {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}`}
              />

              <CodeExample
                title="Route Groups et Layouts Conditionnels"
                code={`// Structure avec route groups
app/
  (marketing)/
    layout.tsx          // Layout pour marketing
    page.tsx           // Page d'accueil
    about/
      page.tsx         // À propos
    contact/
      page.tsx         // Contact
  (dashboard)/
    layout.tsx          // Layout pour dashboard
    dashboard/
      page.tsx         // Dashboard principal
    settings/
      page.tsx         // Paramètres
  (auth)/
    layout.tsx          // Layout pour auth
    login/
      page.tsx         // Connexion
    register/
      page.tsx         // Inscription

// app/(marketing)/layout.tsx
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Logo />
            <div className="space-x-4">
              <Link href="/about">À propos</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/login">Connexion</Link>
            </div>
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <p>&copy; 2024 Mon Site</p>
        </div>
      </footer>
    </div>
  );
}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layouts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layout className="mr-2 h-5 w-5" />
                Layouts Avancés et Imbriqués
              </CardTitle>
              <CardDescription>
                Exemples concrets de layouts pour différents types d'applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="Dashboard Layout avec Sidebar"
                code={`// app/dashboard/layout.tsx
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar fixe */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-xl font-bold">Dashboard</h2>
        </div>
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            <Link 
              href="/dashboard" 
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <BarChart className="mr-3 h-5 w-5" />
              Analytics
            </Link>
            <Link 
              href="/dashboard/users" 
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Users className="mr-3 h-5 w-5" />
              Utilisateurs
            </Link>
            <Link 
              href="/dashboard/settings" 
              className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Settings className="mr-3 h-5 w-5" />
              Paramètres
            </Link>
          </div>
        </nav>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}`}
              />

              <CodeExample
                title="E-commerce Layout avec Header Dynamique"
                code={`// app/(shop)/layout.tsx
import { ShoppingCart, Search, User } from 'lucide-react';
import { CartProvider } from '@/contexts/cart-context';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        {/* Header avec navigation */}
        <header className="sticky top-0 z-50 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-2xl font-bold">
                ShopLogo
              </Link>
              
              {/* Barre de recherche */}
              <div className="flex-1 max-w-lg mx-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Rechercher des produits..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Actions utilisateur */}
              <div className="flex items-center space-x-4">
                <Link href="/account" className="p-2 hover:bg-gray-100 rounded-lg">
                  <User className="h-5 w-5" />
                </Link>
                <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation catégories */}
        <nav className="bg-gray-50 border-b">
          <div className="container mx-auto px-4">
            <div className="flex space-x-8 py-4">
              <Link href="/products/electronics" className="hover:text-blue-600">
                Électronique
              </Link>
              <Link href="/products/clothing" className="hover:text-blue-600">
                Vêtements
              </Link>
              <Link href="/products/home" className="hover:text-blue-600">
                Maison
              </Link>
            </div>
          </div>
        </nav>

        {/* Contenu principal */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold mb-4">À propos</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><Link href="/about">Notre histoire</Link></li>
                  <li><Link href="/careers">Carrières</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><Link href="/help">Aide</Link></li>
                  <li><Link href="/contact">Contact</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loading" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Loader className="mr-2 h-5 w-5" />
                États de Chargement et Streaming
              </CardTitle>
              <CardDescription>
                Exemples concrets de loading states et streaming UI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Blog Posts</h3>
                  <Suspense fallback={<BlogSkeleton />}>
                    <BlogPosts />
                  </Suspense>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">User Profile</h3>
                  <Suspense fallback={<UserSkeleton />}>
                    <UserProfile />
                  </Suspense>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Products</h3>
                  <Suspense fallback={<ProductSkeleton />}>
                    <ProductGrid />
                  </Suspense>
                </div>
              </div>

              <CodeExample
                title="Loading States Granulaires"
                code={`// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Chargement rapide - stats principales */}
      <div className="grid md:grid-cols-4 gap-4">
        <Suspense fallback={<StatCardSkeleton />}>
          <QuickStats />
        </Suspense>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Chargement moyen - graphiques */}
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        
        {/* Chargement lent - données complexes */}
        <Suspense fallback={<TableSkeleton />}>
          <RecentOrders />
        </Suspense>
      </div>

      {/* Chargement très lent - rapports */}
      <Suspense fallback={<ReportSkeleton />}>
        <DetailedReports />
      </Suspense>
    </div>
  );
}

// Composants de skeleton spécialisés
function StatCardSkeleton() {
  return (
    <div className="p-6 border rounded-lg animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="p-6 border rounded-lg animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );
}`}
              />

              <CodeExample
                title="Loading avec Indicateurs de Progression"
                code={`// app/products/loading.tsx
export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Chargement des produits</h2>
          <p className="text-muted-foreground">Récupération des dernières données...</p>
        </div>
      </div>
      
      {/* Skeleton pour la grille de produits */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border rounded-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Streaming progressif avec états multiples
export default function ProductsPage() {
  return (
    <div className="space-y-8">
      {/* Header - charge immédiatement */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Nos Produits</h1>
        <p className="text-xl text-muted-foreground">
          Découvrez notre sélection de produits
        </p>
      </div>

      {/* Filtres - charge rapidement */}
      <Suspense fallback={<FiltersSkeleton />}>
        <ProductFilters />
      </Suspense>

      {/* Produits - charge plus lentement */}
      <Suspense fallback={<ProductsLoading />}>
        <ProductGrid />
      </Suspense>

      {/* Recommandations - charge en dernier */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <ProductRecommendations />
      </Suspense>
    </div>
  );
}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exemples d'Applications Complètes</CardTitle>
              <CardDescription>
                Découvrez des applications complètes construites avec Next.js App Router
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold">Blog/CMS</h3>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <p><strong>Fonctionnalités :</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Page d'accueil avec articles récents</li>
                      <li>Liste d'articles avec pagination</li>
                      <li>Pages d'articles individuels</li>
                      <li>Catégories et tags</li>
                      <li>Recherche et filtres</li>
                      <li>Interface responsive</li>
                    </ul>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/examples/blog">
                      Voir l'exemple
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <ShoppingCart className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold">E-commerce</h3>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <p><strong>Fonctionnalités :</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Catalogue produits avec filtres</li>
                      <li>Pages produits détaillées</li>
                      <li>Panier et système de notation</li>
                      <li>Interface utilisateur moderne</li>
                      <li>Recherche avancée</li>
                      <li>Design responsive</li>
                    </ul>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/examples/ecommerce">
                      Voir l'exemple
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <User className="h-6 w-6 text-purple-600 mr-2" />
                    <h3 className="text-lg font-semibold">SaaS Dashboard</h3>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <p><strong>Modules :</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Dashboard avec métriques</li>
                      <li>Graphiques interactifs</li>
                      <li>Gestion des données</li>
                      <li>Interface d'administration</li>
                      <li>Rapports et analytics</li>
                      <li>Navigation sidebar</li>
                    </ul>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/examples/dashboard">
                      Voir l'exemple
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <Globe className="h-6 w-6 text-orange-600 mr-2" />
                    <h3 className="text-lg font-semibold">Site Corporate</h3>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <p><strong>Pages :</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Landing page optimisée</li>
                      <li>Présentation des services</li>
                      <li>Équipe et témoignages</li>
                      <li>Portfolio de projets</li>
                      <li>Formulaire de contact</li>
                      <li>Design professionnel</li>
                    </ul>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/examples/corporate">
                      Voir l'exemple
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Voir tous les exemples
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Explorez la collection complète d'exemples avec du code source détaillé 
                  et des explications pas à pas.
                </p>
                <Button asChild>
                  <Link href="/examples">
                    Accéder aux exemples
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <CodeExample
                title="Structure E-commerce Complète"
                code={`app/
├── (auth)/
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── (shop)/
│   ├── layout.tsx              # Layout avec header/footer
│   ├── page.tsx               # Page d'accueil
│   ├── products/
│   │   ├── page.tsx           # Liste produits
│   │   ├── [id]/
│   │   │   ├── page.tsx       # Détail produit
│   │   │   └── loading.tsx    # Loading produit
│   │   └── category/
│   │       └── [slug]/
│   │           └── page.tsx   # Produits par catégorie
│   ├── cart/
│   │   └── page.tsx           # Panier
│   ├── checkout/
│   │   ├── page.tsx           # Checkout
│   │   ├── success/
│   │   │   └── page.tsx       # Confirmation
│   │   └── error/
│   │       └── page.tsx       # Erreur paiement
│   └── search/
│       └── page.tsx           # Recherche
├── (account)/
│   ├── layout.tsx             # Layout compte utilisateur
│   ├── profile/
│   │   └── page.tsx           # Profil
│   ├── orders/
│   │   ├── page.tsx           # Historique commandes
│   │   └── [id]/
│   │       └── page.tsx       # Détail commande
│   └── settings/
│       └── page.tsx           # Paramètres
├── (admin)/
│   ├── layout.tsx             # Layout admin
│   ├── dashboard/
│   │   └── page.tsx           # Dashboard admin
│   ├── products/
│   │   ├── page.tsx           # Gestion produits
│   │   ├── new/
│   │   │   └── page.tsx       # Nouveau produit
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx   # Éditer produit
│   └── orders/
│       └── page.tsx           # Gestion commandes
├── api/
│   ├── products/
│   │   └── route.ts           # API produits
│   ├── cart/
│   │   └── route.ts           # API panier
│   └── orders/
│       └── route.ts           # API commandes
├── globals.css
├── layout.tsx                 # Layout racine
└── not-found.tsx             # Page 404`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patterns Avancés</CardTitle>
              <CardDescription>
                Techniques avancées pour optimiser vos applications Next.js
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="Parallel Routes et Intercepting Routes"
                code={`// Structure pour modal avec intercepting routes
app/
├── @modal/
│   ├── (..)photo/
│   │   └── [id]/
│   │       └── page.tsx       # Modal photo
│   └── default.tsx            # Slot par défaut
├── photo/
│   └── [id]/
│       └── page.tsx           # Page photo complète
├── layout.tsx                 # Layout avec slot modal
└── page.tsx                   # Page principale

// app/layout.tsx
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div>
      {children}
      {modal}
    </div>
  );
}

// app/@modal/(..)photo/[id]/page.tsx
import { Modal } from '@/components/modal';

export default function PhotoModal({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <div className="max-w-2xl mx-auto">
        <img 
          src={\`/photos/\${params.id}.jpg\`} 
          alt="Photo" 
          className="w-full h-auto"
        />
      </div>
    </Modal>
  );
}

// Parallel routes pour dashboard
app/dashboard/
├── @analytics/
│   ├── page.tsx               # Composant analytics
│   └── loading.tsx            # Loading analytics
├── @revenue/
│   ├── page.tsx               # Composant revenue
│   └── loading.tsx            # Loading revenue
├── layout.tsx                 # Layout avec slots
└── page.tsx                   # Page principale

// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  revenue,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  revenue: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>{analytics}</div>
      <div>{revenue}</div>
      <div className="col-span-2">{children}</div>
    </div>
  );
}`}
              />

              <CodeExample
                title="Middleware et Redirections Avancées"
                code={`// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Redirection pour anciennes URLs
  if (pathname.startsWith('/old-blog')) {
    return NextResponse.redirect(
      new URL(pathname.replace('/old-blog', '/blog'), request.url)
    );
  }
  
  // Protection routes admin
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token');
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // A/B Testing
  if (pathname === '/') {
    const variant = Math.random() > 0.5 ? 'a' : 'b';
    const response = NextResponse.next();
    response.cookies.set('ab-test', variant);
    return response;
  }
  
  // Géolocalisation
  const country = request.geo?.country || 'US';
  if (pathname.startsWith('/shop') && country === 'FR') {
    return NextResponse.rewrite(new URL('/shop/fr' + pathname, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};`}
              />

              <CodeExample
                title="Optimisation et Performance"
                code={`// Optimisation des images avec Next.js
import Image from 'next/image';

export function ProductCard({ product }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={200}
        className="w-full h-48 object-cover"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={product.featured}
      />
      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-green-600 font-bold">{product.price}€</p>
      </div>
    </div>
  );
}

// Lazy loading avec dynamic imports
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/heavy-component'), {
  loading: () => <div>Chargement...</div>,
  ssr: false, // Désactive le SSR pour ce composant
});

const ChartComponent = dynamic(() => import('@/components/chart'), {
  loading: () => <ChartSkeleton />,
});

// Optimisation des fonts
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={\`\${inter.variable} \${robotoMono.variable}\`}>
      <body className="font-sans">{children}</body>
    </html>
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