'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CodeExample } from '@/components/code-example';
import { Badge } from '@/components/ui/badge';
import { WhyWhenTabs } from '@/components/why-when-tabs';
import { userSchema, blogPostSchema, type UserFormData } from '@/lib/validations/user';
import { toast } from 'sonner';
import { Shield, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

const zodWhyWhen = {
  why: {
    title: "Pourquoi Zod ?",
    description: "Zod est une bibliothèque de validation de schémas TypeScript-first qui permet de définir des schémas de données avec une inférence de type automatique. Contrairement aux validateurs traditionnels, Zod garantit que vos types TypeScript et vos validations runtime sont toujours synchronisés.",
    benefits: [
      "Inférence automatique des types TypeScript à partir des schémas",
      "Validation runtime avec des messages d'erreur détaillés et personnalisables",
      "Zero dépendances et bundle très léger (~12kb minifié)",
      "API composable et chaînable pour des schémas complexes",
      "Support natif des transformations de données",
      "Intégration parfaite avec React Hook Form et tRPC",
      "Schémas réutilisables et extensibles avec .extend(), .merge(), .pick()",
      "Validation asynchrone pour les vérifications côté serveur"
    ],
    problemsSolved: [
      "Duplication entre les types TypeScript et les validations runtime",
      "Erreurs de validation peu descriptives et difficiles à déboguer",
      "Validation incohérente entre le client et le serveur",
      "Complexité de la validation de structures de données imbriquées",
      "Manque de typage fort pour les données provenant d'APIs externes",
      "Difficulté à maintenir la cohérence des schémas dans le temps"
    ]
  },
  when: {
    idealCases: [
      {
        title: "Validation de formulaires",
        description: "Validation des entrées utilisateur avec des messages d'erreur clairs et une intégration directe avec React Hook Form.",
        example: "z.object({ email: z.string().email(), password: z.string().min(8) })"
      },
      {
        title: "Validation des réponses API",
        description: "S'assurer que les données reçues d'une API correspondent au format attendu avant de les utiliser.",
        example: "const user = userSchema.parse(await fetch('/api/user').then(r => r.json()))"
      },
      {
        title: "Server Actions et API Routes",
        description: "Valider les données entrantes dans les Server Actions Next.js ou les API routes pour garantir la sécurité.",
        example: "export async function createPost(formData: FormData) { const data = postSchema.parse(...) }"
      },
      {
        title: "Variables d'environnement",
        description: "Valider et typer les variables d'environnement au démarrage de l'application.",
        example: "z.object({ DATABASE_URL: z.string().url(), API_KEY: z.string().min(32) })"
      }
    ],
    avoidCases: [
      {
        title: "Validations très simples",
        description: "Pour une simple vérification de nullité ou de type basique, typeof ou optional chaining peuvent suffire.",
        example: "if (value !== null) // Pas besoin de Zod pour ça"
      },
      {
        title: "Gros volumes de données en temps réel",
        description: "Pour des streams de données massifs où la performance est critique, une validation manuelle optimisée peut être préférable.",
        example: "Parsing de logs en temps réel, traitement de flux vidéo"
      },
      {
        title: "Projets sans TypeScript",
        description: "Zod est conçu pour TypeScript. Sans TS, vous perdez l'avantage principal de l'inférence de types.",
        example: "Projets JavaScript vanilla sans bundler"
      }
    ],
    realWorldExamples: [
      {
        title: "Formulaire d'inscription",
        description: "Validation complète avec email unique, mot de passe fort, confirmation, et acceptation des CGU.",
        example: "z.object({...}).refine(d => d.password === d.confirm, 'Passwords must match')"
      },
      {
        title: "Configuration d'application",
        description: "Validation des fichiers de config JSON/YAML avec des valeurs par défaut et des transformations.",
        example: "configSchema.parse(JSON.parse(fs.readFileSync('config.json')))"
      },
      {
        title: "Webhook entrant",
        description: "Valider les payloads de webhooks Stripe, GitHub, etc. avant traitement.",
        example: "const event = stripeWebhookSchema.parse(req.body)"
      },
      {
        title: "Import de données CSV/Excel",
        description: "Valider chaque ligne d'un fichier importé avec des messages d'erreur par ligne.",
        example: "rows.map((row, i) => schema.safeParse(row).error?.flatten())"
      },
      {
        title: "GraphQL/tRPC inputs",
        description: "Définir les schémas d'entrée pour les resolvers GraphQL ou les procédures tRPC.",
        example: "t.procedure.input(z.object({ id: z.string().uuid() })).query(...)"
      },
      {
        title: "Feature flags",
        description: "Valider la structure des feature flags avec des valeurs par défaut.",
        example: "z.object({ darkMode: z.boolean().default(false), betaFeatures: z.array(z.string()) })"
      }
    ]
  }
};

export default function ZodPage() {
  const t = useTranslations('zod');
  const tForm = useTranslations('common.form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    password: '',
    confirmPassword: '',
    website: '',
    bio: '',
    interests: [] as string[],
    newsletter: false,
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    try {
      const numericAge = formData.age ? parseInt(formData.age) : 0;
      const dataToValidate = {
        ...formData,
        age: numericAge,
        interests: formData.interests.length > 0 ? formData.interests : ['coding'], // Demo default
      };
      
      userSchema.parse(dataToValidate);
      setErrors({});
      toast.success(t('formValidationPassed'));
      return true;
    } catch (error: any) {
      const fieldErrors: Record<string, string> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
      }
      setErrors(fieldErrors);
      toast.error(t('formValidationFailed'));
      return false;
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 text-xs tracking-wider uppercase">
              {t('badge')}
            </Badge>
            <h1 className="mb-4">{t('title')}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('description')}
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
          <TabsTrigger value="basics">{t('tabs.basics')}</TabsTrigger>
          <TabsTrigger value="schemas">{t('tabs.schemas')}</TabsTrigger>
          <TabsTrigger value="validation">{t('tabs.validation')}</TabsTrigger>
          <TabsTrigger value="advanced">{t('tabs.advanced')}</TabsTrigger>
        </TabsList>

        <TabsContent value="why-when">
          <WhyWhenTabs why={zodWhyWhen.why} when={zodWhyWhen.when} />
        </TabsContent>

        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                {t('whatIs')}
              </CardTitle>
              <CardDescription>
                {t('whatIsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">{t('typeSafety')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('typeSafetyDesc')}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">{t('runtimeValidation')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('runtimeValidationDesc')}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <XCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold">{t('errorHandling')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('errorHandlingDesc')}
                  </p>
                </div>
              </div>

              <CodeExample
                title="Basic Zod Schema"
                code={`import { z } from 'zod';

// Define a schema
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "Must be at least 18 years old"),
});

// Infer TypeScript type
type User = z.infer<typeof userSchema>;

// Validate data
const result = userSchema.safeParse({
  name: "John Doe",
  email: "john@example.com",
  age: 25
});

if (result.success) {
  console.log(result.data); // Typed as User
} else {
  console.log(result.error.issues); // Validation errors
}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schemas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('schemaTypes')}</CardTitle>
              <CardDescription>
                {t('schemaTypesDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="Common Schema Types"
                code={`import { z } from 'zod';

// Primitive types
const stringSchema = z.string();
const numberSchema = z.number();
const booleanSchema = z.boolean();
const dateSchema = z.date();

// String validations
const emailSchema = z.string().email();
const urlSchema = z.string().url();
const uuidSchema = z.string().uuid();
const regexSchema = z.string().regex(/^[a-z]+$/);

// Number validations
const positiveSchema = z.number().positive();
const integerSchema = z.number().int();
const rangeSchema = z.number().min(0).max(100);

// Array schemas
const stringArraySchema = z.array(z.string());
const numberArraySchema = z.array(z.number()).min(1).max(10);

// Object schemas
const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  email: z.string().email(),
  age: z.number().int().min(0).max(120),
  isActive: z.boolean().default(true),
});

// Optional and nullable
const optionalSchema = z.string().optional();
const nullableSchema = z.string().nullable();
const nullishSchema = z.string().nullish(); // null | undefined`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('complexSchemas')}</CardTitle>
              <CardDescription>
                {t('complexSchemasDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="Advanced Schema Example"
                code={`// Enum schema
const StatusEnum = z.enum(['pending', 'approved', 'rejected']);

// Union types
const StringOrNumber = z.union([z.string(), z.number()]);

// Discriminated unions
const EventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('user_created'),
    userId: z.string(),
    email: z.string().email(),
  }),
  z.object({
    type: z.literal('post_published'),
    postId: z.string(),
    title: z.string(),
  }),
]);

// Recursive schemas
type Category = {
  name: string;
  subcategories: Category[];
};

const CategorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    name: z.string(),
    subcategories: z.array(CategorySchema),
  })
);

// Transform data
const TransformSchema = z
  .string()
  .transform((val) => val.toLowerCase())
  .pipe(z.string().min(3));`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('interactiveForm')}</CardTitle>
              <CardDescription>
                {t('interactiveFormDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">{tForm('name')}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">{tForm('email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="age">{tForm('age')}</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className={errors.age ? 'border-red-500' : ''}
                    />
                    {errors.age && (
                      <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password">{tForm('password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={errors.password ? 'border-red-500' : ''}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="confirmPassword">{tForm('confirmPassword')}</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={errors.confirmPassword ? 'border-red-500' : ''}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="website">{tForm('website')} (optionnel)</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://example.com"
                      className={errors.website ? 'border-red-500' : ''}
                    />
                    {errors.website && (
                      <p className="text-red-500 text-sm mt-1">{errors.website}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bio">{tForm('bio')} (optionnel)</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Parlez-nous de vous..."
                      className={errors.bio ? 'border-red-500' : ''}
                    />
                    {errors.bio && (
                      <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={formData.newsletter}
                        onCheckedChange={(checked) => handleInputChange('newsletter', checked)}
                      />
                      <Label htmlFor="newsletter">{tForm('subscribeToNewsletter')}</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.terms}
                        onCheckedChange={(checked) => handleInputChange('terms', checked)}
                      />
                      <Label htmlFor="terms">{tForm('acceptTerms')} *</Label>
                    </div>
                    {errors.terms && (
                      <p className="text-red-500 text-sm">{errors.terms}</p>
                    )}
                  </div>
                </div>
              </div>

              <Button onClick={validateForm} className="w-full">
                {t('validateForm')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('errorHandlingTitle')}</CardTitle>
              <CardDescription>
                {t('errorHandlingDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="Custom Error Handling"
                code={`import { z } from 'zod';

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  age: z.number({
    required_error: "Age is required",
    invalid_type_error: "Age must be a number",
  }).min(18, "You must be at least 18 years old"),
});

// Safe parsing with error handling
const result = schema.safeParse({ email: "invalid", age: "not-a-number" });

if (!result.success) {
  // Handle errors
  result.error.errors.forEach((error) => {
    console.log(\`\${error.path.join('.')}: \${error.message}\`);
  });
  
  // Formatted errors for forms
  const fieldErrors = result.error.errors.reduce((acc, error) => {
    const path = error.path.join('.');
    acc[path] = error.message;
    return acc;
  }, {} as Record<string, string>);
}

// Custom validation with refine
const passwordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // Error will be attached here
});`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('schemaComposition')}</CardTitle>
              <CardDescription>
                {t('schemaCompositionDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="Schema Composition Patterns"
                code={`import { z } from 'zod';

// Base schemas
const BaseUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.date(),
});

// Extend schemas
const AdminUserSchema = BaseUserSchema.extend({
  role: z.literal('admin'),
  permissions: z.array(z.string()),
});

const RegularUserSchema = BaseUserSchema.extend({
  role: z.literal('user'),
  subscription: z.enum(['free', 'premium']),
});

// Merge schemas
const ProfileSchema = z.object({
  name: z.string(),
  bio: z.string().optional(),
});

const UserWithProfileSchema = BaseUserSchema.merge(ProfileSchema);

// Partial and pick
const UpdateUserSchema = BaseUserSchema.partial(); // All fields optional
const UserSummarySchema = BaseUserSchema.pick({ id: true, email: true });

// Omit fields
const PublicUserSchema = BaseUserSchema.omit({ createdAt: true });

// Conditional schemas
const ConditionalSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('email'),
    email: z.string().email(),
  }),
  z.object({
    type: z.literal('phone'),
    phone: z.string().regex(/^\d{10}$/),
  }),
]);`}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}