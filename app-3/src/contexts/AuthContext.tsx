import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthContextType } from '@/types';
import { mockSupabase, mockDb } from '@/lib/mockSupabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data } = await mockSupabase.auth.getUser();
      if (data && data.user) {
        setUser(data.user);
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await mockSupabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data && data.user) {
        setUser(data.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      // Use mockDb directly to include username
      const newUser = await mockDb.signUp(email, password, username);
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await mockSupabase.auth.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
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
