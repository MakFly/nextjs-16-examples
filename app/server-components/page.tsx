import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CodeExample } from '@/components/code-example';
import { 
  Server, 
  Monitor, 
  Database, 
  Clock,
  Users,
  TrendingUp,
  Loader2
} from 'lucide-react';

// Server Component - Simple Data Fetching
async function SimpleServerData() {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  const data = {
    timestamp: new Date().toISOString(),
    message: "This data was fetched on the server!"
  };
  
  return (
    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
      <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Server-side Data</h3>
      <p className="text-sm text-green-700 dark:text-green-300">Fetched at: {data.timestamp}</p>
      <p className="text-green-600 dark:text-green-400">{data.message}</p>
    </div>
  );
}

// Server Component - Complex Data with Multiple Sources
async function ComplexServerData() {
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
            Users
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
            Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{(stats as any).growth}</div>
          <p className="text-xs text-muted-foreground">vs last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Active Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(stats as any).activeToday}</div>
          <p className="text-xs text-muted-foreground">online users</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading Component
function LoadingCard() {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading server data...</span>
      </div>
    </div>
  );
}

export default function ServerComponentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Server Components</h1>
        <p className="text-xl text-muted-foreground">
          Learn the difference between Server and Client Components, data fetching patterns, and optimization techniques.
        </p>
      </div>

      <Tabs defaultValue="basics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="simple">Simple Example</TabsTrigger>
          <TabsTrigger value="complex">Complex Example</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="mr-2 h-5 w-5" />
                Server vs Client Components
              </CardTitle>
              <CardDescription>
                Understanding when and how to use each type of component
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                  <div className="flex items-center mb-3">
                    <Server className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">Server Components</h3>
                  </div>
                  <ul className="text-sm space-y-1 text-blue-700 dark:text-blue-300">
                    <li>• Render on the server</li>
                    <li>• Can access databases directly</li>
                    <li>• No JavaScript sent to client</li>
                    <li>• Cannot use hooks or event handlers</li>
                    <li>• Better for SEO and performance</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-950">
                  <div className="flex items-center mb-3">
                    <Monitor className="h-5 w-5 text-orange-600 mr-2" />
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">Client Components</h3>
                  </div>
                  <ul className="text-sm space-y-1 text-orange-700 dark:text-orange-300">
                    <li>• Render in the browser</li>
                    <li>• Can use hooks and state</li>
                    <li>• Handle user interactions</li>
                    <li>• Access browser APIs</li>
                    <li>• Interactive and dynamic</li>
                  </ul>
                </div>
              </div>

              <CodeExample
                title="Component Type Declaration"
                code={`// Server Component (default)
export default function ServerComponent() {
  // Can access databases, file system, etc.
  const data = await fetch('https://api.example.com/data');
  
  return <div>{data.title}</div>;
}

// Client Component
'use client';

import { useState } from 'react';

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>When to Use Each Type</CardTitle>
              <CardDescription>
                Decision matrix for choosing the right component type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-blue-600">Use Server Components for:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Data fetching from APIs or databases
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Static content and layouts
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      SEO-critical content
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Large dependencies (stay on server)
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-orange-600">Use Client Components for:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Interactive elements (forms, buttons)
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      State management and hooks
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Browser APIs (localStorage, etc.)
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Event handlers and user input
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simple" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simple Server Component Example</CardTitle>
              <CardDescription>
                Basic data fetching and rendering on the server
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Suspense fallback={<LoadingCard />}>
                <SimpleServerData />
              </Suspense>

              <CodeExample
                title="Simple Server Component"
                code={`// app/components/simple-server-data.tsx
async function SimpleServerData() {
  // This runs on the server
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const data = {
    timestamp: new Date().toISOString(),
    message: "This data was fetched on the server!"
  };
  
  return (
    <div className="p-4 bg-green-50 rounded-lg">
      <h3 className="font-semibold mb-2">Server-side Data</h3>
      <p>Fetched at: {data.timestamp}</p>
      <p>{data.message}</p>
    </div>
  );
}

// Usage in page
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SimpleServerData />
    </Suspense>
  );
}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complex" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Complex Server Component Example</CardTitle>
              <CardDescription>
                Multiple data sources with parallel fetching and error handling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Suspense fallback={
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => <LoadingCard key={i} />)}
                </div>
              }>
                <ComplexServerData />
              </Suspense>

              <CodeExample
                title="Complex Server Component with Multiple Data Sources"
                code={`async function ComplexServerData() {
  // Parallel data fetching
  const [users, stats, trends] = await Promise.all([
    fetch('https://api.example.com/users').then(res => res.json()),
    fetchUserStats(),
    fetchTrendData()
  ]);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <StatsCard title="Users" value={stats.totalUsers} />
      <StatsCard title="Growth" value={stats.growth} />
      <StatsCard title="Active" value={stats.activeToday} />
    </div>
  );
}

// Helper functions (also server-side)
async function fetchUserStats() {
  // Database query or API call
  return {
    totalUsers: 1234,
    activeToday: 89,
    growth: '+12%'
  };
}

async function fetchTrendData() {
  // Another data source
  return [
    { month: 'Jan', value: 400 },
    { month: 'Feb', value: 300 },
    // ...
  ];
}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Patterns</CardTitle>
              <CardDescription>
                Best practices for Server Component architecture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="Composition Pattern"
                code={`// Server Component that composes other components
export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <Header />
      
      <div className="grid md:grid-cols-2 gap-6">
        <Suspense fallback={<SkeletonCard />}>
          <UserStats />
        </Suspense>
        
        <Suspense fallback={<SkeletonCard />}>
          <RecentActivity />
        </Suspense>
      </div>
      
      <Suspense fallback={<SkeletonTable />}>
        <DataTable />
      </Suspense>
    </div>
  );
}

// Each component can have its own data fetching
async function UserStats() {
  const stats = await fetchUserStats();
  return <StatsDisplay data={stats} />;
}

async function RecentActivity() {
  const activities = await fetchRecentActivities();
  return <ActivityList activities={activities} />;
}

async function DataTable() {
  const data = await fetchTableData();
  return <Table data={data} />;
}`}
              />

              <CodeExample
                title="Error Boundaries with Server Components"
                code={`// error.tsx - Handles errors in Server Components
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center py-8">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <button onClick={reset} className="btn-primary">
        Try again
      </button>
    </div>
  );
}

// Server Component with potential errors
async function DataComponent() {
  try {
    const data = await riskyApiCall();
    return <DataDisplay data={data} />;
  } catch (error) {
    // This will be caught by error.tsx
    throw new Error('Failed to fetch data');
  }
}`}
              />

              <CodeExample
                title="Streaming with Nested Suspense"
                code={`export default function StreamingPage() {
  return (
    <div>
      {/* Fast content loads immediately */}
      <Header />
      
      {/* Slow content streams in progressively */}
      <Suspense fallback={<HeaderSkeleton />}>
        <SlowHeader />
        
        <div className="grid md:grid-cols-2 gap-4">
          <Suspense fallback={<CardSkeleton />}>
            <SlowCard1 />
          </Suspense>
          
          <Suspense fallback={<CardSkeleton />}>
            <SlowCard2 />
          </Suspense>
        </div>
        
        <Suspense fallback={<TableSkeleton />}>
          <VerySlowTable />
        </Suspense>
      </Suspense>
    </div>
  );
}`}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}