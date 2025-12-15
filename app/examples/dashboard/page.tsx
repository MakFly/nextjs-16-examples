import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp,
  Activity,
  Settings,
  Bell,
  Search,
  Calendar,
  Download,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  Award
} from 'lucide-react';
import Link from 'next/link';

// Simulated dashboard data
const stats = [
  {
    title: "Revenus totaux",
    value: "€45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "vs mois dernier"
  },
  {
    title: "Utilisateurs actifs",
    value: "2,350",
    change: "+180.1%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "utilisateurs ce mois"
  },
  {
    title: "Ventes",
    value: "+12,234",
    change: "+19%",
    trend: "up",
    icon: BarChart3,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    description: "commandes traitées"
  },
  {
    title: "Taux de conversion",
    value: "3.2%",
    change: "-4.3%",
    trend: "down",
    icon: Activity,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    description: "taux moyen"
  }
];

const recentSales = [
  {
    id: 1,
    customer: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+€1,999.00",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    status: "completed"
  },
  {
    id: 2,
    customer: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+€39.00",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    status: "pending"
  },
  {
    id: 3,
    customer: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+€299.00",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    status: "completed"
  },
  {
    id: 4,
    customer: "William Kim",
    email: "will@email.com",
    amount: "+€99.00",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    status: "completed"
  },
  {
    id: 5,
    customer: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+€39.00",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    status: "refunded"
  }
];

const recentActivity = [
  {
    id: 1,
    action: "Nouvelle commande",
    description: "Commande #3210 créée par John Doe",
    time: "Il y a 2 minutes",
    type: "order",
    color: "bg-blue-100 text-blue-800"
  },
  {
    id: 2,
    action: "Utilisateur inscrit",
    description: "Marie Dubois a créé un compte",
    time: "Il y a 5 minutes",
    type: "user",
    color: "bg-green-100 text-green-800"
  },
  {
    id: 3,
    action: "Paiement reçu",
    description: "Paiement de €299.00 confirmé",
    time: "Il y a 10 minutes",
    type: "payment",
    color: "bg-yellow-100 text-yellow-800"
  },
  {
    id: 4,
    action: "Produit ajouté",
    description: "iPhone 15 Pro ajouté au catalogue",
    time: "Il y a 1 heure",
    type: "product",
    color: "bg-purple-100 text-purple-800"
  }
];

async function StatsCards() {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="flex items-center text-sm">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {stat.change}
                </span>
                <span className="text-gray-500 ml-2">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

async function RevenueChart() {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return (
    <Card className="col-span-4 bg-white shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Aperçu des revenus</CardTitle>
            <CardDescription className="text-gray-600">
              Évolution mensuelle des revenus
            </CardDescription>
          </div>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            +12.5% ce mois
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[250px] flex items-end justify-between space-x-2 mb-4">
          {[40, 60, 80, 45, 70, 90, 65, 85, 55, 75, 95, 70].map((height, index) => (
            <div
              key={index}
              className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg flex-1 transition-all hover:from-blue-700 hover:to-blue-500 cursor-pointer"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          {["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"].map(month => (
            <span key={month} className="font-medium">{month}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

async function RecentSales() {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return (
    <Card className="col-span-3 bg-white shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Ventes récentes</CardTitle>
            <CardDescription className="text-gray-600">
              Vous avez réalisé 265 ventes ce mois-ci.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
            Voir tout
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recentSales.map((sale) => (
            <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <img
                  src={sale.avatar}
                  alt={sale.customer}
                  className="h-12 w-12 rounded-full ring-2 ring-gray-200"
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {sale.customer}
                  </p>
                  <p className="text-sm text-gray-500">
                    {sale.email}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600 text-lg">
                  {sale.amount}
                </div>
                <Badge 
                  variant="secondary" 
                  className={
                    sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                    sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }
                >
                  {sale.status === 'completed' ? 'Terminé' :
                   sale.status === 'pending' ? 'En attente' : 'Remboursé'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

async function RecentActivity() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return (
    <Card className="col-span-4 bg-white shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Activité récente</CardTitle>
            <CardDescription className="text-gray-600">
              Dernières actions sur votre plateforme
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-3 h-3 rounded-full mt-2 ${
                activity.type === 'order' ? 'bg-blue-500' :
                activity.type === 'user' ? 'bg-green-500' :
                activity.type === 'payment' ? 'bg-yellow-500' :
                'bg-purple-500'
              }`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <Badge variant="secondary" className={activity.color}>
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-0 pb-3">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardExamplePage() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <Link href="/examples" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SaaS Dashboard
            </span>
          </Link>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            <Link 
              href="/examples/dashboard" 
              className="flex items-center px-4 py-3 text-blue-600 bg-blue-50 rounded-xl font-medium border border-blue-200"
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link 
              href="/examples/dashboard/analytics" 
              className="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <TrendingUp className="mr-3 h-5 w-5" />
              Analytics
            </Link>
            <Link 
              href="/examples/dashboard/users" 
              className="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Users className="mr-3 h-5 w-5" />
              Utilisateurs
            </Link>
            <Link 
              href="/examples/dashboard/sales" 
              className="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <DollarSign className="mr-3 h-5 w-5" />
              Ventes
            </Link>
            <Link 
              href="/examples/dashboard/settings" 
              className="flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Settings className="mr-3 h-5 w-5" />
              Paramètres
            </Link>
          </div>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4">
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <img
              src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop"
              alt="User"
              className="w-10 h-10 rounded-full ring-2 ring-blue-200"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Bienvenue sur votre tableau de bord
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              
              <Button variant="outline" size="icon" className="border-gray-300 hover:bg-gray-50">
                <Bell className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                <Calendar className="h-4 w-4 mr-2" />
                Aujourd'hui
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Suspense fallback={<DashboardSkeleton />}>
            <div className="space-y-8">
              {/* Stats Cards */}
              <StatsCards />
              
              {/* Charts and Tables */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Suspense fallback={
                  <Card className="col-span-4 animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px] bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                }>
                  <RevenueChart />
                </Suspense>
                
                <Suspense fallback={
                  <Card className="col-span-3 animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex items-center space-x-4">
                            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                            <div className="space-y-2 flex-1">
                              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                }>
                  <RecentSales />
                </Suspense>
              </div>
              
              {/* Recent Activity */}
              <Suspense fallback={
                <Card className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-start space-x-4">
                          <div className="w-3 h-3 bg-gray-200 rounded-full mt-2"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          </div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              }>
                <RecentActivity />
              </Suspense>
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  );
}