import { useMemo, useState } from "react";
import { UserTableRow } from "./UserTableRow";

interface UserDirectoryProps {
  onStatusChange: (userName: string, action: "Desativar" | "Reativar") => void;
  onAction: (message: string) => void;
}

export function UserDirectory({
  onStatusChange,
  onAction,
}: UserDirectoryProps) {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("");
  const [profile, setProfile] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("xp-desc");

  const users = [
    {
      name: "Carlos Drummond",
      initials: "CD",
      email: "carlos.drummond@empresa.com",
      role: "Tech Lead",
      description: "Líder de Arquitetura",
      sector: "Engenharia",
      squad: "CyberTitans",
      profile: "Admin",
      xp: 12850,
      lastAccess: "Há 12 min",
      status: "Ativo",
    },
    {
      name: "Mariana Albuquerque",
      initials: "MA",
      email: "mariana.albuquerque@empresa.com",
      role: "Product Manager",
      description: "Lead Product Manager",
      sector: "Produto",
      squad: "DevCommanders",
      profile: "Gestor",
      xp: 9420,
      lastAccess: "Hoje, 09:14",
      status: "Ativo",
    },
    {
      name: "Rafael Fontana",
      initials: "RF",
      email: "rafael.fontana@empresa.com",
      role: "Desenvolvedor",
      description: "Senior Frontend Dev",
      sector: "Engenharia",
      squad: "CyberTitans",
      profile: "Usuário Comum",
      xp: 8200,
      lastAccess: "Há 45 min",
      status: "Ativo",
    },
    {
      name: "Beatriz Santos",
      initials: "BS",
      email: "beatriz.santos@empresa.com",
      role: "Designer",
      description: "Design System Specialist",
      sector: "Design",
      squad: "PixelForge",
      profile: "Usuário Comum",
      xp: 6150,
      lastAccess: "Ontem, 17:40",
      status: "Ativo",
    },
    {
      name: "Diego Nogueira",
      initials: "DN",
      email: "diego.nogueira@empresa.com",
      role: "QA",
      description: "DevOps Engineer",
      sector: "Infraestrutura",
      squad: "CloudWarriors",
      profile: "Usuário Comum",
      xp: 4890,
      lastAccess: "Há 2 dias",
      status: "Ativo",
    },
    {
      name: "Larissa Queiroz",
      initials: "LQ",
      email: "larissa.queiroz@empresa.com",
      role: "QA",
      description: "Ex-Data Analyst",
      sector: "Dados",
      squad: "DataKnights",
      profile: "Usuário Comum",
      xp: 1200,
      lastAccess: "Há 4 dias",
      status: "Desativado",
    },
  ];

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = users.filter((user) => {
      const searchableText = [
        user.name,
        user.email,
        user.role,
        user.description,
        user.squad,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        query.length === 0 || searchableText.includes(query);

      const matchesSector = !sector || user.sector === sector;
      const matchesProfile = !profile || user.profile === profile;
      const matchesStatus = !status || user.status === status;

      return matchesSearch && matchesSector && matchesProfile && matchesStatus;
    });

    return result.sort((first, second) => {
      if (sort === "xp-desc") return second.xp - first.xp;
      if (sort === "xp-asc") return first.xp - second.xp;
      if (sort === "nome-asc") {
        return first.name.localeCompare(second.name);
      }

      return 0;
    });
  }, [search, sector, profile, status, sort]);

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container shadow-xl">
      <div className="flex flex-col gap-space-md border-b border-outline-variant/20 bg-surface-container-low/70 p-4 sm:p-space-lg xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h3 className="font-headline-md text-lg text-on-surface sm:text-headline-md">
            Diretório de Usuários Corporativos
          </h3>

          <p className="font-body-sm text-body-sm text-outline">
            Gestão de permissões, squads e auditoria de pontuação global
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap xl:w-auto">
          <div className="relative min-w-[200px] flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-outline">
              search
            </span>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome ou e-mail..."
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest py-2 pl-9 pr-3 font-body-sm text-body-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <select
            value={sector}
            onChange={(event) => setSector(event.target.value)}
            className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-2.5 py-2 font-label-sm text-label-sm text-on-surface outline-none"
          >
            <option value="">Setores (Todos)</option>
            <option value="Engenharia">Engenharia</option>
            <option value="Produto">Produto</option>
            <option value="Design">Design</option>
            <option value="Dados">Dados</option>
            <option value="Infraestrutura">Infraestrutura</option>
          </select>

          <select
            value={profile}
            onChange={(event) => setProfile(event.target.value)}
            className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-2.5 py-2 font-label-sm text-label-sm text-on-surface outline-none"
          >
            <option value="">Perfis (Todos)</option>
            <option value="Admin">Admin</option>
            <option value="Gestor">Gestor</option>
            <option value="Usuário Comum">Usuário Comum</option>
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-2.5 py-2 font-label-sm text-label-sm text-on-surface outline-none"
          >
            <option value="">Status (Todos)</option>
            <option value="Ativo">Ativo</option>
            <option value="Desativado">Desativado</option>
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-2.5 py-2 font-label-sm text-label-sm text-primary outline-none"
          >
            <option value="xp-desc">Maior XP</option>
            <option value="xp-asc">Menor XP</option>
            <option value="nome-asc">Nome: A-Z</option>
          </select>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-[1000px] w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-lowest/60 font-label-sm uppercase tracking-wider text-outline">
              <th className="px-space-md py-space-sm">Colaborador</th>
              <th className="px-space-md py-space-sm">E-mail</th>
              <th className="px-space-md py-space-sm">Cargo</th>
              <th className="px-space-md py-space-sm">Setor</th>
              <th className="px-space-md py-space-sm">Squad</th>
              <th className="px-space-md py-space-sm">Perfil</th>
              <th className="px-space-md py-space-sm">Status</th>
              <th className="px-space-md py-space-sm">XP</th>
              <th className="px-space-md py-space-sm">Último acesso</th>
              <th className="px-space-md py-space-sm text-right">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant/10">
            {filteredUsers.map((user) => (
              <UserTableRow
                key={user.email}
                user={user}
                onStatusChange={onStatusChange}
                onAction={onAction}
              />
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <span className="material-symbols-outlined mb-2 text-4xl text-outline">
            person_search
          </span>

          <p className="font-headline-sm text-headline-sm text-on-surface">
            Nenhum usuário encontrado
          </p>

          <p className="mt-1 font-body-sm text-body-sm text-outline">
            Tente mudar os filtros ou o termo de busca.
          </p>
        </div>
      )}

      <div className="flex flex-col items-center justify-between gap-2 border-t border-outline-variant/20 bg-surface-container-low/50 p-space-md text-center font-body-sm text-body-sm text-outline sm:flex-row sm:text-left">
        <div>
          Exibindo {filteredUsers.length} de 148 colaboradores corporativos
          <span className="mx-1 hidden sm:inline">•</span>
          <span className="text-tertiary">Sincronização LDAP / SSO ativa</span>
        </div>

        <div className="flex items-center gap-1">
          <button className="flex h-8 w-8 items-center justify-center rounded bg-surface-container text-outline">
            <span className="material-symbols-outlined text-sm">
              chevron_left
            </span>
          </button>

          <button className="flex h-8 w-8 items-center justify-center rounded bg-primary-container font-label-md text-label-md text-on-primary-container">
            1
          </button>

          <button className="flex h-8 w-8 items-center justify-center rounded bg-surface-container font-label-md text-label-md text-on-surface">
            2
          </button>

          <button className="flex h-8 w-8 items-center justify-center rounded bg-surface-container font-label-md text-label-md text-on-surface">
            3
          </button>

          <span className="px-1">...</span>

          <button className="flex h-8 w-8 items-center justify-center rounded bg-surface-container font-label-md text-label-md text-on-surface">
            25
          </button>

          <button className="flex h-8 w-8 items-center justify-center rounded bg-surface-container text-outline">
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
