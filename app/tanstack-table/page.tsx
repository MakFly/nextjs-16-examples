'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type GroupingState,
  type ExpandedState,
} from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CodeExample } from '@/components/code-example';
import { WhyWhenTabs } from '@/components/why-when-tabs';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  Users,
  Building,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  HelpCircle,
  X,
  Save,
  CheckSquare,
  UserX,
  UserCheck,
  FileDown,
} from 'lucide-react';

const tanstackTableWhyWhen = {
  why: {
    title: "Pourquoi TanStack Table ?",
    description: "TanStack Table est la bibliothèque de tableaux la plus puissante et flexible pour React. Headless par design, elle fournit toute la logique (tri, filtrage, pagination, groupement) sans imposer de style, vous donnant un contrôle total sur le rendu tout en gérant la complexité.",
    benefits: [
      "Headless : contrôle total sur le markup et les styles",
      "Tri multi-colonnes avec direction personnalisable",
      "Filtrage global et par colonne",
      "Pagination côté client ou serveur",
      "Groupement et agrégation de données",
      "Sélection de lignes avec checkbox",
      "Colonnes redimensionnables et réordonnables",
      "Virtualisation pour des milliers de lignes",
      "TypeScript-first avec typage complet"
    ],
    problemsSolved: [
      "Tableaux avec tri/filtre/pagination maison complexes à maintenir",
      "Libraries de tableaux avec styles imposés difficiles à personnaliser",
      "Performance dégradée sur de gros datasets",
      "Logique de tableau dupliquée entre projets",
      "Gestion complexe de l'état des colonnes (visibilité, ordre, taille)"
    ]
  },
  when: {
    idealCases: [
      {
        title: "Tableaux de données complexes",
        description: "Back-office, admin panels, CRM avec tri, filtrage, et pagination.",
        example: "Liste d'utilisateurs, commandes, produits avec actions"
      },
      {
        title: "Rapports et analytics",
        description: "Tableaux avec groupement, agrégation, et export de données.",
        example: "Rapport de ventes par région, période, produit"
      },
      {
        title: "Tableaux avec sélection",
        description: "Actions en masse sur plusieurs lignes sélectionnées.",
        example: "Sélectionner 10 utilisateurs → actions groupées (supprimer, exporter)"
      },
      {
        title: "Grilles de données éditables",
        description: "Cellules éditables inline avec validation.",
        example: "Spreadsheet-like pour édition de prix, stocks, etc."
      }
    ],
    avoidCases: [
      {
        title: "Tableaux très simples",
        description: "Pour un tableau statique de 5-10 lignes sans interaction, un simple <table> HTML suffit.",
        example: "Tableau de pricing, liste de features"
      },
      {
        title: "Affichage de cards/grid",
        description: "Si vous n'avez pas besoin d'un format tabulaire, utilisez un simple map() avec des cards.",
        example: "Galerie de produits, liste de cards utilisateurs"
      },
      {
        title: "Besoin d'un tableau prêt à l'emploi",
        description: "Si vous voulez un tableau stylé out-of-the-box, préférez AG Grid ou une solution avec UI incluse.",
        example: "Prototype rapide sans temps pour le styling"
      }
    ],
    realWorldExamples: [
      {
        title: "Liste d'utilisateurs admin",
        description: "Nom, email, rôle, date d'inscription avec tri, recherche, et actions (éditer, supprimer, bloquer).",
        example: "Filtrage par rôle, tri par date, pagination serveur"
      },
      {
        title: "Historique de commandes",
        description: "Numéro, client, montant, statut avec filtres par date et statut, groupement par mois.",
        example: "Groupement par mois, sous-totaux, export CSV"
      },
      {
        title: "Gestion de stock",
        description: "Produits avec SKU, quantité, prix, alertes de stock bas, édition inline.",
        example: "Cellules éditables, validation, sauvegarde auto"
      },
      {
        title: "Logs et événements",
        description: "Timestamp, type, message avec filtrage, recherche full-text, virtualisation pour des milliers de lignes.",
        example: "Virtualisation avec react-virtual, filtrage temps réel"
      },
      {
        title: "Tableau de bord RH",
        description: "Employés avec département, manager, salaire, congés avec groupement et agrégations.",
        example: "Groupement par département, moyenne de salaire, total congés"
      },
      {
        title: "Comparateur de produits",
        description: "Caractéristiques en lignes, produits en colonnes avec highlight des différences.",
        example: "Colonnes dynamiques, cellules colorées selon valeurs"
      }
    ]
  }
};
import { toast } from 'sonner';

