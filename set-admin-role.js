// Script pour définir le rôle 'admin' pour un utilisateur existant dans Supabase
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

// Création du client Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setAdminRole() {
  try {
    console.log('Définition du rôle administrateur pour un utilisateur');
    
    // Demander l'email de l'utilisateur
    const email = await askQuestion('Entrez l\'email de l\'utilisateur: ');
    
    // Vérifier si l'utilisateur existe dans auth
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(email);
    
    if (authError) {
      console.log('Impossible de vérifier l\'utilisateur dans auth. Vérifions directement dans la table users...');
    }
    
    // Rechercher l'utilisateur dans la table users par email
    const { data: existingUsers, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);
    
    if (selectError) {
      throw new Error(`Erreur lors de la recherche de l'utilisateur: ${selectError.message}`);
    }
    
    let userId;
    
    if (existingUsers && existingUsers.length > 0) {
      // L'utilisateur existe déjà dans la table users
      userId = existingUsers[0].id;
      console.log(`Utilisateur trouvé dans la table users avec l'ID: ${userId}`);
      
      // Mettre à jour le rôle
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', userId);
      
      if (updateError) {
        throw new Error(`Erreur lors de la mise à jour du rôle: ${updateError.message}`);
      }
      
      console.log(`Le rôle de l'utilisateur ${email} a été défini comme 'admin'`);
      
    } else if (authUser) {
      // L'utilisateur existe dans auth mais pas dans la table users
      userId = authUser.id;
      console.log(`Utilisateur trouvé dans auth avec l'ID: ${userId}`);
      
      // Demander le nom complet
      const fullName = await askQuestion('Entrez le nom complet de l\'utilisateur (optionnel): ');
      
      // Insérer l'utilisateur dans la table users
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: email,
          full_name: fullName || null,
          role: 'admin'
        });
      
      if (insertError) {
        throw new Error(`Erreur lors de l'insertion de l'utilisateur: ${insertError.message}`);
      }
      
      console.log(`L'utilisateur ${email} a été ajouté à la table users avec le rôle 'admin'`);
      
    } else {
      console.log(`Aucun utilisateur trouvé avec l'email ${email}. Veuillez d'abord créer un compte.`);
    }
    
  } catch (error) {
    console.error('Erreur:', error.message);
  } finally {
    rl.close();
  }
}

setAdminRole();
