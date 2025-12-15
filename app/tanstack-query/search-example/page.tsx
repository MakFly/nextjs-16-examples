'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useQueries, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CodeExample } from '@/components/code-example';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  X,
  Loader2,
  Users,
  Building,
  Mail,
  MapPin,
  Calendar,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Types
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface SearchFilters {
  query: string;
  company: string;
  city: string;
  verified: boolean;
}

interface PostFilters {
  search: string;
  userId: number | null;
  sortBy: 'title' | 'id';
  sortOrder: 'asc' | 'desc';
}

// API Functions
const searchApi = {
  // Recherche d'utilisateurs avec filtres
  searchUsers: async (filters: SearchFilters): Promise<User[]> => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    
    const users: User[] = await response.json();
    
    return users.filter(user => {
      const matchesQuery = !filters.query || 
        user.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.query.toLowerCase()) ||
        user.username.toLowerCase().includes(filters.query.toLowerCase());
      
      const matchesCompany = !filters.company || 
        user.company.name.toLowerCase().includes(filters.company.toLowerCase());
      
      const matchesCity = !filters.city || 
        user.address.city.toLowerCase().includes(filters.city.toLowerCase());
      
      // Simulation du filtre "verified" basé sur l'ID pair
      const matchesVerified = !filters.verified || user.id % 2 === 0;
      
      return matchesQuery && matchesCompany && matchesCity && matchesVerified;
    });
  },

  // Recherche de posts avec filtres avancés
  searchPosts: async (filters: PostFilters): Promise<Post[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) throw new Error('Failed to fetch posts');
    
    let posts: Post[] = await response.json();
    
    // Filtrage
    if (filters.search) {
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        post.body.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.userId) {
      posts = posts.filter(post => post.userId === filters.userId);
    }
    
    // Tri
    posts.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];
      
      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return posts;
  },

  // Obtenir les options de filtres
  getFilterOptions: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const [usersResponse, postsResponse] = await Promise.all([
      fetch('https://jsonplaceholder.typicode.com/users'),
      fetch('https://jsonplaceholder.typicode.com/posts')
    ]);
    
    const users: User[] = await usersResponse.json();
    const posts: Post[] = await postsResponse.json();
    
    const companies = Array.from(new Set(users.map(u => u.company.name)));
    const cities = Array.from(new Set(users.map(u => u.address.city)));
    const userOptions = users.map(u => ({ id: u.id, name: u.name }));
    
    return { companies, cities, users: userOptions };
  }
};

