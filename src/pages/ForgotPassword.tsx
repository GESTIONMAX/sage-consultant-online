import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';

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
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Mot de passe oublié
          </Typography>
          
          {message && (
            <Alert severity={message.type} sx={{ width: '100%', mb: 2 }}>
              {message.text}
            </Alert>
          )}
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Entrez l'adresse email associée à votre compte et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Envoyer le lien de réinitialisation'}
            </Button>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                component={Link}
                to="/client-login" 
                variant="text" 
                size="small"
              >
                Retour à la connexion
              </Button>
              
              <Button 
                component={Link}
                to="/" 
                variant="text" 
                size="small"
                color="inherit"
              >
                Accueil
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
