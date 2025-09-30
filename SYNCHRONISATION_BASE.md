# 🔄 SYNCHRONISATION BASE DE DONNÉES

## 📋 Étapes de synchronisation

### 1. **Mise à jour du schéma (si nécessaire)**

Si vous avez des changements de structure, exécutez dans Supabase SQL Editor :

```sql
-- Vérifier que les colonnes nécessaires existent
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users' AND table_schema = 'public';

-- Ajouter les colonnes manquantes si nécessaire
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS last_login timestamp,
ADD COLUMN IF NOT EXISTS status varchar(20) DEFAULT 'active';

-- Mettre à jour les index
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
```

### 2. **Vérifier les données existantes**

```sql
-- Voir l'état actuel des utilisateurs
SELECT
    email,
    role,
    status,
    client_since,
    last_login
FROM public.users
ORDER BY client_since DESC;
```

### 3. **Nettoyer les données corrompues (si nécessaire)**

```sql
-- Supprimer les utilisateurs problématiques (ATTENTION: sauvegarde d'abord!)
-- DELETE FROM public.users WHERE email IN ('consultant@1cgestion.tech');
-- DELETE FROM auth.users WHERE email IN ('consultant@1cgestion.tech');
```

### 4. **Créer l'admin principal**

Utilisez l'une de ces méthodes :

#### **Méthode A: Via l'interface d'urgence (Recommandé)**
1. Allez sur `http://localhost:8080/emergency-admin?code=admin`
2. Cliquez "Créer Admin Régulier"
3. Suivez les instructions

#### **Méthode B: Via Supabase Dashboard**
1. Aller dans Supabase > Authentication > Users
2. Créer un nouvel utilisateur :
   - Email: `admin@1cgestion.tech`
   - Password: `Admin2024!`
   - Confirm email: ✅
3. Puis exécuter dans SQL Editor :
```sql
UPDATE public.users
SET role = 'admin',
    full_name = 'Administrateur Sage',
    company = '1C Gestion',
    status = 'active'
WHERE email = 'admin@1cgestion.tech';
```

### 5. **Vérifier les fonctions et triggers**

```sql
-- Vérifier que le trigger existe
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Si le trigger n'existe pas, le créer :
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, role, client_since, status, last_login)
  VALUES (NEW.id, NEW.email, 'client', CURRENT_DATE, 'active', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 6. **Tester la synchronisation**

```sql
-- Créer un utilisateur de test pour vérifier que tout fonctionne
SELECT 'Test de synchronisation - Base prête!' as status;

-- Compter les utilisateurs par statut
SELECT
    status,
    role,
    COUNT(*) as nombre
FROM public.users
GROUP BY status, role;
```

## ✅ **Vérification finale**

Après synchronisation, testez :

1. **Connexion admin :** `http://localhost:8080/admin`
2. **Dashboard admin :** `http://localhost:8080/admin-dashboard`
3. **Invitations :** `http://localhost:8080/admin-invitations`
4. **Urgence :** `http://localhost:8080/emergency-admin?code=admin`

## 🚨 **En cas de problème**

Si quelque chose ne fonctionne pas :

1. **Vérifier les logs d'erreur** dans la console navigateur
2. **Utiliser l'accès d'urgence** : `/emergency-admin?code=admin`
3. **Recréer l'admin** avec les scripts fournis
4. **Vérifier les permissions** RLS dans Supabase

## 📞 **Support**

Les pages de diagnostic sont disponibles :
- `/auth-test` - Test d'authentification général
- `/direct-auth-test` - Test d'authentification direct
- `/emergency-admin?code=admin` - Accès de déblocage