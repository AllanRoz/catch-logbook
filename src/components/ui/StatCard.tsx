import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string | undefined;
  icon: LucideIcon;
}

/** Compact metric tile used across the dashboard and stats pages. */
export function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
  return (
    <div className="panel panel-hover p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/12 text-primary">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
