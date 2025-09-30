# Configuration Railway - Alternative à Supabase

## 🚀 Déploiement Railway

### 1. Créer un compte Railway
- Aller sur [railway.app](https://railway.app)
- Se connecter avec GitHub
- Créer un nouveau projet

### 2. Ajouter une base de données PostgreSQL
```bash
# Dans Railway Dashboard
1. Cliquer sur "New Project"
2. Sélectionner "Database" 
3. Choisir "PostgreSQL"
4. Attendre le déploiement
```

### 3. Variables d'environnement Railway
```env
# Database
DATABASE_URL=postgresql://postgres:password@host:port/database
DB_HOST=host.railway.internal
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=your_password

# App
NODE_ENV=production
PORT=3000
```

### 4. Déployer l'application
```bash
# Connecter le repo GitHub
1. Railway Dashboard > "Deploy from GitHub repo"
2. Sélectionner votre repository
3. Railway déploie automatiquement
```

## 🗄️ Migration depuis Supabase

### 1. Exporter les données Supabase
```sql
-- Dans Supabase SQL Editor
-- Exporter toutes les tables
pg_dump $DATABASE_URL > backup.sql
```

### 2. Importer dans Railway
```bash
# Se connecter à Railway PostgreSQL
psql $RAILWAY_DATABASE_URL < backup.sql
```

### 3. Mettre à jour les variables d'environnement
```env
# Remplacer Supabase par Railway
VITE_SUPABASE_URL=your_railway_url
VITE_SUPABASE_ANON_KEY=your_railway_key
```

## 🔄 Avantages Railway vs Supabase

| Fonctionnalité | Supabase Free | Railway Free |
|----------------|---------------|--------------|
| Pause automatique | ❌ Oui (après inactivité) | ✅ Non |
| Base de données | ✅ PostgreSQL | ✅ PostgreSQL |
| API REST | ✅ Auto-générée | ✅ Avec Prisma/Sequelize |
| Auth | ✅ Intégrée | ⚠️ À implémenter |
| Storage | ✅ Intégré | ⚠️ À configurer |
| Realtime | ✅ Intégré | ⚠️ À configurer |

## 🛠️ Configuration Prisma (Recommandé)

### 1. Installer Prisma
```bash
npm install prisma @prisma/client
npx prisma init
```

### 2. Configuration schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      String   @default("client")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Client {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  company   String?
  phone     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 3. Migration et génération
```bash
npx prisma migrate dev --name init
npx prisma generate
```

## 🔐 Authentification Alternative

### 1. NextAuth.js (Recommandé)
```bash
npm install next-auth
```

### 2. Configuration NextAuth
```javascript
// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        
        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return user
        }
        return null
      }
    })
  ]
})
```

## 📊 Monitoring et Maintenance

### 1. Logs Railway
```bash
# Voir les logs en temps réel
railway logs
```

### 2. Backup automatique
```bash
# Script de backup quotidien
#!/bin/bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### 3. Monitoring
- Railway Dashboard pour les métriques
- Logs en temps réel
- Alertes par email

## 🚀 Déploiement Final

### 1. Variables d'environnement Railway
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=https://your-app.railway.app
```

### 2. Build et déploiement
```bash
# Railway détecte automatiquement
# package.json > scripts > build
npm run build
```

### 3. Domaine personnalisé
- Railway Dashboard > Settings > Domains
- Ajouter votre domaine personnalisé
- Configurer DNS

## ✅ Avantages de cette solution

1. **Pas de pause** : Railway ne met jamais en pause
2. **PostgreSQL natif** : Performance optimale
3. **Déploiement facile** : Git push = déploiement
4. **Monitoring intégré** : Logs et métriques
5. **Scaling automatique** : Adapte selon la charge
6. **Backup automatique** : Sécurité des données
