'use client';

import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { CodeExample } from '@/components/code-example';
import { WhyWhenTabs } from '@/components/why-when-tabs';
import { useCounterStore } from '@/lib/stores/counter-store';
import { useTodoStore } from '@/lib/stores/todo-store';
import {
  useCheckoutStore,
  sampleProducts,
  type ShippingInfo,
  type PaymentInfo,
  type CheckoutStep,
} from '@/lib/stores/checkout-store';
import { useState, useEffect } from 'react';
import {
  Plus,
  Minus,
  RotateCcw,
  Trash2,
  Check,
  HelpCircle,
  ShoppingCart,
  Truck,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Package,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const zustandWhyWhen = {
  why: {
    title: "Pourquoi Zustand ?",
    description: "Zustand est une solution de gestion d'état minimaliste et performante pour React. Avec seulement 2.6kB, elle offre une API simple sans boilerplate, pas de providers nécessaires, et une intégration parfaite avec TypeScript. C'est l'alternative moderne à Redux pour la plupart des cas d'usage.",
    benefits: [
      "Bundle ultra-léger (2.6kB) comparé à Redux (~7kB) ou MobX (~16kB)",
      "Aucun Provider ou Context nécessaire - utilisation directe des hooks",
      "API simple et intuitive sans actions, reducers ou dispatchers",
      "Middleware intégré : persist (localStorage), devtools, immer",
      "Sélection fine de l'état pour éviter les re-renders inutiles",
      "Fonctionne hors React (vanilla JS, Node.js)",
      "Support natif des actions asynchrones sans middleware",
      "TypeScript-first avec inférence de types complète"
    ],
    problemsSolved: [
      "Boilerplate excessif de Redux (actions, reducers, types)",
      "Prop drilling à travers de nombreux composants",
      "Re-renders inutiles avec Context API",
      "Complexité de configuration des DevTools",
      "Persistance de l'état nécessitant des libs supplémentaires",
      "Gestion des effets de bord avec des middlewares complexes"
    ]
  },
  when: {
    idealCases: [
      {
        title: "État global de l'application",
        description: "Thème, langue, préférences utilisateur, état d'authentification - tout ce qui doit être accessible partout.",
        example: "useUserStore(state => state.theme)"
      },
      {
        title: "Panier e-commerce",
        description: "État partagé entre header, page produit, et checkout avec persistance automatique.",
        example: "useCartStore(state => ({ items: state.items, addItem: state.addItem }))"
      },
      {
        title: "État de formulaires multi-étapes",
        description: "Wizard ou formulaire en plusieurs pages où les données doivent être conservées.",
        example: "useFormStore(state => state.step1Data)"
      },
      {
        title: "Cache côté client",
        description: "Stocker temporairement des données API pour éviter des refetch inutiles.",
        example: "useProductCache(state => state.products[id])"
      }
    ],
    avoidCases: [
      {
        title: "État serveur (fetching, caching)",
        description: "Pour les données provenant d'APIs, préférez TanStack Query qui gère le cache, la revalidation et les états de chargement.",
        example: "Utilisez useQuery() plutôt que de stocker les résultats API dans Zustand"
      },
      {
        title: "État local d'un seul composant",
        description: "Si l'état n'est utilisé que dans un composant, useState suffit. Zustand est pour l'état partagé.",
        example: "const [isOpen, setIsOpen] = useState(false) // Pas besoin de Zustand"
      },
      {
        title: "Formulaires simples",
        description: "Pour un formulaire isolé, React Hook Form ou un simple useState est plus approprié.",
        example: "Formulaire de contact, modal de feedback"
      }
    ],
    realWorldExamples: [
      {
        title: "Store d'authentification",
        description: "Gestion du user connecté, token JWT, et état de loading avec persistance sécurisée.",
        example: "useAuthStore: { user, token, login(), logout(), isAuthenticated }"
      },
      {
        title: "Notifications toast",
        description: "Stack de notifications accessible depuis n'importe quel composant.",
        example: "useNotificationStore: { notifications, add(), remove(), clear() }"
      },
      {
        title: "Sidebar/Navigation state",
        description: "État d'ouverture de la sidebar, onglet actif, breadcrumbs.",
        example: "useUIStore: { sidebarOpen, activeTab, toggleSidebar() }"
      },
      {
        title: "Filtres et recherche",
        description: "État des filtres d'une liste partagé entre la sidebar et les résultats.",
        example: "useFilterStore: { filters, setFilter(), resetFilters(), activeFilters }"
      },
      {
        title: "Mode hors-ligne",
        description: "Queue d'actions à synchroniser quand la connexion revient.",
        example: "useOfflineStore: { pendingActions, addAction(), sync(), isOnline }"
      },
      {
        title: "Comparateur de produits",
        description: "Liste de produits à comparer accessible depuis les cards produits et la page de comparaison.",
        example: "useCompareStore: { products, add(), remove(), clear(), maxItems: 4 }"
      }
    ]
  }
};

// ==========================================
// Zod Schemas for validation
// ==========================================

const shippingSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z
    .string()
    .min(10, 'Le téléphone doit contenir au moins 10 chiffres')
    .regex(/^[0-9+\s-]+$/, 'Format de téléphone invalide'),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  city: z.string().min(2, 'La ville doit contenir au moins 2 caractères'),
  postalCode: z
    .string()
    .min(4, 'Code postal invalide')
    .regex(/^[0-9A-Za-z\s-]+$/, 'Format de code postal invalide'),
  country: z.string().min(2, 'Le pays doit contenir au moins 2 caractères'),
});

