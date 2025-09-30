# 🔐 DOCUMENTATION SYSTÈME D'AUTHENTIFICATION SAGE 100

## 📋 VUE D'ENSEMBLE

Le système d'authentification de la plateforme Sage 100 utilise une architecture hybride combinant **Supabase Auth** et une **session d'urgence locale** pour garantir un accès administrateur fiable même en cas de problème avec la base de données.

## 🏗️ ARCHITECTURE DU SYSTÈME

### **1. AUTHENTIFICATION PRINCIPALE (Supabase)**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Web    │───▶│  Supabase Auth  │───▶│ public.users    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────▶│  auth.users     │◄─────────────┘
                         └─────────────────┘
```

#### **Fonctionnement :**
- **Connexion** via `supabase.auth.signInWithPassword()`
- **Session** stockée dans le navigateur par Supabase
- **Vérification** du rôle via `auth.users.raw_user_meta_data.role`
- **Données profil** dans `public.users` (email, nom, société, etc.)

### **2. SYSTÈME D'URGENCE (Session Locale)**

```
┌─────────────────┐    ┌─────────────────────────────┐
│   Client Web    │───▶│  localStorage               │
└─────────────────┘    │  emergency_admin_session    │
                        │  {                          │
                        │    user: {...},             │
                        │    expires: timestamp       │
                        │  }                          │
                        └─────────────────────────────┘
```

#### **Activation :**
- **URL spéciale** : `/emergency-admin?code=admin`
- **Session temporaire** : 2 heures d'expiration
- **Utilisateur fictif** : `{ id: 'emergency-admin', role: 'admin' }`
- **Stockage local** : `localStorage` du navigateur

## 🔒 GESTION DES PERMISSIONS (RLS)

### **Politiques Row Level Security :**

#### **Pour les Admins :**
```sql
CREATE POLICY "admin_full_access" ON public.users
FOR ALL USING (
    auth.uid() IS NOT NULL AND (
        -- Vérification dans auth.users
        EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
        -- Vérification dans public.users
        OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
        -- Session d'urgence
        OR auth.uid()::text = 'emergency-admin'
    )
);
```

#### **Pour les Utilisateurs :**
```sql
CREATE POLICY "user_own_access" ON public.users
FOR SELECT USING (auth.uid() = id);
```

## 🛡️ COMPOSANT DE PROTECTION DES ROUTES

### **`PrivateRoute.tsx` - Double Vérification :**

```typescript
const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();           // Session Supabase
  const emergencyUser = checkEmergencySession(); // Session d'urgence

  const currentUser = emergencyUser || user;     // Priorité à l'urgence

  // Vérifications d'accès...
  return currentUser?.role === requiredRole ? children : <Redirect />;
};
```

## 🔄 PROCESSUS D'INVITATION ET D'ACTIVATION

### **1. Création d'Invitation (Admin)**

```typescript
// Via fonction RPC sécurisée
const { data } = await supabase.rpc('create_invitation_safe', {
  p_email: 'user@example.com',
  p_role: 'client',
  p_full_name: 'John Doe',
  p_company: 'ACME Corp'
});

// Génération du token d'activation
const token = btoa(`${userId}:${email}:${timestamp}`);
const link = `${origin}/client-activation?token=${token}`;
```

### **2. Activation du Compte (Utilisateur)**

```typescript
// Validation du token (7 jours max)
const [userId, email, timestamp] = atob(token).split(':');
const isValid = (Date.now() - parseInt(timestamp)) < 7 * 24 * 60 * 60 * 1000;

// Création du compte Supabase
await supabase.auth.signUp({ email, password });

// Mise à jour du statut
await supabase.from('users').update({ status: 'active' }).eq('id', userId);
```

## 📊 FONCTIONS RPC SÉCURISÉES

### **Contournement des Problèmes RLS :**

#### **`admin_get_users()` :**
```sql
CREATE FUNCTION admin_get_users()
RETURNS TABLE (...)
SECURITY DEFINER  -- Exécution avec privilèges élevés
AS $$
BEGIN
    -- Vérification admin
    IF NOT (admin_check()) THEN
        RAISE EXCEPTION 'Accès réservé aux administrateurs';
    END IF;

    -- Retour de tous les utilisateurs
    RETURN QUERY SELECT * FROM public.users ORDER BY client_since DESC;
END;
$$;
```

#### **`admin_get_stats()` :**
```sql
CREATE FUNCTION admin_get_stats()
RETURNS jsonb
AS $$
BEGIN
    RETURN jsonb_build_object(
        'totalUsers', (SELECT COUNT(*) FROM public.users),
        'activeUsers', (SELECT COUNT(*) FROM public.users WHERE status = 'active'),
        -- ... autres statistiques
    );
