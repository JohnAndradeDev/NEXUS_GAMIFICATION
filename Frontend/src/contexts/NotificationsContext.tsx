import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getUnreadCount } from "../lib/notifications";
import { useAuth } from "./AuthContext";

interface NotificationsContextValue {
  unreadCount: number;
  refreshUnread: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null,
);

const POLL_MS = 60_000;

// Mantém o número de notificações não lidas (badge do sino). Consulta a API a cada minuto
// enquanto a aba está visível e de novo quando a pessoa volta para ela.
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnread = useCallback(async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.unreadCount);
    } catch {
      // mantém o último valor conhecido
    }
  }, []);

  useEffect(() => {
    if (userId === undefined) {
      setUnreadCount(0);
      return;
    }

    void refreshUnread();

    const refreshIfVisible = () => {
      if (document.visibilityState === "visible") void refreshUnread();
    };

    const timer = window.setInterval(refreshIfVisible, POLL_MS);
    document.addEventListener("visibilitychange", refreshIfVisible);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    };
  }, [userId, refreshUnread]);

  const value = useMemo(
    () => ({ unreadCount, refreshUnread }),
    [unreadCount, refreshUnread],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error(
      "useNotifications deve ser usado dentro de <NotificationsProvider>",
    );
  return ctx;
}