// Types pour les données
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  salary: number;
  joinDate: string;
  department: string;
  avatar: string;
}

interface Sale {
  id: string;
  product: string;
  customer: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  date: string;
  region: string;
  salesperson: string;
}

// Données de démonstration
const generateUsers = (): User[] => {
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  const roles = ['Manager', 'Developer', 'Designer', 'Analyst', 'Coordinator'];
  const statuses: User['status'][] = ['active', 'inactive', 'pending'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `user-${i + 1}`,
    firstName: ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank'][i % 8],
    lastName: ['Doe', 'Smith', 'Johnson', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore'][i % 8],
    email: `user${i + 1}@example.com`,
    phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    company: ['TechCorp', 'InnovateLab', 'DataSoft', 'CloudTech', 'StartupXYZ'][i % 5],
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
    salary: Math.floor(Math.random() * 100000) + 40000,
    joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    department: departments[i % departments.length],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
  }));
};

const generateSales = (): Sale[] => {
  const products = ['MacBook Pro', 'iPhone 15', 'iPad Air', 'Apple Watch', 'AirPods Pro'];
  const customers = ['Acme Corp', 'TechStart', 'BigCorp', 'SmallBiz', 'Enterprise Ltd'];
  const regions = ['North', 'South', 'East', 'West', 'Central'];
  const salespeople = ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Eve Adams'];
  const statuses: Sale['status'][] = ['completed', 'pending', 'cancelled'];

  return Array.from({ length: 100 }, (_, i) => ({
    id: `sale-${i + 1}`,
    product: products[i % products.length],
    customer: customers[i % customers.length],
    amount: Math.floor(Math.random() * 10000) + 1000,
    status: statuses[i % statuses.length],
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    region: regions[i % regions.length],
    salesperson: salespeople[i % salespeople.length],
  }));
};

// Dialog pour voir/éditer un utilisateur
interface UserViewEditDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'view' | 'edit';
  onSave?: (user: User) => void;
}

