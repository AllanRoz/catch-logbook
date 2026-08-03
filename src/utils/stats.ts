// Pure derivation helpers. Keeping these outside React means they are trivially
// testable and can be memoised by callers without re-render side effects.

import type { Trip } from "@/lib/types";

export const totalFish = (trip: Trip) =>
  trip.catches.reduce((sum, c) => sum + (c.count || 0), 0);

const toMinutes = (hhmm: string) => {
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export function tripDurationHours(trip: Trip) {
  if (!trip.startTime || !trip.endTime) return null;
  const mins = toMinutes(trip.endTime) - toMinutes(trip.startTime);
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

// --- Milestone 3 derivations -------------------------------------------------

export interface Counted {
  label: string;
  value: number;
}

const topN = (map: Map<string, number>, n: number): Counted[] =>
  [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([label, value]) => ({ label, value }));

/** Fish caught per species, largest first. */
export function speciesBreakdown(trips: Trip[], limit = 8): Counted[] {
  const map = new Map<string, number>();
  for (const t of trips)
    for (const c of t.catches) {
      if (!c.species) continue;
      map.set(c.species, (map.get(c.species) ?? 0) + (c.count || 0));
    }
  return topN(map, limit);
}

/** Fish caught per lure — answers "what is actually working". */
export function lureBreakdown(trips: Trip[], limit = 8): Counted[] {
  const map = new Map<string, number>();
  for (const t of trips)
    for (const c of t.catches) {
      const lure = c.lure?.trim();
      if (!lure) continue;
      map.set(lure, (map.get(lure) ?? 0) + (c.count || 0));
    }
  return topN(map, limit);
}

/** Trips grouped by water type. */
export function waterBreakdown(trips: Trip[]): Counted[] {
  const map = new Map<string, number>();
  for (const t of trips) map.set(t.waterType, (map.get(t.waterType) ?? 0) + 1);
  return [...map.entries()].map(([label, value]) => ({ label, value }));
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Fish per calendar month across all years — reveals seasonal patterns. */
export function monthlyCatches(trips: Trip[]): Counted[] {
  const totals = new Array(12).fill(0) as number[];
  for (const t of trips) {
    const month = Number(t.date.slice(5, 7)) - 1;
    if (month >= 0 && month < 12) totals[month]! += totalFish(t);
  }
  return MONTHS.map((label, i) => ({ label, value: totals[i]! }));
}

/** Fish per trip over time, oldest first. */
export function catchesOverTime(trips: Trip[], limit = 20): Counted[] {
  return [...trips]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-limit)
    .map((t) => ({ label: t.date.slice(5), value: totalFish(t) }));
}

export interface CatchRecord {
  species: string;
  value: number;
  tripId: string;
  location: string;
  date: string;
}

export interface Records {
  heaviest: CatchRecord | null;
  longest: CatchRecord | null;
  bestTrip: { tripId: string; location: string; date: string; fish: number } | null;
  longestSession: { tripId: string; location: string; date: string; hours: number } | null;
  speciesRecords: CatchRecord[];
}

/** Personal bests derived from the log — never stored, always recomputed. */
export function computeRecords(trips: Trip[]): Records {
  let heaviest: CatchRecord | null = null;
  let longest: CatchRecord | null = null;
  const perSpecies = new Map<string, CatchRecord>();

  for (const t of trips) {
    for (const c of t.catches) {
      const base = { tripId: t.id, location: t.location, date: t.date };
      if (c.weight) {
        const rec = { ...base, species: c.species || "Unknown", value: c.weight };
        if (!heaviest || rec.value > heaviest.value) heaviest = rec;
        const cur = perSpecies.get(rec.species);
        if (!cur || rec.value > cur.value) perSpecies.set(rec.species, rec);
      }
      if (c.length) {
        const rec = { ...base, species: c.species || "Unknown", value: c.length };
        if (!longest || rec.value > longest.value) longest = rec;
      }
    }
  }

  let bestTrip: Records["bestTrip"] = null;
  let longestSession: Records["longestSession"] = null;
  for (const t of trips) {
    const fish = totalFish(t);
    if (fish > 0 && (!bestTrip || fish > bestTrip.fish))
      bestTrip = { tripId: t.id, location: t.location, date: t.date, fish };
    const hours = tripDurationHours(t);
    if (hours && (!longestSession || hours > longestSession.hours))
      longestSession = { tripId: t.id, location: t.location, date: t.date, hours };
  }

  return {
    heaviest,
    longest,
    bestTrip,
    longestSession,
    speciesRecords: [...perSpecies.values()].sort((a, b) => b.value - a.value),
  };
}
