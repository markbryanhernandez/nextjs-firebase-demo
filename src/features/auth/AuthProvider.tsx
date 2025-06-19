'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '../../lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.debug('[AuthProvider] onAuthStateChanged', firebaseUser);
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.debug('[AuthProvider] login called', { email });
      await signInWithEmailAndPassword(auth, email, password);
      console.debug('[AuthProvider] login success', { email });
    } catch (err) {
      console.error('[AuthProvider] login error', err);
      throw err;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      console.debug('[AuthProvider] signup called', { email });
      await createUserWithEmailAndPassword(auth, email, password);
      console.debug('[AuthProvider] signup success', { email });
    } catch (err) {
      console.error('[AuthProvider] signup error', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      console.debug('[AuthProvider] logout called');
      await signOut(auth);
      console.debug('[AuthProvider] logout success');
    } catch (err) {
      console.error('[AuthProvider] logout error', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
