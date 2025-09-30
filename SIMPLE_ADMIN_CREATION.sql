-- SOLUTION ULTRA-SIMPLE : Créer un admin qui fonctionne
-- Copier-coller cette requête dans Supabase et c'est fini !

-- Nettoyer d'abord
DELETE FROM public.users WHERE email = 'admin@1cgestion.tech';
DELETE FROM auth.users WHERE email = 'admin@1cgestion.tech';

-- Créer l'admin en 1 seule fois
WITH new_user AS (
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
  ) RETURNING id, email
)
INSERT INTO public.users (id, email, role, full_name, company, status, client_since)
SELECT id, email, 'admin', 'Admin Sage', '1C Gestion', 'active', CURRENT_DATE
FROM new_user;

-- Vérifier que ça marche
SELECT 'TERMINÉ ! Admin créé avec succès' as message;
SELECT email FROM auth.users WHERE email = 'admin@1cgestion.tech';
SELECT email, role FROM public.users WHERE email = 'admin@1cgestion.tech';