-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  company TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
  client_since DATE,
  last_login TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'active'
);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check if trigger exists before creating it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_users') THEN
    CREATE TRIGGER set_timestamp_users
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END $$;

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  price TEXT,
  featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true
);

-- Check if trigger exists before creating it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_services') THEN
    CREATE TRIGGER set_timestamp_services
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END $$;

-- Service features table
CREATE TABLE IF NOT EXISTS service_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT
);

-- Client services table
CREATE TABLE IF NOT EXISTS client_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  service_date DATE NOT NULL,
  status TEXT CHECK (status IN ('Planifié', 'En cours', 'Terminé', 'Annulé')),
  notes TEXT
);

-- Check if trigger exists before creating it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_client_services') THEN
    CREATE TRIGGER set_timestamp_client_services
    BEFORE UPDATE ON client_services
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END $$;

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  client_service_id UUID REFERENCES client_services(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER
);

-- Documents trigger
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_documents') THEN
    CREATE TRIGGER set_timestamp_documents
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END $$;

-- Meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  meeting_date DATE NOT NULL,
  status TEXT CHECK (status IN ('Planifié', 'Confirmé', 'Annulé', 'Terminé')),
  location TEXT
);

-- Check if trigger exists before creating it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_meetings') THEN
    CREATE TRIGGER set_timestamp_meetings
    BEFORE UPDATE ON meetings
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END $$;

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  parent_message_id UUID REFERENCES messages(id)
);

-- Check if trigger exists before creating it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_messages') THEN
    CREATE TRIGGER set_timestamp_messages
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END $$;

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  service_id UUID REFERENCES services(id),
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false
);

-- Check if trigger exists before creating it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_testimonials') THEN
    CREATE TRIGGER set_timestamp_testimonials
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END $$;

-- Set up Row Level Security (RLS) policies
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for users table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own profile') THEN
    CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all profiles') THEN
    CREATE POLICY "Admins can view all profiles"
    ON users FOR SELECT
    USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update all profiles') THEN
    CREATE POLICY "Admins can update all profiles"
    ON users FOR UPDATE
    USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
  END IF;
END $$;

-- Create policies for services table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Services are viewable by everyone') THEN
    CREATE POLICY "Services are viewable by everyone"
    ON services FOR SELECT
    USING (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can insert services') THEN
    CREATE POLICY "Admins can insert services"
    ON services FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update services') THEN
    CREATE POLICY "Admins can update services"
    ON services FOR UPDATE
    USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can delete services') THEN
    CREATE POLICY "Admins can delete services"
    ON services FOR DELETE
    USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
  END IF;
END $$;

-- Create policies for service_features table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service features are viewable by everyone') THEN
    CREATE POLICY "Service features are viewable by everyone"
    ON service_features FOR SELECT
    USING (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage service features') THEN
    CREATE POLICY "Admins can manage service features"
    ON service_features
    USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
  END IF;
END $$;

-- Create policies for client_services table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Clients can view their own services') THEN
    CREATE POLICY "Clients can view their own services"
    ON client_services FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all client services') THEN
    CREATE POLICY "Admins can view all client services"
    ON client_services FOR SELECT
    USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage client services') THEN
    CREATE POLICY "Admins can manage client services"
    ON client_services
    USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
  END IF;
END $$;

-- Create policies for documents table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Clients can view their own documents') THEN
    CREATE POLICY "Clients can view their own documents"
    ON documents FOR SELECT
    USING (EXISTS (
      SELECT 1 FROM client_services
      WHERE client_services.id = documents.client_service_id
      AND client_services.user_id = auth.uid()
    ));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all documents') THEN
    CREATE POLICY "Admins can view all documents"
    ON documents FOR SELECT
    USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage documents') THEN
    CREATE POLICY "Admins can manage documents"
    ON documents
    USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
  END IF;
END $$;

-- Create policies for meetings table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Clients can view their own meetings') THEN
    CREATE POLICY "Clients can view their own meetings"
    ON meetings FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all meetings') THEN
    CREATE POLICY "Admins can view all meetings"
    ON meetings FOR SELECT
    USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage meetings') THEN
    CREATE POLICY "Admins can manage meetings"
    ON meetings
    USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
  END IF;
END $$;

-- Create policies for messages table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own messages') THEN
    CREATE POLICY "Users can view their own messages"
    ON messages FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all messages') THEN
    CREATE POLICY "Admins can view all messages"
    ON messages FOR SELECT
    USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can send messages') THEN
    CREATE POLICY "Users can send messages"
    ON messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own messages') THEN
    CREATE POLICY "Users can update their own messages"
    ON messages FOR UPDATE
    USING (auth.uid() = sender_id)
    WITH CHECK (auth.uid() = sender_id);
  END IF;
END $$;

-- Create policies for testimonials table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Approved testimonials are viewable by everyone') THEN
    CREATE POLICY "Approved testimonials are viewable by everyone"
    ON testimonials FOR SELECT
    USING (is_approved = true OR EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.id = testimonials.user_id
    ));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all testimonials') THEN
    CREATE POLICY "Admins can view all testimonials"
    ON testimonials FOR SELECT
    USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Clients can create testimonials') THEN
    CREATE POLICY "Clients can create testimonials"
    ON testimonials FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage testimonials') THEN
    CREATE POLICY "Admins can manage testimonials"
    ON testimonials
    USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
  END IF;
END $$;

-- Create function to handle user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, client_since, status, last_login)
  VALUES (NEW.id, NEW.email, 'client', CURRENT_DATE, 'active', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Add performance indexes for authentication and queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);
