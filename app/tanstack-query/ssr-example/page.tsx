import { QueryClient, dehydrate } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/posts';
import { SSRUsersList } from './users-list';
import { SSRClientWrapper } from '../ssr-vs-client/ssr-client-wrapper';

export default async function SSRExamplePage() {
  const queryClient = new QueryClient();

  // Précharger les données côté serveur
  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: usersApi.getUsers,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Exemple SSR avec TanStack Query</h1>
        <p className="text-xl text-muted-foreground">
          Cette page démontre l'utilisation de TanStack Query avec le Server-Side Rendering.
          Les données sont préchargées côté serveur et hydratées côté client.
        </p>
      </div>

      <SSRClientWrapper dehydratedState={dehydratedState}>
        <SSRUsersList />
      </SSRClientWrapper>
    </div>
  );
}