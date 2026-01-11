import { createContext } from 'react';

export type Role = 'ADMIN' | 'VIEWER';

export interface AuthUser {
  id: number;
  email: string;
  name?: string;
  role: Role;
}

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
