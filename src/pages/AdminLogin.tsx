import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Link as MuiLink,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { Visibility, VisibilityOff, AdminPanelSettings } from '@mui/icons-material';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithEmail, user } = useAuth();

  // Rediriger vers le tableau de bord admin si déjà connecté en tant qu'admin
  if (user && user.role === 'admin') {
    navigate('/admin');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Tentative de connexion admin avec:', email);
      // Attendre la connexion
      const result = await signInWithEmail(email, password);
      console.log('Résultat de connexion:', result);

      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // Attendre un court instant pour permettre à useAuth de mettre à jour l'utilisateur
      setTimeout(() => {
        // L'état de l'utilisateur a été mis à jour automatiquement par useAuth
        // Le useEffect au début du composant redirigera vers /admin si l'utilisateur est admin
        if (user?.role === 'admin') {
          console.log('Utilisateur admin déjà détecté, redirection automatique');
          navigate('/admin');
        } else {
          console.log('Rôle utilisateur non admin ou pas encore chargé:', user?.role);
          setError('Accès refusé. Seuls les administrateurs peuvent se connecter ici. Si vous êtes administrateur, veuillez patienter ou rafraîchir la page.');
          setLoading(false);
        }
      }, 1000);

    } catch (err: any) {
      console.error('Erreur de connexion:', err);
      setError(err.message || 'Une erreur est survenue lors de la connexion');
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="xs">
      <Paper 
        elevation={3} 
        sx={{ 
          mt: 8, 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderTop: '5px solid #ffca28' // Bordure jaune pour indiquer espace admin
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          p: 1,
          bgcolor: 'rgba(255, 202, 40, 0.1)',
          borderRadius: 1
        }}>
          <AdminPanelSettings sx={{ color: '#ffca28', fontSize: 40, mr: 1 }} />
          <Typography component="h1" variant="h5">
            Connexion Administrateur
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
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
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: '#ffca28', color: '#212121', '&:hover': { bgcolor: '#ffb300' } }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Se connecter'}
          </Button>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <MuiLink component={RouterLink} to="/login" variant="body2">
              Connexion standard
            </MuiLink>
            
            <MuiLink component={RouterLink} to="/forgot-password" variant="body2">
              Mot de passe oublié ?
            </MuiLink>
          </Box>
        </Box>
      </Paper>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
        Accès réservé aux administrateurs uniquement
      </Typography>
    </Container>
  );
}
