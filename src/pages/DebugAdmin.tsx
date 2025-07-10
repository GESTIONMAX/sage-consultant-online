import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

export default function DebugAdmin() {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [existingUsers, setExistingUsers] = useState<any[]>([]);
  const [message, setMessage] = useState<{type: 'success' | 'error' | 'info', text: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);

  // Récupérer les utilisateurs existants
  const fetchUsers = async () => {
    setIsFetchingUsers(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      
      setExistingUsers(data || []);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      setMessage({
        type: 'error',
        text: `Erreur lors de la récupération des utilisateurs: ${err.message}`
      });
    } finally {
      setIsFetchingUsers(false);
    }
  };

  // Attribuer le rôle admin à un utilisateur
  const makeAdmin = async (userEmail: string) => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      // Vérifier si l'utilisateur existe dans la table users
      const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('*')
        .eq('email', userEmail)
        .single();
      
      if (selectError && selectError.code !== 'PGRST116') {
        throw new Error(`Erreur lors de la recherche de l'utilisateur: ${selectError.message}`);
      }
      
      if (existingUser) {
        // Mettre à jour le rôle de l'utilisateur existant
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', existingUser.id);
        
        if (updateError) throw new Error(`Erreur lors de la mise à jour du rôle: ${updateError.message}`);
        
        setMessage({
          type: 'success',
          text: `Le rôle de l'utilisateur ${userEmail} a été défini comme 'admin'`
        });
      } else {
        setMessage({
          type: 'error',
          text: `Aucun utilisateur trouvé avec l'email ${userEmail}`
        });
      }
      
      // Rafraîchir la liste des utilisateurs
      fetchUsers();
      
    } catch (err: any) {
      console.error('Erreur:', err);
      setMessage({
        type: 'error',
        text: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les utilisateurs au chargement de la page
  useEffect(() => {
    fetchUsers();
  }, []);

  // Afficher les informations de débogage
  useEffect(() => {
    console.log('DebugAdmin - User:', user);
    console.log('DebugAdmin - User role:', user?.role);
  }, [user]);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Outils d'administration
        </Typography>
        
        {message && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Utilisateur actuel
          </Typography>
          
          {loading ? (
            <CircularProgress size={20} />
          ) : user ? (
            <Box>
              <Typography>Email: {user.email}</Typography>
              <Typography>Rôle: {user.role || 'Non défini'}</Typography>
              <Typography>ID: {user.id}</Typography>
            </Box>
          ) : (
            <Alert severity="warning">
              Aucun utilisateur connecté
            </Alert>
          )}
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Attribuer le rôle administrateur
          </Typography>
          
          <Box component="form" onSubmit={(e) => {
            e.preventDefault();
            makeAdmin(email);
          }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email de l'utilisateur"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading || !email}
              sx={{ mt: 2 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Définir comme administrateur'}
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box>
          <Typography variant="h6" gutterBottom>
            Utilisateurs existants
          </Typography>
          
          <Button 
            variant="outlined"
            onClick={fetchUsers}
            disabled={isFetchingUsers}
            sx={{ mb: 2 }}
          >
            {isFetchingUsers ? <CircularProgress size={24} /> : 'Rafraîchir la liste'}
          </Button>
          
          {isFetchingUsers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          ) : existingUsers.length > 0 ? (
            <List>
              {existingUsers.map((user) => (
                <ListItem key={user.id} divider>
                  <ListItemText
                    primary={`${user.email} (${user.role || 'Aucun rôle'})`}
                    secondary={`ID: ${user.id} | Nom: ${user.full_name || 'Non spécifié'}`}
                  />
                  {user.role !== 'admin' && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => makeAdmin(user.email)}
                      disabled={isLoading}
                    >
                      Définir admin
                    </Button>
                  )}
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info">
              Aucun utilisateur trouvé
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
