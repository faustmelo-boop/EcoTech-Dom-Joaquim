import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, googleProvider, db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  school: string;
  role: 'admin' | 'teacher';
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  profile: AuthUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Sync user to firestore
        const userRef = doc(db, 'users', user.uid);
        let userDoc = await getDoc(userRef);
        let userData: AuthUser;
        
        if (!userDoc.exists()) {
          // Unify automatically: Check if email already exists
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // Existing profile found! Merge data.
            const existingData = querySnapshot.docs[0].data() as AuthUser;
            userData = {
              ...existingData,
              id: user.uid, // Map new UID to same person
              photoURL: user.photoURL || existingData.photoURL
            };
            await setDoc(userRef, userData);
          } else {
            const isAdminEmail = user.email === 'faustolsm@gmail.com';
            userData = {
              id: user.uid,
              name: user.displayName || 'Mestre',
              email: user.email || '',
              school: 'E. M. Dom Joaquim de Almeida',
              role: isAdminEmail ? 'admin' : 'teacher',
              photoURL: user.photoURL || undefined
            };
            await setDoc(userRef, userData);
          }
        } else {
          const data = userDoc.data() as AuthUser;
          const isAdminEmail = user.email === 'faustolsm@gmail.com';
          
          // Force update to admin if email matches but role is wrong
          if (isAdminEmail && data.role !== 'admin') {
            await updateDoc(userRef, { role: 'admin' });
            userData = { ...data, role: 'admin', photoURL: user.photoURL || undefined };
          } else {
            userData = { ...data, photoURL: user.photoURL || undefined };
            // Ensure name is synced if it was missing or generic
            if (user.displayName && (data.name === 'Professor' || !data.name)) {
              await updateDoc(userRef, { name: user.displayName });
              userData.name = user.displayName;
            }
          }
        }
        setProfile(userData);
        setUser(user);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      alert('Erro login Google: ' + error.message);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      alert('Erro login: ' + error.message);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(user, { displayName: name });
      
      // Manually trigger profile sync to ensure it happens with the correct name
      const userRef = doc(db, 'users', user.uid);
      const isAdminEmail = email === 'faustolsm@gmail.com';
      const userData: AuthUser = {
        id: user.uid,
        name: name,
        email: email,
        school: 'E. M. Dom Joaquim de Almeida',
        role: isAdminEmail ? 'admin' : 'teacher',
      };
      await setDoc(userRef, userData);
      setProfile(userData);
      setUser(user);
    } catch (error: any) {
      alert('Erro no cadastro: ' + error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signInWithEmail, signUpWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
