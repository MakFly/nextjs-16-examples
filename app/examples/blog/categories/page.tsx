import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  ArrowLeft,
  TrendingUp,
  Code,
  Zap,
  Users
} from 'lucide-react';
import Link from 'next/link';

const categories = [
  {
    name: "Développement",
    description: "Tutoriels et guides sur les technologies de développement web modernes",
    count: 8,
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    icon: Code,
    posts: [
      "Introduction à Next.js 15",
      "React Server Components",
      "TypeScript avancé",
      "API Routes optimisées"
    ]
  },
  {
    name: "Performance",
    description: "Optimisation et amélioration des performances des applications web",
    count: 5,
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    icon: Zap,
    posts: [
      "Optimisation des images",
      "Lazy loading avancé",
      "Bundle splitting",
      "Core Web Vitals"
    ]
  },
  {
    name: "State Management",
    description: "Gestion d'état avec Zustand, Redux et autres solutions modernes",
    count: 4,
    color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    icon: TrendingUp,
    posts: [
      "Zustand vs Redux",
      "Context API patterns",
      "State persistence",
      "Async state management"
    ]
  },
  {
    name: "Formulaires",
    description: "Validation, gestion et optimisation des formulaires React",
    count: 7,
    color: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    icon: Users,
    posts: [
      "React Hook Form",
      "Validation avec Zod",
      "Formulaires complexes",
      "UX des formulaires"
    ]
  }
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/examples/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au blog
              </Link>
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                DevBlog
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            Catégories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explorez nos articles organisés par thématiques pour trouver exactement 
            ce que vous cherchez et approfondir vos connaissances.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.name} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white border-gray-200 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </CardTitle>
                        <Badge className={category.color}>
                          {category.count} articles
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">Articles populaires :</h4>
                    <ul className="space-y-2">
                      {category.posts.map((post, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3" />
                          {post}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg" asChild>
                    <Link href={`/examples/blog?category=${category.name.toLowerCase()}`}>
                      Voir tous les articles
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Statistiques du blog</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">24</div>
              <div className="text-blue-100">Articles publiés</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4</div>
              <div className="text-blue-100">Catégories</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15k+</div>
              <div className="text-blue-100">Lecteurs mensuels</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Satisfaction</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}