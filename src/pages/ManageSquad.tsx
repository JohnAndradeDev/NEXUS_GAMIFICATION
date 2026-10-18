import { useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import { SquadHeader } from "../components/ManageSquad/SquadHeader";
import { MembersGrid } from "../components/ManageSquad/MembersGrid";
import { MemberInspector } from "../components/ManageSquad/MemberInspector";
import { AddMemberModal } from "../components/ManageSquad/AddMemberModal";
import { RemoveMemberModal } from "../components/ManageSquad/RemoveMemberModal";
import { ToastNotification } from "../components/ManageSquad/ToastNotification";

export function ManageSquad() {
  const [selectedMember, setSelectedMember] = useState("João Silveira");
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");

  function showToast(message: string) {
    setToastMessage(message);

    window.setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }

  function handleRemoveMember() {
    if (!memberToRemove) return;

    showToast(`Membro ${memberToRemove} removido do squad.`);
    setMemberToRemove(null);
  }

  function handleAddMember() {
    setIsAddModalOpen(false);
    showToast("Membro adicionado com sucesso ao CyberTitans.");
  }

  return (
    <AppLayout activePage="squad">
      <div className="mt-4 flex w-full flex-col pb-12 sm:mt-0 sm:pb-16">
        <SquadHeader
          search={search}
          onSearchChange={setSearch}
          department={department}
          onDepartmentChange={setDepartment}
          onAddMember={() => setIsAddModalOpen(true)}
        />

        <div className="flex flex-col items-start gap-6 sm:gap-8 xl:grid xl:grid-cols-12">
          <MembersGrid
            search={search}
            department={department}
            selectedMember={selectedMember}
            onSelectMember={setSelectedMember}
            onRemoveMember={setMemberToRemove}
          />

          <MemberInspector selectedMember={selectedMember} />
        </div>
      </div>

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddMember}
      />

      <RemoveMemberModal
        memberName={memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleRemoveMember}
      />

      <ToastNotification message={toastMessage} />
    </AppLayout>
  );
}