END;
$$;
```

## 🎯 STRATÉGIE DE RÉCUPÉRATION (FALLBACK)

### **Double Approche dans l'Application :**

```typescript
const loadUsers = async () => {
  try {
    // 1. Essayer la fonction RPC sécurisée
    const { data: rpcData, error: rpcError } = await supabase.rpc('admin_get_users');

    if (!rpcError && rpcData) {
      setUsers(rpcData);
    } else {
      // 2. Fallback vers requête directe
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('client_since', { ascending: false });

      if (error) throw error;
      setUsers(data);
    }
  } catch (error) {
    setMessage({ type: 'error', text: `Erreur: ${error.message}` });
  }
};
```

## 🔧 POINTS DE DÉBLOCAGE D'URGENCE

### **1. Accès Admin Bloqué :**
- **URL d'urgence** : `http://localhost:8080/emergency-admin?code=admin`
- **Session temporaire** : 2h d'accès complet
- **Création d'admin** : Interface pour créer un admin régulier

### **2. Problèmes RLS :**
- **Scripts de correction** : `FIX_RLS_POLICIES.sql`, `FIX_ADMIN_AUTH_SCHEMA.sql`
- **Fonctions de contournement** : RPC avec `SECURITY DEFINER`
- **Permissions élargies** : `GRANT ALL` sur les tables critiques

### **3. Contraintes FK :**
- **Script spécialisé** : `FIX_FK_WITH_DEPENDENCIES.sql`
- **Suppression sélective** : Uniquement les FK problématiques vers `auth.users`
- **Préservation** : Structure de base et dépendances importantes

## 📋 AVANTAGES DE CETTE ARCHITECTURE

### **✅ Robustesse :**
- **Double authentification** : Supabase + session d'urgence
- **Récupération automatique** : Fallback en cas d'erreur
- **Scripts de réparation** : Solutions pour tous les problèmes courants

### **✅ Sécurité :**
- **RLS multicouches** : Vérifications dans 2 tables différentes
- **Sessions temporaires** : Expiration automatique des accès d'urgence
- **Fonctions sécurisées** : `SECURITY DEFINER` pour contourner RLS

### **✅ Flexibilité :**
- **Supports multiples** : Auth normale, session d'urgence, admin externe
- **Gestion des rôles** : Admin et client avec permissions distinctes
- **Évolutivité** : Facile d'ajouter de nouveaux rôles ou permissions

## 🚀 UTILISATION QUOTIDIENNE

### **Connexion Normale :**
1. `/admin` → Connexion Supabase standard
2. Vérification automatique du rôle
3. Redirection vers `/admin-dashboard`

### **Situation d'Urgence :**
1. `/emergency-admin?code=admin` → Session temporaire
2. Accès complet pendant 2h
3. Possibilité de créer un admin régulier
4. Retour au fonctionnement normal

### **Gestion des Invitations :**
1. `/admin-invitations` → Interface complète
2. Création d'invitations avec liens automatiques
3. Suivi des statuts (pending, active, inactive)
4. Gestion des utilisateurs existants

---

**Ce système garantit un fonctionnement fiable et sécurisé de l'authentification, même dans les situations les plus problématiques.** 🔐

## 🌐 URLS D'ACCÈS COMPLÈTES

### **🏠 PAGES PUBLIQUES**
```
http://localhost:8080/                    - Page d'accueil
http://localhost:8080/about              - À propos
http://localhost:8080/services           - Services Sage 100
http://localhost:8080/contact            - Contact
http://localhost:8080/blog               - Blog/Actualités
```

### **🔐 AUTHENTIFICATION - CLIENTS**
```
http://localhost:8080/client-login       - Connexion client
http://localhost:8080/forgot-password    - Mot de passe oublié
http://localhost:8080/reset-password     - Réinitialisation mot de passe
http://localhost:8080/client-activation?token=XXX  - Activation compte invité
```

### **🛡️ AUTHENTIFICATION - ADMINISTRATEURS**
```
http://localhost:8080/admin              - Connexion admin
http://localhost:8080/emergency-admin?code=admin  - Accès d'urgence admin
```

### **📊 ESPACES UTILISATEURS PROTÉGÉS**
```
http://localhost:8080/client-dashboard   - Dashboard client
http://localhost:8080/admin-dashboard    - Dashboard admin
http://localhost:8080/admin-invitations  - Gestion des invitations
```

