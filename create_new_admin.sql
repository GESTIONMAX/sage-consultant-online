-- Script pour créer un nouvel utilisateur admin fonctionnel
-- Email: admin@1cgestion.tech
-- Mot de passe: Admin2024!

-- Étape 1: Supprimer l'ancien utilisateur problématique s'il existe
DELETE FROM public.users WHERE email = 'consultant@1cgestion.tech';
DELETE FROM auth.users WHERE email = 'consultant@1cgestion.tech';

-- Étape 2: Créer un nouvel admin avec email différent
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_sent_at,
    recovery_sent_at,
    email_change_sent_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    last_sign_in_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@1cgestion.tech',
    crypt('Admin2024!', gen_salt('bf')),
    now(),
    now(),
    now(),
    now(),
    null,
    null,
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "admin"}',
    false,
    null
);

-- Étape 3: Créer le profil admin dans public.users
INSERT INTO public.users (id, email, role, full_name, company, status, client_since, last_login)
SELECT
    au.id,
    au.email,
    'admin',
    'Administrateur Sage',
    '1C Gestion',
    'active',
    CURRENT_DATE,
    null
FROM auth.users au
WHERE au.email = 'admin@1cgestion.tech';

-- Étape 4: Vérifier la création
SELECT
    'auth.users' as table_name,
    email,
    created_at,
    email_confirmed_at
FROM auth.users
WHERE email = 'admin@1cgestion.tech'
UNION ALL
SELECT
    'public.users' as table_name,
    email,
    client_since::timestamp,
    last_login
FROM public.users
WHERE email = 'admin@1cgestion.tech';