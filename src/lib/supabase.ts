import { createClient } from '@supabase/supabase-js';
import { config } from './config';

// Create Supabase client avec validation automatique
export const supabase = createClient(config.supabase.url, config.supabase.anonKey);

// Export type definitions for TypeScript
export type { 
  SupabaseClient,
  Session,
  User,
  PostgrestError
} from '@supabase/supabase-js';
