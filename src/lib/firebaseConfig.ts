/**
 * Secure Firebase Configuration Resolver
 *
 * Priorities:
 * 1. Environment variables from .env / import.meta.env (VITE_FIREBASE_*)
 * 2. Local gitignored firebase-applet-config.json if present
 * 3. Graceful fallback for fresh clones
 */

interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  oAuthClientId?: string;
}

// Safely probe for local gitignored config file using Vite's glob import
// If the file is omitted or gitignored on fresh clones, Vite returns {} without build errors
const configModules = import.meta.glob<{ default: Record<string, string> }>(
  '../../firebase-applet-config.json',
  { eager: true }
);

const localFileConfig = configModules['../../firebase-applet-config.json']?.default || {};
const env = import.meta.env;

export const firebaseConfig: FirebaseClientConfig = {
  apiKey: (env.VITE_FIREBASE_API_KEY as string) || localFileConfig.apiKey || '',
  authDomain: (env.VITE_FIREBASE_AUTH_DOMAIN as string) || localFileConfig.authDomain || '',
  projectId: (env.VITE_FIREBASE_PROJECT_ID as string) || localFileConfig.projectId || '',
  storageBucket: (env.VITE_FIREBASE_STORAGE_BUCKET as string) || localFileConfig.storageBucket || '',
  messagingSenderId: (env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || localFileConfig.messagingSenderId || '',
  appId: (env.VITE_FIREBASE_APP_ID as string) || localFileConfig.appId || '',
  oAuthClientId: (env.VITE_FIREBASE_OAUTH_CLIENT_ID as string) || localFileConfig.oAuthClientId || '',
};
