import type { RankingEntry } from "../../lib/rankings";

const SIZE = {
  sm: "h-9 w-9 text-sm",
  lg: "h-16 w-16 text-xl",
};

export function EntryAvatar({ entry, size = "sm" }: { entry: RankingEntry; size?: "sm" | "lg" }) {
  if (entry.avatarUrl) {
    return (
      <img
        alt={`Foto de ${entry.title}`}
        src={entry.avatarUrl}
        className={["shrink-0 rounded-full object-cover", SIZE[size]].join(" ")}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={[
        "flex shrink-0 items-center justify-center rounded-full bg-secondary font-bold text-on-secondary",
        SIZE[size],
      ].join(" ")}
    >
      {entry.initials}
    </div>
  );
}
