import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthSimple as useEnhancedAuth } from '../hooks/useAuth-simple';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useEnhancedAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Debug complet de la page reset password
    console.log('=== RESET PASSWORD DEBUG ===');
    console.log('1. Full URL:', window.location.href);
    console.log('2. Search params:', window.location.search);
    console.log('3. Hash:', window.location.hash);

    const params = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.substring(1));

    console.log('4. Access token (search):', params.get('access_token'));
    console.log('5. Access token (hash):', hash.get('access_token'));
    console.log('6. Type (search):', params.get('type'));
    console.log('7. Type (hash):', hash.get('type'));
    console.log('8. Current session:', session);
    console.log('9. User in session:', session?.user?.email);
    console.log('============================');

    // Test de session Supabase direct
    const checkSupabaseSession = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      console.log('🔍 Direct Supabase session check:');
      console.log('   Session:', currentSession);
      console.log('   Error:', error);
      console.log('   User email:', currentSession?.user?.email);
    };

    checkSupabaseSession();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!password || !confirmPassword) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);

      console.log('Attempting password update...');

      // Extraire le token de l'URL pour la réinitialisation
      const params = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.substring(1));

      const accessToken = params.get('access_token') || hash.get('access_token');
      const refreshToken = params.get('refresh_token') || hash.get('refresh_token');

      console.log('Access token found:', !!accessToken);
      console.log('Refresh token found:', !!refreshToken);

      let result;

      if (accessToken) {
        // Utiliser le token directement pour établir la session
        console.log('Setting session with tokens...');
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || ''
        });

        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        console.log('Session established:', sessionData);

        // Attendre que la session soit complètement établie
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Maintenant mettre à jour le mot de passe
      console.log('Updating password...');
      result = await supabase.auth.updateUser({
        password: password
      });

      const { data, error } = result;

      // Attendre la propagation de la mise à jour
      if (!error && data) {
        console.log('Password updated successfully, waiting for propagation...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Vérifier que la session est toujours active
        const { data: currentSession } = await supabase.auth.getSession();
        console.log('Current session after password update:', currentSession);

        if (currentSession?.session?.user) {
          console.log('User is automatically logged in:', currentSession.session.user.email);
        }
      }

      console.log('Password update result:', { data, error });

      if (error) {
        console.error('Password update error:', error);
        setMessage({ type: 'error', text: `Erreur: ${error.message}` });
        return;
      }

      setMessage({
        type: 'success',
        text: 'Votre mot de passe a été réinitialisé avec succès ! Vous êtes maintenant connecté automatiquement. Redirection vers votre espace...'
      });

      // Déterminer la page de redirection selon le rôle
      const userRole = data?.user?.user_metadata?.role || 'client';
      const redirectPath = userRole === 'admin' ? '/admin-dashboard' : '/client-dashboard';

      console.log('Redirecting to:', redirectPath);

      // Redirection vers le dashboard approprié après 3 secondes
      setTimeout(() => {
        navigate(redirectPath);
      }, 3000);

    } catch (err: any) {
      console.error('🚨 ERREUR RESET PASSWORD:', err);
      console.error('   Type:', typeof err);
      console.error('   Message:', err.message);
      console.error('   Stack:', err.stack);
      console.error('   Code:', err.code);
      setMessage({
        type: 'error',
        text: `Erreur détaillée: ${err.message || err.toString()}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light to-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-sage-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-sage-secondary/15 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Header avec Logo Sage */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-sage-elegant">
              <img
                src="/sage-logo-green.svg"
                alt="Sage 100"
                className="h-12 w-auto"
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-sage-dark">
            Nouveau mot de passe
          </h2>
          <p className="mt-2 text-muted-foreground text-center">
            Définissez un nouveau mot de passe sécurisé pour votre compte
          </p>
        </div>

        {/* Formulaire de réinitialisation */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sage-elegant p-8 border border-sage-light">
          {message && (
            <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-start">
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                ) : (
                  <Lock className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                )}
                <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {message.text}
                </AlertDescription>
              </div>
            </Alert>
          )}

          <div className="mb-6 p-4 bg-sage-light/30 rounded-lg border border-sage-light">
            <p className="text-sm text-sage-dark">
              <strong>Critères du mot de passe :</strong> Minimum 8 caractères avec une combinaison
              de lettres majuscules, minuscules, chiffres et symboles pour une sécurité optimale.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="password" className="text-sage-dark font-medium">
                Nouveau mot de passe
              </Label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-sage-primary/60" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="pl-10 pr-10 border-sage-light focus:border-sage-primary focus:ring-sage-primary"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-sage-primary/60" />
                  ) : (
                    <Eye className="h-5 w-5 text-sage-primary/60" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-sage-dark font-medium">
                Confirmer le mot de passe
              </Label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-sage-primary/60" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="pl-10 pr-10 border-sage-light focus:border-sage-primary focus:ring-sage-primary"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-sage-primary/60" />
                  ) : (
                    <Eye className="h-5 w-5 text-sage-primary/60" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-sage-black text-sage-white hover:bg-sage-dark"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Réinitialisation en cours...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Confirmer le nouveau mot de passe
                </>
              )}
            </Button>
          </form>

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t border-sage-light/50">
            <div className="flex justify-center">
              <Link to="/client-login">
                <Button variant="outline" className="border-sage-primary text-sage-primary hover:bg-sage-light">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Informations sécurité */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Lien sécurisé • Session temporaire • Données chiffrées
          </p>
        </div>
      </div>
    </div>
  );
}
