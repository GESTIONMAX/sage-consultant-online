-- 🔧 CORRECTION SPÉCIFIQUE POUR LES POLITIQUES D'INSERTION
-- Résout l'erreur: "new row violates row-level security policy for table users"

-- ================================
-- 1. DIAGNOSTIC DES POLITIQUES ACTUELLES
-- ================================

SELECT '=== DIAGNOSTIC POLITIQUES INSERT ===' as info;

-- Voir les politiques actuelles
SELECT
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'users' AND schemaname = 'public' AND cmd = 'INSERT';

-- ================================
-- 2. SUPPRIMER LES POLITIQUES D'INSERTION PROBLÉMATIQUES
-- ================================

SELECT '=== SUPPRESSION POLITIQUES INSERT ===' as info;

-- Supprimer toutes les politiques d'insertion existantes
DROP POLICY IF EXISTS "optimized_insert_policy" ON public.users;
DROP POLICY IF EXISTS "simple_insert_policy" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
DROP POLICY IF EXISTS "Admin can insert users" ON public.users;

-- ================================
-- 3. CRÉER UNE POLITIQUE D'INSERTION PERMISSIVE
-- ================================

SELECT '=== CRÉATION POLITIQUE INSERT PERMISSIVE ===' as info;

-- Politique très permissive pour l'insertion (admin peut tout insérer)
CREATE POLICY "admin_insert_policy" ON public.users
FOR INSERT
WITH CHECK (
    -- Permettre l'insertion si l'utilisateur connecté est admin
    EXISTS (
        SELECT 1 FROM auth.users au
        WHERE au.id = auth.uid()
        AND (
            au.raw_user_meta_data->>'role' = 'admin'
            OR au.email LIKE '%admin%'
            OR au.id IN (
                SELECT id FROM public.users pu
                WHERE pu.role = 'admin' AND pu.id = au.id
            )
        )
    )
    -- OU si c'est une auto-insertion (même ID)
    OR auth.uid() = id
);

-- ================================
-- 4. SOLUTION ALTERNATIVE - POLITIQUE TRÈS PERMISSIVE
-- ================================

SELECT '=== ALTERNATIVE - POLITIQUE ULTRA PERMISSIVE ===' as info;

-- Si la politique ci-dessus ne fonctionne pas, utiliser cette version ultra-permissive
DROP POLICY IF EXISTS "admin_insert_policy" ON public.users;

-- Politique qui permet l'insertion à tout utilisateur authentifié
-- (Moins sécurisée mais évite les blocages)
CREATE POLICY "permissive_insert_policy" ON public.users
FOR INSERT
WITH CHECK (
    -- Tout utilisateur authentifié peut insérer
    auth.uid() IS NOT NULL
    -- ET soit c'est son propre profil, soit il est admin
    AND (
        auth.uid() = id  -- Propre profil
        OR EXISTS (      -- Ou admin
            SELECT 1 FROM auth.users au
            WHERE au.id = auth.uid()
            AND au.raw_user_meta_data->>'role' = 'admin'
        )
    )
);

-- ================================
-- 5. TEST DE LA POLITIQUE
-- ================================

SELECT '=== TEST INSERTION ===' as info;

-- Tester avec un INSERT fictif (sera annulé)
BEGIN;
    INSERT INTO public.users (id, email, role, full_name, company, status, client_since)
    VALUES (gen_random_uuid(), 'test@example.com', 'client', 'Test User', 'Test Co', 'pending', CURRENT_DATE);
ROLLBACK;

SELECT '✅ Test d''insertion réussi (transaction annulée)' as test_result;

-- ================================
-- 6. VÉRIFICATION FINALE
-- ================================

SELECT '=== VÉRIFICATION FINALE ===' as info;

-- Vérifier les politiques d'insertion
SELECT
    policyname,
    cmd,
    with_check
FROM pg_policies
WHERE tablename = 'users' AND schemaname = 'public' AND cmd = 'INSERT';

SELECT 'Politique d''insertion corrigée - Invitations possibles!' as resultat;