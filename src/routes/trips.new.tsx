import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TripForm, emptyTrip } from "@/components/trips/TripForm";
import { useTrips } from "@/context/TripsContext";

export const Route = createFileRoute("/trips/new")({
  head: () => ({
    meta: [
      { title: "Log a trip — CatchLog" },
      {
        name: "description",
        content: "Record a fishing trip: conditions, catches, gear and notes.",
      },
      { property: "og:title", content: "Log a trip — CatchLog" },
      {
        property: "og:description",
        content: "Record conditions, catches, gear and notes.",
      },
    ],
  }),
  component: NewTripPage,
});

function NewTripPage() {
  const { addTrip } = useTrips();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold">Log a fishing trip</h1>
        <p className="text-sm text-muted-foreground">
          Everything stays in this browser — nothing is uploaded.
        </p>
      </header>
      <TripForm
        initial={emptyTrip()}
        submitLabel="Save trip"
        onCancel={() => navigate({ to: "/trips" })}
        onSubmit={(draft) => {
          addTrip(draft);
          navigate({ to: "/trips" });
        }}
      />
    </div>
  );
}
