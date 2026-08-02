// Single source of truth for trip data.
//
// Why context + reducer-ish callbacks instead of a data-fetching library:
// there is no server. State lives in memory, mirrors to localStorage on every
// mutation, and is read once on mount (never during SSR) to avoid hydration
// mismatches.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Trip } from "@/lib/types";
import { loadTrips, newId, saveTrips } from "@/utils/storage";

interface TripsContextValue {
  trips: Trip[];
  hydrated: boolean;
  storageError: string | null;
  addTrip: (trip: Omit<Trip, "id" | "createdAt" | "updatedAt">) => Trip;
  updateTrip: (id: string, patch: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  duplicateTrip: (id: string) => Trip | null;
  replaceAll: (trips: Trip[]) => void;
}

const TripsContext = createContext<TripsContextValue | null>(null);

export function TripsProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  // Read after mount only — localStorage is unavailable during SSR.
  useEffect(() => {
    setTrips(loadTrips());
    setHydrated(true);
  }, []);

  const commit = useCallback((next: Trip[]) => {
    setTrips(next);
    const res = saveTrips(next);
    setStorageError(res.ok ? null : (res.error ?? null));
  }, []);

  const addTrip: TripsContextValue["addTrip"] = useCallback(
    (data) => {
      const now = new Date().toISOString();
      const trip: Trip = { ...data, id: newId(), createdAt: now, updatedAt: now };
      commit([trip, ...loadTrips()]);
      return trip;
    },
    [commit],
  );

  const updateTrip = useCallback<TripsContextValue["updateTrip"]>(
    (id, patch) => {
      commit(
        loadTrips().map((t) =>
          t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t,
        ),
      );
    },
    [commit],
  );

  const deleteTrip = useCallback<TripsContextValue["deleteTrip"]>(
    (id) => commit(loadTrips().filter((t) => t.id !== id)),
    [commit],
  );

  const duplicateTrip = useCallback<TripsContextValue["duplicateTrip"]>(
    (id) => {
      const all = loadTrips();
      const source = all.find((t) => t.id === id);
      if (!source) return null;
      const now = new Date().toISOString();
      const copy: Trip = { ...source, id: newId(), createdAt: now, updatedAt: now };
      commit([copy, ...all]);
      return copy;
    },
    [commit],
  );

  const replaceAll = useCallback<TripsContextValue["replaceAll"]>(
    (next) => commit(next),
    [commit],
  );

  const value = useMemo(
    () => ({
      trips,
      hydrated,
      storageError,
      addTrip,
      updateTrip,
      deleteTrip,
      duplicateTrip,
      replaceAll,
    }),
    [
      trips,
      hydrated,
      storageError,
      addTrip,
      updateTrip,
      deleteTrip,
      duplicateTrip,
      replaceAll,
    ],
  );

  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>;
}

export function useTrips() {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error("useTrips must be used inside <TripsProvider>");
  return ctx;
}