// Hook personnalisé pour la recherche avec debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Composant de recherche simple
function SimpleSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 500);

  const { data: users, isLoading, error, isFetching } = useQuery({
    queryKey: ['users', 'search', debouncedQuery],
    queryFn: () => searchApi.searchUsers({
      query: debouncedQuery,
      company: '',
      city: '',
      verified: false
    }),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30 * 1000, // 30 secondes
    placeholderData: [],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="mr-2 h-5 w-5" />
          Recherche Simple
        </CardTitle>
        <CardDescription>
          Recherche d'utilisateurs avec debouncing automatique
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par nom, email ou username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {isFetching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-blue-600" />
          )}
        </div>

        {debouncedQuery.length > 0 && debouncedQuery.length < 2 && (
          <p className="text-sm text-gray-500">
            Tapez au moins 2 caractères pour rechercher
          </p>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">
              Erreur: {(error as Error).message}
            </p>
          </div>
        )}

        {debouncedQuery.length >= 2 && (
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2">Recherche en cours...</span>
              </div>
            ) : users && users.length > 0 ? (
              <>
                <p className="text-sm text-gray-600">
                  {users.length} résultat(s) trouvé(s) pour "{debouncedQuery}"
                </p>
                <div className="grid gap-3">
                  {users.map(user => (
                    <div key={user.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Building className="h-3 w-3 mr-1" />
                            {user.company.name}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {user.address.city}
                          </p>
                        </div>
                        <Badge variant={user.id % 2 === 0 ? "default" : "secondary"}>
                          {user.id % 2 === 0 ? "Vérifié" : "Standard"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center p-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun utilisateur trouvé pour "{debouncedQuery}"</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Composant de recherche avancée avec filtres
function AdvancedSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    company: '',
    city: '',
    verified: false
  });

  const [postFilters, setPostFilters] = useState<PostFilters>({
    search: '',
    userId: null,
    sortBy: 'title',
    sortOrder: 'asc'
  });

  const debouncedFilters = useDebounce(filters, 500);
  const debouncedPostFilters = useDebounce(postFilters, 500);

  // Requêtes parallèles pour les options de filtres et les résultats
  const queries = useQueries({
    queries: [
      {
        queryKey: ['filter-options'],
        queryFn: searchApi.getFilterOptions,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
      {
        queryKey: ['users', 'advanced-search', debouncedFilters],
        queryFn: () => searchApi.searchUsers(debouncedFilters),
        enabled: debouncedFilters.query.length >= 2 || 
                 debouncedFilters.company.length > 0 || 
                 debouncedFilters.city.length > 0 || 
                 debouncedFilters.verified,
        staleTime: 30 * 1000,
      },
      {
        queryKey: ['posts', 'search', debouncedPostFilters],
        queryFn: () => searchApi.searchPosts(debouncedPostFilters),
        enabled: debouncedPostFilters.search.length >= 2 || debouncedPostFilters.userId !== null,
        staleTime: 30 * 1000,
      }
    ]
  });

  const [optionsQuery, usersQuery, postsQuery] = queries;

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const updatePostFilter = (key: keyof PostFilters, value: any) => {
    setPostFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      company: '',
      city: '',
      verified: false
    });
    setPostFilters({
      search: '',
      userId: null,
      sortBy: 'title',
      sortOrder: 'asc'
    });
    toast.success('Filtres réinitialisés');
  };

  const hasActiveFilters = filters.query || filters.company || filters.city || filters.verified ||
                          postFilters.search || postFilters.userId;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Recherche Avancée avec Filtres
            </div>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Effacer
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            Recherche multi-critères avec filtres dynamiques
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filtres pour utilisateurs */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="user-search">Recherche utilisateurs</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="user-search"
                  placeholder="Nom, email..."
                  value={filters.query}
                  onChange={(e) => updateFilter('query', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="company-filter">Entreprise</Label>
              <Select value={filters.company || "all-companies"} onValueChange={(value) => updateFilter('company', value === "all-companies" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les entreprises" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-companies">Toutes les entreprises</SelectItem>
                  {optionsQuery.data?.companies.map(company => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="city-filter">Ville</Label>
              <Select value={filters.city || "all-cities"} onValueChange={(value) => updateFilter('city', value === "all-cities" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les villes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-cities">Toutes les villes</SelectItem>
                  {optionsQuery.data?.cities.map(city => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="verified-filter"
                checked={filters.verified}
                onCheckedChange={(checked) => updateFilter('verified', checked)}
              />
              <Label htmlFor="verified-filter">Utilisateurs vérifiés</Label>
            </div>
          </div>

          {/* Filtres pour posts */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
            <div>
              <Label htmlFor="post-search">Recherche posts</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="post-search"
                  placeholder="Titre, contenu..."
                  value={postFilters.search}
                  onChange={(e) => updatePostFilter('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="author-filter">Auteur</Label>
              <Select 
                value={postFilters.userId?.toString() || "all-authors"} 
                onValueChange={(value) => updatePostFilter('userId', value === "all-authors" ? null : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les auteurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-authors">Tous les auteurs</SelectItem>
                  {optionsQuery.data?.users.map(user => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sort-by">Trier par</Label>
              <Select value={postFilters.sortBy} onValueChange={(value: 'title' | 'id') => updatePostFilter('sortBy', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Titre</SelectItem>
                  <SelectItem value="id">ID</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sort-order">Ordre</Label>
              <Select value={postFilters.sortOrder} onValueChange={(value: 'asc' | 'desc') => updatePostFilter('sortOrder', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Croissant</SelectItem>
                  <SelectItem value="desc">Décroissant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résultats utilisateurs */}
      {(debouncedFilters.query.length >= 2 || debouncedFilters.company || debouncedFilters.city || debouncedFilters.verified) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Résultats Utilisateurs</span>
              {usersQuery.isFetching && (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usersQuery.isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2">Recherche en cours...</span>
              </div>
            ) : usersQuery.error ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  Erreur: {(usersQuery.error as Error).message}
                </p>
              </div>
            ) : usersQuery.data && usersQuery.data.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  {usersQuery.data.length} utilisateur(s) trouvé(s)
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {usersQuery.data.map(user => (
                    <div key={user.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-gray-600">@{user.username}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-600">{user.company.name}</p>
                          <p className="text-sm text-gray-600">{user.address.city}</p>
                        </div>
                        <Badge variant={user.id % 2 === 0 ? "default" : "secondary"}>
                          {user.id % 2 === 0 ? "Vérifié" : "Standard"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun utilisateur trouvé avec ces critères</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Résultats posts */}
      {(debouncedPostFilters.search.length >= 2 || debouncedPostFilters.userId) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Résultats Posts</span>
              {postsQuery.isFetching && (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {postsQuery.isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2">Recherche en cours...</span>
              </div>
            ) : postsQuery.error ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">
                  Erreur: {(postsQuery.error as Error).message}
                </p>
              </div>
            ) : postsQuery.data && postsQuery.data.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  {postsQuery.data.length} post(s) trouvé(s)
                </p>
                <div className="space-y-4">
                  {postsQuery.data.slice(0, 10).map(post => (
                    <div key={post.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{post.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{post.body}</p>
                        </div>
                        <div className="ml-4 text-right">
                          <Badge variant="outline">#{post.id}</Badge>
                          <p className="text-xs text-gray-500 mt-1">User {post.userId}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun post trouvé avec ces critères</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Composant principal avec QueryClient
function SearchExampleContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Button variant="ghost" asChild>
            <Link href="/tanstack-query">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à TanStack Query
            </Link>
          </Button>
        </div>
        <h1 className="text-4xl font-bold mb-4">Recherche et Filtres avec TanStack Query</h1>
        <p className="text-xl text-muted-foreground">
          Exemples de recherche simple et avancée avec filtres dynamiques et debouncing.
        </p>
      </div>

      <div className="space-y-8">
        <SimpleSearch />
        <AdvancedSearch />

        {/* Code Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Exemples de Code</CardTitle>
            <CardDescription>
              Implémentation des patterns de recherche et filtrage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <CodeExample
              title="Hook de Debounce Personnalisé"
              code={`function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Utilisation
const [searchQuery, setSearchQuery] = useState('');
const debouncedQuery = useDebounce(searchQuery, 500);

const { data, isLoading } = useQuery({
  queryKey: ['search', debouncedQuery],
  queryFn: () => searchApi.search(debouncedQuery),
  enabled: debouncedQuery.length >= 2,
  staleTime: 30 * 1000,
});`}
            />

            <CodeExample
              title="Requêtes Parallèles avec useQueries"
              code={`const queries = useQueries({
  queries: [
    {
      queryKey: ['filter-options'],
      queryFn: searchApi.getFilterOptions,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    {
      queryKey: ['users', 'search', debouncedFilters],
      queryFn: () => searchApi.searchUsers(debouncedFilters),
      enabled: hasValidFilters(debouncedFilters),
      staleTime: 30 * 1000,
    },
    {
      queryKey: ['posts', 'search', debouncedPostFilters],
      queryFn: () => searchApi.searchPosts(debouncedPostFilters),
      enabled: hasValidPostFilters(debouncedPostFilters),
      staleTime: 30 * 1000,
    }
  ]
});

const [optionsQuery, usersQuery, postsQuery] = queries;`}
            />

            <CodeExample
              title="API de Recherche avec Filtres"
              code={`const searchApi = {
  searchUsers: async (filters: SearchFilters): Promise<User[]> => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const response = await fetch('https://api.example.com/users');
    const users: User[] = await response.json();
    
    return users.filter(user => {
      const matchesQuery = !filters.query || 
        user.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.query.toLowerCase());
      
      const matchesCompany = !filters.company || 
        user.company.name.toLowerCase().includes(filters.company.toLowerCase());
      
      const matchesCity = !filters.city || 
        user.address.city.toLowerCase().includes(filters.city.toLowerCase());
      
      const matchesVerified = !filters.verified || user.verified;
      
      return matchesQuery && matchesCompany && matchesCity && matchesVerified;
    });
  },

  searchPosts: async (filters: PostFilters): Promise<Post[]> => {
    const response = await fetch('https://api.example.com/posts');
    let posts: Post[] = await response.json();
    
    // Filtrage
    if (filters.search) {
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        post.body.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.userId) {
      posts = posts.filter(post => post.userId === filters.userId);
    }
    
    // Tri
    posts.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];
      
      return filters.sortOrder === 'asc' 
        ? (aValue > bValue ? 1 : -1)
        : (aValue < bValue ? 1 : -1);
    });
    
    return posts;
  }
};`}
            />
          </CardContent>
        </Card>
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

export default function SearchExamplePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchExampleContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}