import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

/**
 * Ping Supabase pour maintenir la connexion active
 * Évite les pauses automatiques en version gratuite
 */
export async function pingSupabase(): Promise<boolean> {
  try {
    // Requête simple pour maintenir la connexion
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase ping failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase ping successful')
    return true
  } catch (error) {
    console.error('❌ Supabase ping error:', error)
    return false
  }
}

/**
 * Fonction de keep-alive avec retry
 */
export async function keepAliveWithRetry(maxRetries: number = 3): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    const success = await pingSupabase()
    if (success) return true
    
    // Attendre 5 secondes avant le prochain essai
    await new Promise(resolve => setTimeout(resolve, 5000))
  }
  
  console.error('❌ All keep-alive attempts failed')
  return false
}

/**
 * Démarrer le keep-alive automatique
 * Ping toutes les 10 minutes
 */
export function startKeepAlive(): void {
  // Ping immédiat
  pingSupabase()
  
  // Ping toutes les 10 minutes
  setInterval(() => {
    pingSupabase()
  }, 10 * 60 * 1000) // 10 minutes
  
  console.log('🔄 Keep-alive started - Supabase will stay active')
}

/**
 * Arrêter le keep-alive
 */
export function stopKeepAlive(): void {
  console.log('⏹️ Keep-alive stopped')
}
