// types/supabase.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: { // Le type de données retourné par Supabase
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          company: string | null
          role: 'admin' | 'client'
          client_since: string | null
        }
        Insert: { // Le type pour insérer une nouvelle ligne
          id: string
          email: string
          role: 'admin' | 'client'
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          company?: string | null
          client_since?: string | null
        }
        Update: { // Le type pour mettre à jour une ligne
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          company?: string | null
          role?: 'admin' | 'client'
          client_since?: string | null
        }
      }
      services: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          icon: string | null
          price: string | null
          featured: boolean | null
          is_active: boolean | null
        }
        Insert: {
          title: string
          description: string
          icon?: string | null
          price?: string | null
          featured?: boolean | null
          is_active?: boolean | null
        }
        Update: {
          title?: string
          description?: string
          icon?: string | null
          price?: string | null
          featured?: boolean | null
          is_active?: boolean | null
        }
      }
      service_features: {
        Row: {
          id: string
          service_id: string
          name: string
          description: string | null
        }
        Insert: {
          service_id: string
          name: string
          description?: string | null
        }
        Update: {
          service_id?: string
          name?: string
          description?: string | null
        }
      }
      client_services: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          service_id: string
          title: string
          description: string
          service_date: string
          status: 'Planifié' | 'En cours' | 'Terminé' | 'Annulé' | null
          notes: string | null
        }
        Insert: {
          user_id: string
          service_id: string
          title: string
          description: string
          service_date: string
          status?: 'Planifié' | 'En cours' | 'Terminé' | 'Annulé' | null
          notes?: string | null
        }
        Update: {
          user_id?: string
          service_id?: string
          title?: string
          description?: string
          service_date?: string
          status?: 'Planifié' | 'En cours' | 'Terminé' | 'Annulé' | null
          notes?: string | null
        }
      }
      documents: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          client_service_id: string
          title: string
          description: string | null
          file_url: string
          file_type: string | null
          file_size: number | null
        }
        Insert: {
          client_service_id: string
          title: string
          file_url: string
          description?: string | null
          file_type?: string | null
          file_size?: number | null
        }
        Update: {
          client_service_id?: string
          title?: string
          description?: string | null
          file_url?: string
          file_type?: string | null
          file_size?: number | null
        }
      }
      meetings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
          description: string | null
          meeting_date: string
          status: 'Planifié' | 'Confirmé' | 'Annulé' | 'Terminé' | null
          location: string | null
        }
        Insert: {
          user_id: string
          title: string
          meeting_date: string
          description?: string | null
          status?: 'Planifié' | 'Confirmé' | 'Annulé' | 'Terminé' | null
          location?: string | null
        }
        Update: {
          user_id?: string
          title?: string
          description?: string | null
          meeting_date?: string
          status?: 'Planifié' | 'Confirmé' | 'Annulé' | 'Terminé' | null
          location?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          sender_id: string
          recipient_id: string
          content: string
          read: boolean
          parent_message_id: string | null
        }
        Insert: {
          sender_id: string
          recipient_id: string
          content: string
          read?: boolean
          parent_message_id?: string | null
        }
        Update: {
          content?: string
          read?: boolean
        }
      }
      testimonials: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          content: string
          rating: number
          service_id: string | null
          is_approved: boolean
          is_featured: boolean
        }
        Insert: {
          user_id: string
          content: string
          rating: number
          service_id?: string | null
          is_approved?: boolean
          is_featured?: boolean
        }
        Update: {
          content?: string
          rating?: number
          service_id?: string | null
          is_approved?: boolean
          is_featured?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Types exportés pour une utilisation plus facile
export type User = Database['public']['Tables']['users']['Row']
export type NewUser = Database['public']['Tables']['users']['Insert']
export type UpdateUser = Database['public']['Tables']['users']['Update']

export type Service = Database['public']['Tables']['services']['Row']
export type NewService = Database['public']['Tables']['services']['Insert']
export type UpdateService = Database['public']['Tables']['services']['Update']

export type ServiceFeature = Database['public']['Tables']['service_features']['Row']
export type NewServiceFeature = Database['public']['Tables']['service_features']['Insert']
export type UpdateServiceFeature = Database['public']['Tables']['service_features']['Update']

export type ClientService = Database['public']['Tables']['client_services']['Row']
export type NewClientService = Database['public']['Tables']['client_services']['Insert']
export type UpdateClientService = Database['public']['Tables']['client_services']['Update']

export type Document = Database['public']['Tables']['documents']['Row']
export type NewDocument = Database['public']['Tables']['documents']['Insert']
export type UpdateDocument = Database['public']['Tables']['documents']['Update']

export type Meeting = Database['public']['Tables']['meetings']['Row']
export type NewMeeting = Database['public']['Tables']['meetings']['Insert']
export type UpdateMeeting = Database['public']['Tables']['meetings']['Update']

export type Message = Database['public']['Tables']['messages']['Row']
export type NewMessage = Database['public']['Tables']['messages']['Insert']
export type UpdateMessage = Database['public']['Tables']['messages']['Update']

export type Testimonial = Database['public']['Tables']['testimonials']['Row']
export type NewTestimonial = Database['public']['Tables']['testimonials']['Insert']
export type UpdateTestimonial = Database['public']['Tables']['testimonials']['Update']
