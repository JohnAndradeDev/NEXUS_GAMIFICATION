import { useEffect, useRef, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import { AddMemberModal } from "../components/ManageSquad/AddMemberModal";
import { MemberInspector } from "../components/ManageSquad/MemberInspector";
import { MembersGrid } from "../components/ManageSquad/MembersGrid";
import { RemoveMemberModal } from "../components/ManageSquad/RemoveMemberModal";
import { SquadHeader } from "../components/ManageSquad/SquadHeader";
import { ToastNotification } from "../components/ManageSquad/ToastNotification";
import { useAuth } from "../contexts/AuthContext";
import { getRoster, removeSquadMember, type Roster, type RosterMember } from "../lib/squads";
import { getErrorMessages } from "../lib/users";

export function ManageSquad() {
  const { user } = useAuth();
  const squadId = user?.squadId ?? null;

  const [roster, setRoster] = useState<Roster | null>(null);
  const [loading, setLoading] = useState(squadId !== null);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<RosterMember | null>(null);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");

  useEffect(() => {
    if (squadId === null) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    getRoster(squadId)
      .then((data) => {
        if (!cancelled) setRoster(data);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessages(err).join(" "));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [squadId, refreshKey]);

  function refresh() {
    setRefreshKey((key) => key + 1);
  }

  function showToast(message: string) {
    window.clearTimeout(toastTimer.current);
    setToastMessage(message);
    toastTimer.current = window.setTimeout(() => setToastMessage(null), 4500);
  }

  function openRemoveModal(member: RosterMember) {
    setRemoveError(null);
    setMemberToRemove(member);
  }

  async function handleRemoveMember() {
    if (!memberToRemove || squadId === null) return;

    setRemoving(true);
    setRemoveError(null);

    try {
      await removeSquadMember(squadId, memberToRemove.id);
      showToast(`Membro ${memberToRemove.name} removido do squad.`);
      setMemberToRemove(null);
      refresh();
    } catch (err) {
      setRemoveError(getErrorMessages(err).join(" "));
    } finally {
      setRemoving(false);
    }
  }

  function handleMemberAdded(name: string) {
    setIsAddModalOpen(false);
    showToast(`Membro ${name} adicionado com sucesso ao ${roster?.squad.name ?? "squad"}.`);
    refresh();
  }

  const selected =
    roster?.members.find((member) => member.id === selectedId) ??
    roster?.members.find((member) => member.id === user?.id) ??
    roster?.members[0] ??
    null;

  return (
    <AppLayout activePage="squad">
      <div className="mt-4 flex w-full flex-col pb-12 sm:mt-0 sm:pb-16">
        {squadId === null && (
          <div className="rounded-xl bg-surface-container-low p-space-xl text-center shadow-md">
            <span className="material-symbols-outlined mb-2 text-5xl text-outline">
              shield_question
            </span>
            <p className="font-headline-md text-headline-md text-on-surface">
              Você ainda não está associado a um squad
            </p>
            <p className="mt-1 font-body-md text-body-md text-outline">
              Um gestor só administra o squad ao qual está associado. Peça ao administrador para
              vinculá-lo a um.
            </p>
          </div>
        )}

        {squadId !== null && loading && !roster && (
          <p className="py-space-xl text-center font-body-md text-body-md text-outline">
            Carregando escalação do squad...
          </p>
        )}

        {error && (
          <div className="flex flex-col items-center gap-2 rounded-xl bg-surface-container-low p-space-xl text-center shadow-md">
            <p role="alert" className="font-body-md text-body-md text-error">
              {error}
            </p>
            <button
              type="button"
              onClick={refresh}
              className="rounded-lg bg-surface-container-high px-space-md py-space-xs font-label-md text-label-md text-on-surface hover:bg-surface-variant"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {roster && user && (
          <>
            <SquadHeader
              squad={roster.squad}
              stats={roster.stats}
              search={search}
              onSearchChange={setSearch}
              department={department}
              onDepartmentChange={setDepartment}
              onAddMember={() => setIsAddModalOpen(true)}
            />

            <div className="flex flex-col items-start gap-6 sm:gap-8 xl:grid xl:grid-cols-12">
              <MembersGrid
                members={roster.members}
                search={search}
                department={department}
                selectedId={selected?.id ?? null}
                currentUserId={user.id}
                onSelectMember={setSelectedId}
                onRemoveMember={openRemoveModal}
              />

              <MemberInspector member={selected} totalPoints={roster.stats.totalPoints} />
            </div>
          </>
        )}
      </div>

      {roster && (
        <>
          <AddMemberModal
            isOpen={isAddModalOpen}
            squadId={roster.squad.id}
            squadName={roster.squad.name}
            onClose={() => setIsAddModalOpen(false)}
            onAdded={handleMemberAdded}
          />

          <RemoveMemberModal
            member={memberToRemove}
            squadName={roster.squad.name}
            submitting={removing}
            error={removeError}
            onClose={() => setMemberToRemove(null)}
            onConfirm={handleRemoveMember}
          />
        </>
      )}

      <ToastNotification message={toastMessage} onClose={() => setToastMessage(null)} />
    </AppLayout>
  );
}
