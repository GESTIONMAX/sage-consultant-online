-- Création de la table blog_posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT false
);

-- Ajouter le trigger pour la mise à jour automatique de updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_blog_posts') THEN
    CREATE TRIGGER set_timestamp_blog_posts
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END $$;

-- Activer RLS sur la table blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les articles de blog
-- Tout le monde peut voir les articles publiés
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view published blog posts') THEN
    CREATE POLICY "Public can view published blog posts"
    ON blog_posts FOR SELECT
    USING (published = true);
  END IF;
END $$;

-- Les administrateurs peuvent voir tous les articles (publiés ou brouillons)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all blog posts') THEN
    CREATE POLICY "Admins can view all blog posts"
    ON blog_posts FOR SELECT
    USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
  END IF;
END $$;

-- Les auteurs peuvent voir leurs propres articles
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authors can view their own blog posts') THEN
    CREATE POLICY "Authors can view their own blog posts"
    ON blog_posts FOR SELECT
    USING (auth.uid() = author_id);
  END IF;
END $$;

-- Les administrateurs peuvent insérer des articles
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can insert blog posts') THEN
    CREATE POLICY "Admins can insert blog posts"
    ON blog_posts FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
  END IF;
END $$;

-- Les administrateurs peuvent mettre à jour tous les articles
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update all blog posts') THEN
    CREATE POLICY "Admins can update all blog posts"
    ON blog_posts FOR UPDATE
    USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
  END IF;
END $$;

-- Les administrateurs peuvent supprimer des articles
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can delete blog posts') THEN
    CREATE POLICY "Admins can delete blog posts"
    ON blog_posts FOR DELETE
    USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
  END IF;
END $$;

-- Index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts (published);
CREATE INDEX IF NOT EXISTS blog_posts_author_id_idx ON blog_posts (author_id);
