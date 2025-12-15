import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Globe, 
  Users, 
  Award, 
  Target,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle,
  Star,
  Quote,
  Briefcase,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';

// Simulated company data
const services = [
  {
    id: 1,
    title: "Développement Web",
    description: "Création de sites web modernes et performants avec les dernières technologies.",
    icon: Globe,
    features: ["React/Next.js", "Design responsive", "SEO optimisé", "Performance"],
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    title: "Applications Mobiles",
    description: "Développement d'applications iOS et Android natives et cross-platform.",
    icon: Target,
    features: ["React Native", "Flutter", "iOS/Android", "UI/UX Design"],
    image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    title: "Consulting IT",
    description: "Conseil en stratégie digitale et transformation numérique pour votre entreprise.",
    icon: Briefcase,
    features: ["Audit technique", "Architecture", "Formation", "Support"],
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    color: "from-green-500 to-emerald-500"
  }
];

const team = [
  {
    id: 1,
    name: "Marie Dubois",
    role: "CEO & Fondatrice",
    bio: "15 ans d'expérience dans le développement web et la direction d'équipes techniques.",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
    linkedin: "#",
    specialty: "Leadership & Strategy"
  },
  {
    id: 2,
    name: "Thomas Martin",
    role: "CTO",
    bio: "Expert en architecture logicielle et technologies cloud, passionné par l'innovation.",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
    linkedin: "#",
    specialty: "Architecture & Cloud"
  },
  {
    id: 3,
    name: "Sophie Laurent",
    role: "Lead Designer",
    bio: "Créatrice d'expériences utilisateur exceptionnelles avec un œil pour le détail.",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
    linkedin: "#",
    specialty: "UX/UI Design"
  },
  {
    id: 4,
    name: "Pierre Durand",
    role: "Développeur Senior",
    bio: "Spécialiste React/Node.js avec une passion pour les solutions innovantes.",
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
    linkedin: "#",
    specialty: "Full-Stack Development"
  }
];

const testimonials = [
  {
    id: 1,
    name: "Jean Dupont",
    company: "TechCorp",
    role: "Directeur Technique",
    content: "Une équipe exceptionnelle qui a transformé notre vision en réalité. Le résultat dépasse nos attentes et notre ROI a augmenté de 300%.",
    rating: 5,
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    project: "Plateforme E-commerce"
  },
  {
    id: 2,
    name: "Sarah Wilson",
    company: "StartupXYZ",
    role: "CEO",
    content: "Professionnalisme, créativité et respect des délais. Je recommande vivement leurs services pour tout projet digital.",
    rating: 5,
    image: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    project: "Application Mobile"
  },
  {
    id: 3,
    name: "Marc Leblanc",
    company: "InnovCorp",
    role: "Product Manager",
    content: "Une collaboration fluide et des résultats qui ont boosté notre croissance de 250%. Équipe réactive et innovante.",
    rating: 5,
    image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    project: "Dashboard Analytics"
  }
];

const stats = [
  { label: "Projets réalisés", value: "150+", icon: Target, color: "text-blue-600", bgColor: "bg-blue-100" },
  { label: "Clients satisfaits", value: "98%", icon: Users, color: "text-green-600", bgColor: "bg-green-100" },
  { label: "Années d'expérience", value: "10+", icon: Award, color: "text-purple-600", bgColor: "bg-purple-100" },
  { label: "Croissance moyenne", value: "250%", icon: TrendingUp, color: "text-orange-600", bgColor: "bg-orange-100" }
];

