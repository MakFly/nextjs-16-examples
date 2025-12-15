'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CodeExample } from '@/components/code-example';
import { useCounterStore } from '@/lib/stores/counter-store';
import { useTodoStore } from '@/lib/stores/todo-store';
import { useState } from 'react';
import { Plus, Minus, RotateCcw, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function ZustandPage() {
  const { count, increment, decrement, reset, setCount } = useCounterStore();
  const { todos, addTodo, toggleTodo, removeTodo, clearCompleted } = useTodoStore();
  const [newTodo, setNewTodo] = useState('');
  const [customCount, setCustomCount] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo('');
      toast.success('Todo added!');
    }
  };

  const handleSetCustomCount = () => {
    const num = parseInt(customCount);
    if (!isNaN(num)) {
      setCount(num);
      setCustomCount('');
      toast.success(`Count set to ${num}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Zustand State Management</h1>
        <p className="text-xl text-muted-foreground">
          Learn simple, scalable state management with Zustand.
        </p>
      </div>

      <Tabs defaultValue="basics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="counter">Counter Demo</TabsTrigger>
          <TabsTrigger value="todos">Todo Demo</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What is Zustand?</CardTitle>
              <CardDescription>
                A small, fast, and scalable bearbones state-management solution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">2.6kB</div>
                  <h3 className="font-semibold">Tiny Bundle</h3>
                  <p className="text-sm text-muted-foreground">
                    Minimal bundle size impact
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">Zero</div>
                  <h3 className="font-semibold">No Boilerplate</h3>
                  <p className="text-sm text-muted-foreground">
                    Simple API, no providers needed
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">TS</div>
                  <h3 className="font-semibold">TypeScript</h3>
                  <p className="text-sm text-muted-foreground">
                    Full TypeScript support
                  </p>
                </div>
              </div>

              <CodeExample
                title="Basic Store Creation"
                code={`import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Usage in component
function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
              <CardDescription>
                What makes Zustand different from other state management solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Advantages</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      No providers or context needed
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      Works with React and non-React code
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      Supports middleware (persist, devtools)
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      Async actions out of the box
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Use Cases</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Global application state</li>
                    <li>• User authentication state</li>
                    <li>• Shopping cart management</li>
                    <li>• Theme and UI preferences</li>
                    <li>• API data caching</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="counter" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Counter</CardTitle>
              <CardDescription>
                A live demo of Zustand store with persistence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 mb-4">{count}</div>
                <div className="flex justify-center space-x-2 mb-4">
                  <Button onClick={decrement} variant="outline" size="icon">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button onClick={increment} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button onClick={reset} variant="outline" size="icon">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Set custom value"
                    value={customCount}
                    onChange={(e) => setCustomCount(e.target.value)}
                    className="w-40"
                  />
                  <Button onClick={handleSetCustomCount}>Set</Button>
                </div>
              </div>

              <Badge variant="secondary" className="w-full justify-center py-2">
                This counter persists across page reloads using Zustand persist middleware
              </Badge>

              <CodeExample
                title="Counter Store Implementation"
                code={`import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (count: number) => void;
}

export const useCounterStore = create<CounterState>()(
  devtools(
    persist(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
        reset: () => set({ count: 0 }),
        setCount: (count) => set({ count }),
      }),
      {
        name: 'counter-storage', // localStorage key
      }
    ),
    {
      name: 'counter-store', // devtools name
    }
  )
);`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="todos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Todo List Demo</CardTitle>
              <CardDescription>
                A more complex example with arrays and multiple actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a new todo..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                />
                <Button onClick={handleAddTodo}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {todos.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No todos yet. Add one above!
                  </p>
                ) : (
                  todos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleTodo(todo.id)}
                          className={todo.completed ? 'text-green-600' : ''}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <span
                          className={`${
                            todo.completed
                              ? 'line-through text-muted-foreground'
                              : ''
                          }`}
                        >
                          {todo.text}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTodo(todo.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              {todos.some(todo => todo.completed) && (
                <Button 
                  variant="outline" 
                  onClick={clearCompleted}
                  className="w-full"
                >
                  Clear Completed
                </Button>
              )}

              <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
                <span>Total: {todos.length}</span>
                <span>Completed: {todos.filter(t => t.completed).length}</span>
                <span>Remaining: {todos.filter(t => !t.completed).length}</span>
              </div>

              <CodeExample
                title="Todo Store Implementation"
                code={`interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  clearCompleted: () => void;
}

export const useTodoStore = create<TodoState>()(
  devtools(
    (set) => ({
      todos: [],
      addTodo: (text) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: crypto.randomUUID(),
              text,
              completed: false,
              createdAt: new Date(),
            },
          ],
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      removeTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        })),
    }),
    { name: 'todo-store' }
  )
);`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Middleware</CardTitle>
              <CardDescription>
                Enhance your stores with persistence, devtools, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="Middleware Composition"
                code={`import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface UserState {
  user: { id: string; name: string; email: string } | null;
  preferences: { theme: 'light' | 'dark'; language: string };
  login: (user: UserState['user']) => void;
  logout: () => void;
  updatePreferences: (prefs: Partial<UserState['preferences']>) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set) => ({
          user: null,
          preferences: { theme: 'light', language: 'en' },
          
          login: (user) => set((state) => {
            state.user = user;
          }),
          
          logout: () => set((state) => {
            state.user = null;
          }),
          
          updatePreferences: (prefs) => set((state) => {
            Object.assign(state.preferences, prefs);
          }),
        }))
      ),
      {
        name: 'user-storage',
        partialize: (state) => ({ 
          user: state.user, 
          preferences: state.preferences 
        }),
      }
    ),
    { name: 'user-store' }
  )
);

// Subscribe to specific state changes
useUserStore.subscribe(
  (state) => state.preferences.theme,
  (theme) => {
    document.documentElement.className = theme;
  }
);`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Async Actions</CardTitle>
              <CardDescription>
                Handle asynchronous operations in your stores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="Async Store Pattern"
                code={`interface ApiState {
  data: any[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  createItem: (item: any) => Promise<void>;
  updateItem: (id: string, updates: any) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export const useApiStore = create<ApiState>()(
  devtools((set, get) => ({
    data: [],
    loading: false,
    error: null,

    fetchData: async () => {
      set({ loading: true, error: null });
      try {
        const response = await fetch('/api/data');
        const data = await response.json();
        set({ data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    createItem: async (item) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch('/api/data', {
          method: 'POST',
          body: JSON.stringify(item),
        });
        const newItem = await response.json();
        set((state) => ({
          data: [...state.data, newItem],
          loading: false,
        }));
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    updateItem: async (id, updates) => {
      const { data } = get();
      try {
        const response = await fetch(\`/api/data/\${id}\`, {
          method: 'PUT',
          body: JSON.stringify(updates),
        });
        const updatedItem = await response.json();
        set({
          data: data.map((item) =>
            item.id === id ? updatedItem : item
          ),
        });
      } catch (error) {
        set({ error: error.message });
      }
    },

    deleteItem: async (id) => {
      const { data } = get();
      try {
        await fetch(\`/api/data/\${id}\`, { method: 'DELETE' });
        set({ data: data.filter((item) => item.id !== id) });
      } catch (error) {
        set({ error: error.message });
      }
    },
  }))
);`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Store Slicing</CardTitle>
              <CardDescription>
                Split large stores into smaller, manageable slices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="Store Slicing Pattern"
                code={`// Define slice types
interface AuthSlice {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

interface CartSlice {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

interface UISlice {
  theme: 'light' | 'dark';
  sidebar: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

// Create individual slices
const createAuthSlice: StateCreator<
  AuthSlice & CartSlice & UISlice,
  [],
  [],
  AuthSlice
> = (set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
});

const createCartSlice: StateCreator<
  AuthSlice & CartSlice & UISlice,
  [],
  [],
  CartSlice
> = (set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(item => item.id !== id) 
  })),
  clearCart: () => set({ items: [] }),
});

const createUISlice: StateCreator<
  AuthSlice & CartSlice & UISlice,
  [],
  [],
  UISlice
> = (set) => ({
  theme: 'light',
  sidebar: false,
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
  toggleSidebar: () => set((state) => ({ 
    sidebar: !state.sidebar 
  })),
});

// Combine slices
export const useAppStore = create<AuthSlice & CartSlice & UISlice>()(
  devtools(
    persist(
      (...a) => ({
        ...createAuthSlice(...a),
        ...createCartSlice(...a),
        ...createUISlice(...a),
      }),
      { name: 'app-storage' }
    )
  )
);`}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}