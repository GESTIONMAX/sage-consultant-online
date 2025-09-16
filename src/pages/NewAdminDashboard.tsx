import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserPlus,
  Settings,
  BarChart3,
  Mail,
  Shield,
  LogOut,
  Clock,
  Activity,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  admins: number;
  clients: number;
}

export default function NewAdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    admins: 0,
    clients: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin');
      return;
    }
    loadStats();
  }, [user, navigate]);

  const loadStats = async () => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('role, status');

      if (error) throw error;

      if (users) {
        const stats: DashboardStats = {
          totalUsers: users.length,
          activeUsers: users.filter(u => u.status === 'active').length,
          pendingUsers: users.filter(u => u.status === 'pending').length,
          admins: users.filter(u => u.role === 'admin').length,
          clients: users.filter(u => u.role === 'client').length
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const quickActions = [
    {
      title: 'Inviter un utilisateur',
      description: 'Créer une invitation pour un nouveau client ou admin',
      icon: UserPlus,
      href: '/admin-invitations',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Gérer les utilisateurs',
      description: 'Voir et administrer tous les utilisateurs',
      icon: Users,
      href: '/admin-invitations',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Paramètres système',
      description: 'Configuration et paramètres',
      icon: Settings,
      href: '/admin-settings',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Rapports',
      description: 'Statistiques et analyses',
      icon: BarChart3,
      href: '/admin-reports',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-light to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-primary mx-auto mb-4"></div>
          <p className="text-sage-dark">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light to-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-sage-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img src="/sage-logo-green.svg" alt="Sage 100" className="h-8 w-auto" />
              <div>
                <h1 className="text-xl font-bold text-sage-dark">Dashboard Admin</h1>
                <p className="text-sm text-muted-foreground">Plateforme de gestion</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full">
                <Shield className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  {user?.full_name || user?.email}
                </span>
                <Badge variant="destructive" className="text-xs">Admin</Badge>
              </div>

              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-sage-dark mb-2">
            Bienvenue, {user?.full_name || 'Administrateur'} !
          </h2>
          <p className="text-muted-foreground">
            Gérez les utilisateurs, les invitations et les paramètres de votre plateforme Sage 100.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sage-dark">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Tous les comptes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                Comptes activés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingUsers}</div>
              <p className="text-xs text-muted-foreground">
                Invitations envoyées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
              <Shield className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
              <p className="text-xs text-muted-foreground">
                Comptes admin
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.clients}</div>
              <p className="text-xs text-muted-foreground">
                Comptes client
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-sage-dark mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Card className="hover:shadow-sage-elegant transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Activité Récente
            </CardTitle>
            <CardDescription>
              Dernières actions et événements système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 rounded-full p-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Système d'invitation opérationnel</p>
                  <p className="text-xs text-muted-foreground">
                    Les invitations peuvent être envoyées aux nouveaux utilisateurs
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="bg-green-100 rounded-full p-2">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Authentification stabilisée</p>
                  <p className="text-xs text-muted-foreground">
                    Le système d'authentification fonctionne correctement
                  </p>
                </div>
              </div>

              {stats.pendingUsers > 0 && (
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="bg-yellow-100 rounded-full p-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {stats.pendingUsers} invitation{stats.pendingUsers > 1 ? 's' : ''} en attente
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Des utilisateurs n'ont pas encore activé leur compte
                    </p>
                  </div>
                  <Link to="/admin-invitations">
                    <Button size="sm" variant="outline">
                      Gérer
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}