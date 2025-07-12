// Script pour vérifier ou créer un utilisateur admin dans Supabase
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Création du client Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndCreateAdmin() {
  try {
    console.log('Vérification des utilisateurs admin...');
    
    // Vérifier si un utilisateur admin existe déjà
    const { data: existingAdmins, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'admin');
    
    if (selectError) {
      throw new Error(`Erreur lors de la vérification des utilisateurs admin: ${selectError.message}`);
    }
    
    console.log(`Nombre d'administrateurs trouvés: ${existingAdmins.length}`);
    
    if (existingAdmins.length > 0) {
      console.log('Utilisateurs admin existants:');
      existingAdmins.forEach(admin => {
        console.log(`- Email: ${admin.email}, ID: ${admin.id}, Nom: ${admin.full_name || 'Non spécifié'}`);
      });
      return;
    }
    
    // Si aucun admin n'existe, demander à l'utilisateur de s'inscrire manuellement via l'interface
    console.log('Aucun utilisateur admin trouvé. Veuillez créer un compte via l\'interface de connexion.');
    console.log('Après avoir créé un compte, utilisez le script set-admin-role.js pour lui attribuer le rôle admin.');
    
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

checkAndCreateAdmin();
