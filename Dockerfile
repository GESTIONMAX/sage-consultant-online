FROM node:18-alpine as build

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm ci

# Copie des fichiers du projet
COPY . .

# Création d'un fichier .env.production avec les variables d'environnement
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

RUN echo "VITE_SUPABASE_URL=${VITE_SUPABASE_URL}" > .env.production
RUN echo "VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}" >> .env.production

# Force Vite à utiliser le mode production pour éviter les erreurs de résolution de modules
ENV NODE_ENV=production

# Créer un tsconfig temporaire qui force l'inclusion de tous les dossiers src
RUN echo '{"compilerOptions":{"baseUrl":".","paths":{"@/*":["./src/*"]}},"include":["src/**/*"]}' > tsconfig.json.build
RUN cat tsconfig.json.build >> tsconfig.json

# Réparer les imports problématiques si nécessaire
RUN find ./src -name "*.ts" -o -name "*.tsx" | xargs grep -l "../lib/supabase" | xargs -r sed -i 's|../lib/supabase|../lib|g'

# Build de l'application
RUN npm run build

# Étape de production
FROM nginx:alpine

# Copie des fichiers de build vers le dossier de NGINX
COPY --from=build /app/dist /usr/share/nginx/html

# Copie d'un fichier de configuration NGINX personnalisé
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
