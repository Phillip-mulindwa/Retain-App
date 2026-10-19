import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authApi from '../../api/auth';
import { extractErrorMessage } from '../../api/client';
import type { User } from '../../types';

const TOKEN_KEY = 'retain_token';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// This is the ONE place authentication lives in the app - no Redux
// involved. Signup/login/logout, the current user, and their role all
// flow through this Context, and ProtectedRoute/AdminRoute below read
// straight from it to guard routes.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  // On a hard refresh there's no user in memory yet, only a token in
  // localStorage (if any). Hydrate the real user from the API so a
  // refreshed page doesn't bounce a logged-in user back to /login.
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .fetchMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  async function login(email: string, password: string) {
    try {
      const { user: loggedInUser, token: newToken } = await authApi.login(email, password);
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      setUser(loggedInUser);
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  }

  async function signup(name: string, email: string, password: string) {
    try {
      const { user: newUser, token: newToken } = await authApi.signup(name, email, password);
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      setUser(newUser);
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      signup,
      logout,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider.');
  return ctx;
}
