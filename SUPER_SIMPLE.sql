-- MÉTHODE SUPER SIMPLE : Laisser le trigger faire son travail
-- puis corriger le rôle après

-- Nettoyer d'abord
DELETE FROM public.users WHERE email = 'admin@1cgestion.tech';
DELETE FROM auth.users WHERE email = 'admin@1cgestion.tech';

-- Créer l'utilisateur (le trigger va automatiquement créer public.users avec role='client')
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

-- Corriger le rôle en 'admin' après création automatique
UPDATE public.users
SET role = 'admin',
    full_name = 'Admin Sage',
    company = '1C Gestion'
WHERE email = 'admin@1cgestion.tech';

-- Vérification
SELECT 'TERMINÉ!' as status;
SELECT email, role, full_name FROM public.users WHERE email = 'admin@1cgestion.tech';