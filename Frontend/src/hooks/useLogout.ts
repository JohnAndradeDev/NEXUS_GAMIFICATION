import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

// Encerra a sessão e volta para "/", que passa a ser a tela de login.
export function useLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useCallback(async () => {
    // navega antes de limpar a sessão, para o login não cair em uma rota inexistente
    navigate("/", { replace: true });
    await logout();
  }, [logout, navigate]);
}
