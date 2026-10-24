import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import { fileToAvatarDataUrl } from "../../lib/image";
import { getErrorMessages } from "../../lib/users";

export type ProfileSummary = {
  name: string;
  initials: string;
  avatarUrl?: string | null;
  level: number;
  roleLabel: string;
  squadLabel: string;
  sector?: string | null;
  email?: string | null;
  experience: number;
  streakDays?: number | null;
};

type UserProfileModalProps = {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  profile: ProfileSummary;
  /** Lance um ApiError (lib/api) para exibir a mensagem no formulário. */
  onChangePassword?: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  /** Recebe o data URL já reduzido. Lance um ApiError para exibir a mensagem. */
  onAvatarChange?: (avatarDataUrl: string) => Promise<void>;
  onAvatarRemove?: () => Promise<void>;
};

const STRENGTH_LABEL = ["", "Fraca", "Razoável", "Boa", "Forte"];
const STRENGTH_COLOR = [
  "",
  "bg-error",
  "bg-[#F59E0B]",
  "bg-tertiary",
  "bg-tertiary",
];
const STRENGTH_TEXT = [
  "",
  "text-error",
  "text-[#F59E0B]",
  "text-tertiary",
  "text-tertiary",
];

function getPasswordStrength(password: string) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.max(score, 1);
}

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]):not([type="file"]), select, textarea, [tabindex]:not([tabindex="-1"])';

