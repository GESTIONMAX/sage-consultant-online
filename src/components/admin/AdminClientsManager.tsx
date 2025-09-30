import { useState, useEffect } from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { supabase } from '../../lib/supabase';
import type { UpdateUser } from '../../types/supabase';

interface UserWithServices {
  id: string;
  email: string;
  full_name: string | null;
  company: string | null;
  role: 'admin' | 'client';
  client_since: string | null;
  serviceCount: number;
}

export default function AdminClientsManager() {
  const [users, setUsers] = useState<UserWithServices[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UpdateUser | null>(null);
  const [filter, setFilter] = useState('');

  // Charger tous les utilisateurs
  const loadUsers = async () => {
    try {
      setLoading(true);
      // Récupérer tous les utilisateurs
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*');
        
      if (usersError) throw usersError;

      // Pour chaque utilisateur, compter le nombre de services associés
      const usersWithServiceCount = await Promise.all(
        (usersData || []).map(async (user) => {
          const { count, error: countError } = await supabase
            .from('client_services')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
            
          if (countError) throw countError;
          
          return {
            ...user,
            serviceCount: count || 0
          };
        })
      );

      setUsers(usersWithServiceCount);
      setError(null);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEditUser = (user: UserWithServices) => {
    setSelectedUser({
      email: user.email,
      full_name: user.full_name,
      company: user.company,
      role: user.role,
      client_since: user.client_since
    });
    setOpenDialog(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        // Vérifier s'il a des services associés
        const { count } = await supabase
          .from('client_services')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', id);
          
        if (count && count > 0) {
          alert(`Impossible de supprimer cet utilisateur car il a ${count} services associés.`);
          return;
        }
        
        // Supprimer l'utilisateur de la table users
        const { error: deleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', id);
          
        if (deleteError) throw deleteError;
        
        // Mettre à jour l'état local
        setUsers(users.filter(user => user.id !== id));
        
        alert('Utilisateur supprimé avec succès');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Erreur lors de la suppression de l\'utilisateur');
      }
    }
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    
    try {
      const userId = users.find(u => u.email === selectedUser.email)?.id;
      
      if (!userId) {
        throw new Error('Utilisateur non trouvé');
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: selectedUser.full_name,
          company: selectedUser.company,
          role: selectedUser.role,
          client_since: selectedUser.client_since
        })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Recharger les utilisateurs
      await loadUsers();
      
      setOpenDialog(false);
      setSelectedUser(null);
      
      alert('Utilisateur mis à jour avec succès');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Erreur lors de la mise à jour de l\'utilisateur');
    }
  };

  const filteredUsers = users.filter(user => {
    const searchTerm = filter.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchTerm) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm)) ||
      (user.company && user.company.toLowerCase().includes(searchTerm))
    );
  });

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          label="Rechercher"
          variant="outlined"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          size="small"
          sx={{ width: '300px' }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Nom complet</TableCell>
              <TableCell>Entreprise</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Client depuis</TableCell>
              <TableCell>Nombre de services</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography>Aucun utilisateur trouvé</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.full_name || '-'}</TableCell>
                  <TableCell>{user.company || '-'}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.client_since ? new Date(user.client_since).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>{user.serviceCount}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditUser(user)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteUser(user.id)} 
                      size="small"
                      disabled={user.serviceCount > 0}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogue d'édition utilisateur */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Modifier l'utilisateur</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={selectedUser?.email || ''}
            disabled
          />
          <TextField
            margin="dense"
            label="Nom complet"
            type="text"
            fullWidth
            value={selectedUser?.full_name || ''}
            onChange={(e) => setSelectedUser(prev => prev ? {...prev, full_name: e.target.value} : null)}
          />
          <TextField
            margin="dense"
            label="Entreprise"
            type="text"
            fullWidth
            value={selectedUser?.company || ''}
            onChange={(e) => setSelectedUser(prev => prev ? {...prev, company: e.target.value} : null)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Rôle</InputLabel>
            <Select
              value={selectedUser?.role || 'client'}
              label="Rôle"
              onChange={(e) => setSelectedUser(prev => prev ? {...prev, role: e.target.value as 'admin' | 'client'} : null)}
            >
              <MenuItem value="admin">Administrateur</MenuItem>
              <MenuItem value="client">Client</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Client depuis"
            type="date"
            fullWidth
            value={selectedUser?.client_since ? new Date(selectedUser.client_since).toISOString().split('T')[0] : ''}
            onChange={(e) => setSelectedUser(prev => prev ? {...prev, client_since: e.target.value} : null)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleSaveUser} variant="contained">Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
