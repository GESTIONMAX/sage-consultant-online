import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Link as MuiLink
} from '@mui/material';

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
      navigate('/client');
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError('Une erreur est survenue lors de la connexion');
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
            Accès Espace Client
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Se connecter'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 1, mb: 2 }}>
              <RouterLink to="/forgot-password" style={{ textDecoration: 'none' }}>
                <Button
                  variant="text"
                  size="small"
                  color="primary"
                >
                  Mot de passe oublié ?
                </Button>
              </RouterLink>
            </Box>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Vous n'avez pas encore de compte ?
              </Typography>
              <Typography variant="body2">
                Contactez-nous pour obtenir un accès à votre espace client.
              </Typography>
              <Button 
                component={MuiLink}
                href="/contact" 
                variant="text" 
                sx={{ mt: 1 }}
              >
                Nous contacter
              </Button>
            </Box>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button 
                component={MuiLink}
                href="/" 
                variant="text" 
                color="inherit"
                size="small"
              >
                Retour à l'accueil
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
