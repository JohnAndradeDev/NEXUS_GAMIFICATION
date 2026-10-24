import { BrowserRouter } from "react-router";
import { LoaderCircle } from "lucide-react";

import { useAuth, type Role } from "../contexts/AuthContext";
import { NotificationsProvider } from "../contexts/NotificationsContext";
import { PointsProvider } from "../contexts/PointsContext";
import { AuthRoutes } from "./auth-routes";
import { UserRoutes } from "./UserRoutes";
import { ManagerRoutes } from "./ManagerRoutes";
import { AdminRoutes } from "./AdminRoutes";

function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-background text-primary">
      <LoaderCircle size={32} className="animate-spin" aria-label="Carregando" />
    </div>
  );
}

function routesByRole(role?: Role) {
  switch (role) {
    case "USER":
      return <UserRoutes />;
    case "GESTOR":
      return <ManagerRoutes />;
    case "ADMIN":
      return <AdminRoutes />;
    default:
      return <AuthRoutes />;
  }
}

export function Routes() {
  const { user, loading } = useAuth();

  // espera o GET /auth/me terminar, senão a tela de login pisca para quem já está logado
  if (loading) return <LoadingScreen />;

  return (
    <PointsProvider>
      <NotificationsProvider>
        <BrowserRouter>{routesByRole(user?.role)}</BrowserRouter>
      </NotificationsProvider>
    </PointsProvider>
  );
}
