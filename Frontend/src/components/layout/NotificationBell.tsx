import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useNotifications } from "../../contexts/NotificationsContext";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type AppNotification,
  type NotificationType,
} from "../../lib/notifications";
import { formatLastAccess, getErrorMessages } from "../../lib/users";

const TYPE_STYLE: Record<NotificationType, { icon: string; tone: string }> = {
  TASK_ASSIGNED: { icon: "assignment", tone: "bg-primary/15 text-primary" },
  TASK_UPDATED: { icon: "edit_note", tone: "bg-secondary/15 text-secondary" },
  TASK_REMOVED: { icon: "person_remove", tone: "bg-surface-container-highest text-on-surface-variant" },
  TASK_CANCELED: { icon: "cancel", tone: "bg-error/15 text-error" },
  TASK_COMPLETED: { icon: "task_alt", tone: "bg-tertiary/15 text-tertiary" },
  POINTS: { icon: "stars", tone: "bg-primary/15 text-primary" },
  ACHIEVEMENT: { icon: "military_tech", tone: "bg-[#F59E0B]/15 text-[#F59E0B]" },
  LEVEL_UP: { icon: "upgrade", tone: "bg-tertiary/15 text-tertiary" },
  SQUAD: { icon: "groups", tone: "bg-secondary/15 text-secondary" },
};

const PAGE_SIZE = 15;

export function NotificationBell() {
  const navigate = useNavigate();
  const { unreadCount, refreshUnread } = useNotifications();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ao abrir, carrega a lista e confere o contador
  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    listNotifications({ perPage: PAGE_SIZE })
      .then((result) => {
        if (!cancelled) setItems(result.items);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessages(err).join(" "));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    void refreshUnread();

    return () => {
      cancelled = true;
    };
  }, [open, refreshUnread]);

  // fecha ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!open) return;

    function handlePointer(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function handleItemClick(item: AppNotification) {
    if (!item.readAt) {
      const now = new Date().toISOString();
      setItems((current) => current.map((n) => (n.id === item.id ? { ...n, readAt: now } : n)));
      markNotificationRead(item.id)
        .then(refreshUnread)
        .catch(() => undefined);
    }

    setOpen(false);
    if (item.link) navigate(item.link);
  }

  async function handleReadAll() {
    try {
      await markAllNotificationsRead();
      const now = new Date().toISOString();
      setItems((current) => current.map((n) => ({ ...n, readAt: n.readAt ?? now })));
      await refreshUnread();
    } catch (err) {
      setError(getErrorMessages(err).join(" "));
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={
          unreadCount > 0 ? `Notificações, ${unreadCount} não lidas` : "Notificações"
        }
        aria-expanded={open}
        aria-haspopup="dialog"
        className="relative flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface sm:h-10 sm:w-10"
      >
        <span className="material-symbols-outlined text-lg sm:text-xl">notifications</span>

        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-label-sm text-[10px] font-bold leading-none text-on-primary ring-2 ring-surface-container-lowest">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notificações"
          className="fixed left-4 right-4 top-[4.5rem] z-50 flex max-h-[70vh] flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-high shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96"
        >
          <div className="flex items-center justify-between gap-2 border-b border-outline-variant/20 px-space-md py-space-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Notificações</h2>

            <button
              type="button"
              onClick={handleReadAll}
              disabled={unreadCount === 0}
              className="font-label-sm text-label-sm text-primary hover:underline disabled:cursor-not-allowed disabled:text-outline disabled:no-underline"
            >
              Marcar todas como lidas
            </button>
          </div>

          <div className="overflow-y-auto">
            {loading && items.length === 0 && (
              <p className="p-space-lg text-center font-body-sm text-body-sm text-outline">
                Carregando...
              </p>
            )}

            {error && (
              <p role="alert" className="p-space-md text-center font-body-sm text-body-sm text-error">
                {error}
              </p>
            )}

            {!loading && !error && items.length === 0 && (
              <div className="flex flex-col items-center p-space-lg text-center">
                <span className="material-symbols-outlined mb-1 text-3xl text-outline">
                  notifications_off
                </span>
                <p className="font-body-sm text-body-sm text-outline">
                  Nenhuma notificação por enquanto.
                </p>
              </div>
            )}

            <ul className="divide-y divide-outline-variant/15">
              {items.map((item) => {
                const style = TYPE_STYLE[item.type];
                const unread = !item.readAt;

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className={[
                        "flex w-full items-start gap-space-sm px-space-md py-3 text-left transition-colors hover:bg-surface-container-highest/60",
                        unread ? "bg-primary/5" : "",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          style.tone,
                        ].join(" ")}
                      >
                        <span className="material-symbols-outlined text-lg">{style.icon}</span>
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span
                            className={[
                              "font-label-md text-label-md",
                              unread ? "font-bold text-on-surface" : "text-on-surface-variant",
                            ].join(" ")}
                          >
                            {item.title}
                          </span>
                          {unread && (
                            <span
                              aria-label="Não lida"
                              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                            />
                          )}
                        </span>
                        <span className="block font-body-sm text-body-sm text-on-surface-variant">
                          {item.message}
                        </span>
                        <span className="mt-0.5 block font-label-sm text-label-sm text-outline">
                          {formatLastAccess(item.createdAt)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
