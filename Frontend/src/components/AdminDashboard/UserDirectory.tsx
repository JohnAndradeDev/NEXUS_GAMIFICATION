import { useEffect, useState } from "react";
import type { Role } from "../../contexts/AuthContext";
import {
  SECTORS,
  getErrorMessages,
  listUsers,
  type ApiUser,
  type Paginated,
  type UserStatus,
} from "../../lib/users";
import { UserCard } from "./UserCard";
import { UserTableRow } from "./UserTableRow";

interface UserDirectoryProps {
  refreshKey: number;
  onStatusChange: (user: ApiUser, action: "Desativar" | "Reativar") => void;
  onEdit: (user: ApiUser) => void;
  onPoints: (user: ApiUser) => void;
}

type Sort = "xp-desc" | "xp-asc" | "name-asc";

const PER_PAGE = 20;

const selectClass =
  "rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-2.5 py-2 font-label-sm text-label-sm text-on-surface outline-none";

function pageWindow(current: number, total: number) {
  const start = Math.max(1, Math.min(current - 2, total - 4));
  const end = Math.min(total, start + 4);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function UserDirectory({
  refreshKey,
  onStatusChange,
  onEdit,
  onPoints,
}: UserDirectoryProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sector, setSector] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [status, setStatus] = useState<UserStatus | "">("");
  const [sort, setSort] = useState<Sort>("xp-desc");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<Paginated<ApiUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // espera o usuário parar de digitar antes de consultar a API
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    listUsers({
      page,
      perPage: PER_PAGE,
      search: debouncedSearch,
      sector,
      role,
      status,
      sort,
    })
      .then((result) => {
        if (!cancelled) setData(result);
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
  }, [
    page,
    debouncedSearch,
    sector,
    role,
    status,
    sort,
    refreshKey,
    reloadKey,
  ]);

  // se a página atual deixou de existir (ex.: desativou o último item com filtro), volta uma
  useEffect(() => {
    if (data && data.meta.totalPages > 0 && page > data.meta.totalPages) {
      setPage(data.meta.totalPages);
    }
  }, [data, page]);

  const users = data?.items ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 0;

  function changeFilter<T>(setter: (value: T) => void, value: T) {
    setter(value);
    setPage(1);
  }

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container shadow-xl">
      <div className="flex flex-col gap-space-md border-b border-outline-variant/20 bg-surface-container-low/70 p-4 sm:p-space-lg">
        <div>
          <h3 className="font-headline-md text-lg text-on-surface sm:text-headline-md">
            Diretório de Usuários Corporativos
          </h3>

          <p className="font-body-sm text-body-sm text-outline">
            Gestão de permissões, squads e auditoria de pontuação global
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap">
          <div className="relative min-w-220px flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-outline">
              search
            </span>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome, e-mail ou cargo..."
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest py-2 pl-9 pr-3 font-body-sm text-body-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <select
            value={sector}
            onChange={(event) => changeFilter(setSector, event.target.value)}
            className={selectClass}
          >
            <option value="">Setores (Todos)</option>
            {SECTORS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={role}
            onChange={(event) =>
              changeFilter(setRole, event.target.value as Role | "")
            }
            className={selectClass}
          >
            <option value="">Perfis (Todos)</option>
            <option value="ADMIN">Admin</option>
            <option value="GESTOR">Gestor</option>
            <option value="USER">Usuário Comum</option>
          </select>

          <select
            value={status}
            onChange={(event) =>
              changeFilter(setStatus, event.target.value as UserStatus | "")
            }
            className={selectClass}
          >
            <option value="">Status (Todos)</option>
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Desativado</option>
          </select>

          <select
            value={sort}
            onChange={(event) =>
              changeFilter(setSort, event.target.value as Sort)
            }
            className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-2.5 py-2 font-label-sm text-label-sm text-primary outline-none"
          >
            <option value="xp-desc">Maior XP</option>
            <option value="xp-asc">Menor XP</option>
            <option value="name-asc">Nome: A-Z</option>
          </select>
        </div>
      </div>

      <div className="hidden w-full overflow-x-auto 2xl:block">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[25%]" />
            <col className="w-[15%]" />
            <col className="w-[11%]" />
            <col className="w-[14%]" />
            <col className="w-[9%]" />
            <col className="w-[8%]" />
            <col className="w-[9%]" />
            <col className="w-[9%]" />
          </colgroup>

          <thead>
            <tr className="bg-surface-container-lowest/60 font-label-sm uppercase tracking-wider text-outline">
              <th className="px-3 py-space-sm text-[11px]">Colaborador</th>
              <th className="px-3 py-space-sm text-[11px]">Cargo / Setor</th>
              <th className="px-3 py-space-sm text-[11px]">Squad</th>
              <th className="px-3 py-space-sm text-[11px]">Perfil</th>
              <th className="px-3 py-space-sm text-[11px]">Status</th>
              <th className="px-3 py-space-sm text-[11px]">XP</th>
              <th className="px-3 py-space-sm text-[11px]">Último acesso</th>
              <th className="px-3 py-space-sm text-right text-[11px]">Ações</th>
            </tr>
          </thead>

          <tbody
            className={[
              "divide-y divide-outline-variant/10 transition-opacity",
              loading && users.length > 0 ? "opacity-50" : "",
            ].join(" ")}
          >
            {users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onStatusChange={onStatusChange}
                onEdit={onEdit}
                onPoints={onPoints}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div
        className={[
          "grid grid-cols-1 gap-3 p-4 transition-opacity sm:grid-cols-2 xl:grid-cols-3 2xl:hidden",
          loading && users.length > 0 ? "opacity-50" : "",
        ].join(" ")}
      >
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onPoints={onPoints}
          />
        ))}
      </div>

      {loading && users.length === 0 && (
        <div className="p-12 text-center font-body-sm text-body-sm text-outline">
          Carregando usuários...
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
          <p role="alert" className="font-body-md text-body-md text-error">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="rounded-lg bg-surface-container-high px-space-md py-space-xs font-label-md text-label-md text-on-surface hover:bg-surface-variant"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
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
          Exibindo {users.length} de {meta?.total ?? 0} colaboradores
          corporativos
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Página anterior"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="flex h-8 w-8 items-center justify-center rounded bg-surface-container text-outline disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>

            {pageWindow(page, totalPages).map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => setPage(number)}
                className={[
                  "flex h-8 w-8 items-center justify-center rounded font-label-md text-label-md",
                  number === page
                    ? "bg-primary-container text-on-primary-container"
                    : "bg-surface-container text-on-surface",
                ].join(" ")}
              >
                {number}
              </button>
            ))}

            <button
              type="button"
              aria-label="Próxima página"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="flex h-8 w-8 items-center justify-center rounded bg-surface-container text-outline disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
