-- ÉTAPE 2: Créer l'authentification pour l'admin créé
-- Email: admin@1cgestion.tech
-- Mot de passe: Admin2024!

-- Méthode 1: Créer directement dans auth.users
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
    raw_app_meta_data,
    raw_user_meta_data
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    pu.id,  -- Utiliser le même ID que dans public.users
    'authenticated',
    'authenticated',
    'admin@1cgestion.tech',
    crypt('Admin2024!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "admin"}'
FROM public.users pu
WHERE pu.email = 'admin@1cgestion.tech'
ON CONFLICT (id) DO UPDATE SET
    encrypted_password = crypt('Admin2024!', gen_salt('bf')),
    email_confirmed_at = now(),
    updated_at = now();

-- Vérification finale
SELECT
    'auth.users' as table_name,
    au.id,
    au.email,
    au.email_confirmed_at IS NOT NULL as email_confirmed,
    au.created_at
FROM auth.users au
WHERE au.email = 'admin@1cgestion.tech'
UNION ALL
SELECT
    'public.users' as table_name,
    pu.id,
    pu.email,
    (pu.status = 'active') as active,
    pu.client_since::timestamp
FROM public.users pu
WHERE pu.email = 'admin@1cgestion.tech';