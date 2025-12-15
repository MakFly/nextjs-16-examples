import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  Search, 
  User, 
  Heart,
  Star,
  Filter,
  Grid,
  List,
  Truck,
  Shield,
  RotateCcw,
  Zap,
  Award,
  Clock
} from 'lucide-react';
import Link from 'next/link';

// Simulated product data
const products = [
  {
    id: 1,
    name: "MacBook Pro 16\" M3",
    price: 2499.99,
    originalPrice: 2799.99,
    rating: 4.8,
    reviews: 234,
    image: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    category: "Ordinateurs",
    brand: "Apple",
    inStock: true,
    isNew: true,
    discount: 11,
    isBestSeller: true
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max",
    price: 1199.99,
    rating: 4.9,
    reviews: 567,
    image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    category: "Smartphones",
    brand: "Apple",
    inStock: true,
    isNew: true,
    isBestSeller: true
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    price: 349.99,
    originalPrice: 399.99,
    rating: 4.7,
    reviews: 892,
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    category: "Audio",
    brand: "Sony",
    inStock: true,
    discount: 13
  },
  {
    id: 4,
    name: "Samsung Galaxy Watch 6",
    price: 299.99,
    rating: 4.6,
    reviews: 445,
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    category: "Montres",
    brand: "Samsung",
    inStock: false
  },
  {
    id: 5,
    name: "Dell XPS 13",
    price: 1299.99,
    rating: 4.5,
    reviews: 178,
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    category: "Ordinateurs",
    brand: "Dell",
    inStock: true
  },
  {
    id: 6,
    name: "iPad Pro 12.9\"",
    price: 1099.99,
    rating: 4.8,
    reviews: 321,
    image: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    category: "Tablettes",
    brand: "Apple",
    inStock: true,
    isNew: true
  }
];

