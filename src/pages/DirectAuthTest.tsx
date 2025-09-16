import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DirectAuthTest() {
  const [email, setEmail] = useState('admin@1cgestion.tech');
  const [password, setPassword] = useState('Admin2024!');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testDirectLogin = async () => {
    setLoading(true);
    setResult('🧪 Test de connexion directe...\n');

    try {
      // Test de connexion Supabase direct
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        setResult(prev => prev + `❌ ERREUR: ${error.message}\n`);
        setResult(prev => prev + `Code: ${error.status}\n`);
        setResult(prev => prev + `Détails: ${JSON.stringify(error, null, 2)}\n`);
      } else {
        setResult(prev => prev + `✅ CONNEXION RÉUSSIE!\n`);
        setResult(prev => prev + `Utilisateur: ${data.user?.email}\n`);
        setResult(prev => prev + `ID: ${data.user?.id}\n`);
        setResult(prev => prev + `Session: ${data.session ? 'Créée' : 'Non créée'}\n`);
      }

    } catch (err: any) {
      setResult(prev => prev + `🚨 ERREUR CRITIQUE: ${err.message}\n`);
    }

    setLoading(false);
  };

  const updatePasswordDirect = async () => {
    setResult('🔧 Méthodes de mise à jour du mot de passe...\n');

    // Méthode 1: SQL avec différents algorithms
    const sql1 = `-- Méthode 1: avec bcrypt (standard)
UPDATE auth.users
SET encrypted_password = crypt('${password}', gen_salt('bf')),
    updated_at = now(),
    email_confirmed_at = now()
WHERE email = 'consultant@1cgestion.tech';`;

    // Méthode 2: Créer l'authentification pour admin existant
    const sql2 = `-- Méthode 2: Créer l'authentification pour admin existant
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    pu.id,  -- Utiliser le même ID que dans public.users
    'authenticated',
    'authenticated',
    '${email}',
    crypt('${password}', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "admin"}'
FROM public.users pu
WHERE pu.email = '${email}'
ON CONFLICT (id) DO UPDATE SET
    encrypted_password = crypt('${password}', gen_salt('bf')),
    email_confirmed_at = now(),
    updated_at = now();`;

    const combinedSQL = sql1 + '\n\n' + sql2;

    try {
      await navigator.clipboard.writeText(combinedSQL);
      setResult(prev => prev + '✅ Requêtes SQL copiées!\n');
      setResult(prev => prev + 'Essayez d\'abord la méthode 1, puis la méthode 2 si nécessaire\n\n');
    } catch (err) {
      setResult(prev => prev + '❌ Erreur copie presse-papier\n');
    }

    setResult(prev => prev + combinedSQL + '\n');
  };

  const checkUserExists = async () => {
    setResult('🔍 Vérification utilisateur...\n');

    try {
      // Vérifier dans auth.users
      const { data: authUsers, error: authError } = await supabase
        .from('auth.users')
        .select('*')
        .eq('email', email);

      if (authError) {
        setResult(prev => prev + `❌ Erreur auth.users: ${authError.message}\n`);
      } else {
        setResult(prev => prev + `auth.users: ${authUsers?.length || 0} résultat(s)\n`);
      }

      // Vérifier dans public.users
      const { data: publicUsers, error: publicError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

      if (publicError) {
        setResult(prev => prev + `❌ Erreur public.users: ${publicError.message}\n`);
      } else {
        setResult(prev => prev + `public.users: ${publicUsers?.length || 0} résultat(s)\n`);
        if (publicUsers && publicUsers.length > 0) {
          setResult(prev => prev + `Rôle: ${publicUsers[0].role}\n`);
          setResult(prev => prev + `Statut: ${publicUsers[0].status}\n`);
        }
      }

    } catch (err: any) {
      setResult(prev => prev + `🚨 Erreur: ${err.message}\n`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🚀 Test Direct d'Authentification</h1>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email à tester</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email de l'utilisateur"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mot de passe à tester</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Button onClick={checkUserExists} variant="outline">
                1. Vérifier Utilisateur
              </Button>
              <Button onClick={updatePasswordDirect} variant="outline">
                2. Générer SQL
              </Button>
              <Button onClick={testDirectLogin} disabled={loading}>
                3. Test Connexion
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm min-h-64 whitespace-pre-wrap">
          {result || 'Aucun test exécuté...'}
        </div>

        <Alert className="mt-4">
          <AlertDescription>
            Cette page teste la connexion directement sans les hooks React.
            Utilisez-la pour isoler les problèmes d'authentification.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}