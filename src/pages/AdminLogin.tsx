import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthSimple as useEnhancedAuth } from '../hooks/useAuth-simple';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Shield, ArrowLeft, Home } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithEmail, user, loading } = useEnhancedAuth();

  // Rediriger vers le dashboard admin si déjà connecté en tant qu'admin
  if (user && user.role === 'admin') {
    navigate('/admin-dashboard');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const { data, error: authError } = await signInWithEmail(email, password);

      if (authError) {
        setError(authError);
        return;
      }

      // Vérifier que l'utilisateur est admin
      if (!data?.user || data.user.role !== 'admin') {
        setError('Accès refusé. Seuls les administrateurs peuvent se connecter ici.');
        return;
      }

      navigate('/admin-dashboard');
    } catch (err: any) {
      console.error('Erreur de connexion admin:', err);
      setError('Une erreur est survenue lors de la connexion');
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
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Header avec Logo Sage et badge Admin */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-sage-elegant border-t-4 border-yellow-400">
              <img
                src="/sage-logo-green.svg"
                alt="Sage 100"
                className="h-12 w-auto"
              />
            </div>
          </div>

          {/* Badge Administrateur */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-400/90 text-yellow-900 rounded-full text-sm font-semibold shadow-lg">
              <Shield className="h-5 w-5 mr-2" />
              Espace Administrateur
            </div>
          </div>

          <h2 className="text-3xl font-bold text-sage-dark">
            Connexion Admin
          </h2>
          <p className="mt-2 text-muted-foreground text-center">
            Accès réservé aux administrateurs du système Sage 100
          </p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sage-elegant p-8 border border-sage-light">
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Sécurité :</strong> Cette interface est protégée et surveillée.
              Seuls les administrateurs autorisés peuvent y accéder.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sage-dark font-medium">
                Adresse email administrateur
              </Label>
              <div className="mt-1 relative">
                <Shield className="absolute left-3 top-3 h-5 w-5 text-sage-primary/60" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10 border-sage-light focus:border-sage-primary focus:ring-sage-primary"
                  placeholder="admin@votre-domaine.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sage-dark font-medium">
                Mot de passe sécurisé
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="pr-10 border-sage-light focus:border-sage-primary focus:ring-sage-primary"
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

            <Button
              type="submit"
              className="w-full bg-yellow-500 text-yellow-900 hover:bg-yellow-400 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Accéder à l'administration
                </>
              )}
            </Button>
          </form>

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t border-sage-light/50">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/client-login">
                <Button variant="outline" className="border-sage-primary text-sage-primary hover:bg-sage-light">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Connexion client
                </Button>
              </Link>

              <Link to="/">
                <Button variant="ghost" className="text-sage-dark hover:bg-sage-light">
                  <Home className="mr-2 h-4 w-4" />
                  Accueil du site
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Informations sécurité */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Connexion sécurisée • Accès surveillé • Données protégées
          </p>
        </div>
      </div>
    </div>
  );
}