const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(16, 'Le numéro de carte doit contenir 16 chiffres')
    .max(19, 'Numéro de carte invalide')
    .regex(/^[0-9\s]+$/, 'Le numéro ne doit contenir que des chiffres'),
  cardHolder: z.string().min(3, 'Le nom du titulaire est requis'),
  expiryDate: z
    .string()
    .min(5, 'Format MM/AA requis')
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Format MM/AA invalide'),
  cvv: z
    .string()
    .min(3, 'CVV invalide')
    .max(4, 'CVV invalide')
    .regex(/^[0-9]+$/, 'Le CVV ne doit contenir que des chiffres'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;
type PaymentFormData = z.infer<typeof paymentSchema>;

// ==========================================
// Helper functions for input formatting
// ==========================================

const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(' ').substring(0, 19) : '';
};

const formatExpiryDate = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.length >= 2) {
    return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
  }
  return digits;
};

const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  if (digits.length <= 8)
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)}`;
};

// ==========================================
// Checkout Step Components
// ==========================================

const STEPS_CONFIG: { key: CheckoutStep; label: string; icon: React.ReactNode }[] = [
  { key: 'cart', label: 'Panier', icon: <ShoppingCart className="h-4 w-4" /> },
  { key: 'shipping', label: 'Livraison', icon: <Truck className="h-4 w-4" /> },
  { key: 'payment', label: 'Paiement', icon: <CreditCard className="h-4 w-4" /> },
  { key: 'confirmation', label: 'Confirmation', icon: <CheckCircle2 className="h-4 w-4" /> },
];

function CheckoutStepper({ currentStep }: { currentStep: CheckoutStep }) {
  const stepIndex = STEPS_CONFIG.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS_CONFIG.map((step, index) => (
        <div key={step.key} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
              index < stepIndex
                ? 'bg-green-600 border-green-600 text-white'
                : index === stepIndex
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-muted-foreground/30 text-muted-foreground'
            }`}
          >
            {index < stepIndex ? <Check className="h-5 w-5" /> : step.icon}
          </div>
          <span
            className={`ml-2 text-sm font-medium hidden sm:inline ${
              index <= stepIndex ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {step.label}
          </span>
          {index < STEPS_CONFIG.length - 1 && (
            <div
              className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                index < stepIndex ? 'bg-green-600' : 'bg-muted-foreground/30'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function CartStep() {
  const { cartItems, addToCart, removeFromCart, updateQuantity, getCartTotal, nextStep } =
    useCheckoutStore();

  const total = getCartTotal();

  return (
    <div className="space-y-6">
      {/* Products to add */}
      <div>
        <h3 className="font-semibold mb-3">Produits disponibles</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {sampleProducts.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => {
                addToCart(product);
                toast.success(`${product.name} ajouté au panier`);
              }}
            >
              <CardContent className="p-3 text-center">
                <div className="text-3xl mb-2">{product.image}</div>
                <p className="text-xs font-medium truncate">{product.name}</p>
                <p className="text-sm font-bold text-primary">
                  {product.price.toLocaleString('fr-FR')} €
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart items */}
      <div>
        <h3 className="font-semibold mb-3">Votre panier</h3>
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Votre panier est vide</p>
            <p className="text-sm">Cliquez sur un produit pour l&apos;ajouter</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.image}</span>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.price.toLocaleString('fr-FR')} € / unité
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => {
                      removeFromCart(item.id);
                      toast.info(`${item.name} retiré du panier`);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total and continue */}
      {cartItems.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{total.toLocaleString('fr-FR')} €</p>
          </div>
          <Button onClick={nextStep} size="lg">
            Continuer
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function ShippingStep() {
  const { shippingInfo, setShippingInfo, nextStep, prevStep } = useCheckoutStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: shippingInfo || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'France',
    },
  });

  const onSubmit = (data: ShippingFormData) => {
    setShippingInfo(data as ShippingInfo);
    toast.success('Informations de livraison enregistrées');
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            {...register('firstName')}
            className={errors.firstName ? 'border-destructive' : ''}
          />
          {errors.firstName && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            {...register('lastName')}
            className={errors.lastName ? 'border-destructive' : ''}
          />
          {errors.lastName && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone *</Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                id="phone"
                value={field.value}
                onChange={(e) => field.onChange(formatPhone(e.target.value))}
                placeholder="06 12 34 56 78"
                className={errors.phone ? 'border-destructive' : ''}
              />
            )}
          />
          {errors.phone && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse *</Label>
        <Input
          id="address"
          {...register('address')}
          placeholder="123 rue de la Paix"
          className={errors.address ? 'border-destructive' : ''}
        />
        {errors.address && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.address.message}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ville *</Label>
          <Input
            id="city"
            {...register('city')}
            className={errors.city ? 'border-destructive' : ''}
          />
          {errors.city && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.city.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">Code postal *</Label>
          <Input
            id="postalCode"
            {...register('postalCode')}
            placeholder="75001"
            className={errors.postalCode ? 'border-destructive' : ''}
          />
          {errors.postalCode && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.postalCode.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Pays *</Label>
          <Input
            id="country"
            {...register('country')}
            className={errors.country ? 'border-destructive' : ''}
          />
          {errors.country && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.country.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={prevStep}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button type="submit">
          Continuer
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

function PaymentStep() {
  const { setPaymentInfo, completeOrder, prevStep, getCartTotal } = useCheckoutStore();
  const total = getCartTotal();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
    },
  });

  const onSubmit = (data: PaymentFormData) => {
    // Mask card number for storage (only last 4 digits)
    const maskedCard = `**** **** **** ${data.cardNumber.replace(/\s/g, '').slice(-4)}`;
    setPaymentInfo({
      ...data,
      cardNumber: maskedCard,
    } as PaymentInfo);
    completeOrder();
    toast.success('Commande validée avec succès !');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Order summary */}
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total à payer</span>
          <span className="text-2xl font-bold">{total.toLocaleString('fr-FR')} €</span>
        </div>
      </div>

      {/* Card form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Numéro de carte *</Label>
          <Controller
            name="cardNumber"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <Input
                  id="cardNumber"
                  value={field.value}
                  onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={`pl-10 font-mono ${errors.cardNumber ? 'border-destructive' : ''}`}
                />
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            )}
          />
          {errors.cardNumber && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.cardNumber.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardHolder">Nom sur la carte *</Label>
          <Controller
            name="cardHolder"
            control={control}
            render={({ field }) => (
              <Input
                id="cardHolder"
                {...field}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                placeholder="JEAN DUPONT"
                className={`uppercase ${errors.cardHolder ? 'border-destructive' : ''}`}
              />
            )}
          />
          {errors.cardHolder && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.cardHolder.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Date d&apos;expiration *</Label>
            <Controller
              name="expiryDate"
              control={control}
              render={({ field }) => (
                <Input
                  id="expiryDate"
                  value={field.value}
                  onChange={(e) => field.onChange(formatExpiryDate(e.target.value))}
                  placeholder="MM/AA"
                  maxLength={5}
                  className={`font-mono ${errors.expiryDate ? 'border-destructive' : ''}`}
                />
              )}
            />
            {errors.expiryDate && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.expiryDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvv">CVV *</Label>
            <Controller
              name="cvv"
              control={control}
              render={({ field }) => (
                <Input
                  id="cvv"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  maxLength={4}
                  type="password"
                  className={`font-mono ${errors.cvv ? 'border-destructive' : ''}`}
                />
              )}
            />
            {errors.cvv && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.cvv.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Security badges */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Check className="h-3 w-3 text-green-600" />
          Paiement sécurisé SSL
        </span>
        <span className="flex items-center gap-1">
          <Check className="h-3 w-3 text-green-600" />
          Données chiffrées
        </span>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={prevStep}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          <CreditCard className="mr-2 h-4 w-4" />
          Payer {total.toLocaleString('fr-FR')} €
        </Button>
      </div>
    </form>
  );
}

function ConfirmationStep() {
  const { orderId, shippingInfo, cartItems, getCartTotal, resetCheckout } = useCheckoutStore();
  const total = getCartTotal();

  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">Commande confirmée !</h3>
        <p className="text-muted-foreground">
          Merci pour votre commande. Vous recevrez un email de confirmation.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-muted-foreground">Numéro de commande</span>
            <span className="font-mono font-bold text-lg">{orderId}</span>
          </div>

          <div className="space-y-2">
            <p className="font-semibold flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Livraison à
            </p>
            {shippingInfo && (
              <p className="text-sm text-muted-foreground">
                {shippingInfo.firstName} {shippingInfo.lastName}
                <br />
                {shippingInfo.address}
                <br />
                {shippingInfo.postalCode} {shippingInfo.city}, {shippingInfo.country}
              </p>
            )}
          </div>

          <div className="space-y-2 pt-4 border-t">
            <p className="font-semibold flex items-center gap-2">
              <Package className="h-4 w-4" />
              Articles commandés
            </p>
            <div className="space-y-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.image} {item.name} x{item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toLocaleString('fr-FR')} €</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total</span>
              <span>{total.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={resetCheckout} variant="outline" size="lg">
        <RotateCcw className="mr-2 h-4 w-4" />
        Nouvelle commande
      </Button>
    </div>
  );
}

function CheckoutWizard() {
  const { currentStep } = useCheckoutStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <CheckoutStepper currentStep={currentStep} />

      {currentStep === 'cart' && <CartStep />}
      {currentStep === 'shipping' && <ShippingStep />}
      {currentStep === 'payment' && <PaymentStep />}
      {currentStep === 'confirmation' && <ConfirmationStep />}
    </div>
  );
}

// ==========================================
// Main Page Component
// ==========================================

export default function ZustandPage() {
  const t = useTranslations('zustand');
  const { count, increment, decrement, reset, setCount } = useCounterStore();
  const { todos, addTodo, toggleTodo, removeTodo, clearCompleted } = useTodoStore();
  const [newTodo, setNewTodo] = useState('');
  const [customCount, setCustomCount] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo('');
      toast.success(t('todoAdded'));
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
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="why-when" className="flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Pourquoi/Quand</span>
            <span className="sm:hidden">?</span>
          </TabsTrigger>
          <TabsTrigger value="basics">{t('tabs.basics')}</TabsTrigger>
          <TabsTrigger value="counter">{t('tabs.counter')}</TabsTrigger>
          <TabsTrigger value="todos">{t('tabs.todos')}</TabsTrigger>
          <TabsTrigger value="checkout" className="flex items-center gap-1">
            <ShoppingCart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Checkout</span>
          </TabsTrigger>
          <TabsTrigger value="advanced">{t('tabs.advanced')}</TabsTrigger>
        </TabsList>

        <TabsContent value="why-when">
          <WhyWhenTabs why={zustandWhyWhen.why} when={zustandWhyWhen.when} />
        </TabsContent>

        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('whatIs')}</CardTitle>
              <CardDescription>
                {t('whatIsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">2.6kB</div>
                  <h3 className="font-semibold">{t('tinyBundle')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('tinyBundleDesc')}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">Zero</div>
                  <h3 className="font-semibold">{t('noBoilerplate')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('noBoilerplateDesc')}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">TS</div>
                  <h3 className="font-semibold">{t('typescript')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('typescriptDesc')}
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
              <CardTitle>{t('keyFeatures')}</CardTitle>
              <CardDescription>
                {t('keyFeaturesDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">{t('advantages')}</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      {t('noProviders')}
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      {t('worksEverywhere')}
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      {t('middleware')}
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      {t('asyncActions')}
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">{t('useCases')}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {t('globalState')}</li>
                    <li>• {t('authState')}</li>
                    <li>• {t('shoppingCart')}</li>
                    <li>• {t('theme')}</li>
                    <li>• {t('apiCache')}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="counter" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('interactiveCounter')}</CardTitle>
              <CardDescription>
                {t('interactiveCounterDesc')}
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
                    placeholder={t('setCustomValue')}
                    value={customCount}
                    onChange={(e) => setCustomCount(e.target.value)}
                    className="w-40"
                  />
                  <Button onClick={handleSetCustomCount}>{t('set')}</Button>
                </div>
              </div>

              <Badge variant="secondary" className="w-full justify-center py-2">
                {t('counterPersists')}
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
              <CardTitle>{t('todoListDemo')}</CardTitle>
              <CardDescription>
                {t('todoListDemoDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder={t('addNewTodo')}
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                />
                <Button onClick={handleAddTodo}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('add')}
                </Button>
              </div>

              <div className="space-y-2">
                {todos.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {t('noTodos')}
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
                  {t('clearCompleted')}
                </Button>
              )}

              <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
                <span>{t('total')} {todos.length}</span>
                <span>{t('completed')} {todos.filter(t => t.completed).length}</span>
                <span>{t('remaining')} {todos.filter(t => !t.completed).length}</span>
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

        <TabsContent value="checkout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Tunnel de commande multi-étapes
              </CardTitle>
              <CardDescription>
                Exemple complet d&apos;un checkout wizard utilisant Zustand pour gérer l&apos;état global,
                Zod pour la validation des schémas, et React Hook Form avec Controller pour le
                formatage des inputs (carte bancaire, téléphone, date d&apos;expiration).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CheckoutWizard />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Code du Store</CardTitle>
              <CardDescription>
                Store Zustand avec persistance partielle (le panier est sauvegardé, pas les infos de paiement)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="checkout-store.ts"
                code={`import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation';

interface CheckoutState {
  currentStep: CheckoutStep;
  cartItems: CartItem[];
  shippingInfo: ShippingInfo | null;
  paymentInfo: PaymentInfo | null;
  orderCompleted: boolean;
  orderId: string | null;

  // Navigation
  setStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Cart
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;

  // Forms
  setShippingInfo: (info: ShippingInfo) => void;
  setPaymentInfo: (info: PaymentInfo) => void;

  // Order
  completeOrder: () => void;
  resetCheckout: () => void;
  getCartTotal: () => number;
}

export const useCheckoutStore = create<CheckoutState>()(
  devtools(
    persist(
      (set, get) => ({
        currentStep: 'cart',
        cartItems: [],
        shippingInfo: null,
        paymentInfo: null,
        orderCompleted: false,
        orderId: null,

        nextStep: () => {
          const steps = ['cart', 'shipping', 'payment', 'confirmation'];
          const currentIndex = steps.indexOf(get().currentStep);
          if (currentIndex < steps.length - 1) {
            set({ currentStep: steps[currentIndex + 1] as CheckoutStep });
          }
        },

        addToCart: (item) => {
          const existing = get().cartItems.find(i => i.id === item.id);
          if (existing) {
            set({
              cartItems: get().cartItems.map(i =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            });
          } else {
            set({ cartItems: [...get().cartItems, { ...item, quantity: 1 }] });
          }
        },

        completeOrder: () => {
          set({
            orderCompleted: true,
            orderId: \`ORD-\${Date.now().toString(36).toUpperCase()}\`,
            currentStep: 'confirmation',
          });
        },

        getCartTotal: () =>
          get().cartItems.reduce((t, i) => t + i.price * i.quantity, 0),
        // ... autres actions
      }),
      {
        name: 'checkout-storage',
        // Ne pas persister les infos de paiement pour la sécurité
        partialize: (state) => ({
          cartItems: state.cartItems,
          shippingInfo: state.shippingInfo,
        }),
      }
    )
  )
);`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Validation Zod + React Hook Form</CardTitle>
              <CardDescription>
                Schémas de validation avec formatage automatique des inputs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="Validation et formatage"
                code={`import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Schéma Zod pour le paiement
const paymentSchema = z.object({
  cardNumber: z.string()
    .min(16, 'Le numéro de carte doit contenir 16 chiffres')
    .regex(/^[0-9\\s]+$/, 'Chiffres uniquement'),
  cardHolder: z.string().min(3, 'Nom requis'),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\\/([0-9]{2})$/, 'Format MM/AA'),
  cvv: z.string()
    .min(3, 'CVV invalide')
    .regex(/^[0-9]+$/, 'Chiffres uniquement'),
});

// Formatage du numéro de carte (4 groupes de 4)
const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\\D/g, '');
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(' ').substring(0, 19) : '';
};

// Formatage de la date d'expiration
const formatExpiryDate = (value: string): string => {
  const digits = value.replace(/\\D/g, '');
  if (digits.length >= 2) {
    return \`\${digits.substring(0, 2)}/\${digits.substring(2, 4)}\`;
  }
  return digits;
};

// Utilisation avec Controller pour le formatage
function PaymentForm() {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(paymentSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="cardNumber"
        control={control}
        render={({ field }) => (
          <Input
            value={field.value}
            onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />
        )}
      />

      <Controller
        name="expiryDate"
        control={control}
        render={({ field }) => (
          <Input
            value={field.value}
            onChange={(e) => field.onChange(formatExpiryDate(e.target.value))}
            placeholder="MM/AA"
            maxLength={5}
          />
        )}
      />
    </form>
  );
}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          {/* Header */}
          <Card className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-2xl">{t('advanced.title')}</CardTitle>
              <CardDescription className="text-base">
                {t('advanced.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Middleware Composition */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">1</Badge>
                {t('advanced.middlewareTitle')}
              </CardTitle>
              <CardDescription>{t('advanced.middlewareDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                  <p className="font-semibold text-sm text-blue-800 dark:text-blue-200">{t('advanced.persistTitle')}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">{t('advanced.persistDesc')}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                  <p className="font-semibold text-sm text-purple-800 dark:text-purple-200">{t('advanced.devtoolsTitle')}</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">{t('advanced.devtoolsDesc')}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                  <p className="font-semibold text-sm text-green-800 dark:text-green-200">{t('advanced.immerTitle')}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">{t('advanced.immerDesc')}</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
                  <p className="font-semibold text-sm text-amber-800 dark:text-amber-200">{t('advanced.subscribeTitle')}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">{t('advanced.subscribeDesc')}</p>
                </div>
              </div>

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

// Middleware composition: devtools > persist > subscribeWithSelector > immer
export const useUserStore = create<UserState>()(
  devtools(                           // 1. Debugging avec Redux DevTools
    persist(                          // 2. Persistance localStorage
      subscribeWithSelector(          // 3. Abonnements avec sélecteurs
        immer((set) => ({             // 4. Mutations immutables simplifiées
          user: null,
          preferences: { theme: 'light', language: 'en' },

          login: (user) => set((state) => {
            state.user = user;        // Mutation directe grâce à immer
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
        partialize: (state) => ({     // Ne persister que certaines propriétés
          user: state.user,
          preferences: state.preferences
        }),
      }
    ),
    { name: 'user-store' }            // Nom dans Redux DevTools
  )
);

// Abonnement aux changements spécifiques (grâce à subscribeWithSelector)
useUserStore.subscribe(
  (state) => state.preferences.theme,  // Sélecteur
  (theme) => {                         // Callback quand theme change
    document.documentElement.className = theme;
  }
);`}
              />
            </CardContent>
          </Card>

          {/* Async Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">2</Badge>
                {t('advanced.asyncTitle')}
              </CardTitle>
              <CardDescription>{t('advanced.asyncDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg border bg-muted/50">
                  <p className="font-medium text-sm">{t('advanced.loadingStates')}</p>
                </div>
                <div className="p-3 rounded-lg border bg-muted/50">
                  <p className="font-medium text-sm">{t('advanced.errorHandling')}</p>
                </div>
                <div className="p-3 rounded-lg border bg-muted/50">
                  <p className="font-medium text-sm">{t('advanced.optimisticUpdates')}</p>
                </div>
                <div className="p-3 rounded-lg border bg-muted/50">
                  <p className="font-medium text-sm">{t('advanced.retryLogic')}</p>
                </div>
              </div>

              <CodeExample
                title="Async Store avec Loading/Error States"
                code={`interface ApiState<T> {
  data: T[];
  loading: boolean;
  error: string | null;

  // CRUD Actions
  fetchAll: () => Promise<void>;
  create: (item: Omit<T, 'id'>) => Promise<void>;
  update: (id: string, updates: Partial<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;

  // Helpers
  reset: () => void;
}

export const useApiStore = create<ApiState<User>>()(
  devtools((set, get) => ({
    data: [],
    loading: false,
    error: null,

    // Fetch avec loading state
    fetchAll: async () => {
      set({ loading: true, error: null });
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Erreur réseau');
        const data = await response.json();
        set({ data, loading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Erreur inconnue',
          loading: false
        });
      }
    },

    // Create avec mise à jour optimiste
    create: async (item) => {
      const tempId = \`temp-\${Date.now()}\`;
      const optimisticItem = { ...item, id: tempId } as User;

      // Mise à jour optimiste
      set((state) => ({ data: [...state.data, optimisticItem] }));

      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        const newItem = await response.json();

        // Remplacer l'item temporaire par le vrai
        set((state) => ({
          data: state.data.map((i) => i.id === tempId ? newItem : i),
        }));
      } catch (error) {
        // Rollback en cas d'erreur
        set((state) => ({
          data: state.data.filter((i) => i.id !== tempId),
          error: 'Erreur lors de la création',
        }));
      }
    },

    // Update avec get() pour accéder à l'état courant
    update: async (id, updates) => {
      const { data } = get();
      const originalItem = data.find((i) => i.id === id);

      // Mise à jour optimiste
      set({
        data: data.map((i) => i.id === id ? { ...i, ...updates } : i),
      });

      try {
        await fetch(\`/api/users/\${id}\`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
      } catch (error) {
        // Rollback
        if (originalItem) {
          set({
            data: get().data.map((i) => i.id === id ? originalItem : i),
            error: 'Erreur lors de la mise à jour',
          });
        }
      }
    },

    remove: async (id) => {
      const { data } = get();
      const removedItem = data.find((i) => i.id === id);

      set({ data: data.filter((i) => i.id !== id) });

      try {
        await fetch(\`/api/users/\${id}\`, { method: 'DELETE' });
      } catch (error) {
        // Rollback
        if (removedItem) {
          set({
            data: [...get().data, removedItem],
            error: 'Erreur lors de la suppression',
          });
        }
      }
    },

    reset: () => set({ data: [], loading: false, error: null }),
  }))
);`}
              />
            </CardContent>
          </Card>

          {/* Store Slicing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">3</Badge>
                {t('advanced.slicesTitle')}
              </CardTitle>
              <CardDescription>{t('advanced.slicesDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg border bg-muted/50">
                  <p className="font-medium text-sm">{t('advanced.createSlice')}</p>
                </div>
                <div className="p-3 rounded-lg border bg-muted/50">
                  <p className="font-medium text-sm">{t('advanced.combineSlices')}</p>
                </div>
                <div className="p-3 rounded-lg border bg-muted/50">
                  <p className="font-medium text-sm">{t('advanced.typeSafety')}</p>
                </div>
                <div className="p-3 rounded-lg border bg-muted/50">
                  <p className="font-medium text-sm">{t('advanced.isolation')}</p>
                </div>
              </div>

              <CodeExample
                title="Store Slicing Pattern"
                code={`import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ===== Types des Slices =====
interface AuthSlice {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

interface CartSlice {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

interface UISlice {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

// Type du store complet
type AppStore = AuthSlice & CartSlice & UISlice;

// ===== Création des Slices =====
const createAuthSlice: StateCreator<AppStore, [], [], AuthSlice> = (set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
});

const createCartSlice: StateCreator<AppStore, [], [], CartSlice> = (set, get) => ({
  items: [],
  addItem: (item) => set((state) => {
    const existing = state.items.find((i) => i.id === item.id);
    if (existing) {
      return {
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),
  clearCart: () => set({ items: [] }),
  getTotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
});

const createUISlice: StateCreator<AppStore, [], [], UISlice> = (set) => ({
  theme: 'light',
  sidebarOpen: false,
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light',
  })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
});

// ===== Combinaison des Slices =====
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (...a) => ({
        ...createAuthSlice(...a),
        ...createCartSlice(...a),
        ...createUISlice(...a),
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          // Ne persister que certaines données
          user: state.user,
          theme: state.theme,
          // Ne pas persister le panier (session uniquement)
        }),
      }
    ),
    { name: 'app-store' }
  )
);

// ===== Sélecteurs Typés =====
export const selectUser = (state: AppStore) => state.user;
export const selectCartItems = (state: AppStore) => state.items;
export const selectCartTotal = (state: AppStore) => state.getTotal();
export const selectTheme = (state: AppStore) => state.theme;`}
              />
            </CardContent>
          </Card>

          {/* Selectors and Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">4</Badge>
                {t('advanced.selectorsTitle')}
              </CardTitle>
              <CardDescription>{t('advanced.selectorsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg border bg-muted/50">
                  <p className="font-medium text-sm">{t('advanced.shallowCompare')}</p>
                </div>
                <div className="p-3 rounded-lg border bg-muted/50">
                  <p className="font-medium text-sm">{t('advanced.memoizedSelectors')}</p>
                </div>
                <div className="p-3 rounded-lg border bg-muted/50">
                  <p className="font-medium text-sm">{t('advanced.computedValues')}</p>
                </div>
                <div className="p-3 rounded-lg border bg-muted/50">
                  <p className="font-medium text-sm">{t('advanced.avoidRerender')}</p>
                </div>
              </div>

              <CodeExample
                title="Sélecteurs et Optimisation"
                code={`import { useShallow } from 'zustand/react/shallow';

// ❌ MAUVAIS: Re-render à chaque changement du store
function BadComponent() {
  const store = useAppStore(); // Sélectionne tout le store
  return <div>{store.user?.name}</div>;
}

// ✅ BON: Re-render seulement quand user change
function GoodComponent() {
  const user = useAppStore((state) => state.user);
  return <div>{user?.name}</div>;
}

// ✅ BON: Sélection multiple avec useShallow
function CartSummary() {
  const { items, getTotal } = useAppStore(
    useShallow((state) => ({
      items: state.items,
      getTotal: state.getTotal,
    }))
  );
  return (
    <div>
      <span>{items.length} articles</span>
      <span>{getTotal()} €</span>
    </div>
  );
}

// ===== Sélecteurs Mémorisés avec Reselect =====
import { createSelector } from 'reselect';

// Sélecteur de base
const selectItems = (state: AppStore) => state.items;

// Sélecteur dérivé mémorisé
const selectItemCount = createSelector(
  [selectItems],
  (items) => items.reduce((sum, item) => sum + item.quantity, 0)
);

const selectExpensiveItems = createSelector(
  [selectItems],
  (items) => items.filter((item) => item.price > 100)
);

// Utilisation
function ItemStats() {
  const itemCount = useAppStore(selectItemCount);
  const expensiveItems = useAppStore(selectExpensiveItems);
  // Ne re-render que si items change ET si le résultat calculé change
}`}
              />
            </CardContent>
          </Card>

          {/* Usage Outside React */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary">5</Badge>
                {t('advanced.outsideReactTitle')}
              </CardTitle>
              <CardDescription>{t('advanced.outsideReactDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg border bg-muted/50">
                  <p className="font-medium text-sm">{t('advanced.getState')}</p>
                </div>
                <div className="p-3 rounded-lg border bg-muted/50">
                  <p className="font-medium text-sm">{t('advanced.setState')}</p>
                </div>
                <div className="p-3 rounded-lg border bg-muted/50">
                  <p className="font-medium text-sm">{t('advanced.subscribe')}</p>
                </div>
                <div className="p-3 rounded-lg border bg-muted/50">
                  <p className="font-medium text-sm">{t('advanced.vanillaJs')}</p>
                </div>
              </div>

              <CodeExample
                title="Utilisation hors React"
                code={`// ===== Accès direct au store =====

// Lire l'état actuel (sans React)
const currentUser = useAppStore.getState().user;
const isLoggedIn = useAppStore.getState().isAuthenticated;

// Modifier l'état (sans React)
useAppStore.setState({ sidebarOpen: true });
useAppStore.getState().login({ id: '1', name: 'John' });

// ===== Abonnement aux changements =====
const unsubscribe = useAppStore.subscribe((state, prevState) => {
  if (state.user !== prevState.user) {
    console.log('User changed:', state.user);
    // Analytics, logging, etc.
  }
});

// Se désabonner quand nécessaire
unsubscribe();

// ===== Cas d'usage concrets =====

// 1. Dans un intercepteur Axios
import axios from 'axios';

axios.interceptors.request.use((config) => {
  const token = useAppStore.getState().user?.token;
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// 2. Dans un service/utility
export const analyticsService = {
  trackPurchase: () => {
    const { items, getTotal } = useAppStore.getState();
    sendAnalytics('purchase', {
      itemCount: items.length,
      total: getTotal(),
    });
  },
};

// 3. Synchronisation avec d'autres systèmes
useAppStore.subscribe(
  (state) => state.theme,
  (theme) => {
    // Sync avec CSS custom properties
    document.documentElement.style.setProperty('--theme', theme);
    // Sync avec localStorage
    localStorage.setItem('preferred-theme', theme);
  }
);`}
              />
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle>{t('advanced.bestPractices')}</CardTitle>
              <CardDescription>{t('advanced.bestPracticesDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">
                    ✅ {t('advanced.do')}
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 text-green-600" />
                      {t('advanced.doList.singleStore')}
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 text-green-600" />
                      {t('advanced.doList.flatStructure')}
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 text-green-600" />
                      {t('advanced.doList.selectors')}
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 text-green-600" />
                      {t('advanced.doList.typedActions')}
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 text-green-600" />
                      {t('advanced.doList.devtools')}
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-red-600 dark:text-red-400">
                    ❌ {t('advanced.avoid')}
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 text-red-600" />
                      {t('advanced.avoidList.deepNesting')}
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 text-red-600" />
                      {t('advanced.avoidList.entireStore')}
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 text-red-600" />
                      {t('advanced.avoidList.mutations')}
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 text-red-600" />
                      {t('advanced.avoidList.tooManyStores')}
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 text-red-600" />
                      {t('advanced.avoidList.businessLogic')}
                    </li>
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