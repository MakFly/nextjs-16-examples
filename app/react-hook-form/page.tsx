'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CodeExample } from '@/components/code-example';
import { Badge } from '@/components/ui/badge';
import { WhyWhenTabs } from '@/components/why-when-tabs';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormInput,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  HelpCircle,
  Mail,
  Lock,
  User,
  CreditCard,
  MapPin,
  Phone,
  Building,
  ShoppingCart,
  UserCircle,
  Settings,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const reactHookFormWhyWhen = {
  why: {
    title: "Pourquoi React Hook Form + shadcn/ui Form ?",
    description: "React Hook Form combiné avec les composants Form de shadcn/ui offre la meilleure expérience développeur pour créer des formulaires accessibles, performants et maintenables. Les composants gèrent automatiquement les attributs ARIA, les erreurs, et l'état du formulaire.",
    benefits: [
      "Composants Form accessibles avec gestion automatique des attributs ARIA",
      "Performance optimale : moins de re-renders grâce aux uncontrolled inputs",
      "Intégration native avec Zod pour validation type-safe",
      "API déclarative et composable avec FormField, FormItem, FormControl",
      "Messages d'erreur automatiques avec FormMessage",
      "Descriptions de champs avec FormDescription",
      "IDs uniques générés automatiquement via React.useId()",
      "Support complet de TypeScript avec inférence des types"
    ],
    problemsSolved: [
      "Boilerplate répétitif pour chaque champ (label, input, error, description)",
      "Accessibilité souvent négligée (aria-describedby, aria-invalid)",
      "Gestion manuelle des IDs pour les labels et inputs",
      "Styles incohérents entre les formulaires du projet",
      "Re-renders excessifs avec les formulaires contrôlés",
      "Validation complexe et messages d'erreur difficiles à gérer"
    ]
  },
  when: {
    idealCases: [
      {
        title: "Formulaires d'inscription/connexion",
        description: "Email, mot de passe avec confirmation, validation en temps réel, gestion des erreurs serveur.",
        example: "FormField + zodResolver pour validation email/password"
      },
      {
        title: "Checkout e-commerce",
        description: "Adresses de livraison/facturation, méthode de paiement, validation conditionnelle.",
        example: "useFieldArray pour les articles, FormField pour chaque section"
      },
      {
        title: "Formulaires de profil utilisateur",
        description: "Édition d'informations personnelles, préférences, liens sociaux.",
        example: "watch() pour preview en temps réel, FormDescription pour les hints"
      },
      {
        title: "Création de contenu (CMS/Blog)",
        description: "Titre, contenu, catégories, tags, SEO metadata, dates de publication.",
        example: "Formulaire multi-sections avec Select, Textarea, et validation"
      }
    ],
    avoidCases: [
      {
        title: "Recherche simple",
        description: "Pour un champ de recherche isolé, un simple useState avec debounce suffit.",
        example: "Barre de recherche dans le header"
      },
      {
        title: "Formulaires sans validation",
        description: "Si aucune validation n'est nécessaire, le overhead peut être inutile.",
        example: "Formulaire de feedback optionnel très simple"
      },
      {
        title: "Inputs contrôlés obligatoires",
        description: "Si vous devez réagir à chaque frappe (autocomplétion), considérez Controller.",
        example: "Recherche avec suggestions en temps réel"
      }
    ],
    realWorldExamples: [
      {
        title: "Stripe Checkout",
        description: "Formulaire de paiement avec validation de carte, adresse, et gestion des erreurs Stripe.",
        example: "FormField pour card number, expiry, CVC avec masques"
      },
      {
        title: "GitHub - Création de repo",
        description: "Nom, description, visibilité, .gitignore, licence avec validation du nom unique.",
        example: "Async validation pour vérifier la disponibilité du nom"
      },
      {
        title: "Airbnb - Création d'annonce",
        description: "Wizard multi-étapes : type, emplacement, équipements, photos, prix.",
        example: "useForm avec state persisté entre les étapes"
      },
      {
        title: "LinkedIn - Édition de profil",
        description: "Sections repliables, champs dynamiques pour expériences et formations.",
        example: "useFieldArray pour les expériences, FormDescription pour les conseils"
      },
      {
        title: "Notion - Création de page",
        description: "Titre, icône, cover, propriétés dynamiques selon le type de base.",
        example: "Schema dynamique basé sur le type sélectionné"
      },
      {
        title: "Calendly - Créer un événement",
        description: "Durée, disponibilités, questions personnalisées, intégrations.",
        example: "useFieldArray pour les questions, Select pour les durées"
      }
    ]
  }
};

// ============================================
// SCHÉMAS ZOD POUR LES EXEMPLES
// ============================================

