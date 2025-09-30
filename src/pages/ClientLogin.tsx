import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthSimple as useAuth } from '../hooks/useAuth-simple';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, Mail, Lock, User } from 'lucide-react';

export default function ClientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { error } = await signInWithEmail(email, password);

      if (error) {
        setError('Identifiants incorrects. Veuillez réessayer.');
        return;
      }

      // Redirection vers l'espace client
      navigate('/client-dashboard');
    } catch (err) {
      console.error('Erreur de connexion:', err);
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
            Espace Client
          </h2>
          <p className="mt-2 text-muted-foreground">
            Accédez à votre espace personnel Sage 100
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sage-dark font-medium">
                Adresse email
              </Label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-sage-primary/60" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10 border-sage-light focus:border-sage-primary focus:ring-sage-primary"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sage-dark font-medium">
                Mot de passe
              </Label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-sage-primary/60" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="pl-10 border-sage-light focus:border-sage-primary focus:ring-sage-primary"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
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
                  Connexion...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Se connecter
                </>
              )}
            </Button>

            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-sage-primary hover:text-sage-secondary transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </form>

          {/* Informations supplémentaires */}
          <div className="mt-8 pt-6 border-t border-sage-light/50">
            <div className="text-center space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Vous n'avez pas encore de compte ?
                </p>
                <p className="text-sm text-sage-dark">
                  Contactez-nous pour obtenir un accès à votre espace client.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/contact">
                  <Button variant="outline" className="border-sage-primary text-sage-primary hover:bg-sage-light">
                    Nous contacter
                  </Button>
                </Link>

                <Link to="/">
                  <Button variant="ghost" className="text-sage-dark hover:bg-sage-light">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à l'accueil
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Connexion sécurisée • Données protégées
          </p>
        </div>
      </div>
    </div>
  );
}
