import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, Mail, Send, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: 'error', text: 'Veuillez entrer votre adresse email' });
      return;
    }

    try {
      setIsLoading(true);
      setMessage(null);

      const { error } = await resetPassword(email);

      if (error) {
        setMessage({ type: 'error', text: 'Une erreur est survenue. Veuillez vérifier votre adresse email.' });
        return;
      }

      setMessage({
        type: 'success',
        text: 'Un email de réinitialisation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception et suivre les instructions.'
      });
      setEmail('');
    } catch (err) {
      console.error('Erreur lors de la demande de réinitialisation:', err);
      setMessage({ type: 'error', text: 'Une erreur est survenue. Veuillez réessayer ultérieurement.' });
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
            Mot de passe oublié
          </h2>
          <p className="mt-2 text-muted-foreground text-center">
            Entrez votre adresse email pour recevoir un lien de réinitialisation
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
                  <Mail className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                )}
                <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {message.text}
                </AlertDescription>
              </div>
            </Alert>
          )}

          <div className="mb-6 p-4 bg-sage-light/30 rounded-lg border border-sage-light">
            <p className="text-sm text-sage-dark">
              <strong>Instructions :</strong> Saisissez l'adresse email associée à votre compte Sage 100.
              Vous recevrez un email sécurisé avec un lien pour créer un nouveau mot de passe.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sage-dark font-medium">
                Adresse email de votre compte
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
                  autoFocus
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
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer le lien de réinitialisation
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
                  Retour à la connexion
                </Button>
              </Link>

              <Link to="/">
                <Button variant="ghost" className="text-sage-dark hover:bg-sage-light">
                  Accueil du site
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Informations sécurité */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Email sécurisé • Lien valide 24h • Données protégées
          </p>
        </div>
      </div>
    </div>
  );
}
