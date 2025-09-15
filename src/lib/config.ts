// Configuration centralisée avec validation
interface Config {
  supabase: {
    url: string;
    anonKey: string;
  };
  isDevelopment: boolean;
  isProduction: boolean;
}

// Validation des variables d'environnement
function validateEnvVar(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Variable d'environnement manquante: ${name}`);
  }
  return value;
}

// Configuration avec validation
export const config: Config = {
  supabase: {
    url: validateEnvVar('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
    anonKey: validateEnvVar('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY),
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Logger sécurisé pour la production
export const logger = {
  log: (...args: unknown[]) => {
    if (config.isDevelopment) {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (config.isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // Les erreurs sont toujours loggées
    console.error(...args);
  },
};