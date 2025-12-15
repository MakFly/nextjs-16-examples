import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  ArrowLeft
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
  },
  {
    id: 7,
    name: "AirPods Pro 2",
    price: 249.99,
    rating: 4.7,
    reviews: 1203,
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    category: "Audio",
    brand: "Apple",
    inStock: true,
    isBestSeller: true
  },
  {
    id: 8,
    name: "Surface Laptop 5",
    price: 1199.99,
    rating: 4.4,
    reviews: 89,
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    category: "Ordinateurs",
    brand: "Microsoft",
    inStock: true
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

async function ProductGrid() {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              {product.isBestSeller && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
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
          
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                {product.category}
              </Badge>
              <span className="text-sm font-medium text-gray-500">{product.brand}</span>
            </div>
            
            <h3 className="font-semibold text-lg mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
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
              <Badge 
                variant={product.inStock ? "default" : "destructive"}
                className={product.inStock ? "bg-green-100 text-green-800" : ""}
              >
                {product.inStock ? "En stock" : "Rupture"}
              </Badge>
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
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
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

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/examples/ecommerce">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Link>
              </Button>
              
              <Link href="/examples/ecommerce" className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TechStore
                </span>
              </Link>
            </div>
            
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

      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            Tous nos produits
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez notre sélection complète de produits high-tech avec les meilleures offres du moment.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="p-6 bg-white shadow-lg sticky top-24">
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
                    {["Apple", "Samsung", "Sony", "Dell", "Microsoft"].map(brand => (
                      <label key={brand} className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="text-sm font-medium">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Note</h4>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <label key={rating} className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <div className="flex items-center space-x-1">
                          {[...Array(rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                          ))}
                          {[...Array(5 - rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-gray-300" />
                          ))}
                          <span className="text-sm">& plus</span>
                        </div>
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
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{products.length} produits trouvés</span>
              </div>
              <div className="flex items-center space-x-4">
                <select className="border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-300 focus:ring-blue-200">
                  <option>Trier par popularité</option>
                  <option>Prix croissant</option>
                  <option>Prix décroissant</option>
                  <option>Nouveautés</option>
                  <option>Meilleures notes</option>
                </select>
                <div className="flex border border-gray-300 rounded-lg">
                  <Button variant="ghost" size="icon" className="rounded-r-none bg-blue-50">
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
    </div>
  );
}