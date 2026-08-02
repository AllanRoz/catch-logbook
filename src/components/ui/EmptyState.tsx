import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

/** Shown whenever a view has no trips to render yet. */
export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="panel flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="text-4xl">🎣</span>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      <Link
        to="/trips/new"
        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
      >
        <Plus className="size-4" />
        Log your first trip
      </Link>
    </div>
  );
}
