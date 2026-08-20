import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as api from './api';
import type { SessionUser } from './types';

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<SessionUser>;
  register: (name: string, email: string, phone: string, password: string) => Promise<SessionUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('otiko_access_token')) {
      setLoading(false);
      return;
    }
    api
      .getProfile()
      .then(setUser)
      .catch(() => localStorage.removeItem('otiko_access_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (emailOrPhone: string, password: string) => {
    await api.login(emailOrPhone, password);
    const profile = await api.getProfile();
    setUser(profile);
    return profile;
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    await api.register(name, email, phone, password);
    const profile = await api.getProfile();
    setUser(profile);
    return profile;
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
