// Core domain model for CatchLog.
// Kept as plain serializable objects so the whole state can round-trip
// through JSON.stringify -> localStorage -> JSON.parse with no rehydration.

export type WaterType = "lake" | "river" | "pond" | "ocean";
export type WaterClarity = "clear" | "stained" | "murky";

export interface Catch {
  id: string;
  species: string;
  count: number;
  /** inches */
  length?: number;
  /** pounds */
  weight?: number;
  lure?: string;
  rod?: string;
  reel?: string;
  technique?: string;
  released: boolean;
}

export interface Trip {
  id: string;
  date: string; // ISO yyyy-mm-dd
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  location: string;
  coordinates?: string;
  waterType: WaterType;
  weather?: string;
  waterClarity?: WaterClarity;
  waterTemp?: number;
  catches: Catch[];
  notes?: string;
  memorableMoments?: string;
  lessonsLearned?: string;
  createdAt: string;
  updatedAt: string;
}
