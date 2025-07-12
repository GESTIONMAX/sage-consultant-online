import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { updatePassword, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est dans un contexte de réinitialisation de mot de passe
    // La présence d'un paramètre type=recovery dans l'URL indique que nous sommes dans ce contexte
    const params = new URLSearchParams(window.location.search);
    const isRecoveryMode = params.get('type') === 'recovery';
    
    if (!isRecoveryMode && !session) {
      // Si l'utilisateur n'est pas dans un contexte de récupération et n'est pas connecté,
      // rediriger vers la page de connexion
      navigate('/client-login');
    }
  }, [session, navigate]);

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
      
      const { error } = await updatePassword(password);
      
      if (error) {
        setMessage({ type: 'error', text: 'Une erreur est survenue. Veuillez réessayer.' });
        return;
      }
      
      setMessage({ 
        type: 'success', 
        text: 'Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.' 
      });
      
      // Redirection vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate('/client-login');
      }, 3000);
      
    } catch (err) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', err);
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
            Réinitialisation du mot de passe
          </Typography>
          
          {message && (
            <Alert severity={message.type} sx={{ width: '100%', mb: 2 }}>
              {message.text}
            </Alert>
          )}
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Veuillez entrer votre nouveau mot de passe.
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Nouveau mot de passe"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmer le mot de passe"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Réinitialiser mon mot de passe'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
