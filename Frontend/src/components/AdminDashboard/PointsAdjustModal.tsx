import { useEffect, useState } from "react";
import {
  createPointsAdjustment,
  getUserPointsHistory,
  type AdjustmentType,
  type UserPointsHistory,
} from "../../lib/points";
import type { PointTransactionType } from "../../lib/squads";
import { formatLastAccess, getErrorMessages, type ApiUser } from "../../lib/users";

interface PointsAdjustModalProps {
  user: ApiUser | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const TYPE_OPTIONS: {
  value: AdjustmentType;
  label: string;
  icon: string;
  hint: string;
  cta: string;
}[] = [
  {
    value: "TASK_BONUS",
    label: "Bônus",
    icon: "add_circle",
    hint: "Soma pontos para reconhecer uma entrega ou atitude extra.",
    cta: "Registrar bônus",
  },
  {
    value: "ADMIN_ADJUSTMENT",
    label: "Ajuste",
    icon: "tune",
    hint: "Soma pontos para corrigir uma pontuação que ficou abaixo do devido.",
    cta: "Registrar ajuste",
  },
  {
    value: "PENALTY",
    label: "Penalidade",
    icon: "remove_circle",
    hint: "Retira pontos. Não pode deixar o saldo negativo.",
    cta: "Aplicar penalidade",
  },
];

const TYPE_LABEL: Record<PointTransactionType, string> = {
  TASK_COMPLETED: "Tarefa concluída",
  TASK_BONUS: "Bônus",
  ACHIEVEMENT_UNLOCKED: "Conquista",
  ADMIN_ADJUSTMENT: "Ajuste administrativo",
  PENALTY: "Penalidade",
};

const inputClass =
  "w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-space-md py-2.5 font-body-md text-body-md text-on-surface outline-none focus:ring-1 focus:ring-primary disabled:opacity-60";

const numberFormat = new Intl.NumberFormat("pt-BR");

// O formulário fica em outro componente para o estado reiniciar a cada abertura
export function PointsAdjustModal(props: PointsAdjustModalProps) {
  if (!props.user) return null;

  return <PointsAdjustForm {...props} user={props.user} />;
}

function PointsAdjustForm({
  user,
  onClose,
  onSaved,
}: PointsAdjustModalProps & { user: ApiUser }) {
  const [type, setType] = useState<AdjustmentType>("TASK_BONUS");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [history, setHistory] = useState<UserPointsHistory | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const blocked =
    user.role === "ADMIN"
      ? "Administradores não têm pontuação."
      : user.status !== "ACTIVE"
        ? "Este usuário está desativado. Reative-o para ajustar a pontuação."
        : null;

  const selected = TYPE_OPTIONS.find((option) => option.value === type) ?? TYPE_OPTIONS[0]!;

  useEffect(() => {
    let cancelled = false;

    getUserPointsHistory(user.id)
      .then((result) => {
        if (!cancelled) setHistory(result);
      })
      .catch((err) => {
        if (!cancelled) setHistoryError(getErrorMessages(err).join(" "));
      });

    return () => {
      cancelled = true;
    };
  }, [user.id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors([]);

    const value = Number(amount);
    if (!Number.isInteger(value) || value < 1) {
      setErrors(["Informe um valor inteiro maior que zero."]);
      return;
    }

    setSubmitting(true);

    try {
      const result = await createPointsAdjustment({
        userId: user.id,
        type,
        amount: value,
        description: description.trim(),
      });

      const base =
        type === "PENALTY"
          ? `Penalidade de ${value} pts aplicada a ${user.name}.`
          : `+${value} pts registrados para ${user.name}.`;
      const unlocked = result.user.achievements.map((item) => item.name);

      onSaved(
        unlocked.length > 0 ? `${base} Conquista desbloqueada: ${unlocked.join(", ")}.` : base,
      );
    } catch (err) {
      setErrors(getErrorMessages(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-70 overflow-y-auto bg-surface-container-lowest/80 backdrop-blur-md">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-xl border border-outline-variant/30 bg-surface-container-high p-space-md shadow-2xl sm:p-space-lg">
          <div className="mb-space-md flex items-start justify-between gap-space-sm">
            <div className="flex min-w-0 items-center gap-space-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container/20 text-primary">
                <span className="material-symbols-outlined text-2xl">stars</span>
              </div>
              <div className="min-w-0">
                <h4 className="truncate font-headline-md text-headline-md text-on-surface">
                  Pontuação de {user.name}
                </h4>
                <span className="font-body-sm text-body-sm text-outline">
                  Nível {user.level}
                  {history && ` • ${numberFormat.format(history.totalPoints)} pts no total`}
                </span>
              </div>
            </div>

            <button
              type="button"
              aria-label="Fechar"
              onClick={onClose}
              className="shrink-0 rounded-lg p-1 text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {blocked ? (
            <p className="rounded-lg bg-surface-container p-space-md font-body-sm text-body-sm text-outline">
              {blocked}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block font-label-md text-label-md text-on-surface">
                  Tipo de lançamento
                </label>
                <div className="grid grid-cols-3 gap-space-xs">
                  {TYPE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={type === option.value}
                      onClick={() => setType(option.value)}
                      className={[
                        "flex flex-col items-center gap-0.5 rounded-lg px-1 py-2 font-label-md text-label-md transition-all",
                        type === option.value
                          ? option.value === "PENALTY"
                            ? "bg-error-container text-on-error-container"
                            : "bg-primary-container text-on-primary-container"
                          : "bg-surface-container-highest text-on-surface-variant hover:text-on-surface",
                      ].join(" ")}
                    >
                      <span className="material-symbols-outlined text-xl">{option.icon}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 font-body-sm text-body-sm text-outline">{selected.hint}</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="points-amount" className="font-label-md text-label-md text-on-surface">
                  Pontos <span className="text-error">*</span>
                </label>
                <input
                  id="points-amount"
                  type="number"
                  inputMode="numeric"
                  required
                  min={1}
                  max={10000}
                  step={1}
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="Ex: 50"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="points-description" className="font-label-md text-label-md text-on-surface">
                  Motivo <span className="text-error">*</span>
                </label>
                <textarea
                  id="points-description"
                  required
                  minLength={3}
                  maxLength={200}
                  rows={3}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="O motivo fica registrado no histórico e não pode ser apagado."
                  className={[inputClass, "resize-none"].join(" ")}
                />
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

              <button
                type="submit"
                disabled={submitting}
                className={[
                  "w-full rounded-lg px-space-md py-2.5 font-label-md text-label-md shadow-md hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70",
                  type === "PENALTY"
                    ? "bg-error text-on-error"
                    : "bg-primary-container text-on-primary-container",
                ].join(" ")}
              >
                {submitting ? "Registrando..." : selected.cta}
              </button>
            </form>
          )}

          <div className="mt-space-md border-t border-outline-variant/20 pt-space-md">
            <p className="mb-space-xs font-label-md text-label-md text-on-surface">
              Últimos lançamentos
            </p>

            {historyError && (
              <p role="alert" className="font-body-sm text-body-sm text-error">
                {historyError}
              </p>
            )}

            {!history && !historyError && (
              <p className="font-body-sm text-body-sm text-outline">Carregando histórico...</p>
            )}

            {history && history.items.length === 0 && (
              <p className="font-body-sm text-body-sm text-outline">
                Este usuário ainda não tem lançamentos de pontos.
              </p>
            )}

            {history && history.items.length > 0 && (
              <div className="space-y-1.5">
                {history.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded-lg bg-surface-container px-space-sm py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-body-sm text-body-sm text-on-surface">
                        {item.description ?? item.task?.title ?? TYPE_LABEL[item.type]}
                      </p>
                      <p className="font-label-sm text-label-sm text-outline">
                        {TYPE_LABEL[item.type]} • {formatLastAccess(item.createdAt)}
                      </p>
                    </div>

                    <span
                      className={[
                        "shrink-0 font-label-lg text-label-lg font-bold",
                        item.amount >= 0 ? "text-tertiary" : "text-error",
                      ].join(" ")}
                    >
                      {item.amount > 0 ? "+" : ""}
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
