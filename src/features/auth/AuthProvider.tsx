'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { debugLog, errorLog } from '@/utils/log';

export interface AuthContextType {
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
      debugLog('[AuthProvider] onAuthStateChanged', firebaseUser);
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      debugLog('[AuthProvider] login called', { email });
      await signInWithEmailAndPassword(auth, email, password);
      debugLog('[AuthProvider] login success', { email });
    } catch (err) {
      errorLog('[AuthProvider] login failed', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      debugLog('[AuthProvider] logout called');
      await signOut(auth);
      debugLog('[AuthProvider] logout success');
    } catch (err) {
      errorLog('[AuthProvider] logout failed', err);
      throw err;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      debugLog('[AuthProvider] signup called', { email });
      await createUserWithEmailAndPassword(auth, email, password);
      debugLog('[AuthProvider] signup success', { email });
    } catch (err) {
      errorLog('[AuthProvider] signup failed', err);
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