CREATE INDEX IF NOT EXISTS idx_users_email_role ON users(email, role);

CREATE INDEX IF NOT EXISTS idx_client_services_user_id ON client_services(user_id);
CREATE INDEX IF NOT EXISTS idx_client_services_service_id ON client_services(service_id);
CREATE INDEX IF NOT EXISTS idx_client_services_status ON client_services(status);
CREATE INDEX IF NOT EXISTS idx_client_services_date ON client_services(service_date);

CREATE INDEX IF NOT EXISTS idx_documents_client_service_id ON documents(client_service_id);
CREATE INDEX IF NOT EXISTS idx_documents_file_type ON documents(file_type);

CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON meetings(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(meeting_date);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

CREATE INDEX IF NOT EXISTS idx_testimonials_user_id ON testimonials(user_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_service_id ON testimonials(service_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);

CREATE INDEX IF NOT EXISTS idx_service_features_service_id ON service_features(service_id);
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(featured);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);

-- Add comments for documentation
COMMENT ON TABLE users IS 'Table des utilisateurs avec rôles admin/client et champs d authentification étendus';
COMMENT ON COLUMN users.role IS 'Rôle de l utilisateur: admin ou client';
COMMENT ON COLUMN users.status IS 'Statut du compte: active, inactive ou pending';
COMMENT ON COLUMN users.last_login IS 'Dernière connexion de l utilisateur';
COMMENT ON COLUMN users.client_since IS 'Date depuis laquelle l utilisateur est client';

COMMENT ON TABLE client_services IS 'Services associés aux clients avec référence au service principal';
COMMENT ON COLUMN client_services.service_id IS 'Référence vers le service principal dans la table services';

COMMENT ON TABLE documents IS 'Documents associés aux services clients avec métadonnées de fichier';
COMMENT ON COLUMN documents.file_url IS 'URL du fichier stocké';
COMMENT ON COLUMN documents.file_type IS 'Type MIME du fichier';
COMMENT ON COLUMN documents.file_size IS 'Taille du fichier en octets';

COMMENT ON TABLE meetings IS 'Rendez-vous et réunions avec les clients';
COMMENT ON COLUMN meetings.status IS 'Statut du rendez-vous: Planifié, Confirmé, Annulé ou Terminé';

COMMENT ON TABLE messages IS 'Système de messagerie entre admin et clients';
COMMENT ON COLUMN messages.read IS 'Indique si le message a été lu par le destinataire';

COMMENT ON TABLE testimonials IS 'Témoignages clients avec possibilité d association à un service';
COMMENT ON COLUMN testimonials.service_id IS 'Service associé au témoignage (optionnel)';
