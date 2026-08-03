import { useParams, useNavigate } from "react-router-dom";
import { TripForm } from "@/components/trips/TripForm";
import { useTrips } from "@/context/TripsContext";

export default function EditTripPage() {
  const { id } = useParams<{ id: string }>();
  const { trips, hydrated, updateTrip } = useTrips();
  const navigate = useNavigate();
  const trip = trips.find((t) => t.id === id);

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
        onCancel={() => navigate("/trips")}
        onSubmit={(next) => {
          updateTrip(trip.id, next);
          navigate("/trips");
        }}
      />
    </div>
  );
}
