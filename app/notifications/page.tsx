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
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
  Settings,
  Zap,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';

const notificationsWhyWhen = {
  why: {
    title: "Pourquoi un système de notifications Toast ?",
    description: "Les notifications toast sont essentielles pour le feedback utilisateur. Sonner est la bibliothèque la plus moderne et performante pour React, offrant des animations fluides, un stacking intelligent, et une API simple. Elle remplace avantageusement react-toastify et react-hot-toast.",
    benefits: [
      "Animations fluides et naturelles avec Framer Motion",
      "Stacking intelligent des notifications multiples",
      "Positionnement flexible (top, bottom, corners)",
      "Types prédéfinis : success, error, warning, info, loading",
      "Promesses avec états automatiques (loading → success/error)",
      "Toasts personnalisables avec JSX",
      "Accessibilité (ARIA, focus management)",
      "Bundle léger et performant"
    ],
    problemsSolved: [
      "Feedback silencieux après les actions utilisateur",
      "Implémentation maison des notifications répétitive",
      "Animations complexes à coder soi-même",
      "Gestion du z-index et du stacking",
      "Accessibilité souvent négligée",
      "Expérience utilisateur incohérente entre les projets"
    ]
  },
  when: {
    idealCases: [
      {
        title: "Confirmation d'actions",
        description: "Après une sauvegarde, un envoi de formulaire, un ajout au panier.",
        example: "toast.success('Produit ajouté au panier')"
      },
      {
        title: "Messages d'erreur",
        description: "Échec de connexion, validation échouée, erreur serveur.",
        example: "toast.error('Impossible de se connecter')"
      },
      {
        title: "Actions asynchrones",
        description: "Upload de fichier, envoi d'email, synchronisation avec loading state.",
        example: "toast.promise(uploadFile(), { loading: 'Upload...', success: 'Terminé!', error: 'Échec' })"
      },
      {
        title: "Notifications informatives",
        description: "Mise à jour disponible, session expirée, nouveaux messages.",
        example: "toast.info('Nouvelle version disponible')"
      }
    ],
    avoidCases: [
      {
        title: "Messages critiques nécessitant une action",
        description: "Pour des confirmations importantes, utilisez une modal ou un dialog.",
        example: "Confirmation de suppression, acceptation de CGU"
      },
      {
        title: "Contenus longs ou complexes",
        description: "Les toasts doivent être courts. Pour plus de détails, utilisez une page ou une modal.",
        example: "Récapitulatif de commande, détails d'erreur techniques"
      },
      {
        title: "Notifications persistantes",
        description: "Pour des bannières permanentes, utilisez un composant dédié dans le layout.",
        example: "Bannière de maintenance, annonce importante"
      }
    ],
    realWorldExamples: [
      {
        title: "E-commerce - Panier",
        description: "Toast de succès avec image du produit ajouté et lien vers le panier.",
        example: "toast.success(<ProductAddedToast product={product} />)"
      },
      {
        title: "Formulaire de contact",
        description: "Loading pendant l'envoi, success avec message personnalisé, error avec retry.",
        example: "toast.promise(sendEmail(data), {...})"
      },
      {
        title: "Upload de fichier",
        description: "Barre de progression pendant l'upload, success avec preview.",
        example: "toast.loading('Upload...', { id }); toast.success('Terminé', { id })"
      },
      {
        title: "Copier dans le presse-papier",
        description: "Feedback instantané quand l'utilisateur copie un lien ou un code.",
        example: "navigator.clipboard.writeText(text); toast.success('Copié!')"
      },
      {
        title: "Connexion/Déconnexion",
        description: "Messages de bienvenue personnalisés, confirmation de déconnexion.",
        example: "toast.success(`Bienvenue, ${user.name}!`)"
      },
      {
        title: "Notifications push",
        description: "Nouveaux messages, mentions, notifications sociales.",
        example: "toast.message(notification.title, { description: notification.body })"
      }
    ]
  }
};

