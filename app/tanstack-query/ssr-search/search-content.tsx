'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  Star,
  ShoppingCart,
  ArrowLeft,
  RefreshCw,
  Package,
  Tag,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useDebounce } from '@/lib/hooks/use-debounce';

// Types
interface SearchFilters {
  query: string;
  category: string;
  status: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// API Functions côté client
const clientSearchApi = {
  searchProducts: async (filters: SearchFilters): Promise<Product[]> => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) throw new Error('Failed to fetch products');
    
    const products: Product[] = await response.json();
    
    return products.filter(product => {
      const matchesQuery = !filters.query || 
        product.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.query.toLowerCase());
      
      const matchesCategory = !filters.category || 
        product.category === filters.category;
      
      // Simulation du filtre status basé sur le rating
      const matchesStatus = !filters.status || 
        (filters.status === 'popular' && product.rating.rate >= 4) ||
        (filters.status === 'new' && product.id > 15) ||
        (filters.status === 'sale' && product.price < 50);
      
      return matchesQuery && matchesCategory && matchesStatus;
    });
  },

  getCategories: async (): Promise<string[]> => {
    const response = await fetch('https://fakestoreapi.com/products/categories');
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const response = await fetch('https://fakestoreapi.com/products?limit=6');
    if (!response.ok) throw new Error('Failed to fetch featured products');
    return response.json();
  }
};

// Hook personnalisé pour la gestion des URL
function useSearchFilters(initialFilters: SearchFilters) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  // Synchroniser les filtres avec l'URL
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.query) params.set('q', filters.query);
    if (filters.category) params.set('category', filters.category);
    if (filters.status) params.set('status', filters.status);
    
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.replace(`/tanstack-query/ssr-search${newUrl}`, { scroll: false });
  }, [filters, router]);

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ query: '', category: '', status: '' });
    toast.success('Filtres réinitialisés');
  };

  return { filters, updateFilter, clearFilters };
}

interface SSRSearchContentProps {
  initialFilters: SearchFilters;
}

export function SSRSearchContent({ initialFilters }: SSRSearchContentProps) {
  const { filters, updateFilter, clearFilters } = useSearchFilters(initialFilters);

  // Queries avec données préchargées côté serveur
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: clientSearchApi.getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: featuredProducts, isLoading: featuredLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: clientSearchApi.getFeaturedProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { 
    data: searchResults, 
    isLoading: searchLoading, 
    isFetching: searchFetching,
    error: searchError 
  } = useQuery({
    queryKey: ['products', 'search', filters],
    queryFn: () => clientSearchApi.searchProducts(filters),
    enabled: !!(filters.query || filters.category || filters.status),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const hasActiveFilters = filters.query || filters.category || filters.status;
  const showResults = hasActiveFilters;

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
        <h1 className="text-4xl font-bold mb-4">Recherche SSR avec TanStack Query</h1>
        <p className="text-xl text-muted-foreground">
          Recherche de produits avec préchargement côté serveur et synchronisation URL.
        </p>
      </div>

      {/* Filtres de recherche */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Recherche de Produits
            </div>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Effacer
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            Les filtres sont synchronisés avec l'URL et préchargés côté serveur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search-query">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search-query"
                  placeholder="Rechercher des produits..."
                  value={filters.query}
                  onChange={(e) => updateFilter('query', e.target.value)}
                  className="pl-10"
                />
                {searchFetching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-blue-600" />
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="category-filter">Catégorie</Label>
              <Select value={filters.category || undefined} onValueChange={(value) => updateFilter('category', value === 'all' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories?.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status-filter">Statut</Label>
              <Select value={filters.status || undefined} onValueChange={(value) => updateFilter('status', value === 'all' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="popular">Populaire (4+ étoiles)</SelectItem>
                  <SelectItem value="new">Nouveau (ID &gt; 15)</SelectItem>
                  <SelectItem value="sale">En promotion (&lt; 50€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.query && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Recherche: "{filters.query}"
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('query', '')}
                  />
                </Badge>
              )}
              {filters.category && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Catégorie: {filters.category}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('category', '')}
                  />
                </Badge>
              )}
              {filters.status && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Statut: {filters.status}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilter('status', '')}
                  />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résultats de recherche */}
      {showResults ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Résultats de Recherche</span>
              {searchFetching && (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {searchLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2">Recherche en cours...</span>
              </div>
            ) : searchError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">
                  Erreur: {(searchError as Error).message}
                </p>
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  {searchResults.length} produit(s) trouvé(s)
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map(product => (
                    <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm line-clamp-2">{product.title}</h3>
                          <Badge variant="outline" className="ml-2">
                            {product.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-green-600">
                              ${product.price}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600">
                                {product.rating.rate} ({product.rating.count})
                              </span>
                            </div>
                          </div>
                          <Button size="sm">
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Ajouter
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-12 text-gray-500">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">Aucun produit trouvé</p>
                <p>Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Produits vedettes (affichés quand pas de recherche) */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Produits Vedettes
            </CardTitle>
            <CardDescription>
              Découvrez notre sélection de produits populaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            {featuredLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2">Chargement des produits vedettes...</span>
              </div>
            ) : featuredProducts ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map(product => (
                  <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm line-clamp-2">{product.title}</h3>
                        <Badge variant="outline" className="ml-2">
                          {product.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">
                            ${product.price}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">
                              {product.rating.rate} ({product.rating.count})
                            </span>
                          </div>
                        </div>
                        <Button size="sm">
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-12 text-gray-500">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Impossible de charger les produits vedettes</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Informations SSR */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCw className="mr-2 h-5 w-5" />
            Informations SSR
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-green-600">✅ Préchargé côté serveur</h3>
              <ul className="space-y-2 text-sm">
                <li>• Catégories de produits</li>
                <li>• Produits vedettes</li>
                <li>• Résultats de recherche (si filtres dans URL)</li>
                <li>• Métadonnées SEO dynamiques</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-blue-600">🔄 Hydraté côté client</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Interactions utilisateur</li>
                <li>• Mise à jour des filtres</li>
                <li>• Synchronisation URL</li>
                <li>• Requêtes en temps réel</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Avantages SSR :</strong> Temps de chargement initial réduit, 
              SEO optimisé, expérience utilisateur améliorée avec des données 
              immédiatement disponibles.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}