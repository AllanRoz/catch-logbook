import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trips/new")({
  head: () => ({
    meta: [
      { title: "Log a trip — CatchLog" },
      {
        name: "description",
        content:
          "Record a fishing trip: conditions, catches, gear, notes and photos.",
      },
      { property: "og:title", content: "Log a trip — CatchLog" },
      {
        property: "og:description",
        content: "Record conditions, catches, gear, notes and photos.",
      },
    ],
  }),
  component: NewTripPage,
});

function NewTripPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Log a fishing trip</h1>
      <p className="panel p-6 text-sm text-muted-foreground">
        The full trip form (conditions, catches, gear, notes, photos) is milestone 2.
      </p>
    </div>
  );
}
