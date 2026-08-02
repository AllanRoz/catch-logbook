import { createFileRoute } from "@tanstack/react-router";
import { EmptyState } from "@/components/ui/EmptyState";

export const Route = createFileRoute("/trips/")({
  head: () => ({
    meta: [
      { title: "Trip history — CatchLog" },
      {
        name: "description",
        content: "Browse, search and filter every fishing trip you have logged.",
      },
      { property: "og:title", content: "Trip history — CatchLog" },
      {
        property: "og:description",
        content: "Browse, search and filter every fishing trip you have logged.",
      },
    ],
  }),
  component: TripsPage,
});

function TripsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Trip history</h1>
      <EmptyState
        title="Trip cards land in milestone 2"
        description="Search, filters and editable trip cards come next."
      />
    </div>
  );
}
