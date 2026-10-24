export function DeltaBadge({ delta }: { delta: number }) {
  if (delta === 0) {
    return <span className="font-label-sm text-label-sm text-outline">—</span>;
  }

  const up = delta > 0;

  return (
    <span
      title={up ? `Subiu ${delta} posições` : `Caiu ${Math.abs(delta)} posições`}
      className={[
        "flex items-center justify-center gap-0.5 font-label-sm text-label-sm font-bold",
        up ? "text-tertiary" : "text-error",
      ].join(" ")}
    >
      <span className="material-symbols-outlined text-xs">
        {up ? "arrow_upward" : "arrow_downward"}
      </span>
      {up ? `+${delta}` : delta}
    </span>
  );
}
