import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, UserCheck, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface ActivationData {
  userId: string;
  email: string;
  timestamp: number;
}

interface UserData {
  id: string;
  email: string;
  role: string;
  full_name: string;
  company: string;
  status: string;
}

export default function ClientActivation() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activationData, setActivationData] = useState<ActivationData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    validateToken();
  }, []);

  const validateToken = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setMessage({ type: 'error', text: 'Token d\'activation manquant' });
      setValidating(false);
      return;
    }

    try {
      // Décoder le token
      const decoded = atob(token);
      const [userId, email, timestamp] = decoded.split(':');

      if (!userId || !email || !timestamp) {
        throw new Error('Token invalide');
      }

      // Vérifier l'expiration (7 jours)
      const tokenAge = Date.now() - parseInt(timestamp);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;

      if (tokenAge > sevenDays) {
        throw new Error('Token expiré');
      }

      setActivationData({ userId, email, timestamp: parseInt(timestamp) });

      // Récupérer les données utilisateur
      const { data: user, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .eq('email', email)
        .single();

      if (error || !user) {
        throw new Error('Utilisateur non trouvé ou invitation invalide');
      }

      if (user.status === 'active') {
        setMessage({ type: 'error', text: 'Ce compte est déjà activé. Utilisez la page de connexion.' });
        setValidating(false);
        return;
      }

      setUserData(user);
    } catch (error: any) {
      console.error('Erreur validation token:', error);
      setMessage({ type: 'error', text: error.message || 'Token invalide' });
    }

    setValidating(false);
  };

  const activateAccount = async () => {
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

    if (!activationData || !userData) return;

    try {
      setLoading(true);
      setMessage(null);

      // Créer l'utilisateur dans auth.users
      const { error: signUpError } = await supabase.auth.signUp({
        email: activationData.email,
        password: password,
        options: {
          data: {
            role: userData.role,
            full_name: userData.full_name,
            company: userData.company
          }
        }
      });

      if (signUpError) {
        // Si l'utilisateur existe déjà dans auth, essayer de le connecter
        if (signUpError.message?.includes('already registered')) {
          // Mettre à jour le mot de passe via une méthode alternative
          const sql = `
UPDATE auth.users
SET encrypted_password = crypt('${password}', gen_salt('bf')),
    updated_at = now(),
    email_confirmed_at = now()
WHERE email = '${activationData.email}';`;

          navigator.clipboard.writeText(sql);
          setMessage({
            type: 'error',
            text: 'Utilisateur déjà existant. SQL de mise à jour du mot de passe copié dans le presse-papier. Exécutez-le dans Supabase puis reconnectez-vous.'
          });
          return;
        }
        throw signUpError;
      }

      // Mettre à jour le statut dans public.users
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          status: 'active',
          last_login: new Date().toISOString()
        })
        .eq('id', userData.id);

      if (updateError) {
        console.warn('Erreur mise à jour statut:', updateError);
      }

      setMessage({
        type: 'success',
        text: 'Compte activé avec succès ! Vous allez être redirigé vers la page de connexion.'
      });

      // Redirection vers la page de connexion appropriée
      setTimeout(() => {
        const loginPath = userData.role === 'admin' ? '/admin' : '/client-login';
        navigate(loginPath);
      }, 3000);

    } catch (error: any) {
      console.error('Erreur activation:', error);
      setMessage({ type: 'error', text: error.message || 'Erreur lors de l\'activation' });
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-light to-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-sage-primary mx-auto mb-4" />
          <p className="text-sage-dark">Validation du lien d'activation...</p>
        </div>
      </div>
    );
  }

  if (!activationData || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-light to-background flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-red-800">Lien invalide</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sage-elegant p-8">
            {message && (
              <Alert className="border-red-200 bg-red-50 mb-6">
                <AlertDescription className="text-red-800">
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Le lien d'activation est invalide ou expiré.
              </p>
              <p className="text-sm text-muted-foreground">
                Contactez votre administrateur pour obtenir un nouveau lien.
              </p>

              <div className="pt-4">
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    Retour à l'accueil
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light to-background flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-4 shadow-sage-elegant mx-auto w-fit mb-6">
            <img
              src="/sage-logo-green.svg"
              alt="Sage 100"
              className="h-12 w-auto"
            />
          </div>
          <h2 className="text-3xl font-bold text-sage-dark">Activation du compte</h2>
          <p className="mt-2 text-muted-foreground">
            Définissez votre mot de passe pour activer votre compte
          </p>
        </div>

        {/* Informations utilisateur */}
        <div className="bg-white rounded-2xl shadow-sage-elegant p-6">
          <div className="flex items-center space-x-3 mb-6">
            <UserCheck className="h-6 w-6 text-sage-primary" />
            <div>
              <h3 className="font-semibold text-sage-dark">Informations du compte</h3>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nom :</span>
              <span className="font-medium">{userData.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email :</span>
              <span className="font-medium">{userData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Société :</span>
              <span className="font-medium">{userData.company}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rôle :</span>
              <span className="font-medium capitalize">
                {userData.role === 'admin' ? 'Administrateur' : 'Client'}
              </span>
            </div>
          </div>
        </div>

        {/* Formulaire d'activation */}
        <div className="bg-white rounded-2xl shadow-sage-elegant p-8">
          {message && (
            <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-start">
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                )}
                <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {message.text}
                </AlertDescription>
              </div>
            </Alert>
          )}

          <div className="space-y-6">
            <div>
              <Label htmlFor="password" className="text-sage-dark font-medium">
                Mot de passe
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 border-sage-light focus:border-sage-primary"
                  placeholder="Minimum 8 caractères"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-sage-primary/60" />
                  ) : (
                    <Eye className="h-4 w-4 text-sage-primary/60" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-sage-dark font-medium">
                Confirmer le mot de passe
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10 border-sage-light focus:border-sage-primary"
                  placeholder="Confirmez votre mot de passe"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-sage-primary/60" />
                  ) : (
                    <Eye className="h-4 w-4 text-sage-primary/60" />
                  )}
                </button>
              </div>
            </div>

            <Button
              onClick={activateAccount}
              className="w-full bg-sage-primary hover:bg-sage-dark"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Activation en cours...
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Activer mon compte
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Besoin d'aide ? Contactez votre administrateur
          </p>
        </div>
      </div>
    </div>
  );
}