const categories = [
  { name: "Tous", count: 156, color: "bg-slate-100 text-slate-800 hover:bg-slate-200" },
  { name: "Ordinateurs", count: 45, color: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
  { name: "Smartphones", count: 67, color: "bg-green-100 text-green-800 hover:bg-green-200" },
  { name: "Audio", count: 23, color: "bg-purple-100 text-purple-800 hover:bg-purple-200" },
  { name: "Montres", count: 12, color: "bg-orange-100 text-orange-800 hover:bg-orange-200" },
  { name: "Tablettes", count: 9, color: "bg-pink-100 text-pink-800 hover:bg-pink-200" }
];

async function FeaturedProducts() {
  await new Promise(resolve => setTimeout(resolve, 600));
  const featured = products.slice(0, 3);
  
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {featured.map(product => (
        <Card key={product.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white border-gray-200 group">
          <div className="relative">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-2">
              {product.isNew && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                  Nouveau
                </Badge>
              )}
              {product.isBestSeller && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
                  <Award className="h-3 w-3 mr-1" />
                  Best Seller
                </Badge>
              )}
              {product.discount && (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                  -{product.discount}%
                </Badge>
              )}
            </div>
            
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-3 right-3 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                {product.category}
              </Badge>
              <span className="text-sm font-medium text-gray-500">{product.brand}</span>
            </div>
            
            <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600">
                {product.rating}
              </span>
              <span className="text-sm text-gray-500">
                ({product.reviews} avis)
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">
                  {product.price.toFixed(2)}€
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.originalPrice.toFixed(2)}€
                  </span>
                )}
              </div>
              <Badge 
                variant={product.inStock ? "default" : "destructive"}
                className={product.inStock ? "bg-green-100 text-green-800" : ""}
              >
                {product.inStock ? "En stock" : "Rupture"}
              </Badge>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg" 
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
              <Button variant="outline" size="icon" className="border-gray-300 hover:bg-gray-50">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function ProductGrid() {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map(product => (
        <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-gray-200 group">
          <div className="relative">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-2">
              {product.isNew && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                  Nouveau
                </Badge>
              )}
              {product.discount && (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                  -{product.discount}%
                </Badge>
              )}
            </div>
          </div>
          
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                {product.category}
              </Badge>
              <span className="text-sm font-medium text-gray-500">{product.brand}</span>
            </div>
            
            <h3 className="font-semibold text-lg mb-3 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.reviews})
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-green-600">
                  {product.price.toFixed(2)}€
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.originalPrice.toFixed(2)}€
                  </span>
                )}
              </div>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg" 
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.inStock ? "Ajouter au panier" : "Rupture de stock"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card key={i} className="overflow-hidden animate-pulse">
          <div className="w-full h-48 bg-gray-200"></div>
          <CardContent className="p-5">
            <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function EcommerceExamplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/examples" className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TechStore
              </span>
            </Link>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Rechercher des produits..."
                  className="pl-10 pr-4 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative hover:bg-blue-50">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-pink-500">
                  3
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8 py-3">
            <Link href="/examples/ecommerce" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
              Accueil
            </Link>
            <Link href="/examples/ecommerce/products" className="text-gray-600 hover:text-blue-600 transition-colors">
              Produits
            </Link>
            <Link href="/examples/ecommerce/categories" className="text-gray-600 hover:text-blue-600 transition-colors">
              Catégories
            </Link>
            <Link href="/examples/ecommerce/deals" className="text-red-600 font-medium hover:text-red-700 transition-colors">
              🔥 Promotions
            </Link>
            <Link href="/examples/ecommerce/support" className="text-gray-600 hover:text-blue-600 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-2xl p-12 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          <div className="relative max-w-3xl">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              <Zap className="h-4 w-4 mr-2" />
              Offres limitées
            </Badge>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Les Dernières Technologies à Portée de Main
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed">
              Découvrez notre sélection de produits high-tech avec les meilleures offres du moment. 
              Livraison gratuite et garantie 2 ans incluses.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl text-lg px-8">
                Découvrir les offres
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
                Voir le catalogue
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="flex items-center space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-green-100 p-3 rounded-xl">
              <Truck className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Livraison gratuite</h3>
              <p className="text-gray-600">Dès 50€ d'achat</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Garantie 2 ans</h3>
              <p className="text-gray-600">Sur tous nos produits</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-orange-100 p-3 rounded-xl">
              <RotateCcw className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Retour 30 jours</h3>
              <p className="text-gray-600">Satisfait ou remboursé</p>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Produits à la une</h2>
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <Clock className="h-4 w-4 mr-2" />
              Offres limitées
            </Badge>
          </div>
          <Suspense fallback={
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="w-full h-56 bg-gray-200"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-20 mb-6"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          }>
            <FeaturedProducts />
          </Suspense>
        </section>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="p-6 bg-white shadow-lg">
              <h3 className="font-bold text-lg mb-6">Filtres</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-4">Catégories</h4>
                  <div className="space-y-3">
                    {categories.map(category => (
                      <div key={category.name} className="flex items-center justify-between">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <span className="text-sm font-medium">{category.name}</span>
                        </label>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Prix</h4>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <Input placeholder="Min" type="number" className="border-gray-300" />
                      <Input placeholder="Max" type="number" className="border-gray-300" />
                    </div>
                    <Button variant="outline" size="sm" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                      Appliquer
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Marques</h4>
                  <div className="space-y-3">
                    {["Apple", "Samsung", "Sony", "Dell"].map(brand => (
                      <label key={brand} className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="text-sm font-medium">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Tous les produits</h2>
              <div className="flex items-center space-x-4">
                <select className="border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-300 focus:ring-blue-200">
                  <option>Trier par popularité</option>
                  <option>Prix croissant</option>
                  <option>Prix décroissant</option>
                  <option>Nouveautés</option>
                </select>
                <div className="flex border border-gray-300 rounded-lg">
                  <Button variant="ghost" size="icon" className="rounded-r-none">
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-l-none border-l">
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <Suspense fallback={<ProductSkeleton />}>
              <ProductGrid />
            </Suspense>
            
            {/* Pagination */}
            <div className="flex justify-center mt-12">
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
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">TechStore</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Votre boutique de référence pour les produits high-tech de qualité.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Produits</h3>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="#" className="hover:text-white transition-colors">Ordinateurs</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Smartphones</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Audio</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Support</h3>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="#" className="hover:text-white transition-colors">Aide</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Livraison</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Retours</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Entreprise</h3>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="#" className="hover:text-white transition-colors">À propos</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Carrières</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TechStore. Tous droits réservés. Créé avec ❤️ pour les passionnés de tech.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}