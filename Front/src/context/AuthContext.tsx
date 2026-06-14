import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { auth as authApi } from "../api/auth";
import { TOKEN_KEY } from "../api/client";
import type { AuthResponse, MeResponse, Role } from "../api/types";

interface AuthState {
  user: MeResponse | null;
  loading: boolean;
  isAuthenticated: boolean;
  role: Role | null;
  loginClient: (email: string, password: string) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  initiateRegistration: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<string>;
  completeRegistration: (email: string, code: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refreshMe(); }, [refreshMe]);

  const handleAuthResponse = async (resp: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, resp.token);
    await refreshMe();
  };

  const value: AuthState = {
    user,
    loading,
    isAuthenticated: !!user,
    role: user?.role ?? null,
    loginClient: async (email, password) => handleAuthResponse(await authApi.loginClient(email, password)),
    loginAdmin: async (email, password) => handleAuthResponse(await authApi.loginAdmin(email, password)),
    initiateRegistration: async (data) => {
      const result = await authApi.initiateRegister(data);
      return result.email;
    },
    completeRegistration: async (email, code) => handleAuthResponse(await authApi.verifyEmail(email, code)),
    logout: () => {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    },
    refreshMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
