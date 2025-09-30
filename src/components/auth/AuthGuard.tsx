import { ReactNode } from 'react';
import { useAuthSimple as useAuth } from '../../hooks/useAuth-simple';

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: Array<'admin' | 'client'>;
  permissions?: string[];
  fallback?: ReactNode;
}

// Permissions par rôle (à synchroniser avec votre base de données)
const ROLE_PERMISSIONS = {
  admin: [
    'read_dashboard',
    'write_dashboard',
    'delete_dashboard',
    'manage_clients',
    'manage_services',
    'manage_blog',
    'view_analytics',
    'manage_settings'
  ],
  client: [
    'read_dashboard',
    'edit_profile',
    'read_documents',
    'download_documents',
    'read_services',
    'create_support_ticket'
  ]
} as const;

const AuthGuard = ({
  children,
  allowedRoles,
  permissions,
  fallback = null
}: AuthGuardProps) => {
  const { user, loading } = useAuth();

  // Ne pas afficher pendant le chargement
  if (loading) return null;

  // Pas d'utilisateur connecté
  if (!user) return <>{fallback}</>;

  // Vérification des rôles autorisés
  if (allowedRoles && !allowedRoles.includes(user.role as 'admin' | 'client')) {
    return <>{fallback}</>;
  }

  // Vérification des permissions spécifiques
  if (permissions && permissions.length > 0) {
    const userPermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];
    const hasPermission = permissions.every(permission =>
      userPermissions.includes(permission as any)
    );

    if (!hasPermission) {
      return <>{fallback}</>;
    }
  }

  // Toutes les vérifications passées, afficher le contenu
  return <>{children}</>;
};

export default AuthGuard;