// 1. Formulaire d'inscription (comme GitHub, Stripe)
const signupSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Doit contenir au moins un chiffre"),
  confirmPassword: z.string(),
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter les conditions d'utilisation"
  }),
  newsletter: z.boolean(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

// 2. Formulaire de checkout (comme Stripe, Amazon)
const checkoutSchema = z.object({
  // Informations de contact
  email: z.string().email("Email invalide"),
  phone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, "Numéro de téléphone invalide"),

  // Adresse de livraison
  shipping: z.object({
    firstName: z.string().min(2, "Prénom requis"),
    lastName: z.string().min(2, "Nom requis"),
    address: z.string().min(5, "Adresse requise"),
    city: z.string().min(2, "Ville requise"),
    postalCode: z.string().regex(/^\d{5}$/, "Code postal invalide"),
    country: z.string().min(2, "Pays requis"),
  }),

  // Facturation
  sameAsShipping: z.boolean(),

  // Instructions
  deliveryNotes: z.string().max(500).optional(),
});

// 3. Formulaire de création de projet (comme GitHub, Vercel)
const projectSchema = z.object({
  name: z.string()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .regex(/^[a-z0-9-]+$/, "Uniquement des lettres minuscules, chiffres et tirets"),
  description: z.string().max(200, "200 caractères maximum").optional(),
  visibility: z.enum(["public", "private"], {
    message: "Sélectionnez une visibilité",
  }),
  framework: z.string().min(1, "Sélectionnez un framework"),
  features: z.array(z.object({
    name: z.string().min(1, "Nom de la feature requis"),
    priority: z.enum(["low", "medium", "high"]),
  })).optional(),
  readme: z.boolean(),
  gitignore: z.boolean(),
});

type SignupFormData = z.infer<typeof signupSchema>;
type CheckoutFormData = z.infer<typeof checkoutSchema>;
type ProjectFormData = z.infer<typeof projectSchema>;

// ============================================
// COMPOSANT 1: FORMULAIRE D'INSCRIPTION
// ============================================
function SignupForm() {
  const t = useTranslations('reactHookForm');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      acceptTerms: false,
      newsletter: false,
    },
  });

  const password = form.watch("password");

  const onSubmit = async (data: SignupFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success(t('accountCreated'), {
      description: `${t('welcome')} ${data.fullName} !`,
    });
    console.log("Signup data:", data);
    form.reset();
  };

  // Calcul de la force du mot de passe
  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password || "");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fullName')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Jean Dupont" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('emailAddress')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="email" placeholder="jean@exemple.com" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormDescription>
                {t('weNeverShare')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('password')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </FormControl>
              {password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded ${
                          passwordStrength >= level
                            ? level <= 2 ? 'bg-red-500' : level <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('passwordStrength')} {passwordStrength <= 2 ? t('weak') : passwordStrength <= 3 ? t('medium') : t('strong')}
                  </p>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('confirmPassword')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-normal">
                  J'accepte les <a href="#" className="text-primary underline">{t('acceptTermsLink')}</a> et la <a href="#" className="text-primary underline">{t('privacyPolicy')}</a>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newsletter"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-normal">
                  {t('receiveNews')}
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('creatingAccount')}
            </>
          ) : (
            t('createAccount')
          )}
        </Button>
      </form>
    </Form>
  );
}

// ============================================
// COMPOSANT 2: FORMULAIRE DE CHECKOUT
// ============================================
function CheckoutForm() {
  const t = useTranslations('reactHookForm');
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      phone: "",
      shipping: {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "France",
      },
      sameAsShipping: true,
      deliveryNotes: "",
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success(t('orderConfirmed'), {
      description: t('confirmationEmail'),
    });
    console.log("Checkout data:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Section Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {t('contactInfo')}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="votre@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phone')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="06 12 34 56 78" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Section Livraison */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t('shippingAddress')}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="shipping.firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('firstName')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shipping.lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('lastName')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="shipping.address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('address')}</FormLabel>
                <FormControl>
                  <Input placeholder="123 rue de la Paix" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="shipping.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('city')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Paris" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shipping.postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('postalCode')}</FormLabel>
                  <FormControl>
                    <Input placeholder="75001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shipping.country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('country')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Belgique">Belgique</SelectItem>
                      <SelectItem value="Suisse">Suisse</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Instructions de livraison */}
        <FormField
          control={form.control}
          name="deliveryNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('deliveryInstructions')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('deliveryPlaceholder')}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t('deliveryInfo')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sameAsShipping"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  {t('billingSameAsShipping')}
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('processing')}
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              {t('proceedToPayment')}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

