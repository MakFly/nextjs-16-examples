import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, FileText, MapPin } from 'lucide-react';

// Type definitions for API responses
interface User {
  id: number;
  name: string;
  email: string;
  address: {
    city: string;
  };
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

// Server Component - Complex Data with Multiple REAL API Sources
export async function ComplexServerData({
  usersLabel,
  growthLabel,
  vsLastMonth,
  activeTodayLabel,
  onlineUsers,
}: {
  usersLabel: string;
  growthLabel: string;
  vsLastMonth: string;
  activeTodayLabel: string;
  onlineUsers: string;
}) {
  // Parallel data fetching from REAL APIs - runs entirely on the server!
  const [usersResponse, postsResponse, todosResponse] = await Promise.all([
    fetch('https://jsonplaceholder.typicode.com/users', { cache: 'no-store' }),
    fetch('https://jsonplaceholder.typicode.com/posts', { cache: 'no-store' }),
    fetch('https://jsonplaceholder.typicode.com/todos', { cache: 'no-store' }),
  ]);

  const users: User[] = await usersResponse.json();
  const posts: Post[] = await postsResponse.json();
  const todos: Todo[] = await todosResponse.json();

  // Calculate real stats from the fetched data
  const totalUsers = users.length;
  const totalPosts = posts.length;
  const completedTodos = todos.filter((t) => t.completed).length;
  const completionRate = Math.round((completedTodos / todos.length) * 100);

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {usersLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {users.slice(0, 3).map((u) => u.name.split(' ')[0]).join(', ')}...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              ~{Math.round(totalPosts / totalUsers)} posts par utilisateur
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Tâches complétées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {completedTodos}/{todos.length} tâches
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real Users List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Utilisateurs (données réelles de l&apos;API)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {users.slice(0, 6).map((user) => (
              <div
                key={user.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {user.address.city}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
