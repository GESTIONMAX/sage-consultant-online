import { useState, useEffect } from 'react';
import { 
  Box, 
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Button,
  IconButton,
  TextField,
  Rating,
  Chip,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { 
  CheckCircle as ApproveIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { supabase } from '../../lib/supabase';

interface Testimonial {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  content: string;
  rating: number;
  service_id: string | null;
  is_approved: boolean;
  is_featured: boolean;
  user: {
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  };
  service?: {
    title: string;
  };
}

export default function AdminTestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Charger tous les témoignages
  const loadTestimonials = async () => {
    try {
      setLoading(true);
      // Récupérer tous les témoignages avec les informations utilisateur et service
      const { data, error: testimonialsError } = await supabase
        .from('testimonials')
        .select(`
          *,
          user:user_id(full_name, email, avatar_url),
          service:service_id(title)
        `)
        .order('created_at', { ascending: false });
        
      if (testimonialsError) throw testimonialsError;

      setTestimonials(data || []);
      setError(null);
    } catch (err) {
      console.error('Error loading testimonials:', err);
      setError('Erreur lors du chargement des témoignages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleApprove = async (id: string, featured: boolean = false) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ 
          is_approved: true,
          is_featured: featured
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Mettre à jour l'état local
      setTestimonials(testimonials.map(testimonial => {
        if (testimonial.id === id) {
          return { ...testimonial, is_approved: true, is_featured: featured };
        }
        return testimonial;
      }));
      
      alert('Témoignage approuvé avec succès');
    } catch (error) {
      console.error('Error approving testimonial:', error);
      alert('Erreur lors de l\'approbation du témoignage');
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_featured: featured })
        .eq('id', id);
        
      if (error) throw error;
      
      // Mettre à jour l'état local
      setTestimonials(testimonials.map(testimonial => {
        if (testimonial.id === id) {
          return { ...testimonial, is_featured: featured };
        }
        return testimonial;
      }));
      
      alert(featured ? 'Témoignage mis en avant' : 'Témoignage retiré de la mise en avant');
    } catch (error) {
      console.error('Error updating testimonial featured status:', error);
      alert('Erreur lors de la mise à jour du statut du témoignage');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
      try {
        const { error } = await supabase
          .from('testimonials')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        // Mettre à jour l'état local
        setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
        
        alert('Témoignage supprimé avec succès');
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        alert('Erreur lors de la suppression du témoignage');
      }
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setOpenDialog(true);
  };

  const handleSaveTestimonial = async () => {
    if (!selectedTestimonial) return;
    
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ 
          content: selectedTestimonial.content,
          rating: selectedTestimonial.rating,
          is_approved: selectedTestimonial.is_approved,
          is_featured: selectedTestimonial.is_featured
        })
        .eq('id', selectedTestimonial.id);
        
      if (error) throw error;
      
      // Mettre à jour l'état local
      setTestimonials(testimonials.map(testimonial => {
        if (testimonial.id === selectedTestimonial.id) {
          return { 
            ...testimonial, 
            content: selectedTestimonial.content,
            rating: selectedTestimonial.rating,
            is_approved: selectedTestimonial.is_approved,
            is_featured: selectedTestimonial.is_featured
          };
        }
        return testimonial;
      }));
      
      setOpenDialog(false);
      setSelectedTestimonial(null);
      
      alert('Témoignage mis à jour avec succès');
    } catch (error) {
      console.error('Error updating testimonial:', error);
      alert('Erreur lors de la mise à jour du témoignage');
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    // Filtrer par texte de recherche
    const searchTerm = filter.toLowerCase();
    const matchesSearch = 
      testimonial.content.toLowerCase().includes(searchTerm) ||
      (testimonial.user.full_name && testimonial.user.full_name.toLowerCase().includes(searchTerm)) ||
      testimonial.user.email.toLowerCase().includes(searchTerm) ||
      (testimonial.service && testimonial.service.title.toLowerCase().includes(searchTerm));
    
    // Filtrer par statut d'approbation si nécessaire
    const matchesStatus = showOnlyPending ? !testimonial.is_approved : true;
    
    return matchesSearch && matchesStatus;
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
        <FormControlLabel
          control={
            <Switch
              checked={showOnlyPending}
              onChange={(e) => setShowOnlyPending(e.target.checked)}
            />
          }
          label="Afficher seulement les témoignages en attente"
        />
      </Box>

      {filteredTestimonials.length === 0 ? (
        <Alert severity="info">Aucun témoignage trouvé</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredTestimonials.map((testimonial) => (
            <Grid item xs={12} md={6} key={testimonial.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1">
                      {testimonial.user.full_name || testimonial.user.email}
                    </Typography>
                    <Box>
                      {!testimonial.is_approved && (
                        <Chip label="En attente" color="warning" size="small" sx={{ mr: 1 }} />
                      )}
                      {testimonial.is_approved && (
                        <Chip label="Approuvé" color="success" size="small" sx={{ mr: 1 }} />
                      )}
                      {testimonial.is_featured && (
                        <Chip label="En vedette" color="primary" size="small" />
                      )}
                    </Box>
                  </Box>
                  
                  <Rating 
                    value={testimonial.rating} 
                    readOnly 
                    precision={0.5}
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                    icon={<StarIcon fontSize="inherit" />}
                  />
                  
                  {testimonial.service && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Service: {testimonial.service.title}
                    </Typography>
                  )}
                  
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    "{testimonial.content}"
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                    Date: {new Date(testimonial.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
                
                <CardActions>
                  <Button size="small" onClick={() => handleEdit(testimonial)}>
                    Modifier
                  </Button>
                  
                  {!testimonial.is_approved && (
                    <Button 
                      size="small" 
                      startIcon={<ApproveIcon />}
                      onClick={() => handleApprove(testimonial.id)}
                    >
                      Approuver
                    </Button>
                  )}
                  
                  <Button
                    size="small"
                    onClick={() => handleToggleFeatured(testimonial.id, !testimonial.is_featured)}
                  >
                    {testimonial.is_featured ? 'Retirer des vedettes' : 'Mettre en vedette'}
                  </Button>
                  
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleDelete(testimonial.id)}
                    sx={{ ml: 'auto' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Dialogue d'édition de témoignage */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>Modifier le témoignage</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <Typography component="legend">Note</Typography>
            <Rating
              value={selectedTestimonial?.rating || 0}
              precision={0.5}
              onChange={(_, newValue) => {
                if (newValue !== null && selectedTestimonial) {
                  setSelectedTestimonial({...selectedTestimonial, rating: newValue});
                }
              }}
            />
          </Box>
          
          <TextField
            margin="dense"
            label="Contenu"
            multiline
            rows={4}
            fullWidth
            value={selectedTestimonial?.content || ''}
            onChange={(e) => {
              if (selectedTestimonial) {
                setSelectedTestimonial({...selectedTestimonial, content: e.target.value});
              }
            }}
          />
          
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={selectedTestimonial?.is_approved || false}
                  onChange={(e) => {
                    if (selectedTestimonial) {
                      setSelectedTestimonial({...selectedTestimonial, is_approved: e.target.checked});
                    }
                  }}
                />
              }
              label="Approuvé"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={selectedTestimonial?.is_featured || false}
                  onChange={(e) => {
                    if (selectedTestimonial) {
                      setSelectedTestimonial({...selectedTestimonial, is_featured: e.target.checked});
                    }
                  }}
                />
              }
              label="En vedette"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleSaveTestimonial} variant="contained">Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
