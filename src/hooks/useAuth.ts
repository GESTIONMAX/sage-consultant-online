import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from "../lib";

// Type pour représenter un utilisateur enrichi avec les données de la base
interface EnhancedUser extends User {
  role?: 'admin' | 'client';
  full_name?: string;
  phone?: string;
  company?: string;
  avatar_url?: string;
  client_since?: string;
}

export function useAuth() {
  const [user, setUser] = useState<EnhancedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer les données utilisateur complètes
  const fetchUserData = async (authUser: User | null): Promise<EnhancedUser | null> => {
    if (!authUser) return null;
    
    console.log('Récupération des données utilisateur pour:', authUser.email);
    
    // Récupérer les informations utilisateur depuis la table users
    const { data, error } = await supabase
      .from('users')
      .select('role, full_name, phone, company, avatar_url, client_since')
      .eq('id', authUser.id)
      .single();
    
    if (error) {
      console.error('Error fetching user data:', error);
      console.log('Aucune entrée trouvée dans la table users pour cet utilisateur, vérifiez que la table users contient une entrée pour', authUser.id);
      // Retourner l'utilisateur avec un rôle par défaut 'client'
      return { ...authUser, role: 'client' } as EnhancedUser;
    }
    
    console.log('Données utilisateur récupérées:', data);
    
    // Combiner les données d'authentification avec les données de la base
    const enhancedUser = { 
      ...authUser, 
      role: data?.role as 'admin' | 'client' | undefined,
      full_name: data?.full_name,
      phone: data?.phone,
      company: data?.company,
      avatar_url: data?.avatar_url,
      client_since: data?.client_since
    };
    
    console.log('Utilisateur enrichi avec rôle:', enhancedUser.role);
    return enhancedUser;
  };

  useEffect(() => {
    // Get current session
    const getSession = async () => {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }
      
      setSession(session);
      
      // Récupérer les données utilisateur complètes
      if (session?.user) {
        const enhancedUser = await fetchUserData(session.user);
        setUser(enhancedUser);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };

    getSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        
        // Récupérer les données utilisateur complètes
        if (session?.user) {
          const enhancedUser = await fetchUserData(session.user);
          setUser(enhancedUser);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  // Sign in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error) {
      console.error('Error signing in:', error);
      return { data: null, error };
    }
    
    // Récupérer les données utilisateur complètes
    if (data?.user) {
      const enhancedUser = await fetchUserData(data.user);
      // Mettre à jour l'utilisateur dans le state
      setUser(enhancedUser);
      return { data: { ...data, user: enhancedUser }, error: null };
    }
    
    return { data, error: null };
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
    }
    
    return { error };
  };

  // Sign up with email and password
  const signUpWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing up:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  };

  // Reset password
  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error('Error requesting password reset:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      console.error('Error updating password:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  };

  return {
    user,
    session,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword,
    updatePassword
  };
}
