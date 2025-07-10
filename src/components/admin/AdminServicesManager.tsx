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
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon,
  AddCircleOutline as AddFeatureIcon
} from '@mui/icons-material';
import { supabase } from '../../lib/supabase';
import type { Service, ServiceFeature, NewService, UpdateService } from '../../types/supabase';

interface ServiceWithFeatures extends Service {
  service_features: ServiceFeature[];
}

export default function AdminServicesManager() {
  const [services, setServices] = useState<ServiceWithFeatures[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [openFeatureDialog, setOpenFeatureDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<NewService | UpdateService | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState({ name: '', description: '' });
  const [filter, setFilter] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Charger tous les services
  const loadServices = async () => {
    try {
      setLoading(true);
      // Récupérer les services avec leurs fonctionnalités
      const { data, error: servicesError } = await supabase
        .from('services')
        .select(`
          *,
          service_features(*)
        `);
        
      if (servicesError) throw servicesError;

      setServices(data || []);
      setError(null);
    } catch (err) {
      console.error('Error loading services:', err);
      setError('Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleAddService = () => {
    setSelectedService({
      title: '',
      description: '',
      icon: '',
      price: '',
      featured: false,
      is_active: true
    });
    setIsEditing(false);
    setOpenServiceDialog(true);
  };

  const handleEditService = (service: ServiceWithFeatures) => {
    setSelectedService({
      title: service.title,
      description: service.description,
      icon: service.icon || '',
      price: service.price || '',
      featured: service.featured || false,
      is_active: service.is_active || true
    });
    setSelectedServiceId(service.id);
    setIsEditing(true);
    setOpenServiceDialog(true);
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      try {
        // Vérifier si le service est associé à des clients
        const { count } = await supabase
          .from('client_services')
          .select('*', { count: 'exact', head: true })
          .eq('service_id', id);
          
        if (count && count > 0) {
          alert(`Impossible de supprimer ce service car il est associé à ${count} clients.`);
          return;
        }
        
        // Supprimer d'abord toutes les fonctionnalités associées
        const { error: featuresError } = await supabase
          .from('service_features')
          .delete()
          .eq('service_id', id);
          
        if (featuresError) throw featuresError;
        
        // Ensuite supprimer le service
        const { error: serviceError } = await supabase
          .from('services')
          .delete()
          .eq('id', id);
          
        if (serviceError) throw serviceError;
        
        // Mettre à jour l'état local
        setServices(services.filter(service => service.id !== id));
        
        alert('Service supprimé avec succès');
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Erreur lors de la suppression du service');
      }
    }
  };

  const handleAddFeature = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setNewFeature({ name: '', description: '' });
    setOpenFeatureDialog(true);
  };

  const handleDeleteFeature = async (featureId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette fonctionnalité ?')) {
      try {
        // Supprimer la fonctionnalité
        const { error } = await supabase
          .from('service_features')
          .delete()
          .eq('id', featureId);
          
        if (error) throw error;
        
        // Mettre à jour l'état local
        setServices(services.map(service => ({
          ...service,
          service_features: service.service_features.filter(feature => feature.id !== featureId)
        })));
        
        alert('Fonctionnalité supprimée avec succès');
      } catch (error) {
        console.error('Error deleting feature:', error);
        alert('Erreur lors de la suppression de la fonctionnalité');
      }
    }
  };

  const handleSaveService = async () => {
    if (!selectedService) return;
    
    try {
      if (isEditing && selectedServiceId) {
        // Mise à jour d'un service existant
        const { error } = await supabase
          .from('services')
          .update(selectedService)
          .eq('id', selectedServiceId);
          
        if (error) throw error;
      } else {
        // Création d'un nouveau service
        const { error } = await supabase
          .from('services')
          .insert(selectedService);
          
        if (error) throw error;
      }
      
      // Recharger les services
      await loadServices();
      
      setOpenServiceDialog(false);
      setSelectedService(null);
      setSelectedServiceId(null);
      
      alert(isEditing ? 'Service mis à jour avec succès' : 'Service créé avec succès');
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Erreur lors de l\'enregistrement du service');
    }
  };

  const handleSaveFeature = async () => {
    if (!selectedServiceId || !newFeature.name) return;
    
    try {
      // Ajouter une nouvelle fonctionnalité
      const { error } = await supabase
        .from('service_features')
        .insert({
          service_id: selectedServiceId,
          name: newFeature.name,
          description: newFeature.description || null
        });
        
      if (error) throw error;
      
      // Recharger les services
      await loadServices();
      
      setOpenFeatureDialog(false);
      setNewFeature({ name: '', description: '' });
      setSelectedServiceId(null);
      
      alert('Fonctionnalité ajoutée avec succès');
    } catch (error) {
      console.error('Error adding feature:', error);
      alert('Erreur lors de l\'ajout de la fonctionnalité');
    }
  };

  const filteredServices = services.filter(service => {
    const searchTerm = filter.toLowerCase();
    return (
      service.title.toLowerCase().includes(searchTerm) ||
      service.description.toLowerCase().includes(searchTerm)
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
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddService}
        >
          Ajouter un service
        </Button>
      </Box>

      {filteredServices.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Aucun service trouvé</Typography>
        </Paper>
      ) : (
        filteredServices.map((service) => (
          <Paper key={service.id} sx={{ mb: 3, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box>
                <Typography variant="h6">{service.title}</Typography>
                <Typography variant="body2" color="text.secondary">{service.description}</Typography>
                {service.price && (
                  <Typography variant="body1" sx={{ mt: 1 }}>Prix: {service.price}</Typography>
                )}
                <Box sx={{ mt: 1 }}>
                  {service.featured && <Chip label="En vedette" color="primary" size="small" sx={{ mr: 1 }} />}
                  {service.is_active ? 
                    <Chip label="Actif" color="success" size="small" /> : 
                    <Chip label="Inactif" color="error" size="small" />
                  }
                </Box>
              </Box>
              <Box>
                <IconButton onClick={() => handleEditService(service)} size="small">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteService(service.id)} size="small">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1">Fonctionnalités</Typography>
              <Button 
                size="small" 
                startIcon={<AddFeatureIcon />}
                onClick={() => handleAddFeature(service.id)}
              >
                Ajouter
              </Button>
            </Box>
            
            {service.service_features && service.service_features.length > 0 ? (
              <List dense>
                {service.service_features.map((feature) => (
                  <ListItem key={feature.id}>
                    <ListItemText 
                      primary={feature.name}
                      secondary={feature.description}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleDeleteFeature(feature.id)} size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Aucune fonctionnalité définie
              </Typography>
            )}
          </Paper>
        ))
      )}

      {/* Dialogue d'ajout/édition de service */}
      <Dialog open={openServiceDialog} onClose={() => setOpenServiceDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? 'Modifier le service' : 'Ajouter un service'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Titre"
            type="text"
            fullWidth
            required
            value={selectedService?.title || ''}
            onChange={(e) => setSelectedService(prev => prev ? {...prev, title: e.target.value} : null)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            required
            multiline
            rows={4}
            value={selectedService?.description || ''}
            onChange={(e) => setSelectedService(prev => prev ? {...prev, description: e.target.value} : null)}
          />
          <TextField
            margin="dense"
            label="Icône (nom de classe ou URL)"
            type="text"
            fullWidth
            value={selectedService?.icon || ''}
            onChange={(e) => setSelectedService(prev => prev ? {...prev, icon: e.target.value} : null)}
          />
          <TextField
            margin="dense"
            label="Prix"
            type="text"
            fullWidth
            value={selectedService?.price || ''}
            onChange={(e) => setSelectedService(prev => prev ? {...prev, price: e.target.value} : null)}
          />
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={selectedService?.featured || false}
                  onChange={(e) => setSelectedService(prev => prev ? {...prev, featured: e.target.checked} : null)}
                />
              }
              label="En vedette"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={selectedService?.is_active !== false} // default to true if undefined
                  onChange={(e) => setSelectedService(prev => prev ? {...prev, is_active: e.target.checked} : null)}
                />
              }
              label="Actif"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenServiceDialog(false)}>Annuler</Button>
          <Button onClick={handleSaveService} variant="contained">Enregistrer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue d'ajout de fonctionnalité */}
      <Dialog open={openFeatureDialog} onClose={() => setOpenFeatureDialog(false)}>
        <DialogTitle>Ajouter une fonctionnalité</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nom"
            type="text"
            fullWidth
            required
            value={newFeature.name}
            onChange={(e) => setNewFeature(prev => ({...prev, name: e.target.value}))}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={newFeature.description}
            onChange={(e) => setNewFeature(prev => ({...prev, description: e.target.value}))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFeatureDialog(false)}>Annuler</Button>
          <Button onClick={handleSaveFeature} variant="contained" disabled={!newFeature.name}>
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
