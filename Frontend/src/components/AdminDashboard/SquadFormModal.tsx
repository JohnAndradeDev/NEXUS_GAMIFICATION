import { useEffect, useState } from "react";
import { createSquad, updateSquad, type AdminSquad } from "../../lib/squads";
import { getErrorMessages, listUsers, type ApiUser } from "../../lib/users";

interface SquadFormModalProps {
  // "new" cria um squad; um squad existente abre para edição; null mantém fechado
  target: AdminSquad | "new" | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const inputClass =
  "w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-space-md py-2.5 font-body-md text-body-md text-on-surface outline-none focus:ring-1 focus:ring-primary disabled:opacity-60";

// O formulário fica em outro componente para o estado reiniciar a cada abertura
export function SquadFormModal(props: SquadFormModalProps) {
  if (!props.target) return null;

  return <SquadForm {...props} target={props.target} />;
}

function SquadForm({
  target,
  onClose,
  onSaved,
}: SquadFormModalProps & { target: AdminSquad | "new" }) {
  const squad = target === "new" ? null : target;

  const [name, setName] = useState(squad?.name ?? "");
  const [description, setDescription] = useState(squad?.description ?? "");
  const [managerId, setManagerId] = useState(squad?.manager ? String(squad.manager.id) : "");
  const [managers, setManagers] = useState<ApiUser[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // gestores ativos que ainda não têm squad, ou que já são deste squad
  useEffect(() => {
    let cancelled = false;

    listUsers({ role: "GESTOR", status: "ACTIVE", perPage: 100 })
      .then((result) => {
        if (cancelled) return;
        setManagers(
          result.items.filter((user) => user.squadId === null || user.squadId === squad?.id),
        );
      })
      .catch(() => {
        if (!cancelled) setManagers([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingManagers(false);
      });

    return () => {
      cancelled = true;
    };
  }, [squad?.id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors([]);
    setSubmitting(true);

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const selectedManager = managerId ? Number(managerId) : null;

    try {
      if (squad) {
        await updateSquad(squad.id, {
          name: trimmedName,
          description: trimmedDescription || null,
          managerId: selectedManager,
        });
        onSaved(`Squad ${trimmedName} atualizado com sucesso.`);
      } else {
        await createSquad({
          name: trimmedName,
          description: trimmedDescription || undefined,
          managerId: selectedManager,
        });
        onSaved(`Squad ${trimmedName} criado com sucesso.`);
      }
    } catch (err) {
      setErrors(getErrorMessages(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-70 overflow-y-auto bg-surface-container-lowest/80 backdrop-blur-md">
      <div className="flex min-h-full items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg rounded-xl border border-outline-variant/30 bg-surface-container-high p-space-md shadow-2xl sm:p-space-lg"
        >
          <div className="mb-space-md flex items-center gap-space-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container/20 text-primary">
              <span className="material-symbols-outlined text-2xl">
                {squad ? "edit" : "add_circle"}
              </span>
            </div>

            <div>
              <h4 className="font-headline-md text-headline-md text-on-surface">
                {squad ? "Editar Squad" : "Novo Squad"}
              </h4>
              <span className="font-body-sm text-body-sm text-outline">
                Nome, descrição e gestor responsável
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="squad-name" className="font-label-md text-label-md text-on-surface">
                Nome do Squad <span className="text-error">*</span>
              </label>
              <input
                id="squad-name"
                required
                minLength={2}
                maxLength={60}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex: CyberTitans"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="squad-description" className="font-label-md text-label-md text-on-surface">
                Descrição
              </label>
              <textarea
                id="squad-description"
                rows={3}
                maxLength={500}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="O que este squad faz?"
                className={[inputClass, "resize-none"].join(" ")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="squad-manager" className="font-label-md text-label-md text-on-surface">
                Gestor
              </label>
              <select
                id="squad-manager"
                value={managerId}
                disabled={loadingManagers}
                onChange={(event) => setManagerId(event.target.value)}
                className={inputClass}
              >
                <option value="">Sem gestor</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name}
                    {manager.squadId === null ? " (sem squad)" : ""}
                  </option>
                ))}
              </select>
              <p className="font-body-sm text-body-sm text-outline">
                Aparecem gestores ativos sem squad. Quem for escolhido é vinculado a este squad
                automaticamente. Para criar um gestor, cadastre um usuário com o perfil Gestor.
              </p>
            </div>
          </div>

          {errors.length > 0 && (
            <ul
              role="alert"
              className="mt-space-md space-y-1 rounded-lg bg-error-container/30 px-space-md py-space-sm font-body-sm text-body-sm text-error"
            >
              {errors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          )}

          <div className="mt-space-md flex items-center justify-end gap-space-sm">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg bg-surface-container px-space-md py-space-xs font-label-md text-label-md text-on-surface hover:bg-surface-variant disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-primary-container px-space-md py-space-xs font-label-md text-label-md text-on-primary-container shadow-md hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Salvando..." : squad ? "Salvar alterações" : "Criar squad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
