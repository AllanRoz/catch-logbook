// Persistence layer.
//
// Architectural note: localStorage is synchronous, string-only and capped at
// roughly 5 MB per origin. Trips are text-only (no images are ever stored),
// so that budget comfortably holds many thousands of entries; writes still
// surface a quota error instead of failing silently.
//
// Every read is guarded for SSR (`typeof window`) because the app is
// server-rendered before hydration and `localStorage` does not exist there.

import type { Trip } from "@/lib/types";

const STORAGE_KEY = "catchlog.trips.v1";

export function isBrowser() {
  return typeof window !== "undefined";
}

export function loadTrips(): Trip[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Trip[]) : [];
  } catch {
    return [];
  }
}

export function saveTrips(trips: Trip[]): { ok: boolean; error?: string } {
  if (!isBrowser()) return { ok: false, error: "not in browser" };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    return { ok: true };
  } catch {
    return {
      ok: false,
      error:
        "Browser storage is full. Export your data as a backup, then remove some trips.",
    };
  }
}

export function exportTripsJSON(trips: Trip[]) {
  return JSON.stringify({ app: "CatchLog", version: 1, trips }, null, 2);
}

export function parseImportedJSON(raw: string): Trip[] {
  const parsed = JSON.parse(raw);
  const trips = Array.isArray(parsed) ? parsed : parsed?.trips;
  if (!Array.isArray(trips)) throw new Error("Unrecognised CatchLog file.");
  return trips as Trip[];
}

export function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
