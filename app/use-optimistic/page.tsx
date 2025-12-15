'use client';

import { useState, useOptimistic, useTransition } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CodeExample } from '@/components/code-example';
import { 
  Zap, 
  MessageCircle, 
  Heart,
  ThumbsUp,
  Plus,
  Trash2,
  Edit,
  Send,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

// Types
interface Message {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  likes: number;
  isOptimistic?: boolean;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  isOptimistic?: boolean;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  likes: number;
  timestamp: Date;
  isOptimistic?: boolean;
}

// Simulated server actions
async function addMessage(text: string): Promise<Message> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate random failure
  if (Math.random() > 0.8) {
    throw new Error('Échec de l\'envoi du message');
  }
  
  return {
    id: Date.now().toString(),
    text,
    author: 'Utilisateur',
    timestamp: new Date(),
    likes: 0
  };
}

async function likeMessage(messageId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (Math.random() > 0.9) {
    throw new Error('Échec du like');
  }
}

async function addTodo(text: string): Promise<Todo> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (Math.random() > 0.85) {
    throw new Error('Échec de l\'ajout de la tâche');
  }
  
  return {
    id: Date.now().toString(),
    text,
    completed: false
  };
}

async function toggleTodo(todoId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  if (Math.random() > 0.9) {
    throw new Error('Échec de la mise à jour');
  }
}

async function deleteTodo(todoId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (Math.random() > 0.9) {
    throw new Error('Échec de la suppression');
  }
}

async function createPost(title: string, content: string): Promise<Post> {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (Math.random() > 0.8) {
    throw new Error('Échec de la création du post');
  }
  
  return {
    id: Date.now().toString(),
    title,
    content,
    author: 'Auteur',
    likes: 0,
    timestamp: new Date()
  };
}

