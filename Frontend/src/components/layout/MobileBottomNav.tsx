import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { useLogout } from "../../hooks/useLogout";
import { getNavItems, type ActivePage } from "./navigation";

interface MobileBottomNavProps {
  activePage: ActivePage;
}

const itemClass =
  "flex min-h-12 max-w-28 flex-1 flex-col items-center justify-center rounded-lg py-1 transition-colors";

export function MobileBottomNav({ activePage }: MobileBottomNavProps) {
  const { user } = useAuth();
  const logout = useLogout();

  if (!user) return null;

  const items = getNavItems(user.role);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around gap-1 border-t border-surface-container-high bg-surface-container-lowest/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_16px_rgba(0,0,0,0.4)] backdrop-blur-xl lg:hidden">
      {items.map((item) => {
        const isActive = item.key === activePage;

        return (
          <Link
            key={item.key}
            to={item.to}
            aria-current={isActive ? "page" : undefined}
            className={[
              itemClass,
              isActive
                ? "font-semibold text-primary"
                : "text-on-surface-variant hover:text-on-surface",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-xl">
              {item.icon}
            </span>
            <span className="mt-0.5 font-label-sm text-[10px]">
              {item.shortLabel}
            </span>
          </Link>
        );
      })}

      <button
        type="button"
        onClick={logout}
        className={[itemClass, "text-error"].join(" ")}
      >
        <span className="material-symbols-outlined text-xl">logout</span>
        <span className="mt-0.5 font-label-sm text-[10px]">Sair</span>
      </button>
    </nav>
  );
}
