'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usersApi } from '@/lib/api/posts';
import { RefreshCw, Loader2, XCircle } from 'lucide-react';

export function SSRUsersList() {
  const { data: users, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Utilisateurs ({users?.length})</h2>
          <p className="text-muted-foreground">
            Données préchargées côté serveur avec TanStack Query
          </p>
        </div>
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          disabled={isFetching}
        >
          {isFetching ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Actualiser
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users?.map(user => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{user.name}</CardTitle>
                <Badge variant="secondary">#{user.id}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Email:</span>
                  <span className="ml-2 text-muted-foreground">{user.email}</span>
                </div>
                <div>
                  <span className="font-medium">Téléphone:</span>
                  <span className="ml-2 text-muted-foreground">{user.phone}</span>
                </div>
                <div>
                  <span className="font-medium">Site web:</span>
                  <span className="ml-2 text-muted-foreground">{user.website}</span>
                </div>
                <div>
                  <span className="font-medium">Entreprise:</span>
                  <span className="ml-2 text-muted-foreground">{user.company.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Note sur le SSR</h3>
        <p className="text-blue-800 text-sm">
          Cette page utilise <code>prefetchQuery</code> côté serveur pour précharger les données.
          Les données sont ensuite hydratées côté client grâce à <code>HydrationBoundary</code>.
          Cela permet d'avoir un rendu initial rapide tout en conservant l\'interactivité côté client.
        </p>
      </div>
    </div>
  );
}