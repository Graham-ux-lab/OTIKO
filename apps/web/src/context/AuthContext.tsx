import { createContext, useContext, useEffect, useState } from 'react';
import { api, type AuthResponse } from '../lib/api';

interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: string;
  organizerProfile?: {
    id: string;
    organizationName: string;
    status: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('otiko_access_token');
    if (token) {
      api
        .getMe()
        .then((data: User) => setUser(data))
        .catch(() => {
          localStorage.removeItem('otiko_access_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (emailOrPhone: string, password: string) => {
    const response: AuthResponse = await api.login(emailOrPhone, password);
    localStorage.setItem('otiko_access_token', response.accessToken);
    setUser(response.user);
    return response.user;
  };

  const logout = () => {
    localStorage.removeItem('otiko_access_token');
    localStorage.removeItem('otiko_refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
