import { useState } from "react";

interface UserRegistrationFormProps {
  onSuccess: () => void;
}

export function UserRegistrationForm({ onSuccess }: UserRegistrationFormProps) {
  const [password, setPassword] = useState("Squad#2025Init");
  const [role, setRole] = useState("Desenvolvedor");
  const [squad, setSquad] = useState("CyberTitans");

  function generatePassword() {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";

    let generatedPassword = "SQ#";

    for (let index = 0; index < 8; index += 1) {
      generatedPassword += chars.charAt(
        Math.floor(Math.random() * chars.length),
      );
    }

    setPassword(generatedPassword);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSuccess();
    event.currentTarget.reset();
    setPassword("Squad#2025Init");
    setRole("Desenvolvedor");
    setSquad("CyberTitans");
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
              placeholder="Ex: Lucas Mendes Oliveira"
              className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-space-md py-2.5 font-body-md text-body-md text-on-surface outline-none focus:ring-1 focus:ring-primary"
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
              placeholder="nome.sobrenome@empresa.com"
              className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-space-md py-2.5 font-body-md text-body-md text-on-surface outline-none focus:ring-1 focus:ring-primary"
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
                onClick={generatePassword}
                className="font-label-sm text-label-sm text-primary hover:underline"
              >
                Gerar Segura
              </button>
            </div>

            <input
              id="input-senha"
              required
              type="text"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-space-md py-2.5 font-body-md text-body-md text-on-surface outline-none focus:ring-1 focus:ring-primary"
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
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-space-md py-2.5 font-body-md text-body-md text-on-surface outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Desenvolvedor">Desenvolvedor(a)</option>
              <option value="QA">Analista de QA</option>
              <option value="Tech Lead">Tech Lead</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Designer">UI/UX Designer</option>
              <option value="Gestor de Squad">Gestor de Squad</option>
              <option value="Administrador">Administrador Geral</option>
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
              value={squad}
              onChange={(event) => setSquad(event.target.value)}
              className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-space-md py-2.5 font-body-md text-body-md text-on-surface outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="CyberTitans">CyberTitans</option>
              <option value="DevCommanders">DevCommanders</option>
              <option value="CloudWarriors">CloudWarriors</option>
              <option value="PixelForge">PixelForge</option>
              <option value="DataKnights">DataKnights</option>
              <option value="Nenhum">Nenhum</option>
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
              className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-space-md py-2.5 font-body-md text-body-md text-on-surface outline-none focus:ring-1 focus:ring-primary"
            >
              <option>Engenharia</option>
              <option>Produto</option>
              <option>Design</option>
              <option>Dados</option>
              <option>Infraestrutura</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-3">
            <label
              htmlFor="select-status"
              className="font-label-md text-label-md text-on-surface"
            >
              Status Inicial <span className="text-error">*</span>
            </label>

            <select
              id="select-status"
              className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-space-md py-2.5 font-body-md text-body-md text-on-surface outline-none focus:ring-1 focus:ring-primary"
            >
              <option>Ativo</option>
              <option>Em Onboarding</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-outline-variant/20 pt-space-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-outline">
            <span className="material-symbols-outlined shrink-0 text-base text-tertiary">
              mark_email_read
            </span>

            <span className="font-body-sm text-body-sm">
              E-mail de ativação será enviado após a criação.
            </span>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <button
              type="reset"
              className="rounded-lg bg-surface-container-low px-space-md py-2.5 font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            >
              Limpar Formulário
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-lg bg-primary-container px-space-lg py-2.5 font-label-md text-label-md text-on-primary-container shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:brightness-110"
            >
              <span className="material-symbols-outlined text-lg">bolt</span>
              Criar Usuário
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
