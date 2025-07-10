-- Ce script confirme l'email de l'utilisateur et lui attribue le rôle admin
-- Adapté spécifiquement pour l'utilisateur briane@1gestion.fr

-- 1. Confirmer l'email dans auth.users
UPDATE auth.users
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = 'briane@1gestion.fr';

-- 2. Obtenir l'ID de l'utilisateur
DO $$
DECLARE 
    user_id uuid;
BEGIN
    -- Récupérer l'ID depuis auth.users
    SELECT id INTO user_id FROM auth.users WHERE email = 'briane@1gestion.fr';
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'Aucun utilisateur trouvé avec l''email briane@1gestion.fr';
    END IF;

    -- 3. Vérifier si l'utilisateur existe déjà dans la table users
    IF EXISTS (SELECT 1 FROM users WHERE id = user_id) THEN
        -- Mettre à jour l'utilisateur existant
        UPDATE users 
        SET role = 'admin', 
            updated_at = now()
        WHERE id = user_id;
        
        RAISE NOTICE 'Utilisateur existant mis à jour avec le rôle admin';
    ELSE
        -- Insérer un nouvel enregistrement
        INSERT INTO users (
            id, 
            email, 
            role, 
            created_at, 
            updated_at
        ) VALUES (
            user_id, 
            'briane@1gestion.fr', 
            'admin', 
            now(), 
            now()
        );
        
        RAISE NOTICE 'Nouvel utilisateur créé avec le rôle admin';
    END IF;
END $$;
