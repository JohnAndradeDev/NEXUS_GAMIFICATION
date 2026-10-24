import { useState } from "react";
import {
  ACHIEVEMENT_TYPES,
  awardedText,
  createAchievement,
  updateAchievement,
  type AchievementType,
  type AdminAchievement,
} from "../../lib/achievements";
import { getErrorMessages } from "../../lib/users";

interface AchievementFormModalProps {
  // "new" cria; uma conquista existente abre para edição; null mantém fechado
  target: AdminAchievement | "new" | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const inputClass =
  "w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-space-md py-2.5 font-body-md text-body-md text-on-surface outline-none focus:ring-1 focus:ring-primary disabled:opacity-60";

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

// O formulário fica em outro componente para o estado reiniciar a cada abertura
export function AchievementFormModal(props: AchievementFormModalProps) {
  if (!props.target) return null;

  return <AchievementForm {...props} target={props.target} />;
}

function AchievementForm({
  target,
  onClose,
  onSaved,
}: AchievementFormModalProps & { target: AdminAchievement | "new" }) {
  const achievement = target === "new" ? null : target;

  const [name, setName] = useState(achievement?.name ?? "");
  const [code, setCode] = useState(achievement?.code ?? "");
  const [codeTouched, setCodeTouched] = useState(false);
  const [description, setDescription] = useState(achievement?.description ?? "");
  const [icon, setIcon] = useState(achievement?.icon ?? "");
  const [type, setType] = useState<AchievementType>(achievement?.type ?? "TASK_COUNT");
  const [goal, setGoal] = useState(achievement?.target ? String(achievement.target) : "");
  const [bonus, setBonus] = useState(String(achievement?.pointsBonus ?? 0));
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const typeInfo = ACHIEVEMENT_TYPES.find((item) => item.value === type) ?? ACHIEVEMENT_TYPES[0]!;
  // depois que alguém desbloqueou, a regra não muda: o que foi conquistado continua valendo
  const ruleLocked = !!achievement && achievement.unlockedCount > 0;

  function handleName(value: string) {
    setName(value);
    if (!achievement && !codeTouched) setCode(slugify(value));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors([]);

    const targetValue = typeInfo.needsTarget ? Number(goal) : null;
    if (typeInfo.needsTarget && (!Number.isInteger(targetValue) || (targetValue ?? 0) < 1)) {
      setErrors(["Informe a meta como um número inteiro maior que zero."]);
      return;
    }

    const bonusValue = Number(bonus);
    if (!Number.isInteger(bonusValue) || bonusValue < 0) {
      setErrors(["O bônus deve ser um número inteiro, zero ou maior."]);
      return;
    }

    const base = {
      name: name.trim(),
      description: description.trim(),
      icon: icon.trim() || null,
      pointsBonus: bonusValue,
    };

    setSubmitting(true);

    try {
      if (achievement) {
        const result = await updateAchievement(
          achievement.id,
          ruleLocked ? base : { ...base, type, target: targetValue },
        );
        onSaved(`Conquista ${base.name} atualizada.${awardedText(result.awarded)}`);
      } else {
        const result = await createAchievement({ ...base, code, type, target: targetValue });
        onSaved(`Conquista ${base.name} criada.${awardedText(result.awarded)}`);
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
              <span className="material-symbols-outlined text-2xl">{icon.trim() || "military_tech"}</span>
            </div>
            <div>
              <h4 className="font-headline-md text-headline-md text-on-surface">
                {achievement ? "Editar Conquista" : "Nova Conquista"}
              </h4>
              <span className="font-body-sm text-body-sm text-outline">
                Regra, bônus de pontos e aparência
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="ach-name" className="font-label-md text-label-md text-on-surface">
                  Nome <span className="text-error">*</span>
                </label>
                <input
                  id="ach-name"
                  required
                  minLength={2}
                  maxLength={60}
                  value={name}
                  onChange={(event) => handleName(event.target.value)}
                  placeholder="Ex: Maratonista"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ach-code" className="font-label-md text-label-md text-on-surface">
                  Código <span className="text-error">*</span>
                </label>
                <input
                  id="ach-code"
                  required
                  minLength={2}
                  maxLength={40}
                  disabled={!!achievement}
                  value={code}
                  onChange={(event) => {
                    setCodeTouched(true);
                    setCode(event.target.value.toLowerCase());
                  }}
                  placeholder="ex: ten-missions"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="ach-description" className="font-label-md text-label-md text-on-surface">
                Descrição <span className="text-error">*</span>
              </label>
              <input
                id="ach-description"
                required
                minLength={3}
                maxLength={200}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="O que a pessoa precisa fazer?"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="ach-icon" className="font-label-md text-label-md text-on-surface">
                Ícone (Material Symbols)
              </label>
              <input
                id="ach-icon"
                maxLength={60}
                pattern="[a-z0-9_]*"
                value={icon}
                onChange={(event) => setIcon(event.target.value.toLowerCase().replace(/\s+/g, "_"))}
                placeholder="ex: military_tech, flag, stars"
                className={inputClass}
              />
              <p className="font-body-sm text-body-sm text-outline">
                Use o nome do ícone, como em fonts.google.com/icons. Vazio usa o ícone padrão.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="ach-type" className="font-label-md text-label-md text-on-surface">
                Regra de desbloqueio
              </label>
              <select
                id="ach-type"
                value={type}
                disabled={ruleLocked}
                onChange={(event) => setType(event.target.value as AchievementType)}
                className={inputClass}
              >
                {ACHIEVEMENT_TYPES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <p className="font-body-sm text-body-sm text-outline">{typeInfo.hint}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {typeInfo.needsTarget && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ach-goal" className="font-label-md text-label-md text-on-surface">
                    Meta <span className="text-error">*</span>
                  </label>
                  <input
                    id="ach-goal"
                    type="number"
                    inputMode="numeric"
                    required
                    min={1}
                    max={100000}
                    step={1}
                    disabled={ruleLocked}
                    value={goal}
                    onChange={(event) => setGoal(event.target.value)}
                    placeholder="Ex: 10"
                    className={inputClass}
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ach-bonus" className="font-label-md text-label-md text-on-surface">
                  Bônus de pontos
                </label>
                <input
                  id="ach-bonus"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={1000}
                  step={1}
                  value={bonus}
                  onChange={(event) => setBonus(event.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {ruleLocked && (
              <p className="font-body-sm text-body-sm text-outline">
                {achievement?.unlockedCount} {achievement?.unlockedCount === 1 ? "pessoa já desbloqueou" : "pessoas já desbloquearam"}{" "}
                esta conquista, então só nome, descrição, ícone e bônus podem mudar.
              </p>
            )}
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
              {submitting ? "Salvando..." : achievement ? "Salvar alterações" : "Criar conquista"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
