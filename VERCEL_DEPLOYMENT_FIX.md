# 🚀 Fix Déploiement Vercel - Page Blanche

## 🔍 **Problème Identifié**
Page blanche sur Vercel = Variables d'environnement Supabase manquantes

## ✅ **Variables à Configurer sur Vercel**

### 📋 **Variables Requises :**
```
VITE_SUPABASE_URL=https://bfyutthizswvlcpyimwf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeXV0dGhpenN3dmxjcHlpbXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDczNDMsImV4cCI6MjA3MzUyMzM0M30.yG9I_uJUAkJZxqjp-5rOL1nhNy86ntrAnTozfsEYUO8
```

## 🔧 **Étapes de Configuration Vercel**

### **Méthode 1 : Via Dashboard Vercel**
1. 🌐 **Accéder à Vercel Dashboard**
   - Aller sur [vercel.com](https://vercel.com)
   - Se connecter à votre compte
   - Sélectionner le projet `sage-consultant-online`

2. ⚙️ **Configurer les Variables**
   - Cliquer sur **Settings** (Paramètres)
   - Dans le menu latéral : **Environment Variables**
   - Cliquer sur **Add New**

3. 📝 **Ajouter chaque variable :**

   **Variable 1 :**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://bfyutthizswvlcpyimwf.supabase.co`
   - Environments: ✅ Production ✅ Preview ✅ Development

   **Variable 2 :**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeXV0dGhpenN3dmxjcHlpbXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDczNDMsImV4cCI6MjA3MzUyMzM0M30.yG9I_uJUAkJZxqjp-5rOL1nhNy86ntrAnTozfsEYUO8`
   - Environments: ✅ Production ✅ Preview ✅ Development

4. 💾 **Sauvegarder** chaque variable

### **Méthode 2 : Via Vercel CLI**
```bash
# Installer Vercel CLI si pas encore fait
npm i -g vercel

# Se connecter
vercel login

# Ajouter les variables
vercel env add VITE_SUPABASE_URL production
# Puis coller: https://bfyutthizswvlcpyimwf.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# Puis coller la clé JWT complète
```

## 🔄 **Redéploiement**

### **Option A : Redéploiement Automatique**
1. Après avoir ajouté les variables, Vercel peut redéployer automatiquement
2. Sinon, aller dans **Deployments** et cliquer **Redeploy**

### **Option B : Nouveau Push Git**
```bash
# Faire un petit changement et push
git commit --allow-empty -m "feat: Force redeploy with environment variables"
git push origin main
```

## 🔍 **Vérification du Fix**

### **1. Logs Vercel**
- Dashboard Vercel → Project → **Functions** tab
- Vérifier qu'il n'y a pas d'erreurs de build
- Checker les logs de runtime

### **2. Console Browser**
- Ouvrir le site Vercel
- F12 → Console
- Vérifier qu'il n'y a pas d'erreurs JavaScript
- Rechercher les erreurs Supabase

### **3. Network Tab**
- F12 → Network
- Recharger la page
- Vérifier que les requêtes vers Supabase passent

## 🚨 **Troubleshooting**

### **Si la page reste blanche :**

1. **Vérifier les variables**
   ```bash
   # Dans Vercel Dashboard
   Settings → Environment Variables
   # S'assurer que les 2 variables sont présentes
   ```

2. **Forcer un nouveau build**
   - Dashboard → Deployments → Latest deployment → **Redeploy**

3. **Vérifier le build log**
   - Voir s'il y a des erreurs de compilation
   - Checker que Vite trouve les variables

4. **Test en local avec les mêmes variables**
   ```bash
   # Supprimer le .env local temporairement
   mv .env .env.backup

   # Créer un .env avec les mêmes valeurs que Vercel
   echo "VITE_SUPABASE_URL=https://bfyutthizswvlcpyimwf.supabase.co" > .env
   echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." >> .env

   # Tester en local
   npm run build
   npm run preview
   ```

## ✅ **Variables Correctement Configurées**

Une fois configurées, votre application Vercel devrait :
- ✅ Afficher la page d'accueil avec les couleurs Sage
- ✅ Charger le logo Sage
- ✅ Boutons noirs fonctionnels
- ✅ Connexion Supabase opérationnelle

## 🔗 **Liens Utiles**
- [Documentation Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)