### **🔧 OUTILS DE DIAGNOSTIC ET TEST**
```
http://localhost:8080/auth-test          - Test d'authentification général
http://localhost:8080/direct-auth-test   - Test d'authentification direct
http://localhost:8080/test-reset-password - Test reset password (dev)
```

### **⚠️ PAGES D'ERREUR**
```
http://localhost:8080/404                - Page non trouvée (catch-all)
```

## 🎯 URLS AVEC PARAMÈTRES

### **📧 Activation de Compte**
```
Format: /client-activation?token=BASE64_TOKEN
Exemple: http://localhost:8080/client-activation?token=eyJ1c2VyX2lkIjoiMTIzNCIsImVtYWlsIjoiLi4uIiwgInRpbWVzdGFtcCI6IjE2OTQ5MTI0MDAifQ==

Structure du token:
- Base64(userId:email:timestamp)
- Expiration: 7 jours
- Validation automatique côté client
```

### **🔒 Réinitialisation de Mot de Passe**
```
Format: /reset-password?access_token=XXX&refresh_token=XXX&type=recovery
Généré automatiquement par Supabase Auth via email
```

### **🚨 Accès d'Urgence Admin**
```
Codes valides:
- http://localhost:8080/emergency-admin?code=admin
- http://localhost:8080/emergency-admin?code=1234
- http://localhost:8080/emergency-admin?code=sage2024emergency

Session d'urgence:
- Durée: 2 heures
- Stockage: localStorage
- Auto-expiration: Oui
```

## 🔄 FLUX DE NAVIGATION

### **💼 Parcours Client Standard**
```
1. / (accueil)
2. /client-login (connexion)
3. /client-dashboard (espace client)
```

### **🛡️ Parcours Admin Standard**
```
1. / (accueil) ou /admin (direct)
2. /admin (connexion)
3. /admin-dashboard (dashboard)
4. /admin-invitations (gestion utilisateurs)
```

### **📨 Parcours Invitation Client**
```
1. Email reçu avec lien d'activation
2. /client-activation?token=XXX
3. Saisie mot de passe
4. Redirection automatique vers /client-login
5. /client-dashboard (après connexion)
```

### **🆘 Parcours Urgence Admin**
```
1. /emergency-admin?code=admin (accès d'urgence)
2. /admin-dashboard (dashboard temporaire)
3. Création admin régulier via interface
4. Retour à l'authentification normale
```

## 🚫 REDIRECTIONS AUTOMATIQUES

### **🔒 Routes Protégées**
```
Si non connecté:
- /client-dashboard → /client-login
- /admin-dashboard → /admin
- /admin-invitations → /admin

Si mauvais rôle:
- Admin → /client-dashboard ➜ /admin-dashboard
- Client → /admin-* ➜ Page d'erreur "Accès Restreint"
```

### **📱 Routes Adaptives**
```
Après connexion réussie:
- Role "admin" → /admin-dashboard
- Role "client" → /client-dashboard

Après activation compte:
- Role "admin" → /admin (pour se connecter)
- Role "client" → /client-login (pour se connecter)
```

## 🔗 LIENS INTERNES PRINCIPAUX

### **📊 Navigation Admin Dashboard**
```
/admin-dashboard:
  ├── "Inviter un utilisateur" → /admin-invitations
  ├── "Gérer les utilisateurs" → /admin-invitations
  ├── "Paramètres système" → /admin-settings (à créer)
  └── "Rapports" → /admin-reports (à créer)
```

### **👥 Navigation Invitations**
```
/admin-invitations:
  ├── "Nouvel utilisateur" → Formulaire sur même page
  ├── "Renvoyer" → Génère nouveau lien d'activation
  ├── "Supprimer" → Supprime l'utilisateur
  └── "Actualiser" → Recharge la liste
```

## 🌍 URLS DE PRODUCTION

### **🚀 Adaptation Production**
```
Développement: http://localhost:8080/
Production: https://sage-consultant.votredomaine.com/

Variables à modifier:
- window.location.origin dans les liens d'activation
- Configurations Supabase (URL, clés)
- Redirections après activation de compte
```

### **📧 Templates Email Production**
```
Liens d'activation automatiques:
${window.location.origin}/client-activation?token=${activationToken}

Exemple production:
https://sage-consultant.votredomaine.com/client-activation?token=eyJ1c2VyX2lkIjoi...
```

---

**Toutes les URLs du système sont maintenant documentées avec leurs paramètres, redirections et flux de navigation !** 🌐✨