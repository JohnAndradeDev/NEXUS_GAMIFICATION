import { MemberCard } from "./MemberCard";

interface MembersGridProps {
  search: string;
  department: string;
  selectedMember: string;
  onSelectMember: (member: string) => void;
  onRemoveMember: (member: string) => void;
}

export function MembersGrid({
  search,
  department,
  selectedMember,
  onSelectMember,
  onRemoveMember,
}: MembersGridProps) {
  const normalizedSearch = search.trim().toLowerCase();

  const members = [
    {
      rank: "#1",
      name: "Mariana Rios",
      role: "Tech Lead & Gestora • Sênior",
      email: "m.rios@cybertitans.io",
      achievement: "Líder Exemplar",
      achievementIcon: "workspace_premium",
      points: "2.840",
      level: "18",
      completedTasks: "24",
      pendingTasks: "1",
      progress: "96%",
      department: ["tech", "product"],
    },
    {
      rank: "#2",
      name: "João Silveira",
      role: "Engenheiro de Software • Backend",
      email: "j.silveira@cybertitans.io",
      achievement: "Código Limpo",
      achievementIcon: "terminal",
      points: "2.450",
      level: "14",
      completedTasks: "18",
      pendingTasks: "2",
      progress: "90%",
      department: ["tech"],
      isCurrentUser: true,
    },
    {
      rank: "#3",
      name: "Lucas Mendes",
      role: "DevOps & SRE • Sênior",
      email: "l.mendes@cybertitans.io",
      achievement: "Infra Ágil",
      achievementIcon: "dns",
      points: "2.120",
      level: "12",
      completedTasks: "15",
      pendingTasks: "3",
      progress: "83%",
      department: ["devops"],
    },
    {
      rank: "#4",
      name: "Beatriz Lima",
      role: "Engenheira Frontend • Plena",
      email: "b.lima@cybertitans.io",
      achievement: "UX Pioneer",
      achievementIcon: "auto_awesome",
      points: "1.890",
      level: "11",
      completedTasks: "14",
      pendingTasks: "2",
      progress: "87%",
      department: ["frontend"],
    },
    {
      rank: "#5",
      name: "Rafael Souza",
      role: "QA Automation Specialist",
      email: "r.souza@cybertitans.io",
      achievement: "Caçador de Falhas",
      achievementIcon: "bug_report",
      points: "1.620",
      level: "9",
      completedTasks: "12",
      pendingTasks: "1",
      progress: "92%",
      department: ["qa"],
    },
    {
      rank: "#6",
      name: "Carla Nogueira",
      role: "Product Owner • Assist",
      email: "c.nogueira@cybertitans.io",
      achievement: "Delivery Ace",
      achievementIcon: "rocket_launch",
      points: "1.450",
      level: "8",
      completedTasks: "11",
      pendingTasks: "3",
      progress: "78%",
      department: ["product"],
    },
  ];

  const filteredMembers = members.filter((member) => {
    const searchText = [
      member.name,
      member.role,
      member.email,
      member.achievement,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      normalizedSearch === "" || searchText.includes(normalizedSearch);

    const matchesDepartment =
      department === "all" || member.department.includes(department);

    return matchesSearch && matchesDepartment;
  });

  return (
    <section className="flex w-full flex-col gap-4 xl:col-span-8">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Escalação Atual
          </h2>

          <span className="rounded-full bg-surface-container-high px-2 py-0.5 font-label-sm text-label-sm text-outline">
            {filteredMembers.length} visualizados
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-body-sm text-body-sm text-outline">
          <span className="material-symbols-outlined text-sm">swap_vert</span>
          <span className="hidden sm:inline">Ordenado por</span>
          <span>Ranking interno</span>
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-xl bg-surface-container-low p-space-lg text-center shadow-md">
          <span className="material-symbols-outlined mb-space-sm text-4xl text-outline">
            person_search
          </span>

          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            Nenhum membro encontrado
          </h3>

          <p className="mt-space-xs font-body-sm text-body-sm text-outline">
            Tente outro nome, cargo ou filtro de setor.
          </p>
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.name}
              rank={member.rank}
              name={member.name}
              role={member.role}
              email={member.email}
              achievement={member.achievement}
              achievementIcon={member.achievementIcon}
              points={member.points}
              level={member.level}
              completedTasks={member.completedTasks}
              pendingTasks={member.pendingTasks}
              progress={member.progress}
              isCurrentUser={member.isCurrentUser}
              isSelected={selectedMember === member.name}
              onInspect={() => onSelectMember(member.name)}
              onRemove={() => onRemoveMember(member.name)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
