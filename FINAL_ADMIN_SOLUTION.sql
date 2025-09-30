-- SOLUTION FINALE : Gérer le trigger automatique

-- Nettoyer d'abord
DELETE FROM public.users WHERE email = 'admin@1cgestion.tech';
DELETE FROM auth.users WHERE email = 'admin@1cgestion.tech';

-- Désactiver temporairement le trigger automatique
ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;

-- Créer l'utilisateur auth seulement
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

-- Créer le profil admin manuellement
INSERT INTO public.users (id, email, role, full_name, company, status, client_since)
SELECT
    au.id,
    au.email,
    'admin',  -- Rôle admin, pas client
    'Admin Sage',
    '1C Gestion',
    'active',
    CURRENT_DATE
FROM auth.users au
WHERE au.email = 'admin@1cgestion.tech';

-- Réactiver le trigger
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;

-- Vérification finale
SELECT 'SUCCESS: Admin créé!' as status;
SELECT email, role FROM public.users WHERE email = 'admin@1cgestion.tech';