-- DIAGNOSTIC ÉTAPE PAR ÉTAPE
-- Exécuter une requête à la fois pour identifier le problème

-- ÉTAPE 1: Vérifier si l'utilisateur existe déjà
SELECT 'Vérification utilisateurs existants' as step;
SELECT email, created_at FROM auth.users WHERE email LIKE '%1cgestion.tech';
SELECT email, role FROM public.users WHERE email LIKE '%1cgestion.tech';

-- ÉTAPE 2: Tester la fonction de hachage
SELECT 'Test fonction crypt' as step;
SELECT crypt('Admin2024!', gen_salt('bf')) as hashed_password;

-- ÉTAPE 3: Insérer seulement dans auth.users d'abord
SELECT 'Création utilisateur auth.users' as step;
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@1cgestion.tech',
    crypt('Admin2024!', gen_salt('bf')),
    now(),
    now(),
    now()
)
ON CONFLICT (email) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    updated_at = now();

-- ÉTAPE 4: Vérifier la création
SELECT 'Vérification création' as step;
SELECT id, email, created_at, email_confirmed_at
FROM auth.users
WHERE email = 'admin@1cgestion.tech';