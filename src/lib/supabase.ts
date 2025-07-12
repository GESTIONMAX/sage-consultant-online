import { createClient } from '@supabase/supabase-js';

// Get values from environment variables (Vite style)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the values are available
if (!supabaseUrl) {
  console.error('Missing Supabase URL environment variable (VITE_SUPABASE_URL)');
}

if (!supabaseKey) {
  console.error('Missing Supabase key environment variable (VITE_SUPABASE_ANON_KEY)');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Export type definitions for TypeScript
export type { 
  SupabaseClient,
  Session,
  User,
  PostgrestError
} from '@supabase/supabase-js';
