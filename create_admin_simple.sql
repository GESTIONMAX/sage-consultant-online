-- Script simplifié pour créer un admin - Exécuter étape par étape
-- Email: admin@1cgestion.tech
-- Mot de passe: Admin2024!

-- ÉTAPE 1: Nettoyer d'abord (optionnel si problème)
-- DELETE FROM public.users WHERE email IN ('consultant@1cgestion.tech', 'admin@1cgestion.tech');
-- DELETE FROM auth.users WHERE email IN ('consultant@1cgestion.tech', 'admin@1cgestion.tech');

-- ÉTAPE 2: Créer l'utilisateur dans auth.users (VERSION SIMPLE)
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
);

-- ÉTAPE 3: Créer le profil dans public.users
INSERT INTO public.users (id, email, role, full_name, company, status, client_since)
SELECT
    au.id,
    au.email,
    'admin',
    'Administrateur Sage',
    '1C Gestion',
    'active',
    CURRENT_DATE
FROM auth.users au
WHERE au.email = 'admin@1cgestion.tech';

-- ÉTAPE 4: Vérifier la création
SELECT 'SUCCESS - Utilisateur créé' as status, email, created_at
FROM auth.users
WHERE email = 'admin@1cgestion.tech';