// ============================================
// COMPOSANT 3: CRÉATION DE PROJET (GitHub-like)
// ============================================
function ProjectForm() {
  const t = useTranslations('reactHookForm');
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      visibility: "public",
      framework: "",
      features: [],
      readme: true,
      gitignore: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  const projectName = form.watch("name");

  const onSubmit = async (data: ProjectFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success(t('projectCreated'), {
      description: `Visibilité : ${data.visibility}`,
    });
    console.log("Project data:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('projectName')}</FormLabel>
              <FormControl>
                <Input placeholder="mon-super-projet" {...field} />
              </FormControl>
              <FormDescription>
                {projectName ? (
                  <span className="text-green-600">
                    URL: github.com/votre-username/<strong>{projectName}</strong>
                  </span>
                ) : (
                  "Lettres minuscules, chiffres et tirets uniquement"
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('projectDescription')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('briefDescription')}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {field.value?.length || 0}/200 {t('characters')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('visibility')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <span>🌍</span> {t('public')}
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <span>🔒</span> {t('private')}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="framework"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('framework')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('chooseFramework')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="nextjs">Next.js</SelectItem>
                    <SelectItem value="react">React (Vite)</SelectItem>
                    <SelectItem value="vue">Vue.js</SelectItem>
                    <SelectItem value="svelte">SvelteKit</SelectItem>
                    <SelectItem value="astro">Astro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Features dynamiques avec useFieldArray */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>{t('featuresToImplement')}</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", priority: "medium" })}
            >
              <Plus className="h-4 w-4 mr-1" />
              {t('add')}
            </Button>
          </div>

          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
              {t('noFeatures')}
            </p>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-end">
              <FormField
                control={form.control}
                name={`features.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    {index === 0 && <FormLabel>{t('name')}</FormLabel>}
                    <FormControl>
                      <Input placeholder="Authentification, API, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`features.${index}.priority`}
                render={({ field }) => (
                  <FormItem className="w-32">
                    {index === 0 && <FormLabel>{t('priority')}</FormLabel>}
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">{t('low')}</SelectItem>
                        <SelectItem value="medium">{t('medium')}</SelectItem>
                        <SelectItem value="high">{t('high')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Separator />

        {/* Options */}
        <div className="space-y-4">
          <FormLabel>{t('options')}</FormLabel>

          <FormField
            control={form.control}
            name="readme"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal">
                    {t('addReadme')}
                  </FormLabel>
                  <FormDescription>
                    {t('readmeDesc')}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gitignore"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal">
                    {t('addGitignore')}
                  </FormLabel>
                  <FormDescription>
                    {t('gitignoreDesc')}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('creatingProject')}
            </>
          ) : (
            <>
              <Building className="mr-2 h-4 w-4" />
              {t('createProject')}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

// ============================================
// PAGE PRINCIPALE
// ============================================
export default function ReactHookFormPage() {
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
            <TabsTrigger value="signup">
              <UserCircle className="h-4 w-4 mr-1 hidden sm:inline" />
              {t('tabs.signup')}
            </TabsTrigger>
            <TabsTrigger value="checkout">
              <ShoppingCart className="h-4 w-4 mr-1 hidden sm:inline" />
              {t('tabs.checkout')}
            </TabsTrigger>
            <TabsTrigger value="project">
              <Building className="h-4 w-4 mr-1 hidden sm:inline" />
              {t('tabs.project')}
            </TabsTrigger>
            <TabsTrigger value="code">
              <Settings className="h-4 w-4 mr-1 hidden sm:inline" />
              {t('tabs.code')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="why-when">
            <WhyWhenTabs why={reactHookFormWhyWhen.why} when={reactHookFormWhyWhen.when} />
          </TabsContent>

          <TabsContent value="signup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5" />
                  {t('signupForm')}
                </CardTitle>
                <CardDescription>
                  {t('signupFormDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SignupForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checkout" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  {t('checkoutForm')}
                </CardTitle>
                <CardDescription>
                  {t('checkoutFormDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CheckoutForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="project" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {t('projectForm')}
                </CardTitle>
                <CardDescription>
                  {t('projectFormDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="space-y-6">
            <Card>
            <CardHeader>
              <CardTitle>{t('baseStructure')}</CardTitle>
              <CardDescription>
                {t('baseStructureDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">{t('accessibility')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('accessibilityDesc')}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <FormInput className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">{t('composable')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('composableDesc')}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold">{t('errors')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('errorsDesc')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

            <CodeExample
              title="Structure de base avec shadcn/ui Form"
              code={`import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 1. Définir le schéma Zod
const formSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
});

type FormData = z.infer<typeof formSchema>;

// 2. Créer le composant
function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormDescription>
                Votre adresse email professionnelle
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">S'inscrire</Button>
      </form>
    </Form>
  );
}`}
            />

            <CodeExample
              title="useFieldArray pour les champs dynamiques"
              code={`import { useForm, useFieldArray } from "react-hook-form";

const form = useForm({
  defaultValues: {
    features: [{ name: "", priority: "medium" }],
  },
});

const { fields, append, remove } = useFieldArray({
  control: form.control,
  name: "features",
});

// Dans le JSX :
{fields.map((field, index) => (
  <div key={field.id} className="flex gap-2">
    <FormField
      control={form.control}
      name={\`features.\${index}.name\`}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input {...field} />
          </FormControl>
        </FormItem>
      )}
    />
    <Button onClick={() => remove(index)}>
      <Trash2 />
    </Button>
  </div>
))}

<Button onClick={() => append({ name: "", priority: "medium" })}>
  Ajouter une feature
</Button>`}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
