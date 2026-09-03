import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiFetch } from './api';
import type { CurrentUser } from './types';

const TOKEN_KEY = 'mon_bazar_token';

interface AuthContextValue {
  authToken: string | null;
  currentUser: CurrentUser | null;
  isLoading: boolean;
  login: (token: string, user: CurrentUser) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (patch: Partial<CurrentUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!stored) {
        setIsLoading(false);
        return;
      }
      try {
        const user = await apiFetch<CurrentUser>('/api/me', { token: stored });
        setAuthToken(stored);
        setCurrentUser(user);
      } catch {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = (token: string, user: CurrentUser) => {
    SecureStore.setItemAsync(TOKEN_KEY, token);
    setAuthToken(token);
    setCurrentUser(user);
  };

  const logout = () => {
    SecureStore.deleteItemAsync(TOKEN_KEY);
    setAuthToken(null);
    setCurrentUser(null);
  };

  const refreshUser = async () => {
    if (!authToken) return;
    const user = await apiFetch<CurrentUser>('/api/me', { token: authToken });
    setCurrentUser(user);
  };

  const updateUser = (patch: Partial<CurrentUser>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  return (
    <AuthContext.Provider value={{ authToken, currentUser, isLoading, login, logout, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
