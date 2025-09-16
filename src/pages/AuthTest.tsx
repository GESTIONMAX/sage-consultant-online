import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AuthTest() {
  const [email, setEmail] = useState('consultant@1cgestion.tech');
  const [password, setPassword] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    setResults([]);
    addResult('🧪 Début des tests d\'authentification');

    try {
      // Test 1: Vérifier si l'utilisateur existe
      addResult('Test 1: Vérification utilisateur...');
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError) {
        addResult(`❌ Utilisateur non trouvé: ${userError.message}`);
        return;
      } else {
        addResult(`✅ Utilisateur trouvé: ${user.email} (${user.role})`);
      }

      // Test 2: Tentative de connexion
      addResult('Test 2: Tentative de connexion...');
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (authError) {
        addResult(`❌ Erreur de connexion: ${authError.message}`);
        addResult(`Code d'erreur: ${authError.status || 'N/A'}`);
      } else {
        addResult(`✅ Connexion réussie: ${authData.user?.email}`);
        addResult(`Session créée: ${authData.session?.access_token ? 'Oui' : 'Non'}`);
      }

      // Test 3: Vérifier la session actuelle
      addResult('Test 3: Vérification session...');
      const { data: sessionData } = await supabase.auth.getSession();
      addResult(`Session active: ${sessionData.session?.user?.email || 'Aucune'}`);

    } catch (err: any) {
      addResult(`🚨 Erreur critique: ${err.message}`);
    }
  };

  const resetPassword = async () => {
    if (!password) {
      addResult('❌ Veuillez entrer un mot de passe');
      return;
    }

    addResult(`🔧 Mise à jour du mot de passe pour ${email}...`);

    const sql = `UPDATE auth.users
SET encrypted_password = crypt('${password}', gen_salt('bf')),
    updated_at = now(),
    email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email = '${email}';`;

    addResult('📋 Requête SQL à exécuter:');
    addResult(sql);

    // Copier dans le presse-papier
    try {
      await navigator.clipboard.writeText(sql);
      addResult('✅ Requête copiée dans le presse-papier');
    } catch (err) {
      addResult('❌ Impossible de copier automatiquement');
    }
  };

  const checkSupabaseConfig = async () => {
    addResult('🔧 Vérification configuration Supabase...');

    try {
      const { data, error } = await supabase.auth.getSession();
      addResult(`URL Supabase: ${supabase.supabaseUrl}`);
      addResult(`Clé publique présente: ${supabase.supabaseKey ? 'Oui' : 'Non'}`);

      if (error) {
        addResult(`❌ Erreur config: ${error.message}`);
      } else {
        addResult('✅ Configuration semble OK');
      }
    } catch (err: any) {
      addResult(`🚨 Erreur de configuration: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Test d'Authentification</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Paramètres de Test</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe à tester"
                />
              </div>

              <div className="space-y-2">
                <Button onClick={checkSupabaseConfig} className="w-full">
                  1. Vérifier Configuration
                </Button>
                <Button onClick={resetPassword} className="w-full" variant="outline">
                  2. Générer SQL Reset Password
                </Button>
                <Button onClick={testConnection} className="w-full" variant="default">
                  3. Tester Connexion
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Résultats des Tests</h2>

            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
              {results.length === 0 ? (
                <div className="text-gray-500">Aucun test exécuté...</div>
              ) : (
                results.map((result, index) => (
                  <div key={index} className="mb-1">
                    {result}
                  </div>
                ))
              )}
            </div>

            <Button
              onClick={() => setResults([])}
              variant="outline"
              className="mt-4 w-full"
            >
              Effacer les résultats
            </Button>
          </div>
        </div>

        <Alert className="mt-8">
          <AlertDescription>
            <strong>Instructions:</strong><br />
            1. Vérifiez d'abord la configuration<br />
            2. Générez et exécutez la requête SQL dans Supabase<br />
            3. Testez la connexion avec le nouveau mot de passe
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}