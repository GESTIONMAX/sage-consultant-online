import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AdminClientsManager from '../components/admin/AdminClientsManager';
import AdminServicesManager from '../components/admin/AdminServicesManager';
import AdminTestimonialsManager from '../components/admin/AdminTestimonialsManager';
import AdminBlogManager from '../components/admin/AdminBlogManager';
import { Box, Tabs, Tab, Typography, CircularProgress, Alert } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est un administrateur
  useEffect(() => {
    // Ajouter des logs pour le débogage
    console.log('AdminDashboard - User:', user);
    console.log('AdminDashboard - User role:', user?.role);
    console.log('AdminDashboard - Loading:', loading);
    
    if (!loading && (!user || user.role !== 'admin')) {
      console.log('Accès non autorisé - Redirection');
      // Rediriger si l'utilisateur n'est pas un administrateur
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Accès non autorisé. Seuls les administrateurs peuvent accéder à cette page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin dashboard tabs">
          <Tab label="Clients" />
          <Tab label="Services" />
          <Tab label="Témoignages" />
          <Tab label="Blog" />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h4" gutterBottom>
          Gestion des clients
        </Typography>
        <AdminClientsManager />
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h4" gutterBottom>
          Gestion des services
        </Typography>
        <AdminServicesManager />
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h4" gutterBottom>
          Gestion des témoignages
        </Typography>
        <AdminTestimonialsManager />
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        <Typography variant="h4" gutterBottom>
          Gestion du blog
        </Typography>
        <AdminBlogManager />
      </TabPanel>
    </Box>
  );
}

export default AdminDashboard;
