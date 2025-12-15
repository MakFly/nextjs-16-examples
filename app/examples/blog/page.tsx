import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Calendar, 
  User, 
  Search, 
  Tag,
  ArrowRight,
  Clock,
  Eye,
  Heart,
  Share2,
  Bookmark
} from 'lucide-react';
import Link from 'next/link';

// Simulated blog data
const blogPosts = [
  {
    id: 1,
    title: "Introduction à Next.js 15 et App Router",
    slug: "introduction-nextjs-15-app-router",
    excerpt: "Découvrez les nouvelles fonctionnalités de Next.js 15 et comment utiliser l'App Router pour créer des applications modernes.",
    content: "Next.js 15 apporte de nombreuses améliorations...",
    author: "Marie Dubois",
    authorAvatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    publishedAt: "2024-01-15",
    readTime: "8 min",
    views: 1234,
    category: "Développement",
    tags: ["Next.js", "React", "JavaScript"],
    image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop"
  },
  {
    id: 2,
    title: "Optimisation des performances avec Server Components",
    slug: "optimisation-performances-server-components",
    excerpt: "Apprenez à optimiser vos applications React avec les Server Components et améliorer l'expérience utilisateur.",
    content: "Les Server Components révolutionnent...",
    author: "Thomas Martin",
    authorAvatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    publishedAt: "2024-01-12",
    readTime: "12 min",
    views: 856,
    category: "Performance",
    tags: ["React", "Performance", "SSR"],
    image: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop"
  },
  {
    id: 3,
    title: "Guide complet de Zustand pour la gestion d'état",
    slug: "guide-complet-zustand-gestion-etat",
    excerpt: "Maîtrisez Zustand, la solution moderne et légère pour gérer l'état de vos applications React.",
    content: "Zustand offre une approche simple...",
    author: "Sophie Laurent",
    authorAvatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    publishedAt: "2024-01-10",
    readTime: "15 min",
    views: 2103,
    category: "State Management",
    tags: ["Zustand", "React", "State"],
    image: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop"
  },
  {
    id: 4,
    title: "Validation de formulaires avec Zod et React Hook Form",
    slug: "validation-formulaires-zod-react-hook-form",
    excerpt: "Créez des formulaires robustes avec une validation type-safe grâce à Zod et React Hook Form.",
    content: "La validation des formulaires...",
    author: "Pierre Durand",
    authorAvatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    publishedAt: "2024-01-08",
    readTime: "10 min",
    views: 1567,
    category: "Formulaires",
    tags: ["Zod", "Forms", "Validation"],
    image: "https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop"
  }
];

const categories = [
  { name: "Tous", count: 24, color: "bg-slate-100 text-slate-800 hover:bg-slate-200" },
  { name: "Développement", count: 8, color: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  { name: "Performance", count: 5, color: "bg-green-100 text-green-800 hover:bg-green-200" },
  { name: "State Management", count: 4, color: "bg-purple-100 text-purple-800 hover:bg-purple-200" },
  { name: "Formulaires", count: 7, color: "bg-orange-100 text-orange-800 hover:bg-orange-200" }
];

async function FeaturedPost() {
  await new Promise(resolve => setTimeout(resolve, 500));
  const featured = blogPosts[0];
  
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-xl">
      <div className="md:flex">
        <div className="md:w-1/2 relative">
          <img 
            src={featured.image} 
            alt={featured.title}
            className="w-full h-64 md:h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <Badge className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700">
            Article à la une
          </Badge>
        </div>
        <div className="md:w-1/2 p-8">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
            {featured.category}
          </Badge>
          <h2 className="text-3xl font-bold mb-4 text-gray-900 leading-tight">
            {featured.title}
          </h2>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            {featured.excerpt}
          </p>
          
          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center space-x-3">
              <img 
                src={featured.authorAvatar} 
                alt={featured.author}
                className="w-10 h-10 rounded-full ring-2 ring-blue-200"
              />
              <span className="font-medium text-gray-900">{featured.author}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{featured.publishedAt}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{featured.readTime}</span>
            </div>
          </div>
          
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg" asChild>
            <Link href={`/examples/blog/${featured.slug}`}>
              Lire l'article
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

async function BlogPostsList() {
  await new Promise(resolve => setTimeout(resolve, 800));
  const posts = blogPosts.slice(1);
  
  return (
    <div className="space-y-8">
      {posts.map(post => (
        <Card key={post.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white border-gray-200">
          <div className="md:flex">
            <div className="md:w-1/3 relative">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-48 md:h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
            <div className="md:w-2/3 p-6">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {post.category}
                </Badge>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-gray-900 hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={post.authorAvatar} 
                      alt={post.author}
                      className="w-8 h-8 rounded-full ring-2 ring-gray-200"
                    />
                    <span className="font-medium text-gray-900">{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{post.publishedAt}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50" asChild>
                  <Link href={`/examples/blog/${post.slug}`}>
                    Lire plus
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs border-gray-300 text-gray-600 hover:bg-gray-50">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function BlogSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map(i => (
        <Card key={i} className="overflow-hidden animate-pulse">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="w-full h-48 md:h-32 bg-gray-200"></div>
            </div>
            <div className="md:w-2/3 p-6">
              <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function BlogExamplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/examples" className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  DevBlog
                </span>
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link href="/examples/blog" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  Accueil
                </Link>
                <Link href="/examples/blog/categories" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Catégories
                </Link>
                <Link href="/examples/blog/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                  À propos
                </Link>
                <Link href="/examples/blog/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 w-64 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                S'abonner
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            Blog de Développement
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez les dernières tendances en développement web, 
            des tutoriels pratiques et des conseils d'experts pour améliorer vos compétences.
          </p>
        </div>

        {/* Featured Post */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Article à la une</h2>
          <Suspense fallback={
            <Card className="overflow-hidden animate-pulse">
              <div className="md:flex">
                <div className="md:w-1/2 h-64 bg-gray-200"></div>
                <div className="md:w-1/2 p-6">
                  <div className="h-6 bg-gray-200 rounded w-20 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </Card>
          }>
            <FeaturedPost />
          </Suspense>
        </section>

        {/* Categories Filter */}
        <section className="mb-12">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Filtrer par catégorie</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <Button
                key={category.name}
                variant={category.name === "Tous" ? "default" : "outline"}
                className={category.name === "Tous" 
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" 
                  : `${category.color} border-0 shadow-sm`
                }
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 bg-white/20 text-current">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </section>

        {/* Blog Posts List */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Derniers articles</h2>
          <Suspense fallback={<BlogSkeleton />}>
            <BlogPostsList />
          </Suspense>
        </section>

        {/* Pagination */}
        <div className="flex justify-center mt-16">
          <div className="flex space-x-2">
            <Button variant="outline" disabled className="border-gray-300">
              Précédent
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">1</Button>
            <Button variant="outline" className="border-gray-300 hover:bg-gray-50">2</Button>
            <Button variant="outline" className="border-gray-300 hover:bg-gray-50">3</Button>
            <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
              Suivant
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">DevBlog</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Votre source d'information pour le développement web moderne et les meilleures pratiques.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Catégories</h3>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="#" className="hover:text-white transition-colors">Développement</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Performance</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Tutoriels</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Ressources</h3>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Exemples</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Outils</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Contact</h3>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="#" className="hover:text-white transition-colors">À propos</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Newsletter</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DevBlog. Tous droits réservés. Créé avec ❤️ pour la communauté dev.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}