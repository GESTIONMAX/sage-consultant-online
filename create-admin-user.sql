-- Créer un nouvel utilisateur administrateur dans Supabase
-- Remplacez 'admin@example.com' et 'password' par vos valeurs souhaitées
-- ATTENTION : Le mot de passe sera en clair dans ce script, à utiliser uniquement pour le développement

-- 1. Créer l'utilisateur dans auth.users (nécessite des droits d'admin sur la base de données)
-- Cette partie doit être exécutée par un administrateur Supabase
INSERT INTO auth.users (
  instance_id,
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  confirmation_token,
  confirmation_sent_at,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- instance_id par défaut
  gen_random_uuid(), -- génère un UUID pour l'utilisateur
  'nouveau-admin@example.com', -- REMPLACEZ PAR VOTRE EMAIL
  crypt('VotreMotDePasse123!', gen_salt('bf')), -- REMPLACEZ PAR VOTRE MOT DE PASSE
  now(), -- email déjà confirmé
  now(),
  '',
  now(),
  now(),
  now()
)
RETURNING id; -- Cette requête retournera l'ID généré, à utiliser dans la prochaine étape

-- 2. Une fois l'utilisateur créé et son ID récupéré, ajoutez-le à la table users avec le rôle admin
-- Remplacez 'USER_ID_FROM_ABOVE' par l'ID généré à l'étape précédente
INSERT INTO public.users (
  id,
  email,
  role,
  created_at,
  updated_at
)
VALUES (
  'USER_ID_FROM_ABOVE', -- Remplacez par l'ID généré à l'étape précédente
  'nouveau-admin@example.com', -- Utilisez le même email qu'à l'étape 1
  'admin',
  now(),
  now()
);

-- REMARQUE IMPORTANTE : 
-- Cette approche nécessite des droits d'administration sur la base de données Supabase.
-- Pour un environnement de production, il est recommandé d'utiliser l'interface d'administration de Supabase ou l'API d'authentification.
