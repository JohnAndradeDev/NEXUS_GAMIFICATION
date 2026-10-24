import { useState } from "react";
import { useAuth, type Role } from "../../contexts/AuthContext";
import {
  JOB_TITLES,
  ROLE_LABEL,
  SECTORS,
  getErrorMessages,
  updateUser,
  withCurrent,
  type ApiUser,
  type Squad,
} from "../../lib/users";

interface EditUserModalProps {
  user: ApiUser | null;
  squads: Squad[];
  onClose: () => void;
  onSaved: (message: string) => void;
}

const inputClass =
  "w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-space-md py-2.5 font-body-md text-body-md text-on-surface outline-none focus:ring-1 focus:ring-primary disabled:opacity-60";

export function EditUserModal(props: EditUserModalProps) {
  if (!props.user) return null;

  return <EditUserForm {...props} user={props.user} />;
}

function EditUserForm({
  user,
  squads,
  onClose,
  onSaved,
}: EditUserModalProps & { user: ApiUser }) {
  const { user: me } = useAuth();
  const isSelf = me?.id === user.id;

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    jobTitle: user.jobTitle ?? "",
    role: user.role as Role,
    sector: user.sector ?? "",
    squadId: user.squadId ? String(user.squadId) : "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors([]);
    setSubmitting(true);

    try {
      await updateUser(user.id, {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        jobTitle: form.jobTitle || null,
        role: form.role,
        sector: form.sector || null,
        squadId: form.squadId ? Number(form.squadId) : null,
      });

      onSaved(`Dados de ${form.name.trim()} atualizados com sucesso.`);
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
              manage_accounts
            </span>
          </div>

          <div>
            <h4 className="font-headline-md text-headline-md text-on-surface">
              Editar Colaborador
            </h4>

            <span className="font-body-sm text-body-sm text-outline">
              Dados, cargo, perfil de acesso e squad
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="edit-nome" className="font-label-md text-label-md text-on-surface">
              Nome Completo
            </label>
            <input
              id="edit-nome"
              required
              minLength={2}
              value={form.name}
              onChange={(event) => setField("name", event.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="edit-email" className="font-label-md text-label-md text-on-surface">
              E-mail Corporativo
            </label>
            <input
              id="edit-email"
              required
              type="email"
              value={form.email}
              onChange={(event) => setField("email", event.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-cargo" className="font-label-md text-label-md text-on-surface">
              Cargo de Atuação
            </label>
            <select
              id="edit-cargo"
              value={form.jobTitle}
              onChange={(event) => setField("jobTitle", event.target.value)}
              className={inputClass}
            >
              <option value="">Não informado</option>
              {withCurrent(JOB_TITLES, user.jobTitle).map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-perfil" className="font-label-md text-label-md text-on-surface">
              Perfil de Acesso
            </label>
            <select
              id="edit-perfil"
              value={form.role}
              disabled={isSelf}
              onChange={(event) => setField("role", event.target.value as Role)}
              className={inputClass}
            >
              {(Object.keys(ROLE_LABEL) as Role[]).map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABEL[role]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-setor" className="font-label-md text-label-md text-on-surface">
              Setor
            </label>
            <select
              id="edit-setor"
              value={form.sector}
              onChange={(event) => setField("sector", event.target.value)}
              className={inputClass}
            >
              <option value="">Não informado</option>
              {withCurrent(SECTORS, user.sector).map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-squad" className="font-label-md text-label-md text-on-surface">
              Squad
            </label>
            <select
              id="edit-squad"
              value={form.squadId}
              onChange={(event) => setField("squadId", event.target.value)}
              className={inputClass}
            >
              <option value="">Nenhum</option>
              {squads.map((squad) => (
                <option key={squad.id} value={squad.id}>
                  {squad.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isSelf && (
          <p className="mt-space-sm font-body-sm text-body-sm text-outline">
            Você não pode alterar o seu próprio perfil de acesso.
          </p>
        )}

        {errors.length > 0 && (
          <ul
            role="alert"
            className="mt-space-sm space-y-1 rounded-lg bg-error-container/30 px-space-md py-space-sm font-body-sm text-body-sm text-error"
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
            {submitting ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
