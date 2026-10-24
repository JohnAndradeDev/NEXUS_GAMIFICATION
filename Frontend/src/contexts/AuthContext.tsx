import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, setUnauthorizedHandler } from "../lib/api";

export type Role = "USER" | "GESTOR" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: "ACTIVE" | "INACTIVE";
  sector: string | null;
  jobTitle: string | null;
  avatarUrl: string | null;
  level: number;
  experience: number;
  squadId: number | null;
  squad: { id: number; name: string } | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ao abrir o app, descobre se já existe uma sessão válida (cookie)
  useEffect(() => {
    api<{ user: User }>("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // sessão expirada: qualquer rota protegida que responda 401 derruba o usuário
  // e o app volta para a tela de login
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = useCallback(
    async (email: string, password: string, remember = true) => {
      const data = await api<{ user: User }>("/auth/login", {
        method: "POST",
        json: { email, password, remember },
      });
      setUser(data.user);
      return data.user;
    },
    [],
  );

  const logout = useCallback(async () => {
    await api<void>("/auth/logout", { method: "POST" }).catch(() => undefined);
    setUser(null);
  }, []);

  // recarrega o usuário (ex.: XP e nível mudaram depois de concluir uma tarefa)
  const refreshUser = useCallback(async () => {
    try {
      const data = await api<{ user: User }>("/auth/me");
      setUser(data.user);
    } catch {
      // se a sessão expirou, o próximo carregamento da página volta ao login
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, refreshUser }),
    [user, loading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
