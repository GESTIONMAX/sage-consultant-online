import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Snackbar,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Types pour les articles de blog
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  author_id: string;
  author_name?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminBlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [open, setOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    cover_image: '',
    published: false
  });
  const [isEditing, setIsEditing] = useState(false);
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });
  
  // Charger les articles de blog
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          users:author_id (full_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Formater les données avec les noms d'auteurs
      const formattedData = data?.map(post => ({
        ...post,
        author_name: post.users?.full_name || 'Auteur inconnu'
      })) || [];
      
      setPosts(formattedData);
    } catch (error: any) {
      console.error('Erreur lors du chargement des articles:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Charger les articles au chargement du composant
  useEffect(() => {
    fetchPosts();
    
    // Vérifier si la table blog_posts existe, sinon la créer
    checkBlogTable();
  }, []);
  
  // Vérifier et créer la table blog_posts si nécessaire
  const checkBlogTable = async () => {
    try {
      // Vérifier si la table existe en essayant de récupérer un article
      const { error } = await supabase
        .from('blog_posts')
        .select('id')
        .limit(1);
      
      if (error && error.code === '42P01') { // Code PostgreSQL pour "relation does not exist"
        setError("La table des articles de blog n'existe pas encore. Veuillez contacter l'administrateur pour la créer.");
      }
    } catch (error: any) {
      console.error('Erreur lors de la vérification de la table blog:', error.message);
    }
  };
  
  // Ouvrir le modal d'ajout/édition
  const handleOpen = (post?: BlogPost) => {
    if (post) {
      setCurrentPost(post);
      setIsEditing(true);
    } else {
      setCurrentPost({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        cover_image: '',
        published: false
      });
      setIsEditing(false);
    }
    setOpen(true);
  };
  
  // Fermer le modal
  const handleClose = () => {
    setOpen(false);
  };
  
  // Gérer les changements de champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    if (name === 'published') {
      setCurrentPost(prev => ({ ...prev, [name]: checked }));
    } else {
      setCurrentPost(prev => ({ ...prev, [name]: value }));
    }
    
    // Générer automatiquement le slug à partir du titre
    if (name === 'title' && !isEditing) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      setCurrentPost(prev => ({ ...prev, slug }));
    }
  };
  
  // Gérer les changements dans l'éditeur de contenu
  const handleContentChange = (content: string) => {
    setCurrentPost(prev => ({ ...prev, content }));
  };
  
  // Gérer les changements dans l'éditeur d'extrait
  const handleExcerptChange = (excerpt: string) => {
    setCurrentPost(prev => ({ ...prev, excerpt }));
  };
  
  // Enregistrer un article (ajout ou mise à jour)
  const handleSave = async () => {
    try {
      if (!currentPost.title || !currentPost.content) {
        setSnackbar({
          open: true,
          message: 'Le titre et le contenu sont obligatoires',
          severity: 'error'
        });
        return;
      }
      
      const { id, ...postData } = currentPost;
      
      if (isEditing && id) {
        // Mise à jour d'un article existant
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);
        
        if (error) throw error;
        
        setSnackbar({
          open: true,
          message: 'Article mis à jour avec succès',
          severity: 'success'
        });
      } else {
        // Ajout d'un nouvel article
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;
        
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            ...postData,
            author_id: userId
          });
        
        if (error) throw error;
        
        setSnackbar({
          open: true,
          message: 'Article créé avec succès',
          severity: 'success'
        });
      }
      
      handleClose();
      fetchPosts();
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement:', error);
      setSnackbar({
        open: true,
        message: `Erreur: ${error.message}`,
        severity: 'error'
      });
    }
  };
  
  // Supprimer un article
  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        setSnackbar({
          open: true,
          message: 'Article supprimé avec succès',
          severity: 'success'
        });
        
        fetchPosts();
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
        setSnackbar({
          open: true,
          message: `Erreur: ${error.message}`,
          severity: 'error'
        });
      }
    }
  };
  
  // Modifier le statut de publication
  const togglePublished = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published: !post.published })
        .eq('id', post.id);
      
      if (error) throw error;
      
      setSnackbar({
        open: true,
        message: `Article ${!post.published ? 'publié' : 'dépublié'} avec succès`,
        severity: 'success'
      });
      
      fetchPosts();
    } catch (error: any) {
      console.error('Erreur lors de la modification du statut:', error);
      setSnackbar({
        open: true,
        message: `Erreur: ${error.message}`,
        severity: 'error'
      });
    }
  };
  
  // Fermer le snackbar
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Gestion des articles de blog
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleOpen()}
        >
          Ajouter un article
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Titre</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Auteur</TableCell>
                <TableCell>Date de création</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.slug}</TableCell>
                    <TableCell>{post.author_name}</TableCell>
                    <TableCell>
                      {new Date(post.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {post.published ? 'Publié' : 'Brouillon'}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          color={post.published ? "success" : "default"}
                          onClick={() => togglePublished(post)}
                          size="small"
                        >
                          {post.published ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpen(post)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(post.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1">
                      Aucun article trouvé. Commencez par en ajouter un !
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Modal d'ajout/édition d'article */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Modifier l\'article' : 'Ajouter un article'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Titre"
              name="title"
              value={currentPost.title || ''}
              onChange={handleChange}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Slug (URL)"
              name="slug"
              value={currentPost.slug || ''}
              onChange={handleChange}
              margin="normal"
              required
              helperText="Identifiant unique pour l'URL de l'article"
            />
            
            <TextField
              fullWidth
              label="Image de couverture (URL)"
              name="cover_image"
              value={currentPost.cover_image || ''}
              onChange={handleChange}
              margin="normal"
            />
            
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Extrait de l'article
              </Typography>
              <ReactQuill
                value={currentPost.excerpt || ''}
                onChange={handleExcerptChange}
                style={{ height: '100px', marginBottom: '50px' }}
              />
            </Box>
            
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Contenu de l'article
              </Typography>
              <ReactQuill
                value={currentPost.content || ''}
                onChange={handleContentChange}
                style={{ height: '200px', marginBottom: '50px' }}
              />
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={currentPost.published || false}
                  onChange={handleChange}
                  name="published"
                />
              }
              label="Publier l'article"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
