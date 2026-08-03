import { useNavigate } from "react-router-dom";
import { TripForm, emptyTrip } from "@/components/trips/TripForm";
import { useTrips } from "@/context/TripsContext";

export default function NewTripPage() {
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
        onCancel={() => navigate("/trips")}
        onSubmit={(draft) => {
          addTrip(draft);
          navigate("/trips");
        }}
      />
    </div>
  );
}
