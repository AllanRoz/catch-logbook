import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TripForm } from "@/components/trips/TripForm";
import { useTrips } from "@/context/TripsContext";

export const Route = createFileRoute("/trips/$id/edit")({
  head: () => ({
    meta: [
      { title: "Edit trip — CatchLog" },
      {
        name: "description",
        content: "Update the details, catches and notes of a logged fishing trip.",
      },
      { property: "og:title", content: "Edit trip — CatchLog" },
      {
        property: "og:description",
        content: "Update the details, catches and notes of a logged trip.",
      },
    ],
  }),
  component: EditTripPage,
});

function EditTripPage() {
  const { id } = Route.useParams();
  const { trips, hydrated, updateTrip } = useTrips();
  const navigate = useNavigate();
  const trip = trips.find((t) => t.id === id);

  // Trips load from localStorage after mount, so "missing" is only real
  // once hydration has finished.
  if (!hydrated) {
    return <p className="panel p-6 text-sm text-muted-foreground">Loading trip…</p>;
  }

  if (!trip) {
    return (
      <div className="panel space-y-2 p-6">
        <h1 className="font-display text-lg font-semibold">Trip not found</h1>
        <p className="text-sm text-muted-foreground">
          It may have been deleted from this browser.
        </p>
      </div>
    );
  }

  const { id: _id, createdAt: _c, updatedAt: _u, ...draft } = trip;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold">Edit trip</h1>
        <p className="text-sm text-muted-foreground">{trip.location}</p>
      </header>
      <TripForm
        initial={draft}
        submitLabel="Save changes"
        onCancel={() => navigate({ to: "/trips" })}
        onSubmit={(next) => {
          updateTrip(trip.id, next);
          navigate({ to: "/trips" });
        }}
      />
    </div>
  );
}
