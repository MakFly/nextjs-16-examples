import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Clock } from 'lucide-react';

// Server Component - Complex Data with Multiple Sources
export async function ComplexServerData({ 
  usersLabel, 
  growthLabel, 
  vsLastMonth, 
  activeTodayLabel, 
  onlineUsers 
}: {
  usersLabel: string;
  growthLabel: string;
  vsLastMonth: string;
  activeTodayLabel: string;
  onlineUsers: string;
}) {
  // Simulate multiple API calls
  const [users, stats, trends] = await Promise.all([
    fetch('https://jsonplaceholder.typicode.com/users').then(res => res.json()).catch(() => []),
    new Promise(resolve => setTimeout(() => resolve({
      totalUsers: 1234,
      activeToday: 89,
      growth: '+12%'
    }), 800)),
    new Promise(resolve => setTimeout(() => resolve([
      { month: 'Jan', value: 400 },
      { month: 'Feb', value: 300 },
      { month: 'Mar', value: 600 },
      { month: 'Apr', value: 800 },
    ]), 1200))
  ]);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Users className="h-4 w-4 mr-2" />
            {usersLabel}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(stats as any).totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            {users.slice(0, 3).map((user: any) => user.name).join(', ')}...
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            {growthLabel}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{(stats as any).growth}</div>
          <p className="text-xs text-muted-foreground">{vsLastMonth}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            {activeTodayLabel}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(stats as any).activeToday}</div>
          <p className="text-xs text-muted-foreground">{onlineUsers}</p>
        </CardContent>
      </Card>
    </div>
  );
}