function UserViewEditDialog({ user, open, onOpenChange, mode, onSave }: UserViewEditDialogProps) {
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(mode === 'edit');

  React.useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
      setIsEditing(mode === 'edit');
    }
  }, [user, mode]);

  const handleSave = () => {
    if (editedUser && onSave) {
      onSave(editedUser);
      toast.success(`Utilisateur ${editedUser.firstName} ${editedUser.lastName} modifié avec succès`);
      onOpenChange(false);
    }
  };

  if (!user || !editedUser) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.firstName} />
              <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
            </Avatar>
            {isEditing ? 'Modifier l\'utilisateur' : 'Détails de l\'utilisateur'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifiez les informations de l\'utilisateur ci-dessous.'
              : `Informations complètes de ${user.firstName} ${user.lastName}`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              {isEditing ? (
                <Input
                  id="firstName"
                  value={editedUser.firstName}
                  onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                />
              ) : (
                <p className="text-sm font-medium py-2">{user.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              {isEditing ? (
                <Input
                  id="lastName"
                  value={editedUser.lastName}
                  onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                />
              ) : (
                <p className="text-sm font-medium py-2">{user.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={editedUser.email}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              />
            ) : (
              <p className="text-sm font-medium py-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {user.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            {isEditing ? (
              <Input
                id="phone"
                value={editedUser.phone}
                onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
              />
            ) : (
              <p className="text-sm font-medium py-2 flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {user.phone}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise</Label>
              {isEditing ? (
                <Input
                  id="company"
                  value={editedUser.company}
                  onChange={(e) => setEditedUser({ ...editedUser, company: e.target.value })}
                />
              ) : (
                <p className="text-sm font-medium py-2 flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  {user.company}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              {isEditing ? (
                <Input
                  id="department"
                  value={editedUser.department}
                  onChange={(e) => setEditedUser({ ...editedUser, department: e.target.value })}
                />
              ) : (
                <p className="text-sm font-medium py-2">{user.department}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              {isEditing ? (
                <Input
                  id="role"
                  value={editedUser.role}
                  onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                />
              ) : (
                <Badge variant="secondary">{user.role}</Badge>
              )}
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              {isEditing ? (
                <select
                  value={editedUser.status}
                  onChange={(e) => setEditedUser({ ...editedUser, status: e.target.value as User['status'] })}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="active">Actif</option>
                  <option value="pending">En attente</option>
                  <option value="inactive">Inactif</option>
                </select>
              ) : (
                <div className="py-2">
                  <Badge
                    variant={user.status === 'active' ? 'default' : user.status === 'pending' ? 'secondary' : 'destructive'}
                  >
                    {user.status === 'active' ? 'Actif' : user.status === 'pending' ? 'En attente' : 'Inactif'}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Salaire</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={editedUser.salary}
                  onChange={(e) => setEditedUser({ ...editedUser, salary: Number(e.target.value) })}
                />
              ) : (
                <p className="text-sm font-medium py-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(user.salary)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Date d&apos;embauche</Label>
              <p className="text-sm font-medium py-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {new Date(user.joinDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fermer
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => {
                setEditedUser({ ...user });
                setIsEditing(mode === 'edit' ? true : false);
              }}>
                Annuler
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Alert Dialog pour supprimer un utilisateur
interface UserDeleteDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (user: User) => void;
}

function UserDeleteDialog({ user, open, onOpenChange, onConfirm }: UserDeleteDialogProps) {
  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Confirmer la suppression
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Êtes-vous sûr de vouloir supprimer l&apos;utilisateur{' '}
              <span className="font-semibold text-foreground">
                {user.firstName} {user.lastName}
              </span>{' '}
              ?
            </p>
            <p className="text-sm">
              Cette action est irréversible. Toutes les données associées à cet utilisateur seront définitivement supprimées.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              onConfirm(user);
              toast.error(`Utilisateur ${user.firstName} ${user.lastName} supprimé`);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Alert Dialog pour suppression en masse
interface BulkDeleteDialogProps {
  users: User[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (users: User[]) => void;
}

function BulkDeleteDialog({ users, open, onOpenChange, onConfirm }: BulkDeleteDialogProps) {
  if (users.length === 0) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Suppression en masse
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Êtes-vous sûr de vouloir supprimer{' '}
              <span className="font-semibold text-foreground">{users.length} utilisateur{users.length > 1 ? 's' : ''}</span> ?
            </p>
            <div className="max-h-32 overflow-y-auto rounded-md border bg-muted/50 p-2">
              <ul className="text-sm space-y-1">
                {users.slice(0, 5).map((user) => (
                  <li key={user.id} className="flex items-center gap-2">
                    <UserX className="h-3 w-3 text-destructive" />
                    {user.firstName} {user.lastName}
                  </li>
                ))}
                {users.length > 5 && (
                  <li className="text-muted-foreground italic">
                    ... et {users.length - 5} autre{users.length - 5 > 1 ? 's' : ''}
                  </li>
                )}
              </ul>
            </div>
            <p className="text-sm text-destructive font-medium">
              Cette action est irréversible.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              onConfirm(users);
              toast.error(`${users.length} utilisateur${users.length > 1 ? 's' : ''} supprimé${users.length > 1 ? 's' : ''}`);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer {users.length} utilisateur{users.length > 1 ? 's' : ''}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Table basique
function BasicTable() {
  const t = useTranslations('tanstackTable');
  const [data, setData] = useState(() => generateUsers().slice(0, 10));
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Dialog states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewEditDialogOpen, setViewEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');

  const handleView = (user: User) => {
    setSelectedUser(user);
    setDialogMode('view');
    setViewEditDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setDialogMode('edit');
    setViewEditDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    setData(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleConfirmDelete = (user: User) => {
    setData(prev => prev.filter(u => u.id !== user.id));
  };

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'Prénom',
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={row.original.avatar} alt={row.original.firstName} />
              <AvatarFallback>{row.original.firstName[0]}{row.original.lastName[0]}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{row.getValue('firstName')}</span>
          </div>
        ),
      },
      {
        accessorKey: 'lastName',
        header: 'Nom',
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <a href={`mailto:${row.getValue('email')}`} className="text-blue-600 hover:underline">
            {row.getValue('email')}
          </a>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Rôle',
        cell: ({ row }) => (
          <Badge variant="secondary">{row.getValue('role')}</Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: t('status'),
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          return (
            <Badge
              variant={status === 'active' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'}
            >
              {status === 'active' ? 'Actif' : status === 'pending' ? 'En attente' : 'Inactif'}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleView(row.original)}>
                <Eye className="mr-2 h-4 w-4" />
                Voir
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                <Edit className="mr-2 h-4 w-4" />
                Éditer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(row.original)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [t]
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder={t('search')}
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none flex items-center space-x-1'
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t('noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} sur{' '}
          {table.getFilteredRowModel().rows.length} {t('selectedRows')}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t('previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t('next')}
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <UserViewEditDialog
        user={selectedUser}
        open={viewEditDialogOpen}
        onOpenChange={setViewEditDialogOpen}
        mode={dialogMode}
        onSave={handleSaveUser}
      />
      <UserDeleteDialog
        user={selectedUser}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

// Table avancée avec sélection et filtres
function AdvancedTable() {
  const t = useTranslations('tanstackTable');
  const [data, setData] = useState(() => generateUsers());
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  // Dialog states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewEditDialogOpen, setViewEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');

  // Bulk action states
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const handleView = (user: User) => {
    setSelectedUser(user);
    setDialogMode('view');
    setViewEditDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setDialogMode('edit');
    setViewEditDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    setData(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleConfirmDelete = (user: User) => {
    setData(prev => prev.filter(u => u.id !== user.id));
  };

  // Bulk action handlers
  const getSelectedUsers = (table: ReturnType<typeof useReactTable<User>>) => {
    return table.getFilteredSelectedRowModel().rows.map(row => row.original);
  };

  const handleBulkDelete = (users: User[]) => {
    const userIds = new Set(users.map(u => u.id));
    setData(prev => prev.filter(u => !userIds.has(u.id)));
    setRowSelection({});
  };

  const handleBulkStatusChange = (table: ReturnType<typeof useReactTable<User>>, status: User['status']) => {
    const selectedUsers = getSelectedUsers(table);
    const userIds = new Set(selectedUsers.map(u => u.id));
    setData(prev => prev.map(u => userIds.has(u.id) ? { ...u, status } : u));
    setRowSelection({});
    toast.success(`${selectedUsers.length} utilisateur${selectedUsers.length > 1 ? 's' : ''} mis à jour en "${status === 'active' ? 'Actif' : status === 'inactive' ? 'Inactif' : 'En attente'}"`);
  };

  const handleBulkExport = (table: ReturnType<typeof useReactTable<User>>) => {
    const selectedUsers = getSelectedUsers(table);
    const csvContent = [
      ['ID', 'Prénom', 'Nom', 'Email', 'Entreprise', 'Département', 'Rôle', 'Statut', 'Salaire'].join(','),
      ...selectedUsers.map(u => [
        u.id,
        u.firstName,
        u.lastName,
        u.email,
        u.company,
        u.department,
        u.role,
        u.status,
        u.salary
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utilisateurs-selection-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success(`${selectedUsers.length} utilisateur${selectedUsers.length > 1 ? 's' : ''} exporté${selectedUsers.length > 1 ? 's' : ''} en CSV`);
  };

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Sélectionner tout"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Sélectionner ligne"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'firstName',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Prénom
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 ring-2 ring-gray-200">
              <AvatarImage src={row.original.avatar} alt={`${row.original.firstName} ${row.original.lastName}`} />
              <AvatarFallback>{row.original.firstName[0]}{row.original.lastName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{row.getValue('firstName')} {row.original.lastName}</div>
              <div className="text-sm text-gray-500">{row.original.email}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'company',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <Building className="mr-2 h-4 w-4" />
            Entreprise
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: 'department',
        header: 'Département',
        cell: ({ row }) => (
          <Badge variant="outline">{row.getValue('department')}</Badge>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Rôle',
        cell: ({ row }) => (
          <Badge variant="secondary">{row.getValue('role')}</Badge>
        ),
      },
      {
        accessorKey: 'salary',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Salaire
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue('salary'));
          const formatted = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
          }).format(amount);
          return <div className="font-medium">{formatted}</div>;
        },
      },
      {
        accessorKey: 'joinDate',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Date d'embauche
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue('joinDate'));
          return date.toLocaleDateString('fr-FR');
        },
      },
      {
        accessorKey: 'status',
        header: 'Statut',
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          return (
            <Badge
              variant={status === 'active' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'}
            >
              {status === 'active' ? 'Actif' : status === 'pending' ? 'En attente' : 'Inactif'}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ouvrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(row.original.id);
                  toast.success('ID copié dans le presse-papier');
                }}
              >
                Copier ID utilisateur
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleView(row.original)}>
                <Eye className="mr-2 h-4 w-4" />
                Voir détails
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDelete(row.original)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="space-y-4">
      {/* Barre d'actions de masse - apparaît quand des éléments sont sélectionnés */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            <span className="font-medium text-primary">
              {selectedCount} utilisateur{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Changer le statut */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Changer statut
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Nouveau statut</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkStatusChange(table, 'active')}>
                  <Badge variant="default" className="mr-2">Actif</Badge>
                  Marquer comme actif
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkStatusChange(table, 'pending')}>
                  <Badge variant="secondary" className="mr-2">En attente</Badge>
                  Marquer en attente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkStatusChange(table, 'inactive')}>
                  <Badge variant="destructive" className="mr-2">Inactif</Badge>
                  Marquer comme inactif
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Exporter la sélection */}
            <Button variant="outline" size="sm" onClick={() => handleBulkExport(table)}>
              <FileDown className="mr-2 h-4 w-4" />
              Exporter CSV
            </Button>

            {/* Supprimer la sélection */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>

            {/* Désélectionner tout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRowSelection({})}
            >
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder={t('filterUsers')}
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Eye className="mr-2 h-4 w-4" />
                {t('columnsLabel')} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t('export')}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('add')}
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t('noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} sur{' '}
          {table.getFilteredRowModel().rows.length} {t('selectedRows')}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">{t('rowsPerPage')}</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="h-8 w-[70px] rounded border border-input bg-background px-3 py-1 text-sm"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            {t('page')} {table.getState().pagination.pageIndex + 1} {t('of')}{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">{t('goToFirst')}</span>
              {'<<'}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">{t('goToPrevious')}</span>
              {'<'}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">{t('goToNext')}</span>
              {'>'}
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">{t('goToLast')}</span>
              {'>>'}
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <UserViewEditDialog
        user={selectedUser}
        open={viewEditDialogOpen}
        onOpenChange={setViewEditDialogOpen}
        mode={dialogMode}
        onSave={handleSaveUser}
      />
      <UserDeleteDialog
        user={selectedUser}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
      <BulkDeleteDialog
        users={getSelectedUsers(table)}
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}

// Table avec groupement
function GroupedTable() {
  const t = useTranslations('tanstackTable');
  const [data] = useState(() => generateSales());
  const [sorting, setSorting] = useState<SortingState>([]);
  const [grouping, setGrouping] = useState<GroupingState>(['region']);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const columns = useMemo<ColumnDef<Sale>[]>(
    () => [
      {
        accessorKey: 'region',
        header: 'Région',
        cell: ({ row, getValue }) => {
          return row.getCanExpand() ? (
            <button
              {...{
                onClick: row.getToggleExpandedHandler(),
                style: { cursor: 'pointer' },
              }}
              className="flex items-center space-x-2"
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <span className="font-medium">{getValue<string>()}</span>
              <Badge variant="secondary" className="ml-2">
                {row.subRows?.length}
              </Badge>
            </button>
          ) : (
            <span style={{ paddingLeft: `${row.depth * 2}rem` }}>
              {getValue<string>()}
            </span>
          );
        },
      },
      {
        accessorKey: 'product',
        header: 'Produit',
        cell: ({ row, getValue }) => (
          <span style={{ paddingLeft: `${row.depth * 1}rem` }}>
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'customer',
        header: 'Client',
      },
      {
        accessorKey: 'salesperson',
        header: 'Commercial',
      },
      {
        accessorKey: 'amount',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Montant
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row, getValue }) => {
          const amount = parseFloat(getValue<string>());
          const formatted = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
          }).format(amount);
          return <div className="font-medium">{formatted}</div>;
        },
        aggregationFn: 'sum',
        aggregatedCell: ({ getValue }) => {
          const amount = getValue<number>();
          const formatted = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
          }).format(amount);
          return <div className="font-bold text-green-600">{formatted}</div>;
        },
      },
      {
        accessorKey: 'status',
        header: 'Statut',
        cell: ({ row, getValue }) => {
          const status = getValue<string>();
          return (
            <Badge
              variant={
                status === 'completed'
                  ? 'default'
                  : status === 'pending'
                  ? 'secondary'
                  : 'destructive'
              }
            >
              {status === 'completed'
                ? 'Terminé'
                : status === 'pending'
                ? 'En cours'
                : 'Annulé'}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ getValue }) => {
          const date = new Date(getValue<string>());
          return date.toLocaleDateString('fr-FR');
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      grouping,
      expanded,
    },
    onSortingChange: setSorting,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label>{t('groupBy')}</Label>
          <select
            value={grouping[0] || ''}
            onChange={(e) => setGrouping(e.target.value ? [e.target.value] : [])}
            className="h-8 rounded border border-input bg-background px-3 py-1 text-sm"
          >
            <option value="">{t('noGrouping')}</option>
            <option value="region">{t('region')}</option>
            <option value="salesperson">{t('salesperson')}</option>
            <option value="status">{t('status')}</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => table.toggleAllRowsExpanded()}
          >
            {table.getIsAllRowsExpanded() ? t('collapseAll') : t('expandAll')}
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={row.getIsGrouped() ? 'bg-muted/50 font-medium' : 'hover:bg-muted/50'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.getIsGrouped() ? (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      ) : cell.getIsAggregated() ? (
                        flexRender(
                          cell.column.columnDef.aggregatedCell ??
                            cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t('noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} {t('totalRows')}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t('previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t('next')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function TanStackTablePage() {
  const t = useTranslations('tanstackTable');
  
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
          <TabsTrigger value="simple">{t('tabs.simple')}</TabsTrigger>
          <TabsTrigger value="advanced">{t('tabs.advanced')}</TabsTrigger>
          <TabsTrigger value="grouped">{t('tabs.grouped')}</TabsTrigger>
          <TabsTrigger value="patterns">{t('tabs.patterns')}</TabsTrigger>
        </TabsList>

        <TabsContent value="why-when">
          <WhyWhenTabs why={tanstackTableWhyWhen.why} when={tanstackTableWhyWhen.when} />
        </TabsContent>

        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                {t('whatIs')}
              </CardTitle>
              <CardDescription>
                {t('whatIsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">{t('headless')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('headlessDesc')}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Filter className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">{t('features')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('featuresDesc')}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">{t('performance')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('performanceDesc')}
                  </p>
                </div>
              </div>

              <CodeExample
                title="Configuration de base"
                code={`import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
} from '@tanstack/react-table';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

function BasicTable() {
  const [data, setData] = useState<User[]>([]);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nom',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'role',
        header: 'Rôle',
        cell: ({ row }) => (
          <Badge>{row.getValue('role')}</Badge>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('keyConcepts')}</CardTitle>
              <CardDescription>
                {t('keyConceptsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-blue-600">{t('columns')}</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      {t('accessorKey')}
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      {t('customCells')}
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      {t('interactiveHeaders')}
                    </li>
                    <li className="flex items-start">
                      <Badge variant="secondary" className="mr-2 mt-0.5">✓</Badge>
                      {t('visibility')}
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-green-600">{t('tableFeatures')}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {t('multiSort')}</li>
                    <li>• {t('globalColumnFilter')}</li>
                    <li>• {t('pagination')}</li>
                    <li>• {t('rowSelection')}</li>
                    <li>• {t('grouping')}</li>
                    <li>• {t('rowExpansion')}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simple" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('simpleTable')}</CardTitle>
              <CardDescription>
                {t('simpleTableDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BasicTable />
            </CardContent>
          </Card>

          <CodeExample
            title="Implémentation table simple"
            code={`const columns = useMemo<ColumnDef<User>[]>(
  () => [
    {
      accessorKey: 'firstName',
      header: 'Prénom',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={row.original.avatar} alt={row.original.firstName} />
            <AvatarFallback>{row.original.firstName[0]}{row.original.lastName[0]}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.getValue('firstName')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <a href={\`mailto:\${row.getValue('email')}\`} className="text-blue-600 hover:underline">
          {row.getValue('email')}
        </a>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge
            variant={status === 'active' ? 'default' : 'secondary'}
          >
            {status === 'active' ? 'Actif' : 'Inactif'}
          </Badge>
        );
      },
    },
  ],
  []
);

const table = useReactTable({
  data,
  columns,
  onSortingChange: setSorting,
  onGlobalFilterChange: setGlobalFilter,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    sorting,
    globalFilter,
  },
});`}
          />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('advancedTable')}</CardTitle>
              <CardDescription>
                {t('advancedTableDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedTable />
            </CardContent>
          </Card>

          <CodeExample
            title="Fonctionnalités avancées"
            code={`// Colonne de sélection
{
  id: 'select',
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
    />
  ),
  enableSorting: false,
  enableHiding: false,
},

// Header avec tri
{
  accessorKey: 'salary',
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      Salaire
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => {
    const amount = parseFloat(row.getValue('salary'));
    const formatted = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
    return <div className="font-medium">{formatted}</div>;
  },
},

// Configuration du table
const table = useReactTable({
  data,
  columns,
  onSortingChange: setSorting,
  onColumnFiltersChange: setColumnFilters,
  onColumnVisibilityChange: setColumnVisibility,
  onRowSelectionChange: setRowSelection,
  onGlobalFilterChange: setGlobalFilter,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    globalFilter,
  },
});`}
          />
        </TabsContent>

        <TabsContent value="grouped" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('groupedTable')}</CardTitle>
              <CardDescription>
                {t('groupedTableDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GroupedTable />
            </CardContent>
          </Card>

          <CodeExample
            title="Groupement et agrégation"
            code={`// Colonne avec expansion pour groupes
{
  accessorKey: 'region',
  header: 'Région',
  cell: ({ row, getValue }) => {
    return row.getCanExpand() ? (
      <button
        onClick={row.getToggleExpandedHandler()}
        className="flex items-center space-x-2"
      >
        {row.getIsExpanded() ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        <span className="font-medium">{getValue<string>()}</span>
        <Badge variant="secondary" className="ml-2">
          {row.subRows?.length}
        </Badge>
      </button>
    ) : (
      <span style={{ paddingLeft: \`\${row.depth * 2}rem\` }}>
        {getValue<string>()}
      </span>
    );
  },
},

// Colonne avec agrégation
{
  accessorKey: 'amount',
  header: 'Montant',
  cell: ({ getValue }) => {
    const amount = parseFloat(getValue<string>());
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  },
  aggregationFn: 'sum',
  aggregatedCell: ({ getValue }) => {
    const amount = getValue<number>();
    const formatted = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
    return <div className="font-bold text-green-600">{formatted}</div>;
  },
},

// Configuration avec groupement
const table = useReactTable({
  data,
  columns,
  state: {
    grouping,
    expanded,
  },
  onGroupingChange: setGrouping,
  onExpandedChange: setExpanded,
  getExpandedRowModel: getExpandedRowModel(),
  getGroupedRowModel: getGroupedRowModel(),
  getCoreRowModel: getCoreRowModel(),
});`}
          />
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('advancedPatterns')}</CardTitle>
              <CardDescription>
                {t('advancedPatternsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeExample
                title="Filtres personnalisés"
                code={`// Filtre de plage pour les nombres
const rangeFilter = (row: any, columnId: string, value: [number, number]) => {
  const rowValue = row.getValue(columnId);
  return rowValue >= value[0] && rowValue <= value[1];
};

// Filtre de recherche fuzzy
const fuzzyFilter = (row: any, columnId: string, value: string) => {
  const itemValue = row.getValue(columnId);
  return itemValue.toLowerCase().includes(value.toLowerCase());
};

// Configuration des filtres
const columns = [
  {
    accessorKey: 'salary',
    header: 'Salaire',
    filterFn: rangeFilter,
    cell: ({ getValue }) => formatCurrency(getValue()),
  },
  {
    accessorKey: 'name',
    header: 'Nom',
    filterFn: fuzzyFilter,
  },
];

// Composant de filtre personnalisé
function SalaryRangeFilter({ column }) {
  const [min, max] = column.getFilterValue() ?? [0, 200000];
  
  return (
    <div className="flex space-x-2">
      <Input
        type="number"
        value={min}
        onChange={(e) => 
          column.setFilterValue([Number(e.target.value), max])
        }
        placeholder="Min"
      />
      <Input
        type="number"
        value={max}
        onChange={(e) => 
          column.setFilterValue([min, Number(e.target.value)])
        }
        placeholder="Max"
      />
    </div>
  );
}`}
              />

              <CodeExample
                title="Virtualisation pour grandes données"
                code={`import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedTable({ data, columns }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();
  
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // hauteur estimée de chaque ligne
    overscan: 10,
  });

  return (
    <div ref={parentRef} className="h-96 overflow-auto">
      <div
        style={{
          height: \`\${virtualizer.getTotalSize()}px\`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          return (
            <div
              key={row.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: \`\${virtualRow.size}px\`,
                transform: \`translateY(\${virtualRow.start}px)\`,
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <span key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}`}
              />

              <CodeExample
                title="Export de données"
                code={`// Fonction d'export CSV
function exportToCSV(table: Table<any>, filename: string) {
  const headers = table.getVisibleFlatColumns()
    .map(column => column.columnDef.header)
    .join(',');
  
  const rows = table.getFilteredRowModel().rows
    .map(row => 
      row.getVisibleCells()
        .map(cell => {
          const value = cell.getValue();
          // Échapper les virgules et guillemets
          return typeof value === 'string' && value.includes(',') 
            ? \`"\${value.replace(/"/g, '""')}"\`
            : value;
        })
        .join(',')
    );
  
  const csv = [headers, ...rows].join('\\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

// Fonction d'export JSON
function exportToJSON(table: Table<any>, filename: string) {
  const data = table.getFilteredRowModel().rows
    .map(row => row.original);
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

// Utilisation
<Button onClick={() => exportToCSV(table, 'users.csv')}>
  Exporter CSV
</Button>
<Button onClick={() => exportToJSON(table, 'users.json')}>
  Exporter JSON
</Button>`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bonnes pratiques</CardTitle>
              <CardDescription>
                Recommandations pour optimiser vos tables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-green-600">{t('do')}</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• {t('useMemo')}</li>
                    <li>• {t('virtualization')}</li>
                    <li>• {t('optimizeCells')}</li>
                    <li>• {t('stableKeys')}</li>
                    <li>• {t('loadingStates')}</li>
                    <li>• {t('accessibility')}</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-red-600">{t('avoid')}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {t('recreateColumns')}</li>
                    <li>• {t('tooManyColumns')}</li>
                    <li>• {t('complexFilters')}</li>
                    <li>• {t('directMutations')}</li>
                    <li>• {t('forgetPagination')}</li>
                    <li>• {t('complexCells')}</li>
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