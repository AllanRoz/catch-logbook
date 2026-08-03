import { Link } from "react-router-dom";
import {
  Copy,
  Droplets,
  MapPin,
  Pencil,
  Thermometer,
  Trash2,
} from "lucide-react";
import type { Trip } from "@/lib/types";
import { totalFish, tripDurationHours } from "@/utils/stats";

const iconBtn =
  "rounded-lg p-2 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground";

export function TripCard({
  trip,
  onDelete,
  onDuplicate,
}: {
  trip: Trip;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const fish = totalFish(trip);
  const hours = tripDurationHours(trip);
  const species = [
    ...new Set(trip.catches.map((c) => c.species).filter(Boolean)),
  ];

  return (
    <article className="panel panel-hover space-y-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            {new Date(`${trip.date}T00:00:00`).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <h3 className="mt-1 flex items-center gap-1.5 truncate font-display text-lg font-semibold">
            <MapPin className="size-4 shrink-0 text-muted-foreground" />
            {trip.location}
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            to={`/trips/${trip.id}/edit`}
            aria-label="Edit trip"
            className={iconBtn}
          >
            <Pencil className="size-4" />
          </Link>
          <button
            onClick={onDuplicate}
            aria-label="Duplicate trip"
            className={iconBtn}
          >
            <Copy className="size-4" />
          </button>
          <button
            onClick={onDelete}
            aria-label="Delete trip"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-full bg-secondary px-2.5 py-1 font-semibold text-secondary-foreground">
          {fish} fish
        </span>
        <span className="rounded-full bg-secondary px-2.5 py-1 capitalize">
          {trip.waterType}
        </span>
        {hours ? (
          <span className="rounded-full bg-secondary px-2.5 py-1">
            {hours.toFixed(1)} h
          </span>
        ) : null}
        {trip.waterClarity ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 capitalize">
            <Droplets className="size-3" />
            {trip.waterClarity}
          </span>
        ) : null}
        {trip.waterTemp ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1">
            <Thermometer className="size-3" />
            {trip.waterTemp}°F
          </span>
        ) : null}
        {trip.weather ? (
          <span className="rounded-full bg-secondary px-2.5 py-1">
            {trip.weather}
          </span>
        ) : null}
      </div>

      {species.length ? (
        <p className="text-sm text-foreground/85">{species.join(" · ")}</p>
      ) : (
        <p className="text-sm text-muted-foreground">No catches logged.</p>
      )}

      {trip.notes ? (
        <p className="line-clamp-2 text-sm text-muted-foreground">{trip.notes}</p>
      ) : null}
    </article>
  );
}
