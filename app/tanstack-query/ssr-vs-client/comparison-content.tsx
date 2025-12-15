'use client';

import React, { useState } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Users,
  FileText,
  CheckSquare,
  MessageCircle,
  Clock,
  Zap,
  Server,
  Monitor,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  Database,
  Globe
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
  };
  address: {
    city: string;
    zipcode: string;
  };
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

// API functions côté client
const clientApi = {
  getUsers: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation délai réseau
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  getPosts: async (): Promise<Post[]> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=20');
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  },

  getTodos: async (): Promise<Todo[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=15');
    if (!response.ok) throw new Error('Failed to fetch todos');
    return response.json();
  },

  getComments: async (): Promise<Comment[]> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const response = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=25');
    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
  }
};

// Composant SSR (utilise les données préchargées)
function SSRDataDisplay() {
  const { data: users, isLoading: usersLoading, isFetching: usersFetching } = useQuery({
    queryKey: ['users'],
    queryFn: clientApi.getUsers,
    staleTime: 5 * 60 * 1000,
  });

  const { data: posts, isLoading: postsLoading, isFetching: postsFetching } = useQuery({
    queryKey: ['posts'],
    queryFn: clientApi.getPosts,
    staleTime: 5 * 60 * 1000,
  });

  const { data: todos, isLoading: todosLoading, isFetching: todosFetching } = useQuery({
    queryKey: ['todos'],
    queryFn: clientApi.getTodos,
    staleTime: 5 * 60 * 1000,
  });

  const { data: comments, isLoading: commentsLoading, isFetching: commentsFetching } = useQuery({
    queryKey: ['comments'],
    queryFn: clientApi.getComments,
    staleTime: 5 * 60 * 1000,
  });

  const isAnyLoading = usersLoading || postsLoading || todosLoading || commentsLoading;
  const isAnyFetching = usersFetching || postsFetching || todosFetching || commentsFetching;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Server className="h-5 w-5 text-blue-600" />
          <h2 className="text-2xl font-bold">Données SSR (Préchargées)</h2>
          {isAnyFetching && (
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          )}
        </div>
        <Badge variant={isAnyLoading ? "destructive" : "default"} className="flex items-center space-x-1">
          {isAnyLoading ? (
            <>
              <Clock className="h-3 w-3" />
              <span>Chargement...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-3 w-3" />
              <span>Données disponibles</span>
            </>
          )}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {users?.length || 0}
            </div>
            <p className="text-sm text-gray-600">
              {users?.slice(0, 2).map(u => u.name).join(', ')}...
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {posts?.length || 0}
            </div>
            <p className="text-sm text-gray-600">
              Derniers articles disponibles
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <CheckSquare className="h-5 w-5 mr-2 text-purple-600" />
              Tâches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {todos?.length || 0}
            </div>
            <p className="text-sm text-gray-600">
              {todos?.filter(t => t.completed).length || 0} terminées
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-orange-600" />
              Commentaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {comments?.length || 0}
            </div>
            <p className="text-sm text-gray-600">
              Commentaires récents
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Détails des données */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="posts">Articles</TabsTrigger>
          <TabsTrigger value="todos">Tâches</TabsTrigger>
          <TabsTrigger value="comments">Commentaires</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users?.slice(0, 5).map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.company.name}</p>
                    </div>
                    <Badge variant="outline">{user.address.city}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Articles Récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {posts?.slice(0, 5).map(post => (
                  <div key={post.id} className="p-3 border rounded-lg">
                    <h3 className="font-semibold mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{post.body}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="secondary">User {post.userId}</Badge>
                      <span className="text-xs text-gray-500">#{post.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="todos">
          <Card>
            <CardHeader>
              <CardTitle>Tâches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todos?.slice(0, 8).map(todo => (
                  <div key={todo.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-3">
                      {todo.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                        {todo.title}
                      </span>
                    </div>
                    <Badge variant={todo.completed ? "default" : "secondary"}>
                      {todo.completed ? "Terminé" : "En cours"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Commentaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {comments?.slice(0, 5).map(comment => (
                  <div key={comment.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm">{comment.name}</h4>
                      <Badge variant="outline">Post {comment.postId}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{comment.body}</p>
                    <p className="text-xs text-gray-500">{comment.email}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Composant Client-side (charge les données côté client)
function ClientSideDataDisplay() {
  const [enabledQueries, setEnabledQueries] = useState({
    users: false,
    posts: false,
    todos: false,
    comments: false
  });

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['client-users'],
    queryFn: clientApi.getUsers,
    enabled: enabledQueries.users,
    staleTime: 5 * 60 * 1000,
  });

  const { data: posts, isLoading: postsLoading, error: postsError } = useQuery({
    queryKey: ['client-posts'],
    queryFn: clientApi.getPosts,
    enabled: enabledQueries.posts,
    staleTime: 5 * 60 * 1000,
  });

  const { data: todos, isLoading: todosLoading, error: todosError } = useQuery({
    queryKey: ['client-todos'],
    queryFn: clientApi.getTodos,
    enabled: enabledQueries.todos,
    staleTime: 5 * 60 * 1000,
  });

  const { data: comments, isLoading: commentsLoading, error: commentsError } = useQuery({
    queryKey: ['client-comments'],
    queryFn: clientApi.getComments,
    enabled: enabledQueries.comments,
    staleTime: 5 * 60 * 1000,
  });

  const loadAllData = () => {
    setEnabledQueries({
      users: true,
      posts: true,
      todos: true,
      comments: true
    });
    toast.info('Chargement de toutes les données...');
  };

  const loadSpecificData = (type: keyof typeof enabledQueries) => {
    setEnabledQueries(prev => ({ ...prev, [type]: true }));
    toast.info(`Chargement des ${type}...`);
  };

  const isAnyLoading = usersLoading || postsLoading || todosLoading || commentsLoading;
  const hasAnyData = users || posts || todos || comments;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Monitor className="h-5 w-5 text-green-600" />
          <h2 className="text-2xl font-bold">Données Client-Side</h2>
          {isAnyLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-green-600" />
          )}
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadAllData} disabled={isAnyLoading}>
            <Database className="h-4 w-4 mr-2" />
            Charger tout
          </Button>
        </div>
      </div>

      {/* Boutons de chargement individuel */}
      <div className="grid md:grid-cols-4 gap-4">
        <Button
          variant={enabledQueries.users ? "default" : "outline"}
          onClick={() => loadSpecificData('users')}
          disabled={usersLoading}
          className="h-20 flex flex-col items-center justify-center"
        >
          {usersLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mb-1" />
          ) : (
            <Users className="h-5 w-5 mb-1" />
          )}
          <span>Utilisateurs</span>
          {users && <Badge variant="secondary" className="mt-1">{users.length}</Badge>}
        </Button>

        <Button
          variant={enabledQueries.posts ? "default" : "outline"}
          onClick={() => loadSpecificData('posts')}
          disabled={postsLoading}
          className="h-20 flex flex-col items-center justify-center"
        >
          {postsLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mb-1" />
          ) : (
            <FileText className="h-5 w-5 mb-1" />
          )}
          <span>Articles</span>
          {posts && <Badge variant="secondary" className="mt-1">{posts.length}</Badge>}
        </Button>

        <Button
          variant={enabledQueries.todos ? "default" : "outline"}
          onClick={() => loadSpecificData('todos')}
          disabled={todosLoading}
          className="h-20 flex flex-col items-center justify-center"
        >
          {todosLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mb-1" />
          ) : (
            <CheckSquare className="h-5 w-5 mb-1" />
          )}
          <span>Tâches</span>
          {todos && <Badge variant="secondary" className="mt-1">{todos.length}</Badge>}
        </Button>

        <Button
          variant={enabledQueries.comments ? "default" : "outline"}
          onClick={() => loadSpecificData('comments')}
          disabled={commentsLoading}
          className="h-20 flex flex-col items-center justify-center"
        >
          {commentsLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mb-1" />
          ) : (
            <MessageCircle className="h-5 w-5 mb-1" />
          )}
          <span>Commentaires</span>
          {comments && <Badge variant="secondary" className="mt-1">{comments.length}</Badge>}
        </Button>
      </div>

      {/* Affichage des données */}
      {hasAnyData && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {users && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Utilisateurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">{users.length}</div>
                <div className="space-y-1">
                  {users.slice(0, 3).map(user => (
                    <p key={user.id} className="text-xs text-gray-600">{user.name}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {posts && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-600" />
                  Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">{posts.length}</div>
                <div className="space-y-1">
                  {posts.slice(0, 2).map(post => (
                    <p key={post.id} className="text-xs text-gray-600 line-clamp-1">{post.title}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {todos && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <CheckSquare className="h-5 w-5 mr-2 text-purple-600" />
                  Tâches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">{todos.length}</div>
                <p className="text-sm text-gray-600">
                  {todos.filter(t => t.completed).length} terminées
                </p>
              </CardContent>
            </Card>
          )}

          {comments && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-orange-600" />
                  Commentaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600 mb-2">{comments.length}</div>
                <p className="text-sm text-gray-600">Commentaires récents</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Affichage des erreurs */}
      {(usersError || postsError || todosError || commentsError) && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-red-800 mb-2">Erreurs de chargement :</h3>
            {usersError && <p className="text-sm text-red-600">• Utilisateurs: {(usersError as Error).message}</p>}
            {postsError && <p className="text-sm text-red-600">• Articles: {(postsError as Error).message}</p>}
            {todosError && <p className="text-sm text-red-600">• Tâches: {(todosError as Error).message}</p>}
            {commentsError && <p className="text-sm text-red-600">• Commentaires: {(commentsError as Error).message}</p>}
          </CardContent>
        </Card>
      )}

      {!hasAnyData && !isAnyLoading && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-12 text-center">
            <Globe className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Aucune donnée chargée</h3>
            <p className="text-gray-600 mb-4">
              Cliquez sur les boutons ci-dessus pour charger les données depuis l'API
            </p>
            <Button onClick={loadAllData}>
              <Database className="h-4 w-4 mr-2" />
              Charger toutes les données
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Composant principal
export function SSRClientComparison() {
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
        <h1 className="text-4xl font-bold mb-4">SSR vs Client-Side avec TanStack Query</h1>
        <p className="text-xl text-muted-foreground">
          Comparaison entre le préchargement côté serveur et le chargement côté client avec mise en cache.
        </p>
      </div>

      <Tabs defaultValue="ssr" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ssr" className="flex items-center space-x-2">
            <Server className="h-4 w-4" />
            <span>SSR (Préchargé)</span>
          </TabsTrigger>
          <TabsTrigger value="client" className="flex items-center space-x-2">
            <Monitor className="h-4 w-4" />
            <span>Client-Side</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Comparaison</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ssr">
          <SSRDataDisplay />
        </TabsContent>

        <TabsContent value="client">
          <ClientSideDataDisplay />
        </TabsContent>

        <TabsContent value="comparison">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Comparaison des Approches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Server className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-600">SSR (Server-Side Rendering)</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Données immédiatement disponibles</p>
                          <p className="text-sm text-gray-600">Les données sont préchargées côté serveur</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">SEO optimisé</p>
                          <p className="text-sm text-gray-600">Contenu indexable par les moteurs de recherche</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Temps de chargement initial rapide</p>
                          <p className="text-sm text-gray-600">Pas d'attente pour les données critiques</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Cache automatique</p>
                          <p className="text-sm text-gray-600">TanStack Query met en cache les données préchargées</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Monitor className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-600">Client-Side</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Chargement à la demande</p>
                          <p className="text-sm text-gray-600">Contrôle total sur quand charger les données</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Interactivité immédiate</p>
                          <p className="text-sm text-gray-600">Interface utilisateur réactive dès le chargement</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Gestion fine des états</p>
                          <p className="text-sm text-gray-600">Loading, error, et success states granulaires</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Optimisation réseau</p>
                          <p className="text-sm text-gray-600">Charge seulement les données nécessaires</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métriques de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">~0ms</div>
                    <p className="text-sm font-medium">Temps d'affichage SSR</p>
                    <p className="text-xs text-gray-600">Données immédiatement disponibles</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">~1-2s</div>
                    <p className="text-sm font-medium">Temps de chargement Client</p>
                    <p className="text-xs text-gray-600">Dépend de la latence réseau</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-2">5min</div>
                    <p className="text-sm font-medium">Durée de cache</p>
                    <p className="text-xs text-gray-600">Configuré via staleTime</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Recommandations
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Utilisez SSR pour :</strong> Pages d'accueil, contenu critique, SEO important</p>
                  <p><strong>Utilisez Client-Side pour :</strong> Données utilisateur, contenu dynamique, interactions complexes</p>
                  <p><strong>Combinez les deux :</strong> SSR pour le contenu initial + Client-Side pour les interactions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}