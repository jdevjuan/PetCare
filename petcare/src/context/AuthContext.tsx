import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import * as api from '../lib/api';
import type { RegisterInput } from '../lib/validators';
import type { PublicUser } from '../types';

interface AuthValue {
  user: PublicUser | null;
  login: (email: string, password: string) => Promise<PublicUser>;
  register: (data: RegisterInput) => Promise<PublicUser>;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(() => api.getCurrentUser());

  const value: AuthValue = {
    user,
    login: async (email, password) => {
      const logged = await api.login({ email, password });
      setUser(logged);
      return logged;
    },
    register: async (data) => {
      const created = await api.register(data);
      setUser(created);
      return created;
    },
    logout: () => {
      api.logout();
      setUser(null);
    },
    refresh: () => setUser(api.getCurrentUser()),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
