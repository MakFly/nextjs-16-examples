'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CodeExample } from '@/components/code-example';
import { Badge } from '@/components/ui/badge';
import { WhyWhenTabs } from '@/components/why-when-tabs';
import {
  Zap,
  Database,
  Shield,
  CheckCircle,
  AlertCircle,
  Send,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

const serverActionsWhyWhen = {
  why: {
    title: "Pourquoi les Server Actions ?",
    description: "Les Server Actions permettent d'exécuter du code côté serveur directement depuis vos composants React, sans créer d'API routes. Elles simplifient drastiquement les mutations de données, la validation, et les opérations sensibles tout en offrant une expérience développeur fluide avec TypeScript.",
    benefits: [
      "Pas besoin de créer des API routes séparées pour les mutations",
      "Typage de bout en bout entre le client et le serveur",
      "Validation côté serveur automatique avec Zod",
      "Revalidation automatique du cache après mutation",
      "Intégration native avec les formulaires HTML (<form action={...}>)",
      "Optimistic updates faciles avec useOptimistic",
      "Sécurité : le code reste sur le serveur, jamais exposé au client",
      "Progressive enhancement : fonctionne même sans JavaScript"
    ],
    problemsSolved: [
      "Boilerplate des API routes (route.ts, fetch, error handling)",
      "Duplication de la logique de validation client/serveur",
      "Gestion complexe des états de chargement et d'erreur",
      "Sécurisation manuelle des endpoints API",
      "Revalidation manuelle du cache après mutations",
      "Types désynchronisés entre API et client"
    ]
  },
  when: {
    idealCases: [
      {
        title: "Soumission de formulaires",
        description: "Inscription, login, création de contenu, mise à jour de profil - toute action déclenchée par un formulaire.",
        example: "async function createPost(formData: FormData) { 'use server'; await db.posts.create(...) }"
      },
      {
        title: "Mutations de données (CRUD)",
        description: "Créer, modifier, supprimer des ressources dans la base de données.",
        example: "async function deletePost(id: string) { 'use server'; await db.posts.delete({ where: { id } }) }"
      },
      {
        title: "Actions avec authentification",
        description: "Vérification de session, permissions, avant d'effectuer une action sensible.",
        example: "const session = await getSession(); if (!session) throw new Error('Unauthorized');"
      },
      {
        title: "Envoi d'emails, notifications",
        description: "Actions qui déclenchent des effets de bord côté serveur.",
        example: "await sendEmail({ to: user.email, subject: 'Welcome!', ... })"
      }
    ],
    avoidCases: [
      {
        title: "Lecture de données (fetching)",
        description: "Pour le fetching, utilisez les Server Components ou TanStack Query. Les Server Actions sont pour les mutations.",
        example: "Utilisez async function getData() dans un Server Component, pas une Server Action"
      },
      {
        title: "Opérations temps réel",
        description: "WebSockets, Server-Sent Events, polling - les Server Actions sont pour des opérations ponctuelles.",
        example: "Pour un chat en temps réel, utilisez Socket.io ou Pusher"
      },
      {
        title: "APIs publiques consommées par des tiers",
        description: "Les Server Actions ne sont pas des endpoints REST accessibles de l'extérieur.",
        example: "Créez des API routes pour les webhooks, intégrations tierces"
      }
    ],
    realWorldExamples: [
      {
        title: "Ajout au panier e-commerce",
        description: "Action qui ajoute un produit au panier, vérifie le stock, et revalide le cache.",
        example: "addToCart(productId, quantity) → vérification stock → update DB → revalidatePath('/cart')"
      },
      {
        title: "Like/Bookmark",
        description: "Toggle d'un like avec optimistic update pour une UX instantanée.",
        example: "likePost(postId) avec useOptimistic pour afficher le like immédiatement"
      },
      {
        title: "Upload de fichier",
        description: "Réception du fichier, validation, stockage sur S3/Cloudinary, sauvegarde de l'URL en DB.",
        example: "uploadAvatar(formData) → validate → upload S3 → update user.avatarUrl"
      },
      {
        title: "Inscription newsletter",
        description: "Validation de l'email, vérification de doublon, ajout à Mailchimp/Resend.",
        example: "subscribe(email) → zod.email() → check exists → add to newsletter provider"
      },
      {
        title: "Paiement Stripe",
        description: "Création d'une session de paiement Stripe côté serveur, redirection vers le checkout.",
        example: "createCheckoutSession(cartItems) → stripe.checkout.sessions.create() → redirect"
      },
      {
        title: "Invitation d'équipe",
        description: "Génération d'un token d'invitation, envoi d'email, création d'une entrée en DB.",
        example: "inviteTeamMember(email, role) → generate token → send email → save to pending_invites"
      }
    ]
  }
};

// Client components for demonstrations
function SimpleActionForm() {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    try {
      // In a real app, this would be a server action
      const name = formData.get('name') as string;
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!name || name.length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }
      
      toast.success(`Hello, ${name}! Form submitted successfully.`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="simple-name">Your Name</Label>
        <Input
          id="simple-name"
          name="name"
          placeholder="Enter your name"
          required
          disabled={isPending}
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (
          <>
            <Spinner className="mr-2" />
            Processing...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Submit
          </>
        )}
      </Button>
    </form>
  );
}

