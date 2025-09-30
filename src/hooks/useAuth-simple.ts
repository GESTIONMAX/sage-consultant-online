import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from "../lib";

// Type pour représenter un utilisateur simplifié
interface SimpleUser extends User {
  role?: 'admin' | 'client';
}

export function useAuthSimple() {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session
    const getSession = async () => {
      setLoading(true);
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }
        
        setSession(session);
        
        // Utilisateur simplifié sans données de profil
        if (session?.user) {
          const simpleUser = { 
            ...session.user, 
            role: 'client' as 'admin' | 'client' // Rôle par défaut
          };
          setUser(simpleUser);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error in getSession:', error);
        setSession(null);
        setUser(null);
        setLoading(false);
      }
    };

    getSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        
        if (session?.user) {
          const simpleUser = { 
            ...session.user, 
            role: 'client' as 'admin' | 'client'
          };
          setUser(simpleUser);
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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Error signing in:', error);
        return { data: null, error };
      }
      
      if (data?.user) {
        const simpleUser = { 
          ...data.user, 
          role: 'client' as 'admin' | 'client'
        };
        setUser(simpleUser);
        return { data: { ...data, user: simpleUser }, error: null };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error in signInWithEmail:', error);
      return { data: null, error: { message: 'Authentication error' } };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        return { error };
      }
      
      setUser(null);
      setSession(null);
      return { error: null };
    } catch (error) {
      console.error('Error in signOut:', error);
      return { error: { message: 'Sign out error' } };
    }
  };

  // Sign up with email and password
  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('Error signing up:', error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error in signUpWithEmail:', error);
      return { data: null, error: { message: 'Sign up error' } };
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error('Error requesting password reset:', error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return { data: null, error: { message: 'Password reset error' } };
    }
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        console.error('Error updating password:', error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error in updatePassword:', error);
      return { data: null, error: { message: 'Password update error' } };
    }
  };

  return {
    user,
    session,
    loading,
    signInWithEmail,
    signOut,
    signUpWithEmail,
    resetPassword,
    updatePassword,
  };
}
