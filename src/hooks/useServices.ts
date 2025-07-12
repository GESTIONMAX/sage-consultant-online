import { useState, useEffect } from 'react';
import { servicesApi } from '../services/api';
import type { Service, ServiceFeature } from '../types/supabase';

// Type pour le service avec ses fonctionnalités
export type ServiceWithFeatures = Service & {
  service_features: ServiceFeature[];
};

export function useServices() {
  const [services, setServices] = useState<ServiceWithFeatures[]>([]);
  const [featuredServices, setFeaturedServices] = useState<ServiceWithFeatures[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Charger tous les services
  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await servicesApi.getAll();
      setServices(data);
      setFeaturedServices(data.filter(service => service.featured));
      setError(null);
    } catch (err) {
      console.error('Error loading services:', err);
      setError(err instanceof Error ? err : new Error('Failed to load services'));
    } finally {
      setLoading(false);
    }
  };

  // Obtenir un service par ID
  const getServiceById = async (id: string) => {
    try {
      const service = await servicesApi.getById(id);
      return service;
    } catch (err) {
      console.error(`Error loading service with id ${id}:`, err);
      throw err;
    }
  };

  // Créer un nouveau service (pour les admins)
  const createService = async (service: {
    title: string;
    description: string;
    icon?: string;
    price?: string;
    featured?: boolean;
    is_active?: boolean;
  }) => {
    try {
      const newService = await servicesApi.create(service);
      
      // Mettre à jour l'état local
      setServices(prev => [...prev, { ...newService, service_features: [] }]);
      
      if (service.featured) {
        setFeaturedServices(prev => [...prev, { ...newService, service_features: [] }]);
      }
      
      return newService;
    } catch (err) {
      console.error('Error creating service:', err);
      throw err;
    }
  };

  // Ajouter une fonctionnalité à un service
  const addFeatureToService = async (serviceId: string, feature: {
    name: string;
    description?: string | null;
  }) => {
    try {
      const newFeature = await serviceFeaturesApi.create({
        service_id: serviceId,
        name: feature.name,
        description: feature.description,
      });
      
      // Mettre à jour l'état local
      setServices(prev => prev.map(service => {
        if (service.id === serviceId) {
          return {
            ...service,
            service_features: [...service.service_features, newFeature],
          };
        }
        return service;
      }));
      
      return newFeature;
    } catch (err) {
      console.error('Error adding feature to service:', err);
      throw err;
    }
  };

  // Mettre à jour un service
  const updateService = async (id: string, updates: {
    title?: string;
    description?: string;
    icon?: string;
    price?: string;
    featured?: boolean;
    is_active?: boolean;
  }) => {
    try {
      const updatedService = await servicesApi.update(id, updates);
      
      // Mettre à jour l'état local
      setServices(prev => prev.map(service => {
        if (service.id === id) {
          return { ...service, ...updatedService };
        }
        return service;
      }));
      
      // Mettre à jour les services en vedette si nécessaire
      if (updates.featured !== undefined) {
        if (updates.featured) {
          const serviceToFeature = services.find(s => s.id === id);
          if (serviceToFeature && !featuredServices.some(s => s.id === id)) {
            setFeaturedServices(prev => [...prev, serviceToFeature]);
          }
        } else {
          setFeaturedServices(prev => prev.filter(s => s.id !== id));
        }
      }
      
      return updatedService;
    } catch (err) {
      console.error('Error updating service:', err);
      throw err;
    }
  };

  // Supprimer un service
  const deleteService = async (id: string) => {
    try {
      await servicesApi.delete(id);
      
      // Mettre à jour l'état local
      setServices(prev => prev.filter(service => service.id !== id));
      setFeaturedServices(prev => prev.filter(service => service.id !== id));
      
      return true;
    } catch (err) {
      console.error('Error deleting service:', err);
      throw err;
    }
  };

  // Charger les services au chargement du composant
  useEffect(() => {
    loadServices();
  }, []);

  return {
    services,
    featuredServices,
    loading,
    error,
    loadServices,
    getServiceById,
    createService,
    addFeatureToService,
    updateService,
    deleteService,
  };
}

export default useServices;