function ComplexActionForm() {
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    setResult(null);
    
    try {
      const title = formData.get('title') as string;
      const content = formData.get('content') as string;
      const category = formData.get('category') as string;
      
      // Simulate server action
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!title || title.length < 5) {
        throw new Error('Title must be at least 5 characters long');
      }
      
      if (!content || content.length < 10) {
        throw new Error('Content must be at least 10 characters long');
      }
      
      const post = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        content,
        category,
        createdAt: new Date().toISOString(),
      };
      
      setResult({ success: true, message: 'Post created successfully!', data: post });
      toast.success('Post created successfully!');
      
      // Reset form
      (document.getElementById('complex-form') as HTMLFormElement)?.reset();
      
    } catch (error: any) {
      setResult({ success: false, message: error.message });
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <form id="complex-form" action={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Post Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter post title"
            required
            disabled={isPending}
          />
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            className="w-full p-2 border rounded-md"
            required
            disabled={isPending}
          >
            <option value="">Select a category</option>
            <option value="technology">Technology</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            placeholder="Write your post content..."
            rows={4}
            required
            disabled={isPending}
          />
        </div>
        
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Spinner className="mr-2" />
              Creating Post...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Create Post
            </>
          )}
        </Button>
      </form>
      
      {result && (
        <div className={`p-4 rounded-lg border ${
          result.success 
            ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
            : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
        }`}>
          <div className="flex items-center mb-2">
            {result.success ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            )}
            <span className={`font-semibold ${
              result.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
            }`}>
              {result.success ? 'Success!' : 'Error!'}
            </span>
          </div>
          <p className={`text-sm ${
            result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
          }`}>
            {result.message}
          </p>
          
          {result.success && result.data && (
            <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border">
              <h4 className="font-semibold text-sm mb-2">Created Post:</h4>
              <div className="text-xs space-y-1">
                <p><strong>ID:</strong> {result.data.id}</p>
                <p><strong>Title:</strong> {result.data.title}</p>
                <p><strong>Category:</strong> {result.data.category}</p>
                <p><strong>Created:</strong> {new Date(result.data.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ServerActionsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 text-xs tracking-wider uppercase">
              Actions
            </Badge>
            <h1 className="mb-4">Server Actions</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Learn form handling, mutations, and server-side logic with Server Actions.
            </p>
            <div className="w-12 h-1 bg-accent mt-6" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
      <Tabs defaultValue="why-when" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="why-when" className="flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Pourquoi/Quand</span>
            <span className="sm:hidden">?</span>
          </TabsTrigger>
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="simple">Simple Example</TabsTrigger>
          <TabsTrigger value="complex">Complex Example</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="why-when">
          <WhyWhenTabs why={serverActionsWhyWhen.why} when={serverActionsWhyWhen.when} />
        </TabsContent>

        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                What are Server Actions?
              </CardTitle>
              <CardDescription>
                Server-side functions that can be called directly from Client Components
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Secure</h3>
                  <p className="text-sm text-muted-foreground">
                    Run on server, never exposed to client
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Database className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Direct Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Access databases and APIs directly
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Progressive</h3>
                  <p className="text-sm text-muted-foreground">
                    Work without JavaScript enabled
                  </p>
                </div>
              </div>

              <CodeExample
                title="Basic Server Action"
                code={`// app/actions.ts
'use server';

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  
  // Validate data
  if (!name || !email) {
    throw new Error('Name and email are required');
  }
  
  // Save to database
  const user = await db.user.create({
    data: { name, email }
  });
  
  // Redirect or return result
  redirect('/users/' + user.id);
}

// app/components/user-form.tsx
import { createUser } from '@/app/actions';

export function UserForm() {
  return (
    <form action={createUser}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit">Create User</button>
    </form>
  );
}`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Benefits</CardTitle>
              <CardDescription>
                Why use Server Actions over traditional API routes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-green-600">Advantages</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      No API routes needed
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Type-safe by default
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Progressive enhancement
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Automatic revalidation
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-blue-600">Use Cases</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Form submissions and mutations</li>
                    <li>• Database operations (CRUD)</li>
                    <li>• File uploads and processing</li>
                    <li>• Email sending and notifications</li>
                    <li>• Cache revalidation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simple" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simple Server Action Demo</CardTitle>
              <CardDescription>
                Basic form submission with server-side processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SimpleActionForm />

              <CodeExample
                title="Simple Server Action Implementation"
                code={`// app/actions/simple.ts
'use server';

export async function simpleServerAction(formData: FormData) {
  const name = formData.get('name') as string;
  
  // Server-side validation
  if (!name || name.length < 2) {
    throw new Error('Name must be at least 2 characters long');
  }
  
  // Simulate processing (database save, API call, etc.)
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return success response
  return { 
    success: true, 
    message: \`Hello, \${name}! Form submitted successfully.\` 
  };
}

// app/components/simple-form.tsx
'use client';

import { simpleServerAction } from '@/app/actions/simple';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Processing...' : 'Submit'}
    </button>
  );
}

export function SimpleForm() {
  return (
    <form action={simpleServerAction}>
      <input name="name" placeholder="Enter your name" required />
      <SubmitButton />
    </form>
  );
}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complex" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Complex Server Action Demo</CardTitle>
              <CardDescription>
                Advanced form with validation, error handling, and data processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ComplexActionForm />

              <CodeExample
                title="Complex Server Action with Validation"
                code={`// app/actions/blog.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const postSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  category: z.enum(['technology', 'design', 'business']),
});

export async function createPost(formData: FormData) {
  try {
    // Extract and validate data
    const rawData = {
      title: formData.get('title'),
      content: formData.get('content'),
      category: formData.get('category'),
    };
    
    const validatedData = postSchema.parse(rawData);
    
    // Simulate database operation
    const post = await db.post.create({
      data: {
        ...validatedData,
        slug: generateSlug(validatedData.title),
        authorId: getCurrentUserId(),
      }
    });
    
    // Revalidate relevant pages
    revalidatePath('/blog');
    revalidatePath('/dashboard');
    
    return { 
      success: true, 
      message: 'Post created successfully!',
      postId: post.id 
    };
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: error.errors[0].message 
      };
    }
    
    return { 
      success: false, 
      message: 'An unexpected error occurred' 
    };
  }
}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Patterns</CardTitle>
              <CardDescription>
                Optimistic updates, file uploads, and error handling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="Optimistic Updates"
                code={`'use client';

import { useOptimistic } from 'react';
import { addTodo } from '@/app/actions/todos';

export function TodoList({ todos }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, { ...newTodo, id: Date.now() }]
  );

  async function formAction(formData) {
    const text = formData.get('text');
    
    // Add optimistically
    addOptimisticTodo({ text, completed: false });
    
    // Submit to server
    await addTodo(formData);
  }

  return (
    <div>
      {optimisticTodos.map(todo => (
        <div key={todo.id}>{todo.text}</div>
      ))}
      
      <form action={formAction}>
        <input name="text" placeholder="Add todo..." />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}`}
              />

              <CodeExample
                title="File Upload Server Action"
                code={`// app/actions/upload.ts
'use server';

import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file) {
    throw new Error('No file uploaded');
  }
  
  // Validate file type and size
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB
    throw new Error('File size must be less than 5MB');
  }
  
  // Save file
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const filename = \`\${Date.now()}-\${file.name}\`;
  const path = join(process.cwd(), 'public/uploads', filename);
  
  await writeFile(path, buffer);
  
  // Save to database
  const upload = await db.upload.create({
    data: {
      filename,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
    }
  });
  
  return { success: true, uploadId: upload.id, url: \`/uploads/\${filename}\` };
}`}
              />

              <CodeExample
                title="Error Handling and Validation"
                code={`// app/actions/user.ts
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function createUser(prevState: any, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedData = userSchema.parse(rawData);
    
    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email }
    });
    
    if (existingUser) {
      return {
        success: false,
        message: 'User with this email already exists',
        errors: { email: 'Email already taken' }
      };
    }
    
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const user = await db.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
      }
    });
    
    // Set session and redirect
    await setSession(user.id);
    redirect('/dashboard');
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.flatten().fieldErrors
      };
    }
    
    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
}`}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}