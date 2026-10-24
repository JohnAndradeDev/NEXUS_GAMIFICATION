import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { useLogout } from "../../hooks/useLogout";
import { getNavItems, type ActivePage } from "./navigation";

interface SidebarProps {
  activePage: ActivePage;
}

export function Sidebar({ activePage }: SidebarProps) {
  const { user } = useAuth();
  const logout = useLogout();

  if (!user) return null;

  const items = getNavItems(user.role);

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-full w-72 flex-col justify-between bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.3)] transition-all duration-300 lg:flex">
      <div className="flex flex-1 flex-col overflow-y-auto px-space-md pt-space-lg">
        <div className="mb-space-xl flex items-center gap-space-sm px-space-sm">
          <div className="flex flex-col">
            <span className="bg-linear-to-r from-primary-fixed via-primary to-secondary bg-clip-text text-2xl tracking-tight text-transparent">
              NEXUS
            </span>

            <span className="mt-space-xs font-label-sm text-label-sm uppercase tracking-wider text-primary">
              Enterprise Gamification
            </span>
          </div>
        </div>

        <div className="mb-space-xs px-space-sm">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Navegação Principal
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-space-xs">
          {items.map((item) => {
            const isActive = item.key === activePage;

            return (
              <Link
                key={item.key}
                to={item.to}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex items-center rounded-lg px-space-md py-space-sm transition-all",
                  isActive
                    ? "bg-primary-container font-headline-sm text-on-primary-container shadow-[0_0_16px_rgba(6,182,212,0.3)]"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                ].join(" ")}
              >
                <span className="material-symbols-outlined shrink-0 text-xl">
                  {item.icon}
                </span>
                <span className="ml-space-sm font-label-lg text-label-lg">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mx-space-md mb-4 border-t border-outline-variant/30 pt-space-md">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center rounded-lg px-space-md py-space-sm text-left text-error transition-all hover:bg-error/10"
        >
          <span className="material-symbols-outlined shrink-0 text-xl">
            logout
          </span>
          <span className="ml-space-sm font-label-lg text-label-lg">Sair</span>
        </button>
      </div>
    </aside>
  );
}