async function ServicesSection() {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {services.map(service => {
        const Icon = service.icon;
        return (
          <Card key={service.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white border-gray-200 group">
            <div className="relative">
              <img 
                src={service.image} 
                alt={service.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className={`absolute top-4 left-4 bg-gradient-to-r ${service.color} p-3 rounded-xl shadow-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              <div className="space-y-3 mb-8">
                {service.features.map(feature => (
                  <div key={feature} className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                En savoir plus
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

async function TeamSection() {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {team.map(member => (
        <Card key={member.id} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-gray-200 group">
          <CardContent className="p-8">
            <div className="relative mb-6">
              <img 
                src={member.image} 
                alt={member.name}
                className="w-28 h-28 rounded-full mx-auto object-cover ring-4 ring-gray-200 group-hover:ring-blue-300 transition-all"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-full">
                <Heart className="h-4 w-4 text-white" />
              </div>
            </div>
            <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">
              {member.name}
            </h3>
            <p className="text-blue-600 font-semibold mb-2">{member.role}</p>
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
              {member.specialty}
            </Badge>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">{member.bio}</p>
            <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
              LinkedIn
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function TestimonialsSection() {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {testimonials.map(testimonial => (
        <Card key={testimonial.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-gray-200">
          <CardContent className="p-8">
            <Quote className="h-10 w-10 text-blue-600 mb-6" />
            <p className="text-gray-700 mb-6 italic leading-relaxed text-lg">
              "{testimonial.content}"
            </p>
            
            <div className="flex items-center space-x-1 mb-6">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <img 
                src={testimonial.image} 
                alt={testimonial.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-200"
              />
              <div>
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">
                  {testimonial.role} chez {testimonial.company}
                </p>
                <Badge variant="secondary" className="mt-1 text-xs bg-blue-100 text-blue-800">
                  {testimonial.project}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ServicesSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {[1, 2, 3].map(i => (
        <Card key={i} className="overflow-hidden animate-pulse">
          <div className="w-full h-56 bg-gray-200"></div>
          <CardContent className="p-8">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
            <div className="space-y-3 mb-8">
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="h-4 bg-gray-200 rounded w-2/3"></div>
              ))}
            </div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function CorporateExamplePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/examples" className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TechSolutions
              </span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="#accueil" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                Accueil
              </Link>
              <Link href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">
                Services
              </Link>
              <Link href="#equipe" className="text-gray-600 hover:text-blue-600 transition-colors">
                Équipe
              </Link>
              <Link href="#portfolio" className="text-gray-600 hover:text-blue-600 transition-colors">
                Portfolio
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contact
              </Link>
            </nav>

            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
              Devis gratuit
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="accueil" className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ddd6fe\' fill-opacity=\'0.4\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
          <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg">
                  <Zap className="h-4 w-4 mr-2" />
                  Innovation & Excellence
                </Badge>
                <h1 className="text-6xl font-bold mb-8 leading-tight">
                  Transformez votre vision en 
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> réalité digitale</span>
                </h1>
                <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                  Nous créons des solutions web et mobiles sur mesure qui propulsent 
                  votre entreprise vers le succès. De l'idée au déploiement, 
                  nous vous accompagnons à chaque étape avec passion et expertise.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                  <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl">
                    Démarrer un projet
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-blue-200 text-blue-600 hover:bg-blue-50">
                    Voir nos réalisations
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                  alt="Team working"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-bold text-gray-900">150+ projets réussis</p>
                      <p className="text-sm text-gray-600">Clients satisfaits</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-8 -right-8 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl shadow-xl">
                  <div className="text-center text-white">
                    <p className="text-2xl font-bold">98%</p>
                    <p className="text-sm">Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center group hover:-translate-y-2 transition-transform duration-300">
                    <div className={`${stat.bgColor} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className={`h-10 w-10 ${stat.color}`} />
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <Badge className="mb-6 bg-blue-100 text-blue-800 border-0">
                <Lightbulb className="h-4 w-4 mr-2" />
                Nos Services
              </Badge>
              <h2 className="text-5xl font-bold mb-8 text-gray-900">
                Des solutions complètes pour votre succès
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Nous offrons une gamme complète de services pour répondre à tous vos besoins digitaux, 
                de la conception à la maintenance, avec une approche personnalisée et innovante.
              </p>
            </div>
            
            <Suspense fallback={<ServicesSkeleton />}>
              <ServicesSection />
            </Suspense>
          </div>
        </section>

        {/* Team Section */}
        <section id="equipe" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <Badge className="mb-6 bg-purple-100 text-purple-800 border-0">
                <Users className="h-4 w-4 mr-2" />
                Notre Équipe
              </Badge>
              <h2 className="text-5xl font-bold mb-8 text-gray-900">
                Des experts passionnés à votre service
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Rencontrez l'équipe de professionnels qui donnera vie à vos projets 
                avec créativité, expertise technique et une approche humaine.
              </p>
            </div>
            
            <Suspense fallback={
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="text-center animate-pulse">
                    <CardContent className="p-8">
                      <div className="w-28 h-28 bg-gray-200 rounded-full mx-auto mb-6"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
                      <div className="h-8 bg-gray-200 rounded w-20 mx-auto"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            }>
              <TeamSection />
            </Suspense>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <Badge className="mb-6 bg-green-100 text-green-800 border-0">
                <Quote className="h-4 w-4 mr-2" />
                Témoignages
              </Badge>
              <h2 className="text-5xl font-bold mb-8 text-gray-900">
                Ce que disent nos clients
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                La satisfaction de nos clients est notre priorité absolue. 
                Découvrez leurs retours sur notre collaboration et les résultats obtenus.
              </p>
            </div>
            
            <Suspense fallback={
              <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-8">
                      <div className="h-10 w-10 bg-gray-200 rounded mb-6"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            }>
              <TestimonialsSection />
            </Suspense>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <Badge className="mb-6 bg-orange-100 text-orange-800 border-0">
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </Badge>
              <h2 className="text-5xl font-bold mb-8 text-gray-900">
                Prêt à démarrer votre projet ?
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Contactez-nous dès aujourd'hui pour discuter de votre projet 
                et obtenir un devis personnalisé gratuit. Notre équipe est là pour vous accompagner.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16">
              <Card className="shadow-xl border-gray-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Envoyez-nous un message
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Nous vous répondrons dans les 24 heures
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold mb-3 block text-gray-700">Nom</label>
                      <Input placeholder="Votre nom" className="border-gray-300 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-3 block text-gray-700">Email</label>
                      <Input type="email" placeholder="votre@email.com" className="border-gray-300 focus:border-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-3 block text-gray-700">Sujet</label>
                    <Input placeholder="Sujet de votre message" className="border-gray-300 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-3 block text-gray-700">Message</label>
                    <Textarea 
                      placeholder="Décrivez votre projet en détail..."
                      rows={6}
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg py-3">
                    Envoyer le message
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
              
              <div className="space-y-10">
                <div>
                  <h3 className="text-3xl font-bold mb-8 text-gray-900">Informations de contact</h3>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Email</p>
                        <p className="text-gray-600">contact@techsolutions.fr</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-3 rounded-xl">
                        <Phone className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Téléphone</p>
                        <p className="text-gray-600">+33 1 23 45 67 89</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 p-3 rounded-xl">
                        <MapPin className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Adresse</p>
                        <p className="text-gray-600">123 Rue de la Tech, 75001 Paris</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
                  <Shield className="h-10 w-10 text-blue-600 mb-4" />
                  <h4 className="font-bold text-xl mb-3 text-gray-900">Garantie satisfaction</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Nous nous engageons à votre satisfaction totale. 
                    Si vous n'êtes pas satisfait, nous travaillons jusqu'à ce que vous le soyez, 
                    sans frais supplémentaires.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">TechSolutions</span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                Votre partenaire de confiance pour tous vos projets digitaux. 
                Innovation, qualité et satisfaction client au cœur de nos priorités.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                  <Globe className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Services</h3>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="#" className="hover:text-white transition-colors">Développement Web</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Applications Mobiles</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Consulting IT</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Support & Maintenance</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Entreprise</h3>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="#" className="hover:text-white transition-colors">À propos</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Équipe</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Carrières</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Support</h3>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TechSolutions. Tous droits réservés. Créé avec ❤️ pour transformer vos idées en réalité.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}