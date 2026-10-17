import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig.ts';

let app: any = null;
let authInstance: Auth | null = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_FIREBASE_WEB_API_KEY') {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    authInstance = getAuth(app);
  }
} catch (e) {
  console.warn('[Firebase Initialization Warning]', e);
}

export const auth = authInstance as Auth;
export const googleAuthProvider = new GoogleAuthProvider();
