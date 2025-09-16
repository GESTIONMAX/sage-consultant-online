import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, TestTube, Key } from 'lucide-react';

export default function TestResetPassword() {
  const [email, setEmail] = useState('consultant@1cgestion.tech');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDirectPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      setMessage({ type: 'error', text: 'Veuillez entrer un nouveau mot de passe' });
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);

      console.log('🧪 TEST DIRECT PASSWORD RESET');
      console.log('Email:', email);

      // Méthode 1: Reset via admin (nécessite service role key)
      // Cette méthode fonctionne en développement

      // Méthode 2: Mettre à jour directement en base (pour test uniquement)
      const { error: updateError } = await supabase.rpc('update_user_password_direct', {
        user_email: email,
        new_password: newPassword
      });

      if (updateError) {
        console.error('Erreur RPC:', updateError);
        // Fallback: mise à jour SQL directe (méthode de test)
        throw new Error('Utilisez la méthode SQL pour le test en développement');
      }

      setMessage({
        type: 'success',
        text: `Mot de passe mis à jour directement en base de données pour ${email}. Testez maintenant la connexion !`
      });

    } catch (err: any) {
      console.error('Erreur:', err);
      setMessage({
        type: 'error',
        text: `Erreur: ${err.message}. Utilisez la requête SQL directe pour tester.`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSQLUpdate = () => {
    const sql = `-- Requête SQL pour tester le reset password en développement
UPDATE auth.users
SET encrypted_password = crypt('${newPassword}', gen_salt('bf')),
    updated_at = now()
WHERE email = '${email}';`;

    navigator.clipboard.writeText(sql);
    setMessage({
      type: 'success',
      text: 'Requête SQL copiée dans le presse-papier ! Exécutez-la dans Supabase SQL Editor.'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light to-background flex items-center justify-center py-12 px-4">
      <div className="relative max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-sage-elegant border-t-4 border-blue-400">
              <TestTube className="h-12 w-12 text-blue-500" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-sage-dark">
            Test Reset Password
          </h2>
          <p className="mt-2 text-muted-foreground text-center">
            Version de test pour développement local
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sage-elegant p-8 border border-sage-light">
          {message && (
            <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Mode Test :</strong> Cette page permet de tester le reset password en développement local
              sans dépendre des emails.
            </p>
          </div>

          <form onSubmit={handleDirectPasswordReset} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sage-dark font-medium">
                Email utilisateur
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-sage-light focus:border-sage-primary"
                disabled
              />
            </div>

            <div>
              <Label htmlFor="newPassword" className="text-sage-dark font-medium">
                Nouveau mot de passe
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Nouveau mot de passe (ex: Admin2024!)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border-sage-light focus:border-sage-primary"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                onClick={generateSQLUpdate}
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
                disabled={!newPassword}
              >
                <Key className="mr-2 h-4 w-4" />
                Générer requête SQL (Recommandé)
              </Button>

              <Button
                type="submit"
                variant="outline"
                className="w-full border-sage-primary text-sage-primary"
                disabled={isLoading || !newPassword}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Test en cours...
                  </>
                ) : (
                  <>
                    <TestTube className="mr-2 h-4 w-4" />
                    Test direct (peut échouer)
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Instructions :</strong><br />
              1. Entrez le nouveau mot de passe<br />
              2. Cliquez "Générer requête SQL"<br />
              3. Exécutez la requête dans Supabase SQL Editor<br />
              4. Testez la connexion sur /admin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}