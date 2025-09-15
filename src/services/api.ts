import { supabase } from '../lib/supabase';
import type {
  User, UpdateUser,
  Service, NewService, UpdateService,
  ServiceFeature, NewServiceFeature,
  ClientService, NewClientService, UpdateClientService,
  Document, NewDocument, UpdateDocument,
  Meeting, NewMeeting, UpdateMeeting,
  Message, NewMessage,
  Testimonial, NewTestimonial, UpdateTestimonial
} from '../types/supabase';

// API pour les utilisateurs
export const usersApi = {
  // Obtenir l'utilisateur actuel
  getCurrentUser: async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!sessionData.session) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', sessionData.session.user.id)
      .single();
      
    if (error) throw error;
    return data as User;
  },

  // Obtenir un utilisateur par son ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as User;
  },

  // Mettre à jour un utilisateur
  update: async (id: string, updates: UpdateUser) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data as User;
  },
};

// API pour les services
export const servicesApi = {
  // Obtenir tous les services
  getAll: async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*, service_features(*)');
      
    if (error) throw error;
    return data as (Service & { service_features: ServiceFeature[] })[];
  },

  // Obtenir un service par son ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('services')
      .select('*, service_features(*)')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as Service & { service_features: ServiceFeature[] };
  },

  // Créer un nouveau service
  create: async (service: NewService) => {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single();
      
    if (error) throw error;
    return data as Service;
  },

  // Mettre à jour un service
  update: async (id: string, updates: UpdateService) => {
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data as Service;
  },

  // Supprimer un service
  delete: async (id: string) => {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  },
};

// API pour les fonctionnalités de service
export const serviceFeaturesApi = {
  // Créer une nouvelle fonctionnalité pour un service
  create: async (feature: NewServiceFeature) => {
    const { data, error } = await supabase
      .from('service_features')
      .insert(feature)
      .select()
      .single();
      
    if (error) throw error;
    return data as ServiceFeature;
  },

  // Supprimer une fonctionnalité
  delete: async (id: string) => {
    const { error } = await supabase
      .from('service_features')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  },
};

// API pour les services des clients
export const clientServicesApi = {
  // Obtenir tous les services d'un client
  getByClientId: async (userId: string) => {
    const { data, error } = await supabase
      .from('client_services')
      .select('*, documents(*)')
      .eq('user_id', userId);
      
    if (error) throw error;
    return data as (ClientService & { documents: Document[] })[];
  },

  // Obtenir un service client par son ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('client_services')
      .select('*, documents(*)')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as ClientService & { documents: Document[] };
  },

  // Créer un nouveau service client
  create: async (clientService: NewClientService) => {
    const { data, error } = await supabase
      .from('client_services')
      .insert(clientService)
      .select()
      .single();
      
    if (error) throw error;
    return data as ClientService;
  },

  // Mettre à jour un service client
  update: async (id: string, updates: UpdateClientService) => {
    const { data, error } = await supabase
      .from('client_services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data as ClientService;
  },

  // Supprimer un service client
  delete: async (id: string) => {
    const { error } = await supabase
      .from('client_services')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  },
};

// API pour les documents
export const documentsApi = {
  // Obtenir tous les documents pour un service client
  getByClientServiceId: async (clientServiceId: string) => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('client_service_id', clientServiceId);
      
    if (error) throw error;
    return data as Document[];
  },

  // Créer un nouveau document
  create: async (document: NewDocument) => {
    const { data, error } = await supabase
      .from('documents')
      .insert(document)
      .select()
      .single();
      
    if (error) throw error;
    return data as Document;
  },

  // Mettre à jour un document
  update: async (id: string, updates: UpdateDocument) => {
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data as Document;
  },

  // Supprimer un document
  delete: async (id: string) => {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  },

  // Upload un fichier au stockage Supabase
  uploadFile: async (file: File, path: string) => {
    const { error } = await supabase
      .storage
      .from('documents')
      .upload(path, file);

    if (error) throw error;

    // Obtenir l'URL publique du fichier
    const { data: urlData } = supabase
      .storage
      .from('documents')
      .getPublicUrl(path);

    return urlData.publicUrl;
  },
};

