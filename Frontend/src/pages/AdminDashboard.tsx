import { useEffect, useRef, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import { AdminHeader } from "../components/AdminDashboard/AdminHeader";
import { AdminMetrics } from "../components/AdminDashboard/AdminMetrics";
import { UserRegistrationForm } from "../components/AdminDashboard/UserRegistrationForm";
import { UserDirectory } from "../components/AdminDashboard/UserDirectory";
import { AdminActionModal } from "../components/AdminDashboard/AdminActionModal";
import { EditUserModal } from "../components/AdminDashboard/EditUserModal";
import { PointsAdjustModal } from "../components/AdminDashboard/PointsAdjustModal";
import { AchievementDirectory } from "../components/AdminDashboard/AchievementDirectory";
import { SquadDirectory } from "../components/AdminDashboard/SquadDirectory";
import { AdminToast } from "../components/AdminDashboard/AdminToast";
import {
  getErrorMessages,
  listSquads,
  setUserStatus,
  type ApiUser,
  type Squad,
} from "../lib/users";

type StatusAction = "Desativar" | "Reativar";

export function Admin() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  // incrementa para a tabela e as métricas recarregarem depois de uma alteração
  const [refreshKey, setRefreshKey] = useState(0);
  const [squads, setSquads] = useState<Squad[]>([]);

  const [statusTarget, setStatusTarget] = useState<{
    user: ApiUser;
    action: StatusAction;
  } | null>(null);
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const [editTarget, setEditTarget] = useState<ApiUser | null>(null);
  const [pointsTarget, setPointsTarget] = useState<ApiUser | null>(null);

  useEffect(() => {
    listSquads()
      .then((data) => setSquads(data.items))
      .catch(() => setSquads([]));
  }, [refreshKey]);

  function refresh() {
    setRefreshKey((key) => key + 1);
  }

  function showToast(message: string) {
    window.clearTimeout(toastTimer.current);
    setToastMessage(message);

    toastTimer.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  }

  function openStatusModal(user: ApiUser, action: StatusAction) {
    setStatusError(null);
    setStatusTarget({ user, action });
  }

  function closeStatusModal() {
    setStatusTarget(null);
    setStatusError(null);
  }

  async function confirmStatusChange() {
    if (!statusTarget) return;
    const { user, action } = statusTarget;

    setStatusSubmitting(true);
    setStatusError(null);

    try {
      await setUserStatus(user.id, action === "Desativar" ? "INACTIVE" : "ACTIVE");
      showToast(`Status do usuário ${user.name} atualizado com sucesso.`);
      closeStatusModal();
      refresh();
    } catch (err) {
      setStatusError(getErrorMessages(err).join(" "));
    } finally {
      setStatusSubmitting(false);
    }
  }

  return (
    <AppLayout activePage="admin">
      <div className="flex w-full flex-col pb-space-xl">
        <AdminHeader
          onNewUser={() => {
            document
              .getElementById("cadastro-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        <AdminMetrics refreshKey={refreshKey} />

        <UserRegistrationForm
          squads={squads}
          onSuccess={() => {
            showToast("Usuário cadastrado com sucesso.");
            refresh();
          }}
        />

        <UserDirectory
          refreshKey={refreshKey}
          onStatusChange={openStatusModal}
          onEdit={setEditTarget}
          onPoints={setPointsTarget}
        />

        <SquadDirectory refreshKey={refreshKey} onChanged={refresh} onToast={showToast} />

        <AchievementDirectory refreshKey={refreshKey} onChanged={refresh} onToast={showToast} />
      </div>

      <AdminActionModal
        userName={statusTarget?.user.name ?? null}
        action={statusTarget?.action ?? null}
        submitting={statusSubmitting}
        error={statusError}
        onClose={closeStatusModal}
        onConfirm={confirmStatusChange}
      />

      <EditUserModal
        user={editTarget}
        squads={squads}
        onClose={() => setEditTarget(null)}
        onSaved={(message) => {
          showToast(message);
          setEditTarget(null);
          refresh();
        }}
      />

      <PointsAdjustModal
        user={pointsTarget}
        onClose={() => setPointsTarget(null)}
        onSaved={(message) => {
          showToast(message);
          setPointsTarget(null);
          refresh();
        }}
      />

      <AdminToast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </AppLayout>
  );
}
