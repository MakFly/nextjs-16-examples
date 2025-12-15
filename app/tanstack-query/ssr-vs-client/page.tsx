import { QueryClient, dehydrate } from '@tanstack/react-query';
import { SSRClientWrapper } from './ssr-client-wrapper';
import { SSRClientComparison } from './comparison-content';

// API Functions côté serveur
const serverApi = {
  getUsers: async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  getPosts: async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=20');
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  },

  getTodos: async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=15');
    if (!response.ok) throw new Error('Failed to fetch todos');
    return response.json();
  },

  getComments: async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=25');
    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
  }
};

export default async function SSRVsClientPage() {
  const queryClient = new QueryClient();

  // Précharger toutes les données côté serveur en parallèle
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['users', 'ssr'],
      queryFn: serverApi.getUsers,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
    queryClient.prefetchQuery({
      queryKey: ['posts', 'ssr'],
      queryFn: serverApi.getPosts,
      staleTime: 5 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ['todos', 'ssr'],
      queryFn: serverApi.getTodos,
      staleTime: 5 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ['comments', 'ssr'],
      queryFn: serverApi.getComments,
      staleTime: 5 * 60 * 1000,
    })
  ]);

  return (
    <SSRClientWrapper dehydratedState={dehydrate(queryClient)}>
      <SSRClientComparison />
    </SSRClientWrapper>
  );
}