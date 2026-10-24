import type { RosterMember } from "../../lib/squads";
import { MemberCard } from "./MemberCard";

interface MembersGridProps {
  members: RosterMember[];
  search: string;
  department: string;
  selectedId: number | null;
  currentUserId: number;
  onSelectMember: (id: number) => void;
  onRemoveMember: (member: RosterMember) => void;
}

export function MembersGrid({
  members,
  search,
  department,
  selectedId,
  currentUserId,
  onSelectMember,
  onRemoveMember,
}: MembersGridProps) {
  const normalizedSearch = search.trim().toLowerCase();

  const filteredMembers = members.filter((member) => {
    const searchText = [member.name, member.jobTitle, member.email, member.sector]
      .join(" ")
      .toLowerCase();

    const matchesSearch = normalizedSearch === "" || searchText.includes(normalizedSearch);
    const matchesDepartment = department === "all" || member.sector === department;

    return matchesSearch && matchesDepartment;
  });

  return (
    <section className="flex w-full flex-col gap-4 xl:col-span-8">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-headline-md text-lg text-on-surface sm:text-headline-md">
            Escalação Atual
          </h2>

          <span className="rounded-full bg-surface-container-high px-2 py-0.5 font-label-sm text-label-sm text-outline">
            {filteredMembers.length} visualizados
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-body-sm text-body-sm text-outline">
          <span className="material-symbols-outlined text-sm">swap_vert</span>
          <span className="hidden sm:inline">Ordenado por</span>
          <span>Pontuação</span>
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-xl bg-surface-container-low p-space-lg text-center shadow-md">
          <span className="material-symbols-outlined mb-space-sm text-4xl text-outline">
            person_search
          </span>

          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            {members.length === 0 ? "Este squad ainda não tem membros" : "Nenhum membro encontrado"}
          </h3>

          <p className="mt-space-xs font-body-sm text-body-sm text-outline">
            {members.length === 0
              ? "Use o botão \"Adicionar Membro ao Squad\" para montar a equipe."
              : "Tente outro nome, cargo ou filtro de setor."}
          </p>
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              isCurrentUser={member.id === currentUserId}
              isSelected={selectedId === member.id}
              onInspect={() => onSelectMember(member.id)}
              onRemove={() => onRemoveMember(member)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
