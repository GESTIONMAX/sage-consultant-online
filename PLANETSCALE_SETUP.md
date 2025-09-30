# Configuration PlanetScale - Alternative MySQL

## 🪐 Déploiement PlanetScale

### 1. Créer un compte PlanetScale
- Aller sur [planetscale.com](https://planetscale.com)
- Se connecter avec GitHub
- Créer une nouvelle base de données

### 2. Configuration de la base
```sql
-- Créer les tables principales
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role ENUM('admin', 'client') DEFAULT 'client',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE clients (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3. Variables d'environnement
```env
# PlanetScale Database
DATABASE_URL=mysql://username:password@host/database?sslaccept=strict
DB_HOST=aws.connect.psdb.cloud
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
```

## 🔄 Migration depuis Supabase

### 1. Script de migration
```javascript
// migrate-to-planetscale.js
import { createConnection } from 'mysql2/promise'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
const planetscale = await createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
})

// Migrer les utilisateurs
const { data: users } = await supabase.from('users').select('*')
for (const user of users) {
  await planetscale.execute(
    'INSERT INTO users (id, email, name, role) VALUES (?, ?, ?, ?)',
    [user.id, user.email, user.name, user.role]
  )
}
```

## 🛠️ Configuration Prisma avec PlanetScale

### 1. Schema Prisma pour MySQL
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      String   @default("client")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  @@map("users")
}

model Client {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  company   String?
  phone     String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  @@map("clients")
}
```

## 🔐 Authentification avec PlanetScale

### 1. JWT avec jsonwebtoken
```bash
npm install jsonwebtoken bcryptjs
```

### 2. Service d'authentification
```javascript
// lib/auth.js
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET

export async function authenticateUser(email, password) {
  const user = await prisma.user.findUnique({
    where: { email }
  })
  
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    return { user, token }
  }
  return null
}
```

## 📊 Avantages PlanetScale

### ✅ Avantages
- **Pas de pause** : Serverless MySQL
- **Branching** : Environnements de développement
- **Scaling automatique** : Adapte la charge
- **Backup automatique** : Sécurité des données
- **Monitoring** : Métriques détaillées

### ⚠️ Inconvénients
- **MySQL** : Syntaxe différente de PostgreSQL
- **Migration** : Nécessite adaptation du code
- **Auth** : À implémenter manuellement

## 🚀 Déploiement Vercel + PlanetScale

### 1. Configuration Vercel
```json
{
  "env": {
    "DATABASE_URL": "@database_url",
    "JWT_SECRET": "@jwt_secret"
  }
}
```

### 2. Variables d'environnement
```bash
# Dans Vercel Dashboard
DATABASE_URL=mysql://...
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

### 3. Déploiement
```bash
# Connecter GitHub à Vercel
# Vercel détecte automatiquement le build
npm run build
```

## 🔄 Comparaison des Solutions

| Solution | Base de données | Pause | Auth | Complexité |
|----------|----------------|-------|------|------------|
| **Railway** | PostgreSQL | ❌ Non | ⚠️ Manuel | 🟡 Moyenne |
| **PlanetScale** | MySQL | ❌ Non | ⚠️ Manuel | 🟡 Moyenne |
| **Supabase** | PostgreSQL | ❌ Oui | ✅ Intégrée | 🟢 Facile |

## 🎯 Recommandation

**Pour votre projet Sage Consultant :**

1. **Railway** si vous voulez garder PostgreSQL
2. **PlanetScale** si vous acceptez MySQL
3. **Migration progressive** : Garder Supabase en dev, Railway/PlanetScale en prod
