import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

export default function EmergencyAdmin() {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Debug complet
    console.log('EmergencyAdmin - URL complète:', window.location.href);
    console.log('EmergencyAdmin - Search params:', window.location.search);

    // Vérifier le code d'urgence dans l'URL
    const params = new URLSearchParams(window.location.search);
    const emergencyCode = params.get('code');

    console.log('EmergencyAdmin - Code reçu:', emergencyCode);
    console.log('EmergencyAdmin - Code attendu: sage2024emergency');
    console.log('EmergencyAdmin - Match:', emergencyCode === 'sage2024emergency');

    // Code d'urgence simple - accepter plusieurs codes
    if (emergencyCode === 'sage2024emergency' || emergencyCode === 'admin' || emergencyCode === '1234') {
      console.log('EmergencyAdmin - Code valide, activation...');
      setAuthenticated(true);
      // Simuler une session admin d'urgence
      const emergencySession = {
        user: {
          id: 'emergency-admin',
          email: 'admin@1cgestion.tech',
          role: 'admin'
        },
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2h
      };
      localStorage.setItem('emergency_admin_session', JSON.stringify(emergencySession));
      console.log('EmergencyAdmin - Session créée:', emergencySession);
    } else {
      console.log('EmergencyAdmin - Code invalide');
    }
  }, []);

  const goToAdminDashboard = () => {
    navigate('/admin-dashboard');
  };

  const createRegularAdmin = async () => {
    const email = prompt('Email du nouvel admin:', 'nouveau-admin@1cgestion.tech');
    if (!email) return;

    const password = prompt('Mot de passe temporaire:', 'Temp2024!');
    if (!password) return;

    try {
      // Créer directement dans public.users d'abord
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .insert({
          email: email,
          role: 'admin',
          full_name: 'Nouvel Administrateur',
          company: '1C Gestion',
          status: 'active',
          client_since: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (userError) {
        throw userError;
      }

      // Utiliser Supabase pour créer l'utilisateur auth
      const { error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: { role: 'admin' }
      });

      if (authError) {
        console.warn('Erreur création auth (normal si pas de service role):', authError);

        // Donner les instructions manuelles
        const sql = `
-- Instructions SQL à exécuter dans Supabase:
UPDATE public.users
SET id = '${userData.id}' -- ou générer un nouvel UUID
WHERE email = '${email}';

INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '${userData.id}',
    'authenticated',
    'authenticated',
    '${email}',
    crypt('${password}', gen_salt('bf')),
    now(),
    now(),
    now()
);`;

        navigator.clipboard.writeText(sql);
        alert('Utilisateur créé dans public.users ✅\nRequête SQL copiée pour créer l\'auth.\n\nInstructions:\n1. Allez dans Supabase SQL Editor\n2. Collez et exécutez la requête\n3. L\'admin pourra se connecter avec:\nEmail: ' + email + '\nMot de passe: ' + password);
      } else {
        alert('Admin créé avec succès! ✅\n\nEmail: ' + email + '\nMot de passe: ' + password + '\n\nL\'admin peut maintenant se connecter.');
      }

    } catch (error: any) {
      console.error('Erreur création admin:', error);
      alert('Erreur: ' + error.message);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="bg-red-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-red-800">Accès d'Urgence</h1>
            <p className="text-red-600 mt-2">Accès administrateur de secours</p>
          </div>

          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              <strong>Accès Refusé</strong><br />
              Cette page nécessite un code d'urgence valide.<br />
              URL: <code>/emergency-admin?code=VOTRE_CODE</code>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-sage-light flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="bg-green-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-800">Mode d'Urgence Activé</h1>
          <p className="text-green-600 mt-2">Accès administrateur temporaire</p>
        </div>

        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <AlertDescription className="text-yellow-800">
            <strong>Session temporaire</strong><br />
            Durée: 2 heures<br />
            Utilisez cet accès pour créer un admin régulier.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <Button onClick={goToAdminDashboard} className="w-full bg-sage-primary hover:bg-sage-dark">
            Accéder au Dashboard Admin
          </Button>

          <Button onClick={createRegularAdmin} variant="outline" className="w-full">
            Créer Admin Régulier
          </Button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded text-sm">
          <p className="text-gray-600">
            <strong>Instructions:</strong><br />
            1. Allez au dashboard admin<br />
            2. Créez un utilisateur admin normal<br />
            3. La session d'urgence expirera automatiquement
          </p>
        </div>
      </div>
    </div>
  );
}