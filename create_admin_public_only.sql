-- MÉTHODE ALTERNATIVE: Créer seulement dans public.users
-- L'utilisateur sera créé automatiquement dans auth.users lors de la première connexion

-- Vérifier d'abord les utilisateurs existants
SELECT 'Utilisateurs existants:' as info;
SELECT email, role, status FROM public.users WHERE email LIKE '%1cgestion.tech';

-- Créer ou mettre à jour l'utilisateur admin dans public.users
INSERT INTO public.users (
    id,
    email,
    role,
    full_name,
    company,
    status,
    client_since
) VALUES (
    gen_random_uuid(),
    'admin@1cgestion.tech',
    'admin',
    'Administrateur Sage',
    '1C Gestion',
    'active',
    CURRENT_DATE
)
ON CONFLICT (email) DO UPDATE SET
    role = 'admin',
    status = 'active',
    full_name = 'Administrateur Sage',
    company = '1C Gestion';

-- Vérifier la création
SELECT 'RÉSULTAT:' as info;
SELECT id, email, role, status, client_since
FROM public.users
WHERE email = 'admin@1cgestion.tech';

-- Instructions pour la suite:
-- 1. Exécuter ce script
-- 2. Aller sur la page reset password /forgot-password
-- 3. Entrer admin@1cgestion.tech
-- 4. Cela créera automatiquement l'utilisateur dans auth.users
-- 5. Suivre le lien de reset pour définir le mot de passe