// Custom Toast Component
interface CustomToastProps {
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

function CustomToast({ title, description, type, onClose }: CustomToastProps) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-600" />,
    error: <AlertCircle className="h-5 w-5 text-red-600" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
    info: <Info className="h-5 w-5 text-blue-600" />,
  };

  const colors = {
    success: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
    error: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
    warning: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
    info: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[type]} shadow-lg animate-in slide-in-from-right-full duration-300`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {icons[type]}
          <div>
            <h4 className="font-semibold text-sm">{title}</h4>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Custom Toast Provider
function CustomToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    title: string;
    description?: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>>([]);

  const addToast = (toast: Omit<typeof toasts[0], 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map(toast => (
          <CustomToast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
      
      {/* Global toast function */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.customToast = ${addToast.toString()};
          `,
        }}
      />
    </div>
  );
}

// Notification Examples Component
function NotificationExamples() {
  const [customToasts, setCustomToasts] = useState<Array<{
    id: string;
    title: string;
    description?: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>>([]);

  const addCustomToast = (toast: Omit<typeof customToasts[0], 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setCustomToasts(prev => [...prev, { ...toast, id }]);
    
    setTimeout(() => {
      removeCustomToast(id);
    }, 5000);
  };

  const removeCustomToast = (id: string) => {
    setCustomToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Sonner Examples
  const showSonnerSuccess = () => {
    toast.success('Success!', {
      description: 'Your action was completed successfully.',
    });
  };

  const showSonnerError = () => {
    toast.error('Error occurred!', {
      description: 'Something went wrong. Please try again.',
    });
  };

  const showSonnerWarning = () => {
    toast.warning('Warning!', {
      description: 'Please check your input and try again.',
    });
  };

  const showSonnerInfo = () => {
    toast.info('Information', {
      description: 'Here is some useful information for you.',
    });
  };

  const showSonnerPromise = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve('Success!') : reject('Failed!');
      }, 2000);
    });

    toast.promise(promise, {
      loading: 'Loading...',
      success: 'Data loaded successfully!',
      error: 'Failed to load data.',
    });
  };

  const showSonnerAction = () => {
    toast('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      action: {
        label: 'Undo',
        onClick: () => toast.info('Event creation undone'),
      },
    });
  };

  // Custom Toast Examples
  const showCustomSuccess = () => {
    addCustomToast({
      type: 'success',
      title: 'Custom Success!',
      description: 'This is a custom success notification.',
    });
  };

  const showCustomError = () => {
    addCustomToast({
      type: 'error',
      title: 'Custom Error!',
      description: 'This is a custom error notification.',
    });
  };

  const showCustomWarning = () => {
    addCustomToast({
      type: 'warning',
      title: 'Custom Warning!',
      description: 'This is a custom warning notification.',
    });
  };

  const showCustomInfo = () => {
    addCustomToast({
      type: 'info',
      title: 'Custom Info!',
      description: 'This is a custom info notification.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Sonner Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Sonner Toast Examples
          </CardTitle>
          <CardDescription>
            Built-in toast notifications with Sonner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button onClick={showSonnerSuccess} variant="outline" className="text-green-600">
              <CheckCircle className="mr-2 h-4 w-4" />
              Success
            </Button>
            <Button onClick={showSonnerError} variant="outline" className="text-red-600">
              <AlertCircle className="mr-2 h-4 w-4" />
              Error
            </Button>
            <Button onClick={showSonnerWarning} variant="outline" className="text-yellow-600">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Warning
            </Button>
            <Button onClick={showSonnerInfo} variant="outline" className="text-blue-600">
              <Info className="mr-2 h-4 w-4" />
              Info
            </Button>
            <Button onClick={showSonnerPromise} variant="outline" className="text-purple-600">
              <Zap className="mr-2 h-4 w-4" />
              Promise
            </Button>
            <Button onClick={showSonnerAction} variant="outline" className="text-orange-600">
              <Settings className="mr-2 h-4 w-4" />
              Action
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom Toast Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Toast Examples</CardTitle>
          <CardDescription>
            Custom-built toast notifications with full control
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button onClick={showCustomSuccess} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              Success
            </Button>
            <Button onClick={showCustomError} className="bg-red-600 hover:bg-red-700">
              <AlertCircle className="mr-2 h-4 w-4" />
              Error
            </Button>
            <Button onClick={showCustomWarning} className="bg-yellow-600 hover:bg-yellow-700">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Warning
            </Button>
            <Button onClick={showCustomInfo} className="bg-blue-600 hover:bg-blue-700">
              <Info className="mr-2 h-4 w-4" />
              Info
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom Toast Container */}
      <div className="fixed top-4 left-4 z-50 space-y-2 max-w-sm">
        {customToasts.map(toast => (
          <CustomToast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            type={toast.type}
            onClose={() => removeCustomToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Server Action Toast Example
function ServerActionToastExample() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleServerAction = async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const message = formData.get('message') as string;

      // Simulate server action
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (!name || !email || !message) {
        throw new Error('All fields are required');
      }

      // Simulate random success/failure
      if (Math.random() > 0.7) {
        throw new Error('Server error occurred');
      }

      toast.success('Message sent successfully!', {
        description: `Thank you ${name}, we'll get back to you soon.`,
        action: {
          label: 'View',
          onClick: () => toast.info('Opening message details...'),
        },
      });

      // Reset form
      (document.getElementById('server-form') as HTMLFormElement)?.reset();

    } catch (error: any) {
      toast.error('Failed to send message', {
        description: error.message,
        action: {
          label: 'Retry',
          onClick: () => handleServerAction(formData),
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Server Action with Toast</CardTitle>
        <CardDescription>
          Form submission with server-side processing and toast feedback
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="server-form" action={handleServerAction} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required disabled={isSubmitting} />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required disabled={isSubmitting} />
          </div>
          
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" required disabled={isSubmitting} />
          </div>
          
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function NotificationsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 text-xs tracking-wider uppercase">
              UI/UX
            </Badge>
            <h1 className="mb-4">Toast Notifications</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Learn Sonner integration and custom notification systems for both client and server components.
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
          <TabsTrigger value="sonner">Sonner Examples</TabsTrigger>
          <TabsTrigger value="custom">Custom Toasts</TabsTrigger>
          <TabsTrigger value="server">Server Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="why-when">
          <WhyWhenTabs why={notificationsWhyWhen.why} when={notificationsWhyWhen.when} />
        </TabsContent>

        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Toast Notifications Overview
              </CardTitle>
              <CardDescription>
                User feedback through toast notifications in modern web applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                  <div className="flex items-center mb-3">
                    <Bell className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">Sonner</h3>
                  </div>
                  <ul className="text-sm space-y-1 text-blue-700 dark:text-blue-300">
                    <li>• Pre-built toast library</li>
                    <li>• Beautiful animations</li>
                    <li>• Promise-based toasts</li>
                    <li>• Action buttons support</li>
                    <li>• Accessibility built-in</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                  <div className="flex items-center mb-3">
                    <Settings className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-green-800 dark:text-green-200">Custom Toasts</h3>
                  </div>
                  <ul className="text-sm space-y-1 text-green-700 dark:text-green-300">
                    <li>• Full design control</li>
                    <li>• Custom animations</li>
                    <li>• Brand-specific styling</li>
                    <li>• Advanced interactions</li>
                    <li>• Complex layouts</li>
                  </ul>
                </div>
              </div>

              <CodeExample
                title="Basic Sonner Setup"
                code={`// app/layout.tsx
import { Toaster } from 'sonner';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

// Using in components
import { toast } from 'sonner';

function MyComponent() {
  const handleClick = () => {
    toast.success('Success!', {
      description: 'Your action was completed.',
    });
  };

  return <button onClick={handleClick}>Show Toast</button>;
}`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Toast Types and Use Cases</CardTitle>
              <CardDescription>
                When and how to use different types of notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-green-600">Success Toasts</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Form submissions completed
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Data saved successfully
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Actions completed
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      Settings updated
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-red-600">Error Toasts</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Network connection issues</li>
                    <li>• Validation failures</li>
                    <li>• Server errors</li>
                    <li>• Permission denied</li>
                    <li>• Unexpected failures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sonner" className="space-y-6">
          <NotificationExamples />

          <CodeExample
            title="Advanced Sonner Usage"
            code={`import { toast } from 'sonner';

// Basic toasts
toast.success('Success message');
toast.error('Error message');
toast.warning('Warning message');
toast.info('Info message');

// Toast with description
toast.success('Success!', {
  description: 'Your action was completed successfully.',
});

// Promise-based toast
const promise = fetch('/api/data');
toast.promise(promise, {
  loading: 'Loading data...',
  success: 'Data loaded successfully!',
  error: 'Failed to load data.',
});

// Toast with action
toast('Event created', {
  description: 'Sunday, December 03, 2023 at 9:00 AM',
  action: {
    label: 'Undo',
    onClick: () => toast.info('Event undone'),
  },
});

// Custom toast with JSX
toast.custom((t) => (
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <h3 className="font-bold">Custom Toast</h3>
    <p>This is a custom toast with JSX content.</p>
    <button onClick={() => toast.dismiss(t)}>
      Dismiss
    </button>
  </div>
));

// Programmatic control
const toastId = toast.loading('Processing...');
// Later...
toast.success('Done!', { id: toastId });

// Global configuration
toast.success('Message', {
  duration: 5000,
  position: 'top-center',
  style: {
    background: 'green',
    color: 'white',
  },
});`}
          />
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Toast Implementation</CardTitle>
              <CardDescription>
                Building your own toast notification system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="Custom Toast Component"
                code={`// components/custom-toast.tsx
'use client';

import { useState, createContext, useContext } from 'react';
import { X } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: {
  toast: Toast;
  onRemove: () => void;
}) {
  const colors = {
    success: 'border-green-200 bg-green-50',
    error: 'border-red-200 bg-red-50',
    warning: 'border-yellow-200 bg-yellow-50',
    info: 'border-blue-200 bg-blue-50',
  };

  return (
    <div className={\`p-4 rounded-lg border shadow-lg \${colors[toast.type]} animate-in slide-in-from-right-full\`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-sm">{toast.title}</h4>
          {toast.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {toast.description}
            </p>
          )}
        </div>
        <button onClick={onRemove} className="ml-4">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Hook for using toasts
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="server" className="space-y-6">
          <ServerActionToastExample />

          <CodeExample
            title="Server Actions with Toast Notifications"
            code={`// app/actions/contact.ts
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function submitContactForm(formData: FormData) {
  try {
    const data = contactSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    });

    // Process the form (save to database, send email, etc.)
    await saveContactMessage(data);
    await sendNotificationEmail(data);

    // Return success - will be handled by client
    return { success: true, message: 'Message sent successfully!' };
    
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
}

// Client component using the server action
'use client';

import { submitContactForm } from '@/app/actions/contact';
import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Sending...' : 'Send Message'}
    </button>
  );
}

export function ContactForm() {
  async function handleSubmit(formData: FormData) {
    const result = await submitContactForm(formData);
    
    if (result.success) {
      toast.success('Success!', {
        description: result.message,
      });
      // Reset form or redirect
    } else {
      toast.error('Error', {
        description: result.message,
        action: {
          label: 'Retry',
          onClick: () => handleSubmit(formData),
        },
      });
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="name" placeholder="Your name" required />
      <input name="email" type="email" placeholder="Your email" required />
      <textarea name="message" placeholder="Your message" required />
      <SubmitButton />
    </form>
  );
}`}
          />

          <CodeExample
            title="Toast Notifications in Server Components"
            code={`// Server Component with conditional toast
// app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { ToastTrigger } from '@/components/toast-trigger';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string };
}) {
  // Handle URL-based notifications
  const { success, error } = searchParams;

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Trigger toast based on URL params */}
      {success && (
        <ToastTrigger
          type="success"
          title="Success!"
          description={success}
        />
      )}
      
      {error && (
        <ToastTrigger
          type="error"
          title="Error"
          description={error}
        />
      )}
      
      {/* Rest of dashboard content */}
    </div>
  );
}

// Client component to trigger toast
'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

interface ToastTriggerProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description: string;
}

export function ToastTrigger({ type, title, description }: ToastTriggerProps) {
  useEffect(() => {
    toast[type](title, { description });
  }, [type, title, description]);

  return null; // This component doesn't render anything
}

// Server Action that redirects with toast data
'use server';

export async function deleteUser(userId: string) {
  try {
    await db.user.delete({ where: { id: userId } });
    redirect('/dashboard?success=User deleted successfully');
  } catch (error) {
    redirect('/dashboard?error=Failed to delete user');
  }
}`}
          />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}