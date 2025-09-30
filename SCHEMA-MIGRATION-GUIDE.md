# Guide de Migration du Schéma d'Authentification

## Résumé des Modifications

Ce document détaille les modifications apportées au schéma de base de données pour optimiser le système d'authentification Admin/Client avec Supabase.

## Changements Principaux

### 1. Table `users` - Champs d'Authentification Étendus

**Nouveaux champs ajoutés :**
- `last_login` : TIMESTAMP WITH TIME ZONE - Suivi de la dernière connexion
- `status` : TEXT CHECK - Statut du compte ('active', 'inactive', 'pending')

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'active';
```

### 2. Table `service_features` - Alignement avec Types TypeScript

**Modifications :**
- `feature_text` → `name` (renommage pour correspondre aux types)
- Ajout de `description` TEXT (optionnel)

### 3. Table `client_services` - Référence aux Services

**Nouveau champ :**
- `service_id` : UUID REFERENCES services(id) - Liaison avec le service principal

### 4. Table `documents` - Métadonnées de Fichiers Optimisées

**Renommages et ajouts :**
- `name` → `title`
- `type` → `file_type`
- `file_path` → `file_url`
- `size` → `file_size`
- Ajout de `updated_at` et `description`

### 5. Table `meetings` - Simplification du Modèle

**Suppressions :**
- `client_service_id`, `meeting_time`, `type`, `notes`

**Ajouts :**
- `description` TEXT

**Modifications de statut :**
- Statuts alignés : 'Planifié', 'Confirmé', 'Annulé', 'Terminé'

### 6. Table `messages` - Système de Messagerie Simplifié

**Suppressions :**
- `title`, `status`

**Ajouts :**
- `read` BOOLEAN DEFAULT false

### 7. Table `testimonials` - Association aux Services

**Suppressions :**
- `name`, `role`, `company` (données récupérées via user_id)

**Ajouts :**
- `service_id` UUID REFERENCES services(id)

## Index de Performance

Ajout d'index optimisés pour les requêtes d'authentification et de performance :

```sql
-- Index pour les utilisateurs
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_last_login ON users(last_login);
CREATE INDEX idx_users_email_role ON users(email, role);

-- Index pour les relations principales
CREATE INDEX idx_client_services_user_id ON client_services(user_id);
CREATE INDEX idx_messages_sender_recipient ON messages(sender_id, recipient_id);
CREATE INDEX idx_documents_client_service_id ON documents(client_service_id);
```

## Politiques RLS Mises à Jour

### Sécurité Renforcée

1. **Contrôle d'accès basé sur les rôles**
   - Admin : accès complet à toutes les données
   - Client : accès limité à ses propres données

2. **Politiques de lecture/écriture granulaires**
   - Messages : lecture bidirectionnelle (expéditeur/destinataire)
   - Documents : accès via relation client_services
   - Testimonials : création par clients, modération par admin

## Triggers Automatisés

### Auto-création de Profil Utilisateur

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, client_since, status, last_login)
  VALUES (NEW.id, NEW.email, 'client', CURRENT_DATE, 'active', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Migration Steps

### Étape 1 : Sauvegarde
```sql
-- Créer une sauvegarde avant migration
pg_dump your_database > backup_before_migration.sql
```

### Étape 2 : Exécuter la Migration
```sql
-- Exécuter le script de migration
\i migration-auth-schema.sql
```

### Étape 3 : Vérifier la Cohérence
```sql
-- Vérifier les nouvelles colonnes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

## Compatibilité avec le Code TypeScript

Le schéma mis à jour est maintenant 100% compatible avec les types définis dans `src/types/supabase.ts` :

- ✅ Tous les champs correspondent aux interfaces TypeScript
- ✅ Les contraintes de validation sont cohérentes
- ✅ Les relations foreign key sont correctes
- ✅ Les politiques RLS supportent les rôles définis

## Tests de Validation

### 1. Test de Création d'Utilisateur

```sql
-- Simuler la création d'un nouvel utilisateur
INSERT INTO auth.users (id, email, encrypted_password)
VALUES (gen_random_uuid(), 'test@example.com', 'encrypted_password');

-- Vérifier l'auto-création du profil
SELECT id, email, role, status, client_since, last_login
FROM users
WHERE email = 'test@example.com';
```

### 2. Test des Politiques RLS

```sql
-- Test accès client (doit voir seulement ses données)
SET session_replication_role = 'origin';
SET row_security = on;
-- Simuler l'utilisateur client et tester les accès
```

### 3. Test des Index de Performance

```sql
-- Analyser les performances des requêtes principales
EXPLAIN ANALYZE SELECT * FROM users WHERE role = 'client' AND status = 'active';
EXPLAIN ANALYZE SELECT * FROM client_services WHERE user_id = 'user_uuid';
```

## Monitoring et Maintenance

### Métriques à Surveiller

1. **Performance des Requêtes**
   - Temps de réponse des authentifications
   - Utilisation des index créés

2. **Sécurité**
   - Tentatives d'accès non autorisées
   - Échecs d'authentification

3. **Données**
   - Croissance des tables principales
   - Intégrité référentielle

### Maintenance Recommandée

```sql
-- Nettoyage périodique des sessions expirées
DELETE FROM auth.sessions WHERE expires_at < now() - interval '30 days';

-- Analyse des statistiques de table
ANALYZE users, client_services, documents, meetings, messages, testimonials;

-- Mise à jour des statistiques d'index
REINDEX INDEX CONCURRENTLY idx_users_role;
```

## Notes de Déploiement

1. **Downtime** : Migration possible sans interruption de service
2. **Rollback** : Script de rollback disponible si nécessaire
3. **Testing** : Tester en staging avant production
4. **Monitoring** : Surveiller les performances post-migration

## Support et Troubleshooting

### Problèmes Courants

1. **Contraintes de validation échouées**
   - Vérifier les données existantes avant migration
   - Nettoyer les données incohérentes

2. **Performance dégradée**
   - Analyser l'utilisation des nouveaux index
   - Ajuster les requêtes si nécessaire

3. **Erreurs de politiques RLS**
   - Vérifier les rôles et permissions
   - Tester avec différents types d'utilisateurs

### Contact

Pour toute question technique sur cette migration, consulter la documentation Supabase ou contacter l'équipe de développement.