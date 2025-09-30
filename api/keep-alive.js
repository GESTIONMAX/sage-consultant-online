// API Route pour maintenir Supabase actif
// Exécuté toutes les 10 minutes via Vercel Cron

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  // Seulement GET autorisé
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Ping simple pour maintenir la connexion Supabase
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase ping failed:', error.message)
      return res.status(500).json({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      })
    }
    
    console.log('✅ Supabase keep-alive successful')
    return res.status(200).json({ 
      success: true,
      message: 'Supabase is active',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Keep-alive error:', error)
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
}
