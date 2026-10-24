import { useState } from "react";
import {
  AtSign,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  LoaderCircle,
  Zap,
} from "lucide-react";
import { useAuth, type User } from "../../contexts/AuthContext";
import { ApiError } from "../../lib/api";

interface LoginFormProps {
  showError?: boolean;
  onSuccess?: (user: User) => void;
  onCredentialsError?: () => void;
  onClearError?: () => void;
}

type SubmitState = "idle" | "loading" | "success";

export function LoginForm({
  showError = false,
  onSuccess,
  onCredentialsError,
  onClearError,
}: LoginFormProps) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    onClearError?.();
    setSubmitState("loading");

    event.preventDefault();
    setError(null);
    setSubmitState("loading");

    try {
      const user = await login(email, password, rememberDevice);
      setSubmitState("success");
      onSuccess?.(user);

      setTimeout(() => setSubmitState("idle"), 1800);
    } catch (err) {
      setSubmitState("idle");

      if (err instanceof ApiError && err.status === 401) {
        onCredentialsError?.();
      } else if (err instanceof ApiError) {
        setError(err.errors?.[0]?.message ?? err.message);
      } else {
        setError("Erro inesperado. Tente novamente.");
      }
    }
  }

  const isLoading = submitState === "loading";
  const isSuccess = submitState === "success";
  const hasError = showError || error !== null;

  return (
    <form id="auth-form" onSubmit={handleSubmit} className="space-y-space-md">
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <label
            htmlFor="corporate-id"
            className="truncate text-xs text-on-surface sm:text-label-md"
          >
            E-mail Corporativo
          </label>
        </div>

        <div className="relative flex items-center">
          <AtSign
            size={20}
            className="pointer-events-none absolute left-3 text-on-surface-variant"
          />

          <input
            id="corporate-id"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nome.sobrenome@empresa.com"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            className={[
              "h-11 w-full rounded-lg bg-surface-container-highest/60 pl-10 pr-space-md text-sm text-on-surface",
              "placeholder:text-on-surface-variant/60 focus:bg-surface-container-highest focus:outline-none focus:ring-1",
              hasError ? "ring-error" : "focus:ring-primary",
              "transition duration-200 sm:text-body-md",
            ].join(" ")}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password-input"
          className="mb-1.5 block text-xs text-on-surface sm:text-label-md"
        >
          Senha
        </label>

        <div className="relative flex items-center">
          <Lock
            size={20}
            className="pointer-events-none absolute left-3 text-on-surface-variant"
          />

          <input
            id="password-input"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Insira sua credencial"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            className={[
              "h-11 w-full rounded-lg bg-surface-container-highest/60 pl-10 pr-space-md text-sm text-on-surface",
              "placeholder:text-on-surface-variant/60 focus:bg-surface-container-highest focus:outline-none",
              hasError
                ? "ring-1 ring-error"
                : "focus:ring-1 focus:ring-primary",
              "transition duration-200 sm:text-body-md",
            ].join(" ")}
          />

          <button
            type="button"
            aria-label="Alternar visibilidade da senha"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-2.5 flex items-center justify-center rounded p-1 text-on-surface-variant transition hover:text-on-surface sm:right-3"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <label className="flex cursor-pointer select-none items-center gap-space-xs">
          <input
            type="checkbox"
            checked={rememberDevice}
            onChange={(event) => setRememberDevice(event.target.checked)}
            className="h-4 w-4 cursor-pointer rounded border-none bg-surface-container-highest accent-primary"
          />

          <span className="text-xs text-on-surface-variant transition hover:text-on-surface sm:text-body-sm">
            Lembrar deste dispositivo
          </span>
        </label>
      </div>

      {error && (
        <p role="alert" className="text-xs text-error sm:text-body-sm">
          {error}
        </p>
      )}

      <div className="pt-space-xs">
        <button
          type="submit"
          disabled={isLoading}
          className={[
            "flex h-12 w-full items-center justify-center gap-space-sm rounded-lg text-sm font-semibold transition duration-200",
            "cursor-pointer active:scale-[0.99] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70",
            "sm:text-headline-sm",
            isSuccess
              ? "bg-tertiary-container text-on-tertiary-container"
              : "bg-linear-to-r from-primary to-primary-container text-on-primary shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_28px_rgba(6,182,212,0.55)]",
          ].join(" ")}
        >
          <span>
            {isLoading && "Conectando ao Squad..."}
            {isSuccess && "Missão Iniciada!"}
            {!isLoading && !isSuccess && "Entrar na Missão"}
          </span>

          {isLoading && <LoaderCircle size={20} className="animate-spin" />}

          {isSuccess && <CheckCircle size={20} />}

          {!isLoading && !isSuccess && <Zap size={20} />}
        </button>
      </div>
    </form>
  );
}
