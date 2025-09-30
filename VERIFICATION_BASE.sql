-- 🔍 SCRIPT DE VÉRIFICATION ET SYNCHRONISATION AUTOMATIQUE
-- À exécuter dans Supabase SQL Editor

-- ================================
-- 1. VÉRIFICATION DE LA STRUCTURE
-- ================================

SELECT '=== VÉRIFICATION STRUCTURE TABLE users ===' as info;

-- Vérifier la structure de la table users
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- ================================
-- 2. MISE À JOUR DE LA STRUCTURE (si nécessaire)
-- ================================

SELECT '=== MISE À JOUR STRUCTURE ===' as info;

-- Ajouter les colonnes manquantes
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS last_login timestamp,
ADD COLUMN IF NOT EXISTS status varchar(20) DEFAULT 'active';

-- Mettre à jour les valeurs par défaut pour les enregistrements existants
UPDATE public.users
SET status = 'active'
WHERE status IS NULL;

-- ================================
-- 3. CRÉATION/VÉRIFICATION DES INDEX
-- ================================

SELECT '=== CRÉATION INDEX ===' as info;

CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- ================================
-- 4. VÉRIFICATION DES TRIGGERS
-- ================================

SELECT '=== VÉRIFICATION TRIGGERS ===' as info;

-- Vérifier les triggers existants
SELECT
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'users' OR trigger_name LIKE '%user%';

-- ================================
-- 5. ÉTAT ACTUEL DES DONNÉES
-- ================================

SELECT '=== ÉTAT ACTUEL DES DONNÉES ===' as info;

-- Compter les utilisateurs par rôle et statut
SELECT
    role,
    status,
    COUNT(*) as nombre_utilisateurs
FROM public.users
GROUP BY role, status
ORDER BY role, status;

-- Voir tous les utilisateurs
SELECT
    email,
    role,
    status,
    full_name,
    company,
    client_since,
    last_login
FROM public.users
ORDER BY client_since DESC;

-- ================================
-- 6. VÉRIFICATION AUTH.USERS vs PUBLIC.USERS
-- ================================

SELECT '=== SYNCHRONISATION AUTH vs PUBLIC ===' as info;

-- Utilisateurs dans auth.users mais pas dans public.users
SELECT
    'Dans AUTH mais pas dans PUBLIC' as probleme,
    au.email
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- Utilisateurs dans public.users mais pas dans auth.users
SELECT
    'Dans PUBLIC mais pas dans AUTH' as probleme,
    pu.email
FROM public.users pu
LEFT JOIN auth.users au ON pu.id = au.id
WHERE au.id IS NULL;

-- ================================
-- 7. RÉSUMÉ FINAL
-- ================================

SELECT '=== RÉSUMÉ FINAL ===' as info;

-- Statistiques globales
SELECT
    (SELECT COUNT(*) FROM public.users) as total_public_users,
    (SELECT COUNT(*) FROM auth.users) as total_auth_users,
    (SELECT COUNT(*) FROM public.users WHERE role = 'admin') as admins,
    (SELECT COUNT(*) FROM public.users WHERE role = 'client') as clients,
    (SELECT COUNT(*) FROM public.users WHERE status = 'active') as users_actifs,
    (SELECT COUNT(*) FROM public.users WHERE status = 'pending') as users_pending;

-- Vérification finale
SELECT
    CASE
        WHEN (SELECT COUNT(*) FROM public.users WHERE role = 'admin') > 0
        THEN '✅ Au moins un admin existe'
        ELSE '❌ AUCUN ADMIN - Créer un admin d''urgence!'
    END as statut_admin,

    CASE
        WHEN (SELECT COUNT(*) FROM public.users) = (SELECT COUNT(*) FROM auth.users)
        THEN '✅ Tables synchronisées'
        ELSE '⚠️  Tables non synchronisées - Vérifier les données'
    END as statut_sync;

SELECT '=== SYNCHRONISATION TERMINÉE ===' as fin;