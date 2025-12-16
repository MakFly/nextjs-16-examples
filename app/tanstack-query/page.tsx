'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CodeExample } from '@/components/code-example';
import { WhyWhenTabs } from '@/components/why-when-tabs';
import {
  Database,
  Zap,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  AlertCircle,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from 'sonner';
import Link from 'next/link';

const tanstackQueryWhyWhen = {
  why: {
    title: "Pourquoi TanStack Query ?",
    description: "TanStack Query (anciennement React Query) est la solution standard pour gérer l'état serveur dans les applications React. Elle gère automatiquement le caching, la synchronisation, les refetch en arrière-plan, et les états de chargement/erreur, vous permettant de vous concentrer sur l'UI plutôt que sur la plomberie.",
    benefits: [
      "Cache intelligent avec stale-while-revalidate par défaut",
      "Refetch automatique (window focus, network reconnect, interval)",
      "Déduplication des requêtes identiques",
      "États loading, error, success gérés automatiquement",
      "Pagination et infinite scroll intégrés",
      "Mutations avec optimistic updates simples",
      "DevTools puissants pour déboguer le cache",
      "Prefetching pour des navigations instantanées"
    ],
    problemsSolved: [
      "Gestion manuelle des états loading/error dans chaque composant",
      "Requêtes dupliquées quand plusieurs composants demandent les mêmes données",
      "Données obsolètes après des mutations",
      "Complexité de l'implémentation du cache côté client",
      "Synchronisation manuelle avec les données serveur",
      "Race conditions lors de requêtes multiples"
    ]
  },
  when: {
    idealCases: [
      {
        title: "Applications data-intensive",
        description: "Dashboards, admin panels, CRM - tout ce qui affiche beaucoup de données provenant d'APIs.",
        example: "useQuery({ queryKey: ['users'], queryFn: fetchUsers })"
      },
      {
        title: "Listes avec pagination/infinite scroll",
        description: "Feeds sociaux, catalogues produits, résultats de recherche.",
        example: "useInfiniteQuery pour charger plus de données au scroll"
      },
      {
        title: "Données partagées entre composants",
        description: "Plusieurs composants affichent les mêmes données (user profile dans header et sidebar).",
        example: "Le cache partage automatiquement les données entre composants"
      },
      {
        title: "Applications temps réel ou fréquemment mises à jour",
        description: "Prix de bourse, notifications, statuts en temps réel.",
        example: "refetchInterval: 5000 pour polling automatique"
      }
    ],
    avoidCases: [
      {
        title: "État purement client-side",
        description: "Pour l'état UI local (modals ouverts, thème), utilisez useState ou Zustand.",
        example: "Ne pas stocker isModalOpen dans React Query"
      },
      {
        title: "Applications avec Server Components principalement",
        description: "Si vous fetchez tout côté serveur avec RSC, React Query peut être redondant.",
        example: "Pages statiques ou SSR où le cache serveur suffit"
      },
      {
        title: "Très petites applications",
        description: "Pour une app avec 1-2 endpoints simples, fetch + useState peut suffire.",
        example: "Site vitrine avec juste un formulaire de contact"
      }
    ],
    realWorldExamples: [
      {
        title: "Dashboard analytics",
        description: "Métriques, graphiques, tableaux avec refresh automatique et cache intelligent.",
        example: "useQuery(['metrics', dateRange], fetchMetrics, { staleTime: 60000 })"
      },
      {
        title: "E-commerce - Liste de produits",
        description: "Filtres, tri, pagination avec prefetch des pages suivantes.",
        example: "useQuery(['products', filters], fetchProducts) + prefetch page suivante"
      },
      {
        title: "Système de commentaires",
        description: "Liste de commentaires avec ajout optimiste et invalidation après mutation.",
        example: "useMutation + queryClient.setQueryData pour optimistic update"
      },
      {
        title: "Recherche avec autocomplete",
        description: "Suggestions en temps réel avec debounce et cache des résultats.",
        example: "useQuery(['search', debouncedTerm], search, { enabled: term.length > 2 })"
      },
      {
        title: "Profil utilisateur",
        description: "Données utilisateur cachées et partagées entre header, sidebar, et page profil.",
        example: "useQuery(['user', userId]) utilisé dans plusieurs composants"
      },
      {
        title: "Feed social infini",
        description: "Infinite scroll avec maintien de la position, prefetch, et nouveaux posts.",
        example: "useInfiniteQuery(['feed'], fetchFeedPage, { getNextPageParam })"
      }
    ]
  }
};

// Types
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

// API Functions
const api = {
  // Users
  getUsers: async (): Promise<User[]> => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  getUser: async (id: number): Promise<User> => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  // Posts
  getPosts: async (page = 1, limit = 10): Promise<Post[]> => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  },

  createPost: async (post: Omit<Post, 'id'>): Promise<Post> => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    if (!response.ok) throw new Error('Failed to create post');
    return response.json();
  },

  updatePost: async (post: Post): Promise<Post> => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    if (!response.ok) throw new Error('Failed to update post');
    return response.json();
  },

  deletePost: async (id: number): Promise<void> => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete post');
  },

  // Todos
  getTodos: async (): Promise<Todo[]> => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=20');
    if (!response.ok) throw new Error('Failed to fetch todos');
    return response.json();
  },

  // Search
  searchPosts: async (query: string): Promise<Post[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) throw new Error('Failed to search posts');
    const posts: Post[] = await response.json();
    return posts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.body.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// Basic Query Example
