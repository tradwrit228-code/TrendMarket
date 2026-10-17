import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onIdTokenChanged 
} from 'firebase/auth';
import { auth, googleAuthProvider, isFirebaseConfigured } from '../lib/firebase';

export interface DbUserProfile {
  id: number;
  uid: string;
  email: string;
  displayName?: string | null;
  photoUrl?: string | null;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  dbUser: DbUserProfile | null;
  token: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  dbUser: null,
  token: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  getIdToken: async () => null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [dbUser, setDbUser] = useState<DbUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync user with PostgreSQL Cloud SQL backend
  const syncWithDatabase = useCallback(async (firebaseUser: User, idToken: string) => {
    try {
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          displayName: firebaseUser.displayName,
          photoUrl: firebaseUser.photoURL,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setDbUser(data.user);
      }
    } catch (err) {
      console.error('Failed to sync user with database:', err);
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          try {
            const freshToken = await currentUser.getIdToken();
            setToken(freshToken);
            await syncWithDatabase(currentUser, freshToken);
          } catch (e) {
            console.error('Error fetching token:', e);
          }
        } else {
          setToken(null);
          setDbUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Auth observer error:', e);
      setLoading(false);
    }
  }, [syncWithDatabase]);

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth) {
      alert("Firebase Authentication n'est pas configuré. Veuillez configurer vos clés API Firebase dans les variables d'environnement (.env) pour activer la connexion Google.");
      return;
    }
    try {
      setLoading(true);
      const cred = await signInWithPopup(auth, googleAuthProvider);
      if (cred.user) {
        const idToken = await cred.user.getIdToken();
        setToken(idToken);
        await syncWithDatabase(cred.user, idToken);
      }
    } catch (error) {
      console.error('Google Sign-in failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!isFirebaseConfigured || !auth) {
      setUser(null);
      setToken(null);
      setDbUser(null);
      return;
    }
    try {
      await fbSignOut(auth);
      setUser(null);
      setToken(null);
      setDbUser(null);
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  const getIdToken = async () => {
    if (!auth || !auth.currentUser) return null;
    const freshToken = await auth.currentUser.getIdToken();
    setToken(freshToken);
    return freshToken;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        token,
        loading,
        signInWithGoogle,
        signOut,
        getIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
