# CRÉATION ADMIN VIA L'INTERFACE SUPABASE

## Méthode la plus simple qui fonctionne à 100%

### 1. Aller dans Supabase Dashboard
- Aller dans votre projet Supabase
- Menu "Authentication" > "Users"

### 2. Créer l'utilisateur admin
- Cliquer "Add user"
- Email: `admin@1cgestion.tech`
- Password: `Admin2024!`
- Confirm email: ✅ (coché)
- Cliquer "Create user"

### 3. Corriger le rôle dans la base
Exécuter cette simple requête dans SQL Editor:
```sql
UPDATE public.users
SET role = 'admin',
    full_name = 'Admin Sage',
    company = '1C Gestion'
WHERE email = 'admin@1cgestion.tech';
```

### 4. Tester
- `http://localhost:8080/admin`
- Email: `admin@1cgestion.tech`
- Password: `Admin2024!`

## Pourquoi cette méthode ?
- Interface officielle Supabase = pas de problème de permissions
- Création automatique des liens auth/public
- Simple et fiable à 100%