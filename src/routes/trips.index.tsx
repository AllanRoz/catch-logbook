import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { TripCard } from "@/components/trips/TripCard";
import { useTrips } from "@/context/TripsContext";
import type { WaterType } from "@/lib/types";
import { totalFish } from "@/utils/stats";

type SortKey = "newest" | "oldest" | "most-fish";

const control =
  "rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/25";

export default function TripsPage() {
  const { trips, hydrated, deleteTrip, duplicateTrip } = useTrips();
  const [query, setQuery] = useState("");
  const [water, setWater] = useState<WaterType | "all">("all");
  const [sort, setSort] = useState<SortKey>("newest");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = trips.filter((t) => {
      if (water !== "all" && t.waterType !== water) return false;
      if (!q) return true;
      const haystack = [
        t.location,
        t.weather ?? "",
        t.notes ?? "",
        ...t.catches.map(
          (c) => `${c.species} ${c.lure ?? ""} ${c.technique ?? ""}`,
        ),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    return [...list].sort((a, b) => {
      if (sort === "most-fish") return totalFish(b) - totalFish(a);
      const cmp = a.date.localeCompare(b.date);
      return sort === "oldest" ? cmp : -cmp;
    });
  }, [trips, query, water, sort]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Trip history</h1>
          <p className="text-sm text-muted-foreground">
            {trips.length} trip{trips.length === 1 ? "" : "s"} logged
          </p>
        </div>
        <Link
          to="/trips/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          <Plus className="size-4" />
          Log a trip
        </Link>
      </header>

      <div className="panel flex flex-wrap gap-3 p-4">
        <div className="relative min-w-[14rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className={`${control} w-full pl-9`}
            placeholder="Search location, species, lure, notes…"
            aria-label="Search trips"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className={control}
          aria-label="Filter by water type"
          value={water}
          onChange={(e) => setWater(e.target.value as WaterType | "all")}
        >
          <option value="all">All water</option>
          <option value="lake">Lake</option>
          <option value="river">River</option>
          <option value="pond">Pond</option>
          <option value="ocean">Ocean</option>
        </select>
        <select
          className={control}
          aria-label="Sort trips"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="most-fish">Most fish</option>
        </select>
      </div>

      {hydrated && trips.length === 0 ? (
        <EmptyState
          title="No trips logged yet"
          description="Log your first outing and it will show up here with catches, gear and conditions."
        />
      ) : null}

      {trips.length > 0 && visible.length === 0 ? (
        <p className="panel p-6 text-sm text-muted-foreground">
          No trips match those filters.
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {visible.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onDuplicate={() => duplicateTrip(trip.id)}
            onDelete={() => {
              if (window.confirm(`Delete the trip at ${trip.location}?`)) {
                deleteTrip(trip.id);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
