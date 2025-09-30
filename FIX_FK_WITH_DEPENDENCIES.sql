-- 🔧 CORRECTION CONTRAINTES AVEC GESTION DES DÉPENDANCES
-- Résout l'erreur FK en gérant toutes les dépendances

-- ================================
-- 1. DIAGNOSTIC COMPLET
-- ================================

SELECT '=== DIAGNOSTIC DÉPENDANCES ===' as info;

-- Voir toutes les contraintes qui dépendent de users_pkey
SELECT
    conname as constraint_name,
    conrelid::regclass as table_name,
    confrelid::regclass as referenced_table,
    contype as constraint_type
FROM pg_constraint
WHERE confrelid = 'public.users'::regclass;

-- ================================
-- 2. SOLUTION ALTERNATIVE - NE PAS TOUCHER À LA PK
-- ================================

SELECT '=== SOLUTION ALTERNATIVE - GARDER LA PK ===' as info;

-- Au lieu de supprimer la PK, on va juste supprimer la FK vers auth.users
-- et créer une fonction qui gère l'insertion correctement

-- Identifier la contrainte FK exacte vers auth.users
SELECT
    conname as fk_name,
    conrelid::regclass as table_name,
    confrelid::regclass as referenced_table
FROM pg_constraint
WHERE conrelid = 'public.users'::regclass
    AND confrelid = 'auth.users'::regclass
    AND contype = 'f';

-- ================================
-- 3. SUPPRIMER SEULEMENT LA FK VERS AUTH.USERS
-- ================================

SELECT '=== SUPPRESSION FK VERS AUTH.USERS ===' as info;

-- Supprimer la contrainte FK spécifique vers auth.users (pas la PK!)
DO $$
DECLARE
    fk_name text;
BEGIN
    -- Trouver le nom exact de la FK vers auth.users
    SELECT conname INTO fk_name
    FROM pg_constraint
    WHERE conrelid = 'public.users'::regclass
        AND confrelid = 'auth.users'::regclass
        AND contype = 'f'
    LIMIT 1;

    -- Supprimer cette FK si elle existe
    IF fk_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.users DROP CONSTRAINT %I', fk_name);
        RAISE NOTICE 'Contrainte FK supprimée: %', fk_name;
    ELSE
        RAISE NOTICE 'Aucune FK vers auth.users trouvée';
    END IF;
END $$;

-- ================================
-- 4. FONCTION INVITATION ULTRA-ROBUSTE
-- ================================

SELECT '=== FONCTION INVITATION ROBUSTE ===' as info;

-- Fonction qui gère tous les cas de figure
CREATE OR REPLACE FUNCTION public.create_invitation_safe(
    p_email text,
    p_role text,
    p_full_name text,
    p_company text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id uuid;
    result jsonb;
BEGIN
    -- Vérifier si l'email existe déjà
    IF EXISTS (SELECT 1 FROM public.users WHERE email = p_email) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Cet email existe déjà'
        );
    END IF;

    -- Générer un ID unique
    new_user_id := gen_random_uuid();

    -- Tenter l'insertion avec gestion d'erreurs
    BEGIN
        INSERT INTO public.users (
            id,
            email,
            role,
            full_name,
            company,
            status,
            client_since
        ) VALUES (
            new_user_id,
            p_email,
            p_role,
            p_full_name,
            p_company,
            'pending',
            CURRENT_DATE
        );

        -- Succès
        result := jsonb_build_object(
            'success', true,
            'user_id', new_user_id,
            'email', p_email,
            'role', p_role,
            'full_name', p_full_name,
            'company', p_company,
            'status', 'pending'
        );

    EXCEPTION
        WHEN unique_violation THEN
            result := jsonb_build_object(
                'success', false,
                'error', 'Email déjà utilisé'
            );
        WHEN foreign_key_violation THEN
            result := jsonb_build_object(
                'success', false,
                'error', 'Erreur de contrainte - ID non valide'
            );
        WHEN others THEN
            result := jsonb_build_object(
                'success', false,
                'error', 'Erreur inconnue: ' || SQLERRM
            );
    END;

    RETURN result;
END;
$$;

-- Donner les permissions
GRANT EXECUTE ON FUNCTION public.create_invitation_safe TO authenticated;

-- ================================
-- 5. FONCTION DE NETTOYAGE (optionnelle)
-- ================================

SELECT '=== FONCTION NETTOYAGE ===' as info;

-- Fonction pour nettoyer les utilisateurs sans auth correspondant
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_users()
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count int;
BEGIN
    -- Supprimer les utilisateurs dans public.users qui n'ont pas d'entrée dans auth.users
    -- SEULEMENT s'ils ont le statut 'pending' (invitations non activées)
    DELETE FROM public.users
    WHERE status = 'pending'
        AND NOT EXISTS (
            SELECT 1 FROM auth.users au WHERE au.id = users.id
        );

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- ================================
-- 6. TEST DE LA FONCTION
-- ================================

SELECT '=== TEST FONCTION SÉCURISÉE ===' as info;

-- Test de la nouvelle fonction
SELECT create_invitation_safe(
    'test-fonction@example.com',
    'client',
    'Test Fonction',
    'Test Company'
) as test_result;

-- Nettoyer le test
DELETE FROM public.users WHERE email = 'test-fonction@example.com';

-- ================================
-- 7. VÉRIFICATION FINALE
-- ================================

SELECT '=== VÉRIFICATION FINALE ===' as info;

-- Vérifier qu'il n'y a plus de FK vers auth.users
SELECT
    CASE
        WHEN EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conrelid = 'public.users'::regclass
                AND confrelid = 'auth.users'::regclass
                AND contype = 'f'
        )
        THEN '⚠️ FK vers auth.users existe encore'
        ELSE '✅ FK vers auth.users supprimée'
    END as fk_status;

-- Vérifier que les autres contraintes sont intactes
SELECT
    COUNT(*) as contraintes_restantes,
    string_agg(conname, ', ') as noms_contraintes
FROM pg_constraint
WHERE conrelid = 'public.users'::regclass;

SELECT '✅ Correction terminée - Invitations possibles avec create_invitation_safe!' as resultat;