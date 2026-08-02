import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Statistics — CatchLog" },
      {
        name: "description",
        content:
          "Charts for species, lures, seasons and catch frequency across your fishing log.",
      },
      { property: "og:title", content: "Statistics — CatchLog" },
      {
        property: "og:description",
        content: "Charts for species, lures, seasons and catch frequency.",
      },
    ],
  }),
  component: StatsPage,
});

function StatsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Statistics</h1>
      <p className="panel p-6 text-sm text-muted-foreground">
        Chart.js visualisations arrive in milestone 3.
      </p>
    </div>
  );
}