// Simple Chat Example
function SimpleChatExample() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Comment allez-vous ?',
      author: 'Alice',
      timestamp: new Date(Date.now() - 300000),
      likes: 2
    },
    {
      id: '2',
      text: 'Très bien merci ! Et vous ?',
      author: 'Bob',
      timestamp: new Date(Date.now() - 180000),
      likes: 1
    }
  ]);
  
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: Message) => [...state, newMessage]
  );
  
  const [isPending, startTransition] = useTransition();
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      text: newMessage,
      author: 'Vous',
      timestamp: new Date(),
      likes: 0,
      isOptimistic: true
    };

    startTransition(async () => {
      addOptimisticMessage(optimisticMessage);
      setNewMessage('');

      try {
        const serverMessage = await addMessage(newMessage);
        setMessages(prev => [...prev, serverMessage]);
      } catch (error) {
        toast.error((error as Error).message);
        // L'état optimiste sera automatiquement annulé
      }
    });
  };

  const handleLike = async (messageId: string) => {
    const message = optimisticMessages.find(m => m.id === messageId);
    if (!message || message.isOptimistic) return;

    // Mise à jour optimiste des likes
    setMessages(prev => 
      prev.map(m => 
        m.id === messageId 
          ? { ...m, likes: m.likes + 1 }
          : m
      )
    );

    try {
      await likeMessage(messageId);
    } catch (error) {
      // Annuler la mise à jour optimiste
      setMessages(prev => 
        prev.map(m => 
          m.id === messageId 
            ? { ...m, likes: m.likes - 1 }
            : m
        )
      );
      toast.error((error as Error).message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="mr-2 h-5 w-5" />
          Chat Simple avec useOptimistic
        </CardTitle>
        <CardDescription>
          Les messages apparaissent instantanément avec une mise à jour optimiste
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages */}
        <div className="h-64 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg">
          {optimisticMessages.map(message => (
            <div 
              key={message.id} 
              className={`p-3 rounded-lg ${
                message.author === 'Vous' 
                  ? 'bg-blue-500 text-white ml-8' 
                  : 'bg-white mr-8'
              } ${message.isOptimistic ? 'opacity-70' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{message.author}</span>
                <div className="flex items-center space-x-2">
                  {message.isOptimistic && (
                    <Clock className="h-3 w-3 text-gray-400" />
                  )}
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <p className="text-sm">{message.text}</p>
              {!message.isOptimistic && (
                <div className="flex items-center justify-between mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleLike(message.id)}
                    className={message.author === 'Vous' ? 'text-white hover:bg-white/20' : ''}
                  >
                    <Heart className="h-3 w-3 mr-1" />
                    {message.likes}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tapez votre message..."
            disabled={isPending}
            className="flex-1"
          />
          <Button type="submit" disabled={isPending || !newMessage.trim()}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Todo List with Optimistic Updates
function OptimisticTodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Apprendre useOptimistic', completed: false },
    { id: '2', text: 'Créer une todo app', completed: true },
  ]);

  const [optimisticTodos, updateOptimisticTodos] = useOptimistic(
    todos,
    (state, action: { type: 'add' | 'toggle' | 'delete'; todo?: Todo; id?: string }) => {
      switch (action.type) {
        case 'add':
          return action.todo ? [...state, action.todo] : state;
        case 'toggle':
          return state.map(todo =>
            todo.id === action.id
              ? { ...todo, completed: !todo.completed }
              : todo
          );
        case 'delete':
          return state.filter(todo => todo.id !== action.id);
        default:
          return state;
      }
    }
  );

  const [isPending, startTransition] = useTransition();
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const optimisticTodo: Todo = {
      id: `temp-${Date.now()}`,
      text: newTodo,
      completed: false,
      isOptimistic: true
    };

    startTransition(async () => {
      updateOptimisticTodos({ type: 'add', todo: optimisticTodo });
      setNewTodo('');

      try {
        const serverTodo = await addTodo(newTodo);
        setTodos(prev => [...prev, serverTodo]);
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  const handleToggleTodo = async (todoId: string) => {
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    startTransition(async () => {
      updateOptimisticTodos({ type: 'toggle', id: todoId });

      try {
        await toggleTodo(todoId);
        setTodos(prev =>
          prev.map(t =>
            t.id === todoId ? { ...t, completed: !t.completed } : t
          )
        );
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  const handleDeleteTodo = async (todoId: string) => {
    startTransition(async () => {
      updateOptimisticTodos({ type: 'delete', id: todoId });

      try {
        await deleteTodo(todoId);
        setTodos(prev => prev.filter(t => t.id !== todoId));
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="mr-2 h-5 w-5" />
          Todo List Optimiste
        </CardTitle>
        <CardDescription>
          Actions instantanées avec rollback automatique en cas d'erreur
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} className="flex space-x-2">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Nouvelle tâche..."
            disabled={isPending}
            className="flex-1"
          />
          <Button type="submit" disabled={isPending || !newTodo.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        {/* Todo List */}
        <div className="space-y-2">
          {optimisticTodos.map(todo => (
            <div
              key={todo.id}
              className={`flex items-center justify-between p-3 border rounded-lg ${
                todo.isOptimistic ? 'opacity-70 bg-blue-50' : 'bg-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleToggleTodo(todo.id)}
                  disabled={todo.isOptimistic}
                  className={todo.completed ? 'text-green-600' : 'text-gray-400'}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <span
                  className={`${
                    todo.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {todo.text}
                </span>
                {todo.isOptimistic && (
                  <Badge variant="secondary" className="text-xs">
                    En cours...
                  </Badge>
                )}
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteTodo(todo.id)}
                disabled={todo.isOptimistic}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {optimisticTodos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune tâche. Ajoutez-en une !</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Complex Form with Optimistic Updates
function OptimisticPostForm() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'Premier post',
      content: 'Contenu du premier post...',
      author: 'Admin',
      likes: 5,
      timestamp: new Date(Date.now() - 3600000)
    }
  ]);

  const [optimisticPosts, addOptimisticPost] = useOptimistic(
    posts,
    (state, newPost: Post) => [newPost, ...state]
  );

  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const optimisticPost: Post = {
      id: `temp-${Date.now()}`,
      title: formData.title,
      content: formData.content,
      author: 'Vous',
      likes: 0,
      timestamp: new Date(),
      isOptimistic: true
    };

    startTransition(async () => {
      addOptimisticPost(optimisticPost);
      setFormData({ title: '', content: '' });

      try {
        const serverPost = await createPost(formData.title, formData.content);
        setPosts(prev => [serverPost, ...prev]);
        toast.success('Post créé avec succès !');
      } catch (error) {
        toast.error((error as Error).message);
        // Restaurer le formulaire en cas d'erreur
        setFormData({
          title: optimisticPost.title,
          content: optimisticPost.content
        });
      }
    });
  };

  const handleLikePost = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Mise à jour optimiste
    setPosts(prev =>
      prev.map(p =>
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      )
    );

    try {
      // Simulation d'une API de like
      await new Promise(resolve => setTimeout(resolve, 500));
      if (Math.random() > 0.9) throw new Error('Échec du like');
    } catch (error) {
      // Rollback
      setPosts(prev =>
        prev.map(p =>
          p.id === postId ? { ...p, likes: p.likes - 1 } : p
        )
      );
      toast.error('Échec du like');
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Post Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Edit className="mr-2 h-5 w-5" />
            Créer un Post
          </CardTitle>
          <CardDescription>
            Le post apparaît instantanément pendant la création
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre du post..."
                disabled={isPending}
              />
            </div>
            
            <div>
              <Label htmlFor="content">Contenu</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Contenu du post..."
                rows={4}
                disabled={isPending}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isPending || !formData.title.trim() || !formData.content.trim()}
              className="w-full"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le post
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Posts Récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimisticPosts.map(post => (
              <div
                key={post.id}
                className={`p-4 border rounded-lg ${
                  post.isOptimistic ? 'opacity-70 bg-blue-50 border-blue-200' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{post.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  {post.isOptimistic && (
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>En cours...</span>
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-700 mb-4">{post.content}</p>
                
                {!post.isOptimistic && (
                  <div className="flex items-center space-x-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center space-x-1"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UseOptimisticPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">useOptimistic Hook</h1>
        <p className="text-xl text-muted-foreground">
          Créez des interfaces utilisateur réactives avec des mises à jour optimistes qui s'annulent automatiquement en cas d'erreur.
        </p>
      </div>

      <Tabs defaultValue="basics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="chat">Chat Simple</TabsTrigger>
          <TabsTrigger value="todos">Todo List</TabsTrigger>
          <TabsTrigger value="posts">Posts Complexes</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Qu'est-ce que useOptimistic ?
              </CardTitle>
              <CardDescription>
                Un hook React pour créer des interfaces utilisateur optimistes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Réactivité</h3>
                  <p className="text-sm text-muted-foreground">
                    Interface qui répond instantanément
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Rollback Auto</h3>
                  <p className="text-sm text-muted-foreground">
                    Annulation automatique en cas d'erreur
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">UX Améliorée</h3>
                  <p className="text-sm text-muted-foreground">
                    Expérience utilisateur fluide
                  </p>
                </div>
              </div>

              <CodeExample
                title="Syntaxe de base useOptimistic"
                code={`import { useOptimistic, useTransition } from 'react';

function OptimisticComponent() {
  const [messages, setMessages] = useState([]);
  const [isPending, startTransition] = useTransition();
  
  // useOptimistic prend l'état actuel et une fonction de mise à jour
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, newMessage]
  );

  const handleSubmit = async (formData) => {
    const optimisticMessage = {
      id: 'temp-' + Date.now(),
      text: formData.get('message'),
      pending: true
    };

    startTransition(async () => {
      // Mise à jour optimiste immédiate
      addOptimisticMessage(optimisticMessage);
      
      try {
        // Action serveur
        const result = await sendMessage(formData);
        setMessages(prev => [...prev, result]);
      } catch (error) {
        // L'état optimiste est automatiquement annulé
        console.error('Échec:', error);
      }
    });
  };

  return (
    <div>
      {optimisticMessages.map(message => (
        <div key={message.id} className={message.pending ? 'opacity-50' : ''}>
          {message.text}
        </div>
      ))}
    </div>
  );
}`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Concepts Clés</CardTitle>
              <CardDescription>
                Comprendre les principes des mises à jour optimistes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-blue-600">Avantages</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Interface réactive instantanée
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Meilleure perception de performance
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Rollback automatique des erreurs
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Synchronisation état local/serveur
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-green-600">Cas d'Usage</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Messages et commentaires</li>
                    <li>• Likes et réactions</li>
                    <li>• Todo lists et tâches</li>
                    <li>• Formulaires de création</li>
                    <li>• Actions utilisateur fréquentes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <SimpleChatExample />

          <CodeExample
            title="Implémentation Chat Optimiste"
            code={`function OptimisticChat() {
  const [messages, setMessages] = useState([]);
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, newMessage]
  );
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get('message');

    const optimisticMessage = {
      id: 'temp-' + Date.now(),
      text,
      author: 'Vous',
      timestamp: new Date(),
      isOptimistic: true
    };

    startTransition(async () => {
      // Ajout optimiste immédiat
      addOptimisticMessage(optimisticMessage);
      
      try {
        const serverMessage = await sendMessage(text);
        setMessages(prev => [...prev, serverMessage]);
      } catch (error) {
        toast.error('Échec de l\\'envoi');
        // L'état optimiste est automatiquement annulé
      }
    });
  };

  return (
    <div>
      <div className="messages">
        {optimisticMessages.map(message => (
          <div 
            key={message.id}
            className={message.isOptimistic ? 'opacity-70' : ''}
          >
            <strong>{message.author}:</strong> {message.text}
            {message.isOptimistic && <span> (envoi...)</span>}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        <input name="message" placeholder="Votre message..." />
        <button type="submit" disabled={isPending}>
          Envoyer
        </button>
      </form>
    </div>
  );
}`}
          />
        </TabsContent>

        <TabsContent value="todos" className="space-y-6">
          <OptimisticTodoList />

          <CodeExample
            title="Todo List avec Actions Multiples"
            code={`function OptimisticTodos() {
  const [todos, setTodos] = useState([]);
  
  // Reducer pour gérer différents types d'actions
  const [optimisticTodos, updateOptimisticTodos] = useOptimistic(
    todos,
    (state, action) => {
      switch (action.type) {
        case 'add':
          return [...state, action.todo];
        case 'toggle':
          return state.map(todo =>
            todo.id === action.id
              ? { ...todo, completed: !todo.completed }
              : todo
          );
        case 'delete':
          return state.filter(todo => todo.id !== action.id);
        default:
          return state;
      }
    }
  );

  const [isPending, startTransition] = useTransition();

  const addTodo = async (text) => {
    const optimisticTodo = {
      id: 'temp-' + Date.now(),
      text,
      completed: false,
      isOptimistic: true
    };

    startTransition(async () => {
      updateOptimisticTodos({ type: 'add', todo: optimisticTodo });
      
      try {
        const serverTodo = await createTodo(text);
        setTodos(prev => [...prev, serverTodo]);
      } catch (error) {
        toast.error('Échec de l\\'ajout');
      }
    });
  };

  const toggleTodo = async (id) => {
    startTransition(async () => {
      updateOptimisticTodos({ type: 'toggle', id });
      
      try {
        await updateTodoStatus(id);
        setTodos(prev =>
          prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        );
      } catch (error) {
        toast.error('Échec de la mise à jour');
      }
    });
  };

  const deleteTodo = async (id) => {
    startTransition(async () => {
      updateOptimisticTodos({ type: 'delete', id });
      
      try {
        await removeTodo(id);
        setTodos(prev => prev.filter(t => t.id !== id));
      } catch (error) {
        toast.error('Échec de la suppression');
      }
    });
  };

  return (
    <div>
      {optimisticTodos.map(todo => (
        <div key={todo.id} className={todo.isOptimistic ? 'opacity-70' : ''}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
            disabled={todo.isOptimistic}
          />
          <span className={todo.completed ? 'line-through' : ''}>
            {todo.text}
          </span>
          <button 
            onClick={() => deleteTodo(todo.id)}
            disabled={todo.isOptimistic}
          >
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
}`}
          />
        </TabsContent>

        <TabsContent value="posts" className="space-y-6">
          <OptimisticPostForm />

          <CodeExample
            title="Formulaire Complexe avec useOptimistic"
            code={`function OptimisticPostForm() {
  const [posts, setPosts] = useState([]);
  const [optimisticPosts, addOptimisticPost] = useOptimistic(
    posts,
    (state, newPost) => [newPost, ...state] // Ajouter en premier
  );

  const handleSubmit = async (formData) => {
    const optimisticPost = {
      id: 'temp-' + Date.now(),
      title: formData.get('title'),
      content: formData.get('content'),
      author: 'Vous',
      likes: 0,
      timestamp: new Date(),
      isOptimistic: true
    };

    startTransition(async () => {
      // Affichage optimiste immédiat
      addOptimisticPost(optimisticPost);
      
      // Réinitialiser le formulaire
      setFormData({ title: '', content: '' });

      try {
        const serverPost = await createPost(
          formData.get('title'),
          formData.get('content')
        );
        setPosts(prev => [serverPost, ...prev]);
        toast.success('Post créé !');
      } catch (error) {
        toast.error('Échec de la création');
        // Restaurer le formulaire en cas d'erreur
        setFormData({
          title: optimisticPost.title,
          content: optimisticPost.content
        });
      }
    });
  };

  // Gestion des likes avec optimisme
  const handleLike = async (postId) => {
    // Mise à jour optimiste immédiate
    setPosts(prev =>
      prev.map(p =>
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      )
    );

    try {
      await likePost(postId);
    } catch (error) {
      // Rollback manuel pour les likes
      setPosts(prev =>
        prev.map(p =>
          p.id === postId ? { ...p, likes: p.likes - 1 } : p
        )
      );
      toast.error('Échec du like');
    }
  };

  return (
    <div>
      <form action={handleSubmit}>
        <input name="title" placeholder="Titre..." required />
        <textarea name="content" placeholder="Contenu..." required />
        <button type="submit">Créer le post</button>
      </form>

      <div className="posts">
        {optimisticPosts.map(post => (
          <article 
            key={post.id}
            className={post.isOptimistic ? 'optimistic' : ''}
          >
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <div className="meta">
              <span>Par {post.author}</span>
              <time>{post.timestamp.toLocaleString()}</time>
              {!post.isOptimistic && (
                <button onClick={() => handleLike(post.id)}>
                  👍 {post.likes}
                </button>
              )}
              {post.isOptimistic && <span>Publication...</span>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}`}
          />

          <Card>
            <CardHeader>
              <CardTitle>Bonnes Pratiques</CardTitle>
              <CardDescription>
                Conseils pour utiliser useOptimistic efficacement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-green-600">✅ À faire</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Utiliser avec useTransition</li>
                    <li>• Indiquer visuellement l'état optimiste</li>
                    <li>• Gérer les erreurs avec toast/notifications</li>
                    <li>• Tester les cas d'échec</li>
                    <li>• Garder les mises à jour simples</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-red-600">❌ À éviter</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Mises à jour optimistes complexes</li>
                    <li>• Oublier la gestion d'erreurs</li>
                    <li>• Pas d'indication visuelle</li>
                    <li>• Logique métier dans l'optimisme</li>
                    <li>• Rollback manuel systématique</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}