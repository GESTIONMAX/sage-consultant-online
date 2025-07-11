# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/b0ea48de-2420-4fca-9fb6-d9986ccc31e1

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b0ea48de-2420-4fca-9fb6-d9986ccc31e1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Option 1: Using Lovable

Simply open [Lovable](https://lovable.dev/projects/b0ea48de-2420-4fca-9fb6-d9986ccc31e1) and click on Share -> Publish.

### Option 2: Deployment with Coolify

This project is configured for deployment with Coolify. The following files have been added to support this:

- `Dockerfile` - Configuration pour la construction de l'image Docker
- `nginx.conf` - Configuration NGINX optimisée pour une SPA React
- `.dockerignore` - Liste des fichiers à exclure du conteneur Docker
- `docker-compose.yml` - Configuration pour l'exécution multi-conteneur

#### Étapes de déploiement sur Coolify

1. **Prérequis**
   - Un serveur Coolify configuré
   - Accès à votre dépôt Git

2. **Configuration de l'environnement**
   Configurer les variables d'environnement suivantes dans Coolify:
   ```
   VITE_SUPABASE_URL=https://votre-instance-supabase.url
   VITE_SUPABASE_ANON_KEY=votre-clé-anon-supabase
   ```

3. **Déploiement**
   - Connectez votre dépôt Git à Coolify
   - Sélectionnez la branche à déployer
   - Utilisez la configuration Docker détectée automatiquement
   - Lancez le build et le déploiement

4. **Vérification**
   - Une fois le déploiement terminé, vérifiez que l'application fonctionne correctement
   - Vérifiez la connexion à Supabase

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