type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: string;
  withToggle?: boolean;
};

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  withToggle = true,
}: PasswordFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block font-label-sm text-label-sm text-outline"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className={`w-full rounded-lg border border-outline-variant/30 bg-surface-container-highest px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/50 ${
            withToggle ? "pr-10" : ""
          }`}
        />
        {withToggle && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-base">
              {visible ? "visibility_off" : "visibility"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export function UserProfileModal({
  open,
  onClose,
  onLogout,
  profile,
  onChangePassword,
  onAvatarChange,
  onAvatarRemove,
}: UserProfileModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarFeedback, setAvatarFeedback] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const strength = getPasswordStrength(newPassword);

  function resetForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setFeedback(null);
    setSubmitting(false);
    setAvatarBusy(false);
    setAvatarFeedback(null);
  }

  // Limpa o formulário sempre que o modal fecha
  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  // Foco inicial, bloqueio de scroll, ESC e focus trap
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      const items = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  async function handleFileSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // permite escolher o mesmo arquivo de novo
    if (!file || !onAvatarChange) return;

    setAvatarFeedback(null);

    let avatarDataUrl: string;
    try {
      avatarDataUrl = await fileToAvatarDataUrl(file);
    } catch (err) {
      setAvatarFeedback({
        type: "error",
        text:
          err instanceof Error ? err.message : "Não foi possível ler a imagem.",
      });
      return;
    }

    try {
      setAvatarBusy(true);
      await onAvatarChange(avatarDataUrl);
      setAvatarFeedback({ type: "success", text: "Foto atualizada!" });
    } catch (err) {
      setAvatarFeedback({
        type: "error",
        text: getErrorMessages(err).join(" "),
      });
    } finally {
      setAvatarBusy(false);
    }
  }

  async function handleAvatarRemove() {
    if (!onAvatarRemove) return;

    try {
      setAvatarBusy(true);
      setAvatarFeedback(null);
      await onAvatarRemove();
      setAvatarFeedback({ type: "success", text: "Foto removida." });
    } catch (err) {
      setAvatarFeedback({
        type: "error",
        text: getErrorMessages(err).join(" "),
      });
    } finally {
      setAvatarBusy(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setFeedback({
        type: "error",
        text: "Por favor, preencha todos os campos.",
      });
      return;
    }
    if (newPassword.length < 8) {
      setFeedback({
        type: "error",
        text: "A senha deve ter ao menos 8 caracteres",
      });
      return;
    }
    if (new TextEncoder().encode(newPassword).length > 72) {
      setFeedback({
        type: "error",
        text: "A senha deve ter no máximo 72 caracteres",
      });
      return;
    }
    if (!/[A-Za-z]/.test(newPassword)) {
      setFeedback({ type: "error", text: "A senha deve conter letras" });
      return;
    }
    if (!/\d/.test(newPassword)) {
      setFeedback({ type: "error", text: "A senha deve conter números" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({
        type: "error",
        text: "A confirmação de senha não confere.",
      });
      return;
    }
    if (newPassword === currentPassword) {
      setFeedback({
        type: "error",
        text: "A nova senha deve ser diferente da atual.",
      });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);
      await onChangePassword?.(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFeedback({ type: "success", text: "Senha atualizada com sucesso!" });
    } catch (err) {
      setFeedback({ type: "error", text: getErrorMessages(err).join(" ") });
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  // Portal: o header usa backdrop-blur, o que faria o `fixed` se prender ao header.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-surface-container-lowest/80 p-space-md backdrop-blur-md sm:p-space-lg"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-primary/30 bg-surface-container-low shadow-[0_0_50px_rgba(6,182,212,0.25)]"
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-lowest/90 px-space-lg py-space-md">
          <div className="flex items-center gap-space-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-xl">
                manage_accounts
              </span>
            </div>
            <div>
              <h3
                id={titleId}
                className="font-headline-sm text-headline-sm font-bold leading-tight text-on-surface"
              >
                Perfil do Usuário &amp; Segurança
              </h3>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
                <span className="font-label-sm text-[11px] font-semibold uppercase tracking-wider text-tertiary">
                  Online
                </span>
              </div>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-outline transition-colors hover:bg-surface-container-high hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex max-h-[75vh] flex-col gap-space-md overflow-y-auto p-space-lg">
          {/* Resumo do usuário */}
          <div className="flex flex-col items-center gap-space-md rounded-xl border border-outline-variant/20 bg-surface-container p-space-md shadow-sm sm:flex-row">
            <div className="flex shrink-0 flex-col items-center gap-4">
              <div className="relative">
                {profile.avatarUrl ? (
                  <img
                    alt={`Perfil de ${profile.name}`}
                    src={profile.avatarUrl}
                    className="h-20 w-20 rounded-2xl object-cover shadow-[0_0_16px_rgba(6,182,212,0.3)] ring-2 ring-primary/40"
                  />
                ) : (
                  <div
                    aria-label={`Perfil de ${profile.name}`}
                    className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-container text-2xl font-bold text-on-primary-container shadow-[0_0_16px_rgba(6,182,212,0.3)] ring-2 ring-primary/40"
                  >
                    {profile.initials}
                  </div>
                )}
                <span className="absolute -bottom-2 -right-2 rounded-full bg-primary px-2 py-0.5 font-label-sm text-[10px] font-bold text-on-primary shadow-md">
                  LVL {profile.level}
                </span>
              </div>

              {onAvatarChange && (
                <div className="flex flex-col items-center gap-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelected}
                    className="hidden"
                    tabIndex={-1}
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={avatarBusy}
                      className="flex items-center gap-1 font-label-sm text-xs font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="material-symbols-outlined text-sm">
                        photo_camera
                      </span>
                      {avatarBusy ? "Enviando..." : "Alterar foto"}
                    </button>
                    {profile.avatarUrl && onAvatarRemove && (
                      <button
                        type="button"
                        onClick={handleAvatarRemove}
                        disabled={avatarBusy}
                        className="font-label-sm text-xs text-outline hover:text-error disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                  {avatarFeedback && (
                    <p
                      role={avatarFeedback.type === "error" ? "alert" : "status"}
                      className={`max-w-[12rem] text-center font-body-sm text-[11px] ${
                        avatarFeedback.type === "error"
                          ? "text-error"
                          : "text-tertiary"
                      }`}
                    >
                      {avatarFeedback.text}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex w-full flex-1 flex-col text-center sm:text-left">
              <div className="mb-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h4 className="font-headline-md text-headline-md font-bold leading-tight text-on-surface">
                  {profile.name}
                </h4>
                <span className="rounded-full bg-secondary-container px-2 py-0.5 font-label-sm text-xs font-semibold text-on-secondary-container">
                  {profile.roleLabel}
                </span>
              </div>

              <p className="mb-2 flex flex-wrap items-center justify-center gap-x-1 font-body-sm text-body-sm text-outline sm:justify-start">
                {profile.email && (
                  <>
                    <span className="material-symbols-outlined text-xs">
                      mail
                    </span>
                    <span>{profile.email}</span>
                    <span>•</span>
                  </>
                )}
                <span className="font-semibold text-primary">
                  {profile.squadLabel}
                </span>
                {profile.sector && <span>({profile.sector})</span>}
              </p>

              <div className="grid w-full grid-cols-3 gap-2 border-t border-outline-variant/30 pt-2">
                <div className="rounded-lg bg-surface-container-high/60 p-1.5 text-center">
                  <span className="block font-body-sm text-[10px] text-outline">
                    XP Atual
                  </span>
                  <span className="font-label-md text-sm font-bold text-primary">
                    {profile.experience.toLocaleString("pt-BR")} XP
                  </span>
                </div>
                <div className="rounded-lg bg-surface-container-high/60 p-1.5 text-center">
                  <span className="block font-body-sm text-[10px] text-outline">
                    Nível
                  </span>
                  <span className="font-label-md text-sm font-bold text-tertiary">
                    {profile.level}
                  </span>
                </div>
                <div className="rounded-lg bg-surface-container-high/60 p-1.5 text-center">
                  <span className="block font-body-sm text-[10px] text-outline">
                    Streak
                  </span>
                  <span className="font-label-md text-sm font-bold text-[#F59E0B]">
                    {profile.streakDays != null
                      ? `${profile.streakDays} Dias 🔥`
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Alterar senha */}
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container p-space-md shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-primary">
                lock_reset
              </span>
              <h5 className="font-label-lg text-label-lg font-bold text-on-surface">
                Alterar Senha de Acesso
              </h5>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3"
              noValidate
            >
              {feedback && (
                <div
                  role={feedback.type === "error" ? "alert" : "status"}
                  className={
                    feedback.type === "error"
                      ? "rounded-lg bg-error-container p-2 font-body-sm text-xs text-on-error-container"
                      : "rounded-lg border border-tertiary bg-tertiary-container/30 p-2 font-body-sm text-xs font-semibold text-tertiary"
                  }
                >
                  {feedback.type === "success" && "✓ "}
                  {feedback.text}
                </div>
              )}

              <PasswordField
                label="Senha Atual"
                value={currentPassword}
                onChange={setCurrentPassword}
                placeholder="••••••••••••"
                autoComplete="current-password"
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <PasswordField
                    label="Nova Senha"
                    value={newPassword}
                    onChange={setNewPassword}
                    placeholder="8+ caracteres, com letras e números"
                    autoComplete="new-password"
                  />
                  {newPassword && (
                    <div className="mt-1.5 flex items-center gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-1 flex-1 rounded ${
                            step <= strength
                              ? STRENGTH_COLOR[strength]
                              : "bg-outline-variant/40"
                          }`}
                        />
                      ))}
                      <span
                        className={`ml-1 font-label-sm text-[10px] ${STRENGTH_TEXT[strength]}`}
                      >
                        {STRENGTH_LABEL[strength]}
                      </span>
                    </div>
                  )}
                </div>

                <PasswordField
                  label="Confirmar Nova Senha"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Repita a nova senha"
                  autoComplete="new-password"
                  withToggle={false}
                />
              </div>

              <div className="flex items-center justify-end pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 rounded-lg bg-primary-container px-space-md py-1.5 font-label-md text-label-md font-bold text-on-primary-container transition-all hover:shadow-[0_0_16px_rgba(6,182,212,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-base">
                    key
                  </span>
                  {submitting ? "Atualizando..." : "Atualizar Senha"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between border-t border-outline-variant/30 bg-surface-container-lowest/90 px-space-lg py-space-md">
          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-label-sm text-label-sm font-semibold text-error transition-all hover:bg-error/10"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Sair da Conta
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-surface-container-high px-4 py-2 font-label-md text-label-md font-medium text-on-surface transition-colors hover:bg-surface-variant"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
