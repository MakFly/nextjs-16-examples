import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  ArrowLeft,
  Users,
  Target,
  Heart,
  Award,
  Mail,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import Link from 'next/link';

const team = [
  {
    name: "Marie Dubois",
    role: "Rédactrice en chef",
    bio: "Développeuse full-stack passionnée par les technologies web modernes et l'enseignement.",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
    specialties: ["Next.js", "React", "TypeScript"],
    social: {
      twitter: "#",
      github: "#",
      linkedin: "#"
    }
  },
  {
    name: "Thomas Martin",
    role: "Expert technique",
    bio: "Architecte logiciel spécialisé dans les performances et l'optimisation des applications web.",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
    specialties: ["Performance", "Architecture", "DevOps"],
    social: {
      twitter: "#",
      github: "#",
      linkedin: "#"
    }
  },
  {
    name: "Sophie Laurent",
    role: "Designer UX/UI",
    bio: "Créatrice d'expériences utilisateur exceptionnelles avec un focus sur l'accessibilité.",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
    specialties: ["UX/UI", "Accessibilité", "Design Systems"],
    social: {
      twitter: "#",
      github: "#",
      linkedin: "#"
    }
  }
];

const values = [
  {
    icon: Target,
    title: "Excellence technique",
    description: "Nous nous efforçons de partager les meilleures pratiques et les techniques les plus avancées."
  },
  {
    icon: Heart,
    title: "Passion pour l'enseignement",
    description: "Nous croyons que le partage de connaissances fait grandir toute la communauté."
  },
  {
    icon: Users,
    title: "Communauté inclusive",
    description: "Nous créons un espace accueillant pour tous les développeurs, quel que soit leur niveau."
  },
  {
    icon: Award,
    title: "Qualité avant tout",
    description: "Chaque article est soigneusement rédigé et vérifié pour garantir sa qualité."
  }
];

export default function AboutPage() {
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
            À propos de DevBlog
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            DevBlog est né de la passion de partager les connaissances en développement web. 
            Notre mission est de créer du contenu de qualité qui aide les développeurs à 
            maîtriser les technologies modernes et à construire de meilleures applications.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-20">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-2xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-6">Notre Mission</h2>
              <p className="text-xl text-blue-100 leading-relaxed max-w-4xl mx-auto">
                Démocratiser l'accès aux connaissances en développement web en créant 
                du contenu accessible, pratique et à jour. Nous croyons que chaque 
                développeur mérite d'avoir accès aux meilleures ressources pour 
                progresser dans sa carrière.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Nos Valeurs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-gray-200">
                  <CardContent className="p-8">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-4 text-gray-900">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Notre Équipe</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-gray-200 group">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover ring-4 ring-gray-200 group-hover:ring-blue-300 transition-all"
                    />
                  </div>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-600 mb-6 leading-relaxed">{member.bio}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900">Spécialités</h4>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {member.specialties.map(specialty => (
                          <Badge key={specialty} variant="secondary" className="bg-blue-100 text-blue-800">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-3">
                      <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                        <Github className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-blue-200">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Rejoignez notre communauté</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Vous avez des questions, des suggestions d'articles ou vous souhaitez 
                contribuer ? N'hésitez pas à nous contacter !
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg" asChild>
                  <Link href="/examples/blog/contact">
                    <Mail className="mr-2 h-5 w-5" />
                    Nous contacter
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  Contribuer au blog
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}