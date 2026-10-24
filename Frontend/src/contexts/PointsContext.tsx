import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getPointsSummary, type PointsSummary } from "../lib/points";
import { useAuth } from "./AuthContext";

interface PointsContextValue {
  summary: PointsSummary | null;
  refreshSummary: () => Promise<void>;
}

const PointsContext = createContext<PointsContextValue | null>(null);

// Carrega o resumo de pontos uma vez por sessão; o header, a barra mobile e o
// dashboard leem do mesmo lugar e se atualizam juntos.
export function PointsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [summary, setSummary] = useState<PointsSummary | null>(null);

  const refreshSummary = useCallback(async () => {
    try {
      const data = await getPointsSummary();
      setSummary(data.summary);
    } catch {
      // mantém o último resumo (ou os traços "—")
    }
  }, []);

  useEffect(() => {
    if (userId === undefined) {
      setSummary(null);
      return;
    }
    void refreshSummary();
  }, [userId, refreshSummary]);

  const value = useMemo(() => ({ summary, refreshSummary }), [summary, refreshSummary]);

  return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>;
}

export function usePoints() {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error("usePoints deve ser usado dentro de <PointsProvider>");
  return ctx;
}
