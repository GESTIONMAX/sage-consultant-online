// Script temporaire pour tester la connexion à Supabase
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config()

// URL et clé depuis les variables d'environnement (Vite style)
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('Configuration Supabase:')
console.log(`URL: ${supabaseUrl ? 'Définie ✅' : 'Non définie ❌'}`)
console.log(`Clé: ${supabaseKey ? 'Définie ✅' : 'Non définie ❌'}`)

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes. Vérifiez votre fichier .env')
  process.exit(1)
}

// Créer le client Supabase
const supabase = createClient(supabaseUrl, supabaseKey)

// Tester la connexion
async function testConnection() {
  try {
    // Tester l'authentification
    console.log('Test de la connexion à Supabase...')
    
    // Vérifier si on peut accéder à l'API d'authentification
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('❌ Erreur lors du test d\'authentification:', authError.message)
    } else {
      console.log('✅ API d\'authentification accessible')
      console.log('Session actuelle:', authData.session ? 'Existante' : 'Aucune')
    }
    
    // Tester l'accès à une table publique (s'il y en a)
    // Note: cette requête peut échouer si aucune table n'est configurée ou accessible
    console.log('\nTest d\'accès à la base de données...')
    const { error: dbError } = await supabase.from('_supabase_functions').select('id').limit(1)
    
    if (dbError) {
      if (dbError.code === 'PGRST116') {
        console.log('✅ Base de données accessible (mais permission refusée, ce qui est normal)')
      } else {
        console.error('❌ Erreur lors du test de la base de données:', dbError.message)
      }
    } else {
      console.log('✅ Base de données accessible')
    }
    
    console.log('\n✅ Test de connexion terminé')
  } catch (error) {
    console.error('❌ Erreur inattendue:', error.message)
  }
}

testConnection()
