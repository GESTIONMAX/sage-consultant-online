import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './config';

// Singleton pour éviter les instances multiples
let supabaseInstance: SupabaseClient | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(config.supabase.url, config.supabase.anonKey);
  }
  return supabaseInstance;
})();

// Export type definitions for TypeScript
export type { 
  SupabaseClient,
  Session,
  User,
  PostgrestError
} from '@supabase/supabase-js';
