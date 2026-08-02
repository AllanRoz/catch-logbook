import { createFileRoute } from "@tanstack/react-router";
import { Fish, Gauge, Ruler, Route as RouteIcon, Star, Weight } from "lucide-react";
import { useMemo } from "react";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTrips } from "@/context/TripsContext";
import { summarize } from "@/utils/stats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — CatchLog fishing journal" },
      {
        name: "description",
        content:
          "Your fishing season at a glance: trips logged, fish caught, personal bests and species trends.",
      },
      { property: "og:title", content: "Dashboard — CatchLog fishing journal" },
      {
        property: "og:description",
        content: "Your fishing season at a glance, stored right in your browser.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { trips, hydrated, storageError } = useTrips();
  const s = useMemo(() => summarize(trips), [trips]);

  const fmt = (n: number | null, unit: string) =>
    n === null ? "—" : `${n.toFixed(1)}${unit}`;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Tight lines
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">Your season so far</h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          Every trip you log lives in this browser only — nothing is uploaded anywhere.
        </p>
      </header>

      {storageError ? (
        <p className="panel border-destructive/50 p-4 text-sm text-destructive">
          {storageError}
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Trips" value={String(s.trips)} icon={RouteIcon} />
        <StatCard label="Fish caught" value={String(s.fish)} icon={Fish} />
        <StatCard
          label="Biggest fish"
          value={s.biggest ? `${s.biggest.weight} lb` : "—"}
          hint={s.biggest?.species}
          icon={Weight}
        />
        <StatCard
          label="Favorite species"
          value={s.favoriteSpecies ?? "—"}
          icon={Star}
        />
        <StatCard label="Avg length" value={fmt(s.avgLength, '"')} icon={Ruler} />
        <StatCard label="Avg weight" value={fmt(s.avgWeight, " lb")} icon={Gauge} />
      </section>

      {hydrated && trips.length === 0 ? (
        <EmptyState
          title="No trips logged yet"
          description="Start your journal by logging a trip — species, gear, weather and notes all live here."
        />
      ) : null}
    </div>
  );
}
