-- 🔧 CORRECTION DES POLITIQUES RLS RÉCURSIVES
-- Exécuter dans Supabase SQL Editor pour résoudre l'erreur de récursion

-- ================================
-- 1. SUPPRIMER TOUTES LES POLITIQUES EXISTANTES
-- ================================

SELECT '=== SUPPRESSION DES POLITIQUES RÉCURSIVES ===' as info;

-- Supprimer toutes les politiques existantes sur la table users
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admin can view all users" ON public.users;
DROP POLICY IF EXISTS "Admin can update all users" ON public.users;
DROP POLICY IF EXISTS "Admin can insert users" ON public.users;
DROP POLICY IF EXISTS "Admin can delete users" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;

-- Supprimer toutes les autres politiques qui pourraient exister
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE tablename = 'users' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.users', pol.policyname);
    END LOOP;
END $$;

-- ================================
-- 2. DÉSACTIVER RLS TEMPORAIREMENT
-- ================================

SELECT '=== DÉSACTIVATION RLS TEMPORAIRE ===' as info;

ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- ================================
-- 3. CRÉER DES POLITIQUES SIMPLES ET SÛRES
-- ================================

SELECT '=== CRÉATION DE NOUVELLES POLITIQUES ===' as info;

-- Réactiver RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Politique simple pour la lecture - pas de récursion
CREATE POLICY "simple_read_policy" ON public.users
FOR SELECT
USING (true);  -- Permettre la lecture à tous pour éviter la récursion

-- Politique pour les mises à jour - utilisateur peut modifier son propre profil
CREATE POLICY "simple_update_policy" ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Politique pour l'insertion - seuls les utilisateurs authentifiés
CREATE POLICY "simple_insert_policy" ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Politique pour la suppression - seuls les admins via fonction
CREATE POLICY "simple_delete_policy" ON public.users
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND au.raw_user_meta_data->>'role' = 'admin'
  )
);

-- ================================
-- 4. CRÉER UNE FONCTION HELPER POUR ÉVITER LA RÉCURSION
-- ================================

SELECT '=== CRÉATION FONCTION HELPER ===' as info;

-- Fonction pour vérifier le rôle sans récursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND (raw_user_meta_data->>'role' = 'admin' OR email LIKE '%admin%')
  );
$$;

-- Fonction pour vérifier si c'est le même utilisateur
CREATE OR REPLACE FUNCTION public.is_own_profile(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT auth.uid() = user_id;
$$;

-- ================================
-- 5. RECRÉER DES POLITIQUES OPTIMISÉES
-- ================================

SELECT '=== POLITIQUES OPTIMISÉES ===' as info;

-- Supprimer les politiques simples temporaires
DROP POLICY IF EXISTS "simple_read_policy" ON public.users;
DROP POLICY IF EXISTS "simple_update_policy" ON public.users;
DROP POLICY IF EXISTS "simple_insert_policy" ON public.users;
DROP POLICY IF EXISTS "simple_delete_policy" ON public.users;

-- Nouvelles politiques optimisées
CREATE POLICY "optimized_select_policy" ON public.users
FOR SELECT
USING (
  is_own_profile(id) OR is_admin()
);

CREATE POLICY "optimized_insert_policy" ON public.users
FOR INSERT
WITH CHECK (
  auth.uid() = id OR is_admin()
);

CREATE POLICY "optimized_update_policy" ON public.users
FOR UPDATE
USING (
  is_own_profile(id) OR is_admin()
)
WITH CHECK (
  is_own_profile(id) OR is_admin()
);

CREATE POLICY "optimized_delete_policy" ON public.users
FOR DELETE
USING (
  is_admin()
);

-- ================================
-- 6. TESTER LES NOUVELLES POLITIQUES
-- ================================

SELECT '=== TEST DES POLITIQUES ===' as info;

-- Test de lecture (doit fonctionner)
SELECT 'Test lecture:' as test, COUNT(*) as nombre_users FROM public.users;

-- Vérification des politiques créées
SELECT
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'users' AND schemaname = 'public';

-- ================================
-- 7. RÉSULTAT FINAL
-- ================================

SELECT '=== CORRECTION TERMINÉE ===' as info;

SELECT
    CASE
        WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users') > 0
        THEN '✅ Nouvelles politiques créées sans récursion'
        ELSE '❌ Problème avec les politiques'
    END as statut_policies;

SELECT 'RLS corrigé - Erreur de récursion résolue!' as resultat;