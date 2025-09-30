import { useState, useEffect } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from "../lib";
import { logger } from '../lib/config';

// Types étendus pour l'authentification
interface EnhancedUser extends User {
  role?: 'admin' | 'client';
  full_name?: string;
  phone?: string;
  company?: string;
  avatar_url?: string;
  client_since?: string;
  last_login?: string;
  status?: 'active' | 'inactive' | 'pending';
}

interface AuthState {
  user: EnhancedUser | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  signInWithEmail: (email: string, password: string) => Promise<{ data?: any; error?: string }>;
  signUpWithEmail: (email: string, password: string, metadata?: any) => Promise<{ data?: any; error?: string }>;
  signOut: () => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ data?: any; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ data?: any; error?: string }>;
  updateProfile: (updates: Partial<EnhancedUser>) => Promise<{ data?: any; error?: string }>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  isRole: (role: 'admin' | 'client') => boolean;
}

// Messages d'erreur français
const ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'Identifiants de connexion invalides',
  'Email not confirmed': 'Email non confirmé. Veuillez vérifier votre boîte de réception.',
  'Too many requests': 'Trop de tentatives. Veuillez attendre avant de réessayer.',
  'User not found': 'Utilisateur non trouvé',
  'Invalid email': 'Adresse email invalide',
  'Password too short': 'Le mot de passe doit contenir au moins 8 caractères',
  'Email already registered': 'Cette adresse email est déjà enregistrée',
  'Network error': 'Erreur de connexion. Vérifiez votre connexion internet.',
  'Token expired': 'Session expirée. Veuillez vous reconnecter.',
  'Unauthorized': 'Accès non autorisé'
};

// Permissions par rôle
const ROLE_PERMISSIONS = {
  admin: [
    'read_dashboard', 'write_dashboard', 'delete_dashboard',
    'manage_clients', 'manage_services', 'manage_blog',
    'view_analytics', 'manage_settings', 'manage_users'
  ],
  client: [
    'read_dashboard', 'edit_profile', 'read_documents',
    'download_documents', 'read_services', 'create_support_ticket'
  ]
};