// API pour les réunions
export const meetingsApi = {
  // Obtenir toutes les réunions d'un client
  getByClientId: async (userId: string) => {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw error;
    return data as Meeting[];
  },

  // Obtenir toutes les réunions pour l'administrateur
  getAllForAdmin: async () => {
    const { data, error } = await supabase
      .from('meetings')
      .select('*, users!inner(full_name, email)');
      
    if (error) throw error;
    return data;
  },

  // Créer une nouvelle réunion
  create: async (meeting: NewMeeting) => {
    const { data, error } = await supabase
      .from('meetings')
      .insert(meeting)
      .select()
      .single();
      
    if (error) throw error;
    return data as Meeting;
  },

  // Mettre à jour une réunion
  update: async (id: string, updates: UpdateMeeting) => {
    const { data, error } = await supabase
      .from('meetings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data as Meeting;
  },

  // Supprimer une réunion
  delete: async (id: string) => {
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  },
};

// API pour les messages
export const messagesApi = {
  // Obtenir tous les messages pour un utilisateur (envoyés et reçus)
  getByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:sender_id(full_name, avatar_url), recipient:recipient_id(full_name, avatar_url)')
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  // Obtenir une conversation entre deux utilisateurs
  getConversation: async (userId1: string, userId2: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:sender_id(full_name, avatar_url), recipient:recipient_id(full_name, avatar_url)')
      .or(`and(sender_id.eq.${userId1},recipient_id.eq.${userId2}),and(sender_id.eq.${userId2},recipient_id.eq.${userId1})`)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    return data;
  },

  // Créer un nouveau message
  create: async (message: NewMessage) => {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();
      
    if (error) throw error;
    return data as Message;
  },

  // Marquer un message comme lu
  markAsRead: async (id: string) => {
    const { data, error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data as Message;
  },

  // Écouter les nouveaux messages (temps réel)
  subscribeToNewMessages: (userId: string, callback: (message: Message) => void) => {
    return supabase
      .channel('messages_channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${userId}`,
      }, (payload) => {
        callback(payload.new as Message);
      })
      .subscribe();
  },
};

// API pour les témoignages
export const testimonialsApi = {
  // Obtenir tous les témoignages approuvés (publics)
  getApproved: async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*, users(full_name, avatar_url), services(title)')
      .eq('is_approved', true);
      
    if (error) throw error;
    return data;
  },

  // Obtenir les témoignages mis en avant
  getFeatured: async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*, users(full_name, avatar_url), services(title)')
      .eq('is_approved', true)
      .eq('is_featured', true);
      
    if (error) throw error;
    return data;
  },

  // Obtenir les témoignages d'un utilisateur
  getByUserId: async (userId: string) => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*, services(title)')
      .eq('user_id', userId);
      
    if (error) throw error;
    return data;
  },

  // Créer un nouveau témoignage
  create: async (testimonial: NewTestimonial) => {
    const { data, error } = await supabase
      .from('testimonials')
      .insert(testimonial)
      .select()
      .single();
      
    if (error) throw error;
    return data as Testimonial;
  },

  // Approuver un témoignage (admin seulement)
  approve: async (id: string, isFeatured: boolean = false) => {
    const { data, error } = await supabase
      .from('testimonials')
      .update({ 
        is_approved: true,
        is_featured: isFeatured
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data as Testimonial;
  },

  // Mettre à jour un témoignage
  update: async (id: string, updates: UpdateTestimonial) => {
    const { data, error } = await supabase
      .from('testimonials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data as Testimonial;
  },

  // Supprimer un témoignage
  delete: async (id: string) => {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  },
};

// Export par défaut avec tous les APIs
export default {
  users: usersApi,
  services: servicesApi,
  serviceFeatures: serviceFeaturesApi,
  clientServices: clientServicesApi,
  documents: documentsApi,
  meetings: meetingsApi,
  messages: messagesApi,
  testimonials: testimonialsApi,
};
