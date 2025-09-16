import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'client';
  fallbackRoute?: string;
}

const PrivateRoute = ({
  children,
  requiredRole,
  fallbackRoute = '/client-login'
}: PrivateRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Vérifier session d'urgence
  const checkEmergencySession = () => {
    try {
      const emergencySession = localStorage.getItem('emergency_admin_session');
      if (emergencySession) {
        const session = JSON.parse(emergencySession);
        const now = new Date().getTime();
        const expires = new Date(session.expires).getTime();

        if (now < expires) {
          return session.user;
        } else {
          localStorage.removeItem('emergency_admin_session');
        }
      }
    } catch (error) {
      localStorage.removeItem('emergency_admin_session');
    }
    return null;
  };

  const emergencyUser = checkEmergencySession();

  // Affichage loader pendant vérification auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-light to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sage-elegant">
            <img
              src="/sage-logo-green.svg"
              alt="Sage 100"
              className="h-12 w-auto mx-auto mb-4"
            />
            <Loader2 className="h-8 w-8 animate-spin text-sage-primary mx-auto" />
          </div>
          <p className="text-sage-dark font-medium">Vérification des autorisations...</p>
        </div>
      </div>
    );
  }

  // Utiliser l'utilisateur d'urgence s'il existe, sinon l'utilisateur normal
  const currentUser = emergencyUser || user;

  // Redirection si pas connecté
  if (!currentUser) {
    const redirectRoute = requiredRole === 'admin' ? '/admin' : fallbackRoute;
    return <Navigate to={redirectRoute} state={{ from: location }} replace />;
  }

  // Vérification du rôle si spécifié
  if (requiredRole && currentUser.role !== requiredRole) {
    // Admin qui tente d'accéder à l'espace client -> dashboard admin
    if (currentUser.role === 'admin' && requiredRole === 'client') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    // Client qui tente d'accéder à l'espace admin -> accès refusé
    if (currentUser.role === 'client' && requiredRole === 'admin') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-sage-light to-background flex items-center justify-center">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sage-elegant">
              <img
                src="/sage-logo-green.svg"
                alt="Sage 100"
                className="h-12 w-auto mx-auto mb-6"
              />
              <h2 className="text-2xl font-bold text-sage-dark mb-4">
                Accès Restreint
              </h2>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas les autorisations nécessaires pour accéder à cette section.
              </p>
              <div className="space-y-3">
                <a
                  href="/client-dashboard"
                  className="block w-full bg-sage-black text-sage-white py-2 px-4 rounded-lg hover:bg-sage-dark transition-colors"
                >
                  Retour à mon espace
                </a>
                <a
                  href="/"
                  className="block w-full border border-sage-primary text-sage-primary py-2 px-4 rounded-lg hover:bg-sage-light transition-colors"
                >
                  Accueil du site
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // Utilisateur autorisé, afficher le contenu
  return <>{children}</>;
};

export default PrivateRoute;