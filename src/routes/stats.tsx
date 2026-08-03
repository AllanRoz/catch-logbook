import { CalendarRange, Fish, Ruler, Waves } from "lucide-react";
import { useMemo } from "react";
import {
  BarChart,
  ChartPanel,
  DoughnutChart,
  LineChart,
} from "@/components/charts/ChartKit";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { useTrips } from "@/context/TripsContext";
import {
  catchesOverTime,
  lureBreakdown,
  monthlyCatches,
  speciesBreakdown,
  summarize,
  waterBreakdown,
} from "@/utils/stats";

export default function StatsPage() {
  const { trips, hydrated } = useTrips();

  const data = useMemo(
    () => ({
      summary: summarize(trips),
      species: speciesBreakdown(trips),
      lures: lureBreakdown(trips),
      water: waterBreakdown(trips),
      monthly: monthlyCatches(trips),
      timeline: catchesOverTime(trips),
    }),
    [trips],
  );

  const monthly = data.monthly.some((m) => m.value > 0) ? data.monthly : [];
  const fishPerTrip = trips.length ? data.summary.fish / trips.length : 0;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Patterns
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">Statistics</h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          Everything below is recalculated from your log each time you open this page.
        </p>
      </header>

      {hydrated && trips.length === 0 ? (
        <EmptyState
          title="No data to chart yet"
          description="Log a trip or two and this page fills up with species, lure and seasonal trends."
        />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Fish per trip"
              value={fishPerTrip ? fishPerTrip.toFixed(1) : "—"}
              icon={Fish}
            />
            <StatCard
              label="Species logged"
              value={String(data.summary.bySpecies.size)}
              icon={Waves}
            />
            <StatCard
              label="Avg length"
              value={
                data.summary.avgLength ? `${data.summary.avgLength.toFixed(1)}"` : "—"
              }
              icon={Ruler}
            />
            <StatCard
              label="Trips logged"
              value={String(trips.length)}
              icon={CalendarRange}
            />
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <ChartPanel
              title="Catches by species"
              subtitle="Top species by number of fish"
              data={data.species}
            >
              <BarChart data={data.species} label="Fish" />
            </ChartPanel>

            <ChartPanel
              title="Most productive lures"
              subtitle="Fish caught per lure"
              data={data.lures}
            >
              <BarChart data={data.lures} label="Fish" />
            </ChartPanel>

            <ChartPanel
              title="Seasonal pattern"
              subtitle="Fish caught per calendar month"
              data={monthly}
            >
              <LineChart data={monthly} label="Fish" />
            </ChartPanel>

            <ChartPanel
              title="Where you fish"
              subtitle="Trips by water type"
              data={data.water}
            >
              <DoughnutChart data={data.water} />
            </ChartPanel>

            <ChartPanel
              title="Catch frequency"
              subtitle="Fish per trip, most recent 20 outings"
              data={data.timeline}
            >
              <LineChart data={data.timeline} label="Fish" />
            </ChartPanel>
          </div>
        </>
      )}
    </div>
  );
}