export function useEnhancedAuth(): AuthState & AuthActions {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  });

  // Fonction pour traduire les erreurs
  const translateError = (error: AuthError | Error | string): string => {
    const message = typeof error === 'string' ? error : error.message;
    return ERROR_MESSAGES[message] || message || 'Une erreur inattendue s\'est produite';
  };

  // Fonction pour récupérer les données utilisateur complètes
  const fetchUserData = async (authUser: User | null): Promise<EnhancedUser | null> => {
    if (!authUser) return null;

    try {
      logger.log('Récupération des données utilisateur pour:', authUser.email);

      const { data, error } = await supabase
        .from('profiles')
        .select('role, full_name, email, company, status, created_at, updated_at')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.warn('Données utilisateur non trouvées dans la table profiles:', error);
        // Retourner l'utilisateur avec un rôle par défaut 'client'
        return { ...authUser, role: 'client', status: 'active' } as EnhancedUser;
      }

      // Mettre à jour la dernière connexion
      await supabase
        .from('profiles')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', authUser.id);

      logger.log('Données utilisateur récupérées:', data);

      const enhancedUser = {
        ...authUser,
        role: data?.role as 'admin' | 'client' | undefined || 'client',
        full_name: data?.full_name,
        company: data?.company,
        client_since: data?.created_at,
        last_login: data?.updated_at,
        status: data?.status || 'active'
      };

      return enhancedUser;
    } catch (err) {
      console.error('Erreur lors de la récupération des données utilisateur:', err);
      return { ...authUser, role: 'client', status: 'active' } as EnhancedUser;
    }
  };

  // Initialisation et écoute des changements d'authentification
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Erreur lors de la récupération de la session:', error);
          if (mounted) {
            setState(prev => ({
              ...prev,
              session: null,
              user: null,
              loading: false,
              error: translateError(error)
            }));
          }
          return;
        }

        const enhancedUser = session?.user ? await fetchUserData(session.user) : null;

        if (mounted) {
          setState(prev => ({
            ...prev,
            session,
            user: enhancedUser,
            loading: false,
            error: null
          }));
        }
      } catch (err) {
        console.error('Erreur d\'initialisation de l\'authentification:', err);
        if (mounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: translateError(err as Error)
          }));
        }
      }
    };

    initializeAuth();

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.log('Changement d\'état d\'authentification:', event);

        if (!mounted) return;

        try {
          const enhancedUser = session?.user ? await fetchUserData(session.user) : null;

          setState(prev => ({
            ...prev,
            session,
            user: enhancedUser,
            loading: false,
            error: null
          }));
        } catch (err) {
          console.error('Erreur lors du changement d\'état d\'authentification:', err);
          setState(prev => ({
            ...prev,
            loading: false,
            error: translateError(err as Error)
          }));
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Actions d'authentification avec gestion d'erreurs améliorée
  const signInWithEmail = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (error) {
        const errorMessage = translateError(error);
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
        return { error: errorMessage };
      }

      if (data?.user) {
        const enhancedUser = await fetchUserData(data.user);
        setState(prev => ({
          ...prev,
          user: enhancedUser,
          loading: false,
          error: null
        }));
        return { data: { ...data, user: enhancedUser } };
      }

      setState(prev => ({ ...prev, loading: false }));
      return { data };
    } catch (err) {
      const errorMessage = translateError(err as Error);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { error: errorMessage };
    }
  };

  const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: metadata
        }
      });

      if (error) {
        const errorMessage = translateError(error);
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
        return { error: errorMessage };
      }

      setState(prev => ({ ...prev, loading: false }));
      return { data };
    } catch (err) {
      const errorMessage = translateError(err as Error);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { error: errorMessage };
    }
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        const errorMessage = translateError(error);
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
        return { error: errorMessage };
      }

      setState({
        user: null,
        session: null,
        loading: false,
        error: null
      });

      return {};
    } catch (err) {
      const errorMessage = translateError(err as Error);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { error: errorMessage };
    }
  };

  const resetPassword = async (email: string) => {
    setState(prev => ({ ...prev, error: null }));

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`
        }
      );

      if (error) {
        const errorMessage = translateError(error);
        setState(prev => ({ ...prev, error: errorMessage }));
        return { error: errorMessage };
      }

      return { data };
    } catch (err) {
      const errorMessage = translateError(err as Error);
      setState(prev => ({ ...prev, error: errorMessage }));
      return { error: errorMessage };
    }
  };

  const updatePassword = async (newPassword: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        const errorMessage = translateError(error);
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
        return { error: errorMessage };
      }

      setState(prev => ({ ...prev, loading: false }));
      return { data };
    } catch (err) {
      const errorMessage = translateError(err as Error);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { error: errorMessage };
    }
  };

  const updateProfile = async (updates: Partial<EnhancedUser>) => {
    if (!state.user) {
      return { error: 'Utilisateur non connecté' };
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Mettre à jour les données dans la table profiles
      const { error: dbError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', state.user.id);

      if (dbError) {
        const errorMessage = translateError(dbError);
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
        return { error: errorMessage };
      }

      // Rafraîchir les données utilisateur
      const updatedUser = await fetchUserData(state.user);
      setState(prev => ({
        ...prev,
        user: updatedUser,
        loading: false
      }));

      return { data: updatedUser };
    } catch (err) {
      const errorMessage = translateError(err as Error);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { error: errorMessage };
    }
  };

  const refreshUser = async () => {
    if (state.session?.user) {
      const refreshedUser = await fetchUserData(state.session.user);
      setState(prev => ({ ...prev, user: refreshedUser }));
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const hasPermission = (permission: string): boolean => {
    if (!state.user?.role) return false;
    const userPermissions = ROLE_PERMISSIONS[state.user.role] || [];
    return userPermissions.includes(permission);
  };

  const isRole = (role: 'admin' | 'client'): boolean => {
    return state.user?.role === role;
  };

  return {
    ...state,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshUser,
    clearError,
    hasPermission,
    isRole
  };
}