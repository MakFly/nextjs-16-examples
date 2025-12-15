import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Heart,
  Star,
  ArrowLeft,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  Check
} from 'lucide-react';
import Link from 'next/link';

// Simulated product data
const products = {
  "1": {
    id: 1,
    name: "MacBook Pro 16\" M3",
    price: 2499.99,
    originalPrice: 2799.99,
    rating: 4.8,
    reviews: 234,
    images: [
      "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
    ],
    category: "Ordinateurs",
    brand: "Apple",
    inStock: true,
    isNew: true,
    discount: 11,
    isBestSeller: true,
    description: "Le MacBook Pro 16 pouces avec puce M3 offre des performances exceptionnelles pour les professionnels créatifs. Avec son écran Liquid Retina XDR et sa batterie longue durée, c'est l'outil parfait pour tous vos projets.",
    features: [
      "Puce Apple M3 avec CPU 8 cœurs",
      "GPU jusqu'à 10 cœurs",
      "16 Go de mémoire unifiée",
      "SSD de 512 Go",
      "Écran Liquid Retina XDR 16 pouces",
      "Caméra FaceTime HD 1080p",
      "Trois ports Thunderbolt 4",
      "Port HDMI, port de carte SDXC",
      "MagSafe 3"
    ],
    specifications: {
      "Processeur": "Apple M3",
      "Mémoire": "16 Go",
      "Stockage": "512 Go SSD",
      "Écran": "16 pouces Liquid Retina XDR",
      "Résolution": "3456 x 2234 pixels",
      "Poids": "2,16 kg",
      "Autonomie": "Jusqu'à 22 heures",
      "Système": "macOS Sonoma"
    }
  }
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: PageProps) {
  const product = products[params.id as keyof typeof products];

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Produit non trouvé</h1>
          <p className="text-gray-600 mb-8">Le produit que vous cherchez n'existe pas.</p>
          <Button asChild>
            <Link href="/examples/ecommerce">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la boutique
            </Link>
          </Button>
        </div>
      </div>
    );
  }

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
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-xl">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 2}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Badge className="bg-blue-100 text-blue-800">
                  {product.category}
                </Badge>
                <span className="text-gray-500">{product.brand}</span>
                {product.isNew && (
                  <Badge className="bg-green-500 text-white">Nouveau</Badge>
                )}
                {product.isBestSeller && (
                  <Badge className="bg-orange-500 text-white">Best Seller</Badge>
                )}
              </div>
              
              <h1 className="text-4xl font-bold mb-4 text-gray-900">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-gray-500">({product.reviews} avis)</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-4xl font-bold text-green-600">
                  {product.price.toFixed(2)}€
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {product.originalPrice.toFixed(2)}€
                    </span>
                    <Badge className="bg-red-500 text-white">
                      -{product.discount}%
                    </Badge>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-2 mb-6">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-green-600 font-medium">En stock - Expédition immédiate</span>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button variant="ghost" size="icon" className="rounded-r-none">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 border-x">1</span>
                  <Button variant="ghost" size="icon" className="rounded-l-none">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg py-3">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Ajouter au panier
                </Button>
                <Button variant="outline" size="icon" className="border-gray-300">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                Acheter maintenant
              </Button>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-lg">
                <Truck className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-semibold">Livraison gratuite</p>
                  <p className="text-sm text-gray-600">Dès 50€</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-lg">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-semibold">Garantie 2 ans</p>
                  <p className="text-sm text-gray-600">Incluse</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-lg">
                <RotateCcw className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="font-semibold">Retour 30 jours</p>
                  <p className="text-sm text-gray-600">Gratuit</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mt-16">
          {/* Description */}
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Description</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
              
              <h3 className="text-xl font-semibold mb-4">Caractéristiques principales :</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Spécifications techniques</h2>
              <div className="space-y-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                    <span className="font-medium text-gray-900">{key}</span>
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section */}
        <Card className="shadow-xl mt-16">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Avis clients</h2>
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                Écrire un avis
              </Button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{product.rating}</div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-600">{product.reviews} avis</p>
              </div>
              
              <div className="col-span-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center space-x-3 mb-2">
                    <span className="text-sm w-8">{rating}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : rating === 2 ? 3 : 2}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">
                      {rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '5%' : rating === 2 ? '3%' : '2%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center text-gray-600">
              <p>Les avis clients seront affichés ici...</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(products).map((id) => ({
    id,
  }));
}