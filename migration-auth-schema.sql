-- Migration pour aligner le schéma d'authentification
-- Exécuter ces requêtes dans l'ordre pour mettre à jour la base de données

-- 1. Ajouter les colonnes manquantes à la table users
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'active';

-- 2. Corriger la table service_features pour correspondre aux types TypeScript
-- Renommer la colonne feature_text en name pour correspondre aux types
ALTER TABLE service_features RENAME COLUMN feature_text TO name;
-- Ajouter la colonne description manquante
ALTER TABLE service_features ADD COLUMN IF NOT EXISTS description TEXT;

-- 3. Corriger la table client_services pour correspondre aux types TypeScript
-- Ajouter la colonne service_id manquante (foreign key vers services)
ALTER TABLE client_services ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES services(id);

-- 4. Corriger la table documents pour correspondre aux types TypeScript
-- Renommer les colonnes pour correspondre aux types
DO $$
BEGIN
  -- Vérifier si la colonne name existe avant de la renommer
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'name') THEN
    ALTER TABLE documents RENAME COLUMN name TO title;
  END IF;

  -- Vérifier si la colonne type existe avant de la renommer
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'type') THEN
    ALTER TABLE documents RENAME COLUMN type TO file_type;
  END IF;

  -- Vérifier si la colonne file_path existe avant de la renommer
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'file_path') THEN
    ALTER TABLE documents RENAME COLUMN file_path TO file_url;
  END IF;

  -- Vérifier si la colonne size existe avant de la renommer
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'size') THEN
    ALTER TABLE documents RENAME COLUMN size TO file_size;
  END IF;
END $$;

-- Ajouter les colonnes manquantes à la table documents
ALTER TABLE documents ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS description TEXT;

-- Créer un trigger pour updated_at sur documents
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_documents') THEN
    CREATE TRIGGER set_timestamp_documents
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END $$;

-- 5. Corriger la table meetings pour correspondre aux types TypeScript
-- Supprimer les colonnes non utilisées dans les types TypeScript
ALTER TABLE meetings DROP COLUMN IF EXISTS client_service_id;
ALTER TABLE meetings DROP COLUMN IF EXISTS meeting_time;
ALTER TABLE meetings DROP COLUMN IF EXISTS type;
ALTER TABLE meetings DROP COLUMN IF EXISTS notes;

-- Ajouter la colonne description manquante
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS description TEXT;

-- Corriger les valeurs de statut pour correspondre aux types TypeScript
UPDATE meetings SET status = 'Planifié' WHERE status = 'À venir';
UPDATE meetings SET status = 'Confirmé' WHERE status = 'Planifié' AND status != 'Planifié';

-- Mettre à jour la contrainte de statut
ALTER TABLE meetings DROP CONSTRAINT IF EXISTS meetings_status_check;
ALTER TABLE meetings ADD CONSTRAINT meetings_status_check
  CHECK (status IN ('Planifié', 'Confirmé', 'Annulé', 'Terminé'));

-- 6. Corriger la table messages pour correspondre aux types TypeScript
-- Supprimer les colonnes non utilisées
ALTER TABLE messages DROP COLUMN IF EXISTS title;
ALTER TABLE messages DROP COLUMN IF EXISTS status;

-- Ajouter la colonne read manquante
ALTER TABLE messages ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT false;

-- 7. Corriger la table testimonials pour correspondre aux types TypeScript
-- Supprimer les colonnes non utilisées dans les types TypeScript
ALTER TABLE testimonials DROP COLUMN IF EXISTS name;
ALTER TABLE testimonials DROP COLUMN IF EXISTS role;
ALTER TABLE testimonials DROP COLUMN IF EXISTS company;

-- Ajouter la colonne service_id manquante
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES services(id);

-- 8. Mettre à jour les politiques RLS pour refléter les nouveaux champs

-- Politique pour les documents avec les nouveaux noms de colonnes
DROP POLICY IF EXISTS "Clients can view their own documents" ON documents;
CREATE POLICY "Clients can view their own documents"
ON documents FOR SELECT
USING (EXISTS (
  SELECT 1 FROM client_services
  WHERE client_services.id = documents.client_service_id
  AND client_services.user_id = auth.uid()
));

-- Politique pour les messages avec la nouvelle colonne read
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
CREATE POLICY "Users can update their own messages"
ON messages FOR UPDATE
USING (auth.uid() = sender_id OR auth.uid() = recipient_id)
WITH CHECK (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- 9. Mettre à jour la fonction handle_new_user pour inclure les nouveaux champs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, client_since, status, last_login)
  VALUES (NEW.id, NEW.email, 'client', CURRENT_DATE, 'active', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Ajouter des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);
CREATE INDEX IF NOT EXISTS idx_client_services_user_id ON client_services(user_id);
CREATE INDEX IF NOT EXISTS idx_client_services_service_id ON client_services(service_id);
CREATE INDEX IF NOT EXISTS idx_documents_client_service_id ON documents(client_service_id);
CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON meetings(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_user_id ON testimonials(user_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_service_id ON testimonials(service_id);

-- 11. Ajouter des commentaires pour documenter le schéma
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

-- Fin de la migration