function BasicQueryExample() {
  const { data: users, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="h-8 w-8 text-blue-600" />
        <span className="ml-2">Chargement des utilisateurs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <XCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">Erreur: {(error as Error).message}</span>
        </div>
        <Button onClick={() => refetch()} className="mt-3" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Utilisateurs ({users?.length})</h3>
        <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isFetching}>
          {isFetching ? (
            <>
              <Spinner className="h-4 w-4 mr-2" />
              Actualisation...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </>
          )}
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {users?.map(user => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{user.name}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">{user.company.name}</p>
                </div>
                <Badge variant="secondary">{user.id}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Mutation Example
function MutationExample() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: api.createPost,
    onSuccess: (newPost) => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post créé avec succès!');
      setTitle('');
      setBody('');
    },
    onError: (error) => {
      toast.error(`Erreur: ${(error as Error).message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    createPostMutation.mutate({
      title,
      body,
      userId: 1,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Créer un nouveau post
        </CardTitle>
        <CardDescription>
          Exemple de mutation avec TanStack Query
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du post"
              disabled={createPostMutation.isPending}
            />
          </div>
          
          <div>
            <Label htmlFor="body">Contenu</Label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Contenu du post"
              className="w-full p-2 border rounded-md"
              rows={4}
              disabled={createPostMutation.isPending}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={createPostMutation.isPending || !title.trim() || !body.trim()}
            className="w-full"
          >
            {createPostMutation.isPending ? (
              <>
                <Spinner className="h-4 w-4 mr-2" />
                Création...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Créer le post
              </>
            )}
          </Button>
        </form>

        {createPostMutation.isSuccess && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800">Post créé avec succès!</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Infinite Query Example
function InfiniteQueryExample() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: ({ pageParam = 1 }) => api.getPosts(pageParam, 5),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 5 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="h-8 w-8 text-blue-600" />
        <span className="ml-2">Chargement des posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <XCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">Erreur: {(error as Error).message}</span>
        </div>
      </div>
    );
  }

  const posts = data?.pages.flat() || [];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Posts avec pagination infinie</h3>
      
      <div className="space-y-3">
        {posts.map(post => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">{post.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{post.body}</p>
                </div>
                <Badge variant="outline">#{post.id}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasNextPage && (
        <div className="text-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? (
              <>
                <Spinner className="h-4 w-4 mr-2" />
                Chargement...
              </>
            ) : (
              'Charger plus'
            )}
          </Button>
        </div>
      )}

      {!hasNextPage && posts.length > 0 && (
        <div className="text-center text-gray-500 py-4">
          Tous les posts ont été chargés
        </div>
      )}
    </div>
  );
}

// Search Example with Debouncing
function SearchExample() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['posts', 'search', debouncedQuery],
    queryFn: () => api.searchPosts(debouncedQuery),
    enabled: debouncedQuery.length > 2,
    staleTime: 30 * 1000, // 30 seconds
  });

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="search">Rechercher des posts</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tapez au moins 3 caractères..."
            className="pl-10"
          />
        </div>
      </div>

          {debouncedQuery.length > 2 && (
        <div>
          {isLoading && (
            <div className="flex items-center p-4">
              <Spinner className="h-4 w-4 mr-2" />
              <span>Recherche en cours...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800">Erreur: {(error as Error).message}</span>
              </div>
            </div>
          )}

          {searchResults && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                {searchResults.length} résultat(s) trouvé(s) pour "{debouncedQuery}"
              </p>
              
              {searchResults.map(post => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{post.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{post.body}</p>
                      </div>
                      <Badge variant="outline">#{post.id}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {debouncedQuery.length <= 2 && searchQuery.length > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-800">Tapez au moins 3 caractères pour rechercher</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Cache Management Example
function CacheManagementExample() {
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
  });

  const { data: selectedUser, isLoading } = useQuery({
    queryKey: ['user', selectedUserId],
    queryFn: () => api.getUser(selectedUserId!),
    enabled: !!selectedUserId,
  });

  const prefetchUser = (userId: number) => {
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => api.getUser(userId),
      staleTime: 10 * 1000,
    });
  };

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    toast.success('Cache des utilisateurs invalidé');
  };

  const clearCache = () => {
    queryClient.clear();
    toast.success('Tout le cache a été vidé');
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
        <Button onClick={invalidateUsers} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Invalider cache utilisateurs
        </Button>
        <Button onClick={clearCache} variant="outline" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Vider tout le cache
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Liste des utilisateurs</CardTitle>
            <CardDescription>Survolez pour précharger les détails</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {users?.map(user => (
                <div
                  key={user.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onMouseEnter={() => prefetchUser(user.id)}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{user.name}</span>
                    <Badge variant={selectedUserId === user.id ? "default" : "secondary"}>
                      {user.id}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Détails de l'utilisateur</CardTitle>
            <CardDescription>
              {selectedUserId ? `Utilisateur #${selectedUserId}` : 'Sélectionnez un utilisateur'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedUserId && (
              <div className="text-center text-gray-500 py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Cliquez sur un utilisateur pour voir ses détails</p>
              </div>
            )}

            {selectedUserId && isLoading && (
              <div className="flex items-center justify-center py-8">
                <Spinner className="h-8 w-8 text-blue-600" />
              </div>
            )}

            {selectedUser && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Téléphone:</span>
                    <span className="text-sm">{selectedUser.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Site web:</span>
                    <span className="text-sm">{selectedUser.website}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Entreprise:</span>
                    <span className="text-sm">{selectedUser.company.name}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main component with QueryClient provider
function TanStackQueryContent() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 text-xs tracking-wider uppercase">
              Data Fetching
            </Badge>
            <h1 className="mb-4">TanStack Query</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Maîtrisez la gestion d&apos;état serveur avec TanStack Query : requêtes, mutations, cache et SSR.
            </p>
            <div className="w-12 h-1 bg-accent mt-6" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
      <Tabs defaultValue="why-when" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="why-when" className="flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Pourquoi/Quand</span>
            <span className="sm:hidden">?</span>
          </TabsTrigger>
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="queries">Queries</TabsTrigger>
          <TabsTrigger value="mutations">Mutations</TabsTrigger>
          <TabsTrigger value="infinite">Infinite</TabsTrigger>
          <TabsTrigger value="cache">Cache</TabsTrigger>
          <TabsTrigger value="examples">Exemples</TabsTrigger>
        </TabsList>

        <TabsContent value="why-when">
          <WhyWhenTabs why={tanstackQueryWhyWhen.why} when={tanstackQueryWhyWhen.when} />
        </TabsContent>

        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Qu'est-ce que TanStack Query ?
              </CardTitle>
              <CardDescription>
                Une bibliothèque puissante pour la gestion d'état serveur dans React
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Performance</h3>
                  <p className="text-sm text-muted-foreground">
                    Cache intelligent et synchronisation automatique
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <RefreshCw className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Synchronisation</h3>
                  <p className="text-sm text-muted-foreground">
                    Mise à jour automatique des données
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">États de chargement</h3>
                  <p className="text-sm text-muted-foreground">
                    Gestion native des états loading/error
                  </p>
                </div>
              </div>

              <CodeExample
                title="Configuration de base"
                code={`// app/layout.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        retry: 3,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Concepts clés</CardTitle>
              <CardDescription>
                Les concepts fondamentaux de TanStack Query
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-blue-600">Queries</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Récupération de données depuis le serveur
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Cache automatique et invalidation
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      États de chargement et d'erreur
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Refetch automatique
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-green-600">Mutations</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Création, mise à jour, suppression</li>
                    <li>• Invalidation optimiste du cache</li>
                    <li>• Gestion des erreurs et retry</li>
                    <li>• Callbacks de succès/erreur</li>
                    <li>• États de chargement</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exemple de Query basique</CardTitle>
              <CardDescription>
                Récupération et affichage de données avec gestion des états
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BasicQueryExample />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recherche avec debouncing</CardTitle>
              <CardDescription>
                Exemple de recherche optimisée avec délai
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SearchExample />
            </CardContent>
          </Card>

          <CodeExample
            title="Query avec options avancées"
            code={`import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const {
    data: user,
    isLoading,
    error,
    refetch,
    isFetching,
    isStale
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    
    // Options de cache
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    
    // Conditions
    enabled: !!userId, // Ne s'exécute que si userId existe
    
    // Retry
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Refetch
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 30000, // 30 secondes
    
    // Callbacks
    onSuccess: (data) => {
      console.log('User loaded:', data);
    },
    onError: (error) => {
      console.error('Failed to load user:', error);
    },
    
    // Transformation des données
    select: (data) => ({
      ...data,
      fullName: \`\${data.firstName} \${data.lastName}\`
    }),
  });

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <div>
      <h1>{user.fullName}</h1>
      <p>{user.email}</p>
      {isStale && <span>Données obsolètes</span>}
      {isFetching && <span>Mise à jour...</span>}
      <button onClick={() => refetch()}>Actualiser</button>
    </div>
  );
}`}
          />
        </TabsContent>

        <TabsContent value="mutations" className="space-y-6">
          <MutationExample />

          <CodeExample
            title="Mutation avec optimistic updates"
            code={`import { useMutation, useQueryClient } from '@tanstack/react-query';

function TodoItem({ todo }) {
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    
    // Optimistic update
    onMutate: async (newTodo) => {
      // Annuler les requêtes en cours
      await queryClient.cancelQueries({ queryKey: ['todos'] });

      // Sauvegarder l'état précédent
      const previousTodos = queryClient.getQueryData(['todos']);

      // Mise à jour optimiste
      queryClient.setQueryData(['todos'], (old) =>
        old.map(todo => 
          todo.id === newTodo.id ? { ...todo, ...newTodo } : todo
        )
      );

      // Retourner le contexte pour rollback
      return { previousTodos };
    },
    
    // En cas d'erreur, rollback
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['todos'], context.previousTodos);
    },
    
    // Toujours refetch après mutation
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const handleToggle = () => {
    updateTodoMutation.mutate({
      ...todo,
      completed: !todo.completed
    });
  };

  return (
    <div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={updateTodoMutation.isPending}
      />
      <span>{todo.title}</span>
      {updateTodoMutation.isPending && <span>Mise à jour...</span>}
    </div>
  );
}`}
          />
        </TabsContent>

        <TabsContent value="infinite" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pagination infinie</CardTitle>
              <CardDescription>
                Chargement progressif de données avec useInfiniteQuery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InfiniteQueryExample />
            </CardContent>
          </Card>

          <CodeExample
            title="useInfiniteQuery avec curseur"
            code={`import { useInfiniteQuery } from '@tanstack/react-query';

function PostsList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = null }) => fetchPosts(pageParam),
    
    getNextPageParam: (lastPage, allPages) => {
      // Retourne le curseur pour la page suivante
      return lastPage.nextCursor ?? undefined;
    },
    
    getPreviousPageParam: (firstPage, allPages) => {
      // Pour la pagination bidirectionnelle
      return firstPage.prevCursor ?? undefined;
    },
    
    initialPageParam: null,
  });

  // Intersection Observer pour le scroll infini
  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <div>
      {data.pages.map((page, i) => (
        <div key={i}>
          {page.posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ))}
      
      {/* Trigger pour le scroll infini */}
      <div ref={ref}>
        {isFetchingNextPage && <div>Chargement...</div>}
      </div>
      
      {!hasNextPage && <div>Fin des résultats</div>}
    </div>
  );
}`}
          />
        </TabsContent>

        <TabsContent value="cache" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion du cache</CardTitle>
              <CardDescription>
                Préchargement, invalidation et manipulation du cache
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CacheManagementExample />
            </CardContent>
          </Card>

          <CodeExample
            title="Manipulation avancée du cache"
            code={`import { useQueryClient } from '@tanstack/react-query';

function CacheManager() {
  const queryClient = useQueryClient();

  // Précharger des données
  const prefetchUser = async (userId) => {
    await queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
      staleTime: 10 * 1000, // 10 secondes
    });
  };

  // Invalider des queries
  const invalidateUsers = () => {
    // Invalide toutes les queries qui commencent par 'users'
    queryClient.invalidateQueries({ queryKey: ['users'] });
    
    // Invalide et refetch immédiatement
    queryClient.invalidateQueries({ 
      queryKey: ['users'], 
      refetchType: 'active' 
    });
  };

  // Mettre à jour le cache manuellement
  const updateUserInCache = (userId, updates) => {
    queryClient.setQueryData(['user', userId], (oldData) => ({
      ...oldData,
      ...updates
    }));
  };

  // Obtenir des données du cache
  const getUserFromCache = (userId) => {
    return queryClient.getQueryData(['user', userId]);
  };

  // Supprimer des queries du cache
  const removeUserFromCache = (userId) => {
    queryClient.removeQueries({ queryKey: ['user', userId] });
  };

  // Vider tout le cache
  const clearCache = () => {
    queryClient.clear();
  };

  // Obtenir l'état d'une query
  const getUserQueryState = (userId) => {
    return queryClient.getQueryState(['user', userId]);
  };

  return (
    <div>
      <button onClick={() => prefetchUser(1)}>
        Précharger utilisateur 1
      </button>
      <button onClick={invalidateUsers}>
        Invalider cache utilisateurs
      </button>
      <button onClick={() => updateUserInCache(1, { name: 'Nouveau nom' })}>
        Mettre à jour utilisateur 1
      </button>
    </div>
  );
}`}
          />
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exemples Avancés</CardTitle>
              <CardDescription>
                Découvrez des exemples concrets de recherche et SSR
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <Search className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold">Recherche Avancée</h3>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <p><strong>Fonctionnalités :</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Recherche simple avec debouncing</li>
                      <li>Filtres multiples et dynamiques</li>
                      <li>Requêtes parallèles avec useQueries</li>
                      <li>Gestion d'état avancée</li>
                      <li>Interface utilisateur réactive</li>
                    </ul>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/tanstack-query/search-example">
                      Voir l'exemple
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <Database className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold">Recherche SSR</h3>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <p><strong>Fonctionnalités :</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Préchargement côté serveur</li>
                      <li>Synchronisation avec l'URL</li>
                      <li>Hydratation optimisée</li>
                      <li>SEO et performance améliorés</li>
                      <li>Filtres persistants</li>
                    </ul>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/tanstack-query/ssr-search">
                      Voir l'exemple SSR
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <Zap className="h-6 w-6 text-purple-600 mr-2" />
                    <h3 className="text-lg font-semibold">SSR vs Client</h3>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <p><strong>Fonctionnalités :</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Comparaison directe SSR/Client</li>
                      <li>Données préchargées et mises en cache</li>
                      <li>Métriques de performance</li>
                      <li>Exemples concrets avec JSONPlaceholder</li>
                      <li>Analyse des avantages/inconvénients</li>
                    </ul>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/tanstack-query/ssr-vs-client">
                      Voir la comparaison
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Exemples pratiques
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Ces exemples démontrent des patterns réels d'utilisation de TanStack Query 
                  avec des cas d'usage concrets et du code production-ready.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button variant="outline" asChild>
                    <Link href="/tanstack-query/search-example">
                      Recherche Client-Side
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/tanstack-query/ssr-search">
                      Recherche avec SSR
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/tanstack-query/ssr-vs-client">
                      Comparaison SSR/Client
                    </Link>
                  </Button>
                </div>
              </div>

              <CodeExample
                title="Pattern de recherche avec filtres"
                code={`// Hook personnalisé pour la recherche
function useAdvancedSearch() {
  const [filters, setFilters] = useState({
    query: '',
    category: '',
    status: '',
  });

  const debouncedFilters = useDebounce(filters, 500);

  // Requêtes parallèles
  const queries = useQueries({
    queries: [
      {
        queryKey: ['filter-options'],
        queryFn: getFilterOptions,
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ['search-results', debouncedFilters],
        queryFn: () => searchWithFilters(debouncedFilters),
        enabled: hasValidFilters(debouncedFilters),
        staleTime: 30 * 1000,
      }
    ]
  });

  const [optionsQuery, resultsQuery] = queries;

  return {
    filters,
    setFilters,
    options: optionsQuery.data,
    results: resultsQuery.data,
    isLoading: resultsQuery.isLoading,
    error: resultsQuery.error,
  };
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

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

export default function TanStackQueryPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <TanStackQueryContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}