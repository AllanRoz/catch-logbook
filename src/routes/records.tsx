import { Link } from "react-router-dom";
import { Clock, Fish, Ruler, Trophy, Weight } from "lucide-react";
import { useMemo } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTrips } from "@/context/TripsContext";
import { computeRecords, type CatchRecord } from "@/utils/stats";

const prettyDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

function RecordCard({
  title,
  value,
  species,
  location,
  date,
  tripId,
  icon: Icon,
}: {
  title: string;
  value: string;
  species?: string;
  location?: string;
  date?: string;
  tripId?: string;
  icon: typeof Trophy;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {title}
        </p>
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold tracking-tight text-gradient">
        {value}
      </p>
      {species ? <p className="mt-1 text-sm font-medium">{species}</p> : null}
      {location ? (
        <p className="text-xs text-muted-foreground">
          {location}
          {date ? ` · ${prettyDate(date)}` : ""}
        </p>
      ) : null}
    </>
  );

  return tripId ? (
    <Link to={`/trips/${tripId}/edit`} className="panel panel-hover block p-5">
      {body}
    </Link>
  ) : (
    <div className="panel p-5">{body}</div>
  );
}

function SpeciesRow({ rec }: { rec: CatchRecord }) {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-border/60 py-3 last:border-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{rec.species}</p>
        <p className="truncate text-xs text-muted-foreground">
          {rec.location} · {prettyDate(rec.date)}
        </p>
      </div>
      <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
        {rec.value} lb
      </span>
    </li>
  );
}

export default function RecordsPage() {
  const { trips, hydrated } = useTrips();
  const r = useMemo(() => computeRecords(trips), [trips]);

  const hasAny =
    r.heaviest ||
    r.longest ||
    r.bestTrip ||
    r.longestSession ||
    r.speciesRecords.length;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Hall of fame
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">Personal bests</h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          Records update themselves whenever you log or edit a trip.
        </p>
      </header>

      {hydrated && !hasAny ? (
        <EmptyState
          title="No records yet"
          description="Add lengths and weights to your catches and your personal bests appear here."
        />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <RecordCard
              title="Heaviest fish"
              value={r.heaviest ? `${r.heaviest.value} lb` : "—"}
              {...(r.heaviest
                ? {
                    species: r.heaviest.species,
                    location: r.heaviest.location,
                    date: r.heaviest.date,
                    tripId: r.heaviest.tripId,
                  }
                : {})}
              icon={Weight}
            />
            <RecordCard
              title="Longest fish"
              value={r.longest ? `${r.longest.value}"` : "—"}
              {...(r.longest
                ? {
                    species: r.longest.species,
                    location: r.longest.location,
                    date: r.longest.date,
                    tripId: r.longest.tripId,
                  }
                : {})}
              icon={Ruler}
            />
            <RecordCard
              title="Best single trip"
              value={r.bestTrip ? `${r.bestTrip.fish} fish` : "—"}
              {...(r.bestTrip
                ? {
                    location: r.bestTrip.location,
                    date: r.bestTrip.date,
                    tripId: r.bestTrip.tripId,
                  }
                : {})}
              icon={Fish}
            />
            <RecordCard
              title="Longest session"
              value={r.longestSession ? `${r.longestSession.hours.toFixed(1)} h` : "—"}
              {...(r.longestSession
                ? {
                    location: r.longestSession.location,
                    date: r.longestSession.date,
                    tripId: r.longestSession.tripId,
                  }
                : {})}
              icon={Clock}
            />
          </section>

          <section className="panel p-5">
            <h2 className="font-display text-base font-semibold">Best per species</h2>
            <p className="mb-2 text-xs text-muted-foreground">
              Heaviest fish recorded for each species you have logged.
            </p>
            {r.speciesRecords.length ? (
              <ul>
                {r.speciesRecords.map((rec) => (
                  <SpeciesRow key={rec.species} rec={rec} />
                ))}
              </ul>
            ) : (
              <p className="py-6 text-sm text-muted-foreground">
                Log a catch weight to start this leaderboard.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
