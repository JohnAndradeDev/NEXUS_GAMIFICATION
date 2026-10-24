import { useState } from "react";
import type { Role } from "../../contexts/AuthContext";
import {
  JOB_TITLES,
  ROLE_LABEL,
  SECTORS,
  createUser,
  getErrorMessages,
  type Squad,
  type UserStatus,
} from "../../lib/users";

interface UserRegistrationFormProps {
  squads: Squad[];
  onSuccess: () => void;
}

interface FormState {
  name: string;
  email: string;
  password: string;
  jobTitle: string;
  role: Role;
  squadId: string;
  sector: string;
  status: UserStatus;
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  password: "",
  jobTitle: JOB_TITLES[0],
  role: "USER",
  squadId: "",
  sector: SECTORS[0],
  status: "ACTIVE",
};

const inputClass =
  "rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-space-md py-2.5 font-body-md text-body-md text-on-surface outline-none focus:ring-1 focus:ring-primary";

// senha aleatória com letras e números (o backend exige os dois)
function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  const values = crypto.getRandomValues(new Uint32Array(11));
  const body = Array.from(values.slice(0, 10), (value) =>
    chars.charAt(value % chars.length),
  ).join("");
  const digit = (values[10] ?? 0) % 10;

  return `SQ${body}${digit}`;
}

export function UserRegistrationForm({
  squads,
  onSuccess,
}: UserRegistrationFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setErrors([]);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors([]);
    setSubmitting(true);

    try {
      await createUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
        status: form.status,
        sector: form.sector,
        jobTitle: form.jobTitle,
        squadId: form.squadId ? Number(form.squadId) : null,
      });

      resetForm();
      onSuccess();
    } catch (err) {
      setErrors(getErrorMessages(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="cadastro-section"
      className="relative mb-space-xl rounded-xl border border-outline-variant/30 bg-surface-container p-4 shadow-lg sm:p-space-lg"
    >
      <div className="-mx-4 -mt-4 mb-space-md flex flex-col gap-space-sm border-b border-outline-variant/20 bg-surface-container-low/50 p-4 sm:-mx-space-lg sm:-mt-space-lg sm:flex-row sm:items-center sm:p-space-lg">
        <div className="flex items-center gap-space-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container/20 text-primary shadow-[0_0_12px_rgba(6,182,212,0.25)]">
            <span className="material-symbols-outlined text-xl">
              person_add
            </span>
          </div>

          <div>
            <h2 className="font-headline-md text-lg text-on-surface sm:text-headline-md">
              Cadastrar Novo Usuário
            </h2>

            <p className="font-body-sm text-body-sm text-outline">
              Provisionamento de credenciais e vínculo organizacional imediato
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="input-nome"
              className="font-label-md text-label-md text-on-surface"
            >
              Nome Completo <span className="text-error">*</span>
            </label>

            <input
              id="input-nome"
              required
              minLength={2}
              value={form.name}
              onChange={(event) => setField("name", event.target.value)}
              placeholder="Ex: Lucas Mendes Oliveira"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="input-email"
              className="font-label-md text-label-md text-on-surface"
            >
              E-mail Corporativo <span className="text-error">*</span>
            </label>

            <input
              id="input-email"
              required
              type="email"
              value={form.email}
              onChange={(event) => setField("email", event.target.value)}
              placeholder="nome.sobrenome@empresa.com"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="input-senha"
                className="font-label-md text-label-md text-on-surface"
              >
                Senha Provisória <span className="text-error">*</span>
              </label>

              <button
                type="button"
                onClick={() => setField("password", generatePassword())}
                className="font-label-sm text-label-sm text-primary hover:underline"
              >
                Gerar Segura
              </button>
            </div>

            <input
              id="input-senha"
              required
              minLength={8}
              type="text"
              value={form.password}
              onChange={(event) => setField("password", event.target.value)}
              placeholder="Mínimo 8 caracteres, com letras e números"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="select-cargo"
              className="font-label-md text-label-md text-on-surface"
            >
              Cargo de Atuação <span className="text-error">*</span>
            </label>

            <select
              id="select-cargo"
              value={form.jobTitle}
              onChange={(event) => setField("jobTitle", event.target.value)}
              className={inputClass}
            >
              {JOB_TITLES.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="select-perfil"
              className="font-label-md text-label-md text-on-surface"
            >
              Perfil de Acesso <span className="text-error">*</span>
            </label>

            <select
              id="select-perfil"
              value={form.role}
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
            <label
              htmlFor="select-squad"
              className="font-label-md text-label-md text-on-surface"
            >
              Squad Vinculado
            </label>

            <select
              id="select-squad"
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

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="select-setor"
              className="font-label-md text-label-md text-on-surface"
            >
              Setor Corporativo <span className="text-error">*</span>
            </label>

            <select
              id="select-setor"
              value={form.sector}
              onChange={(event) => setField("sector", event.target.value)}
              className={inputClass}
            >
              {SECTORS.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-1 lg:col-span-1">
            <label
              htmlFor="select-status"
              className="font-label-md text-label-md text-on-surface"
            >
              Status Inicial <span className="text-error">*</span>
            </label>

            <select
              id="select-status"
              value={form.status}
              onChange={(event) =>
                setField("status", event.target.value as UserStatus)
              }
              className={inputClass}
            >
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Desativado</option>
            </select>
          </div>
        </div>

        {errors.length > 0 && (
          <ul
            role="alert"
            className="space-y-1 rounded-lg bg-error-container/30 px-space-md py-space-sm font-body-sm text-body-sm text-error"
          >
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-4 border-t border-outline-variant/20 pt-space-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-outline">
            <span className="material-symbols-outlined shrink-0 text-base text-tertiary">
              key
            </span>

            <span className="font-body-sm text-body-sm">
              Repasse a senha provisória ao colaborador após a criação.
            </span>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <button
              type="button"
              onClick={resetForm}
              disabled={submitting}
              className="rounded-lg bg-surface-container-low px-space-md py-2.5 font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface disabled:opacity-60"
            >
              Limpar Formulário
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary-container px-space-lg py-2.5 font-label-md text-label-md text-on-primary-container shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="material-symbols-outlined text-lg">bolt</span>
              {submitting ? "Criando..." : "Criar Usuário"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
