// Pure derivation helpers. Keeping these outside React means they are trivially
// testable and can be memoised by callers without re-render side effects.

import type { Trip } from "@/lib/types";

export const totalFish = (trip: Trip) =>
  trip.catches.reduce((sum, c) => sum + (c.count || 0), 0);

export function tripDurationHours(trip: Trip) {
  if (!trip.startTime || !trip.endTime) return null;
  const [sh, sm] = trip.startTime.split(":").map(Number);
  const [eh, em] = trip.endTime.split(":").map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  return mins > 0 ? mins / 60 : null;
}

export function summarize(trips: Trip[]) {
  const all = trips.flatMap((t) => t.catches);
  const fish = trips.reduce((s, t) => s + totalFish(t), 0);

  const lengths = all.map((c) => c.length).filter((n): n is number => !!n);
  const weights = all.map((c) => c.weight).filter((n): n is number => !!n);

  const bySpecies = new Map<string, number>();
  for (const c of all) {
    if (!c.species) continue;
    bySpecies.set(c.species, (bySpecies.get(c.species) ?? 0) + (c.count || 0));
  }
  const favoriteSpecies =
    [...bySpecies.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const biggest = all
    .filter((c) => c.weight)
    .sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))[0];

  const avg = (xs: number[]) =>
    xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;

  return {
    trips: trips.length,
    fish,
    favoriteSpecies,
    biggest: biggest ?? null,
    avgLength: avg(lengths),
    avgWeight: avg(weights),
    bySpecies,
  };
}
