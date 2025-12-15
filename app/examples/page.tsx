import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  ShoppingCart, 
  BarChart3, 
  Globe,
  ArrowRight,
  Code2,
  Users,
  Zap
} from 'lucide-react';
import Link from 'next/link';

const examples = [
  {
    title: 'Blog/CMS',
    description: 'Application de blog complète avec système de gestion de contenu, catégories, recherche et interface d\'administration.',
    icon: BookOpen,
    href: '/examples/blog',
    badge: 'Content',
    color: 'bg-blue-500',
    features: [
      'Articles avec catégories et tags',
      'Système de recherche avancé',
      'Interface d\'administration',
      'Gestion des utilisateurs',
      'SEO optimisé'
    ],
    tech: ['Next.js', 'React', 'Tailwind CSS', 'Suspense'],
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop'
  },
  {
    title: 'E-commerce',
    description: 'Boutique en ligne complète avec catalogue produits, panier, checkout et gestion des commandes.',
    icon: ShoppingCart,
    href: '/examples/ecommerce',
    badge: 'Commerce',
    color: 'bg-green-500',
    features: [
      'Catalogue avec filtres avancés',
      'Panier et checkout sécurisé',
      'Gestion des commandes',
      'Système de notation',
      'Interface responsive'
    ],
    tech: ['Next.js', 'Server Components', 'Stripe', 'Database'],
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop'
  },
  {
    title: 'SaaS Dashboard',
    description: 'Tableau de bord SaaS avec analytics, gestion d\'utilisateurs, métriques en temps réel et rapports.',
    icon: BarChart3,
    href: '/examples/dashboard',
    badge: 'Analytics',
    color: 'bg-purple-500',
    features: [
      'Métriques en temps réel',
      'Graphiques interactifs',
      'Gestion d\'équipe',
      'Rapports personnalisés',
      'Notifications push'
    ],
    tech: ['Next.js', 'Charts', 'Real-time', 'API'],
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop'
  },
  {
    title: 'Site Corporate',
    description: 'Site vitrine d\'entreprise avec présentation des services, équipe, témoignages et formulaire de contact.',
    icon: Globe,
    href: '/examples/corporate',
    badge: 'Business',
    color: 'bg-orange-500',
    features: [
      'Landing page optimisée',
      'Présentation d\'équipe',
      'Portfolio de projets',
      'Témoignages clients',
      'Formulaire de contact'
    ],
    tech: ['Next.js', 'SEO', 'Forms', 'Animations'],
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop'
  }
];

const features = [
  {
    icon: Code2,
    title: 'Code Production-Ready',
    description: 'Exemples complets avec les meilleures pratiques et patterns modernes'
  },
  {
    icon: Zap,
    title: 'Performance Optimisée',
    description: 'Loading states, streaming UI et optimisations avancées'
  },
  {
    icon: Users,
    title: 'UX/UI Moderne',
    description: 'Interfaces utilisateur intuitives et design responsive'
  }
];

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
            Exemples d'Applications
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez des exemples concrets d'applications construites avec Next.js App Router. 
            Chaque exemple démontre des patterns et techniques spécifiques.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Examples Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {examples.map((example, index) => {
            const Icon = example.icon;
            return (
              <Card key={example.title} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm overflow-hidden">
                <div className="relative">
                  <img 
                    src={example.image} 
                    alt={example.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${example.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="bg-white/90">
                      {example.badge}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {example.title}
                  </CardTitle>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Fonctionnalités :</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {example.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Technologies :</h4>
                    <div className="flex flex-wrap gap-2">
                      {example.tech.map((tech, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button asChild className="w-full group">
                    <Link href={example.href}>
                      Voir l'exemple
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Back to Tutorial */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Prêt à apprendre ?</h2>
            <p className="text-blue-100 mb-6">
              Retournez au tutoriel principal pour apprendre à construire ces applications étape par étape.
            </p>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/">
                Retour au tutoriel
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}