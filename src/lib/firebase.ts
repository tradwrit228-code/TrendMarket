import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig.ts';

let app: any = null;
let authInstance: Auth | null = null;

const hasValidConfig = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'YOUR_FIREBASE_WEB_API_KEY' &&
  !firebaseConfig.apiKey.includes('YOUR_')
);

if (hasValidConfig) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    authInstance = getAuth(app);
  } catch (e) {
    console.warn('[Firebase Initialization Warning] Could not initialize Firebase:', e);
  }
} else {
  console.info('[Firebase Info] Firebase API key not configured or placeholder. Running in offline/guest mode.');
}

export const auth = authInstance as Auth;
export const googleAuthProvider = (() => {
  try {
    return new GoogleAuthProvider();
  } catch {
    return {} as GoogleAuthProvider;
  }
})();
export const isFirebaseConfigured = hasValidConfig && authInstance !== null;
