import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  User, 
  Clock,
  ArrowLeft,
  Share2,
  Heart,
  Bookmark,
  Eye
} from 'lucide-react';
import Link from 'next/link';

// Simulated blog post data
const blogPosts = {
  "introduction-nextjs-15-app-router": {
    id: 1,
    title: "Introduction à Next.js 15 et App Router",
    slug: "introduction-nextjs-15-app-router",
    content: `
# Introduction à Next.js 15 et App Router

Next.js 15 apporte de nombreuses améliorations significatives, notamment avec l'App Router qui révolutionne la façon dont nous structurons nos applications React.

## Qu'est-ce que l'App Router ?

L'App Router est une nouvelle approche pour gérer le routage dans Next.js. Contrairement au Pages Router traditionnel, l'App Router utilise le système de fichiers pour définir les routes, mais avec une structure plus flexible et puissante.

### Avantages principaux :

1. **Layouts imbriqués** : Possibilité de créer des layouts qui persistent entre les pages
2. **Loading states** : Gestion native des états de chargement
3. **Error boundaries** : Gestion d'erreurs au niveau des routes
4. **Server Components** : Rendu côté serveur par défaut
5. **Streaming** : Chargement progressif du contenu

## Structure des fichiers

Avec l'App Router, chaque dossier dans le répertoire \`app\` représente une route. Les fichiers spéciaux incluent :

- \`page.tsx\` : Définit l'interface utilisateur d'une route
- \`layout.tsx\` : Définit l'interface utilisateur partagée entre plusieurs routes
- \`loading.tsx\` : Définit l'interface de chargement
- \`error.tsx\` : Définit l'interface d'erreur
- \`not-found.tsx\` : Définit l'interface 404

## Exemple pratique

\`\`\`typescript
// app/blog/page.tsx
export default function BlogPage() {
  return (
    <div>
      <h1>Blog</h1>
      <p>Liste des articles</p>
    </div>
  );
}

// app/blog/layout.tsx
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-layout">
      <nav>Navigation du blog</nav>
      {children}
    </div>
  );
}
\`\`\`

## Migration depuis Pages Router

La migration vers l'App Router peut se faire progressivement. Vous pouvez commencer par migrer certaines routes tout en gardant d'autres dans le Pages Router.

## Conclusion

Next.js 15 avec l'App Router offre une expérience de développement améliorée et de meilleures performances pour vos applications React. C'est un investissement qui en vaut la peine pour tout développeur React moderne.
    `,
    author: "Marie Dubois",
    authorAvatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    publishedAt: "2024-01-15",
    readTime: "8 min",
    views: 1234,
    category: "Développement",
    tags: ["Next.js", "React", "JavaScript"],
    image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop"
  },
  "optimisation-performances-server-components": {
    id: 2,
    title: "Optimisation des performances avec Server Components",
    slug: "optimisation-performances-server-components",
    content: `
# Optimisation des performances avec Server Components

Les Server Components révolutionnent la façon dont nous pensons les performances dans les applications React. Ils permettent de déplacer la logique de rendu côté serveur, réduisant ainsi la taille du bundle JavaScript et améliorant les performances.

## Qu'est-ce qu'un Server Component ?

Un Server Component est un composant React qui s'exécute exclusivement côté serveur. Il peut accéder directement aux bases de données, aux APIs, et aux ressources serveur sans exposer ces détails au client.

### Avantages des Server Components :

1. **Bundle JavaScript réduit** : Le code des Server Components n'est pas envoyé au client
2. **Accès direct aux données** : Pas besoin d'API routes pour les données simples
3. **Sécurité renforcée** : Les clés API et secrets restent côté serveur
4. **Performance améliorée** : Moins de JavaScript à télécharger et exécuter

## Exemple pratique

\`\`\`typescript
// Server Component
async function UserProfile({ userId }: { userId: string }) {
  // Cette requête s'exécute côté serveur
  const user = await db.user.findUnique({
    where: { id: userId }
  });

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// Client Component
'use client';

import { useState } from 'react';

function InteractiveButton() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Cliqué {count} fois
    </button>
  );
}
\`\`\`

## Bonnes pratiques

1. **Utilisez Server Components par défaut** : Sauf si vous avez besoin d'interactivité
2. **Minimisez les Client Components** : Utilisez-les uniquement quand nécessaire
3. **Composition intelligente** : Combinez Server et Client Components efficacement
4. **Gestion des erreurs** : Implémentez des error boundaries appropriés

## Mesurer les performances

Utilisez les outils de développement pour mesurer l'impact des Server Components :

- **Lighthouse** : Pour les métriques de performance web
- **React DevTools** : Pour analyser le rendu des composants
- **Next.js Bundle Analyzer** : Pour analyser la taille du bundle

## Conclusion

Les Server Components sont un outil puissant pour optimiser les performances de vos applications React. En comprenant quand et comment les utiliser, vous pouvez créer des applications plus rapides et plus efficaces.
    `,
    author: "Thomas Martin",
    authorAvatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    publishedAt: "2024-01-12",
    readTime: "12 min",
    views: 856,
    category: "Performance",
    tags: ["React", "Performance", "SSR"],
    image: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop"
  }
};

interface PageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = blogPosts[params.slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article non trouvé</h1>
          <p className="text-gray-600 mb-8">L'article que vous cherchez n'existe pas.</p>
          <Button asChild>
            <Link href="/examples/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/examples/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au blog
              </Link>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bookmark className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-12">
            <div className="mb-6">
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
                {post.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                {post.title}
              </h1>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <img 
                    src={post.authorAvatar} 
                    alt={post.author}
                    className="w-12 h-12 rounded-full ring-2 ring-blue-200"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{post.author}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{post.publishedAt}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.views} vues</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-xl"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: post.content.replace(/\n/g, '<br>').replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code>$2</code></pre>').replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded">$1</code>').replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-8 mb-4">$1</h3>').replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>').replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-6">$1</h1>').replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>').replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
                }}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/examples/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Tous les articles
                </Link>
              </Button>
              <Button asChild>
                <Link href="/examples/blog">
                  Lire d'autres articles
                </Link>
              </Button>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }));
}