import { QueryClient, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';
import { SSRSearchContent } from './search-content';
import { SSRSearchWrapper } from './ssr-search-wrapper';

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

// API Functions côté serveur
const serverSearchApi = {
  searchProducts: async (filters: SearchFilters): Promise<Product[]> => {
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

export default async function SSRSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string }>;
}) {
  const queryClient = new QueryClient();
  const { q, category, status } = await searchParams;

  // Extraire les paramètres de recherche de l'URL
  const filters: SearchFilters = {
    query: q || '',
    category: category || '',
    status: status || ''
  };

  // Précharger les données côté serveur
  await Promise.all([
    // Précharger les catégories (toujours nécessaires)
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: serverSearchApi.getCategories,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }),

    // Précharger les produits vedettes
    queryClient.prefetchQuery({
      queryKey: ['products', 'featured'],
      queryFn: serverSearchApi.getFeaturedProducts,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),

    // Précharger les résultats de recherche si des filtres sont présents
    ...(filters.query || filters.category || filters.status ? [
      queryClient.prefetchQuery({
        queryKey: ['products', 'search', filters],
        queryFn: () => serverSearchApi.searchProducts(filters),
        staleTime: 2 * 60 * 1000, // 2 minutes
      })
    ] : [])
  ]);

  return (
    <SSRSearchWrapper dehydratedState={dehydrate(queryClient)}>
      <Suspense fallback={<div>Chargement...</div>}>
        <SSRSearchContent initialFilters={filters} />
      </Suspense>
    </SSRSearchWrapper>
  );
}