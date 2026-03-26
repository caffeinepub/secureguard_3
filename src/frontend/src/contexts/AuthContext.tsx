import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthToken {
  email: string;
  expiry: number;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  email: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const DEMO_EMAIL = "admin@sentinel.com";
const DEMO_PASSWORD = "password123";
const STORAGE_KEY = "sentinel_auth_token";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthToken | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      const parsed: AuthToken = JSON.parse(stored);
      if (parsed.expiry < Date.now()) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!auth) return;
    const remaining = auth.expiry - Date.now();
    if (remaining <= 0) {
      setAuth(null);
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const timer = setTimeout(() => {
      setAuth(null);
      localStorage.removeItem(STORAGE_KEY);
    }, remaining);
    return () => clearTimeout(timer);
  }, [auth]);

  const login = useCallback((email: string, password: string): boolean => {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const token: AuthToken = { email, expiry: Date.now() + 30 * 60 * 1000 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(token));
      setAuth(token);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  }, []);

  const isAuthenticated = auth !== null && auth.expiry > Date.now();

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, email: auth?.email ?? null, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
