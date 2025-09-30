-- 🚨 SOLUTION D'URGENCE - DÉSACTIVER RLS COMPLÈTEMENT
-- À utiliser SEULEMENT si le script de correction ne fonctionne pas
-- ATTENTION: Cette solution désactive la sécurité RLS

-- ================================
-- SOLUTION D'URGENCE
-- ================================

SELECT '⚠️  DÉSACTIVATION RLS D''URGENCE ⚠️' as warning;

-- Supprimer TOUTES les politiques
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE tablename = 'users' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY %I ON public.users', pol.policyname);
    END LOOP;
END $$;

-- Désactiver complètement RLS sur la table users
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Donner les permissions nécessaires
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO anon;

-- Vérification
SELECT
    'RLS désactivé - Table accessible' as statut,
    COUNT(*) as nombre_users
FROM public.users;

SELECT '✅ Solution d''urgence appliquée - RLS désactivé' as resultat;

-- IMPORTANT: Réactiver RLS plus tard quand le problème sera résolu
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;