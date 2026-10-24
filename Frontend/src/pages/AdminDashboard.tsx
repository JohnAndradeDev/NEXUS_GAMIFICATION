import { useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import { AdminHeader } from "../components/AdminDashboard/AdminHeader";
import { AdminMetrics } from "../components/AdminDashboard/AdminMetrics";
import { UserRegistrationForm } from "../components/AdminDashboard/UserRegistrationForm";
import { UserDirectory } from "../components/AdminDashboard/UserDirectory";
import { AdminActionModal } from "../components/AdminDashboard/AdminActionModal";
import { AdminToast } from "../components/AdminDashboard/AdminToast";

export function Admin() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [modalUser, setModalUser] = useState<string | null>(null);
  const [modalAction, setModalAction] = useState<
    "Desativar" | "Reativar" | null
  >(null);

  function showToast(message: string) {
    setToastMessage(message);

    window.setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  }

  function openStatusModal(userName: string, action: "Desativar" | "Reativar") {
    setModalUser(userName);
    setModalAction(action);
  }

  function closeStatusModal() {
    setModalUser(null);
    setModalAction(null);
  }

  function confirmStatusChange() {
    if (!modalUser || !modalAction) return;

    showToast(`Status do usuário ${modalUser} atualizado com sucesso.`);

    closeStatusModal();
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

        <AdminMetrics />

        <UserRegistrationForm
          onSuccess={() =>
            showToast(
              "Usuário cadastrado com sucesso e credenciais enviadas por e-mail.",
            )
          }
        />

        <UserDirectory
          onStatusChange={openStatusModal}
          onAction={(message) => showToast(message)}
        />
      </div>

      <AdminActionModal
        userName={modalUser}
        action={modalAction}
        onClose={closeStatusModal}
        onConfirm={confirmStatusChange}
      />

      <AdminToast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </AppLayout>
  );
}
