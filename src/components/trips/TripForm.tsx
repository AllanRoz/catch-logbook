// The one form used for both creating and editing a trip.
//
// Why a single component: create and edit differ only in their initial values
// and the submit handler, so sharing one controlled form keeps validation and
// layout in exactly one place.

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Catch, Trip, WaterClarity, WaterType } from "@/lib/types";
import { newId } from "@/utils/storage";

export type TripDraft = Omit<Trip, "id" | "createdAt" | "updatedAt">;

const WATER_TYPES: WaterType[] = ["lake", "river", "pond", "ocean"];
const CLARITIES: WaterClarity[] = ["clear", "stained", "murky"];

const field =
  "w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/25";
const labelCls = "block space-y-1.5 text-sm font-medium text-muted-foreground";

function emptyCatch(): Catch {
  return { id: newId(), species: "", count: 1, released: true };
}

export function emptyTrip(): TripDraft {
  return {
    date: new Date().toISOString().slice(0, 10),
    location: "",
    waterType: "lake",
    catches: [emptyCatch()],
  };
}

/** Strings from <input> are always strings; keep undefined for blanks. */
const num = (v: string) => (v === "" ? undefined : Number(v));

export function TripForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: TripDraft;
  submitLabel: string;
  onSubmit: (draft: TripDraft) => void;
  onCancel?: () => void;
}) {
  const [draft, setDraft] = useState<TripDraft>(initial);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof TripDraft>(key: K, value: TripDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  type CatchPatch = { [K in keyof Catch]?: Catch[K] | undefined };
  const setCatch = (id: string, patch: CatchPatch) =>
    setDraft((d) => ({
      ...d,
      catches: d.catches.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));

  const addCatch = () =>
    setDraft((d) => ({ ...d, catches: [...d.catches, emptyCatch()] }));

  const removeCatch = (id: string) =>
    setDraft((d) => ({ ...d, catches: d.catches.filter((c) => c.id !== id) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.date) return setError("Pick a date for the trip.");
    if (!draft.location.trim()) return setError("Where did you fish?");
    setError(null);
    onSubmit({
      ...draft,
      location: draft.location.trim(),
      // Drop blank catch rows so empty placeholders never pollute the stats.
      catches: draft.catches.filter((c) => c.species.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="panel space-y-4 p-5">
        <h2 className="font-display text-lg font-semibold">When &amp; where</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className={labelCls}>
            <span>Date</span>
            <input
              type="date"
              className={field}
              value={draft.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </label>
          <label className={labelCls}>
            <span>Start time</span>
            <input
              type="time"
              className={field}
              value={draft.startTime ?? ""}
              onChange={(e) => set("startTime", e.target.value || undefined)}
            />
          </label>
          <label className={labelCls}>
            <span>End time</span>
            <input
              type="time"
              className={field}
              value={draft.endTime ?? ""}
              onChange={(e) => set("endTime", e.target.value || undefined)}
            />
          </label>
          <label className={`${labelCls} sm:col-span-2`}>
            <span>Location</span>
            <input
              className={field}
              placeholder="Lake Minnewaska, north shore"
              value={draft.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </label>
          <label className={labelCls}>
            <span>Coordinates (optional)</span>
            <input
              className={field}
              placeholder="41.72, -74.24"
              value={draft.coordinates ?? ""}
              onChange={(e) => set("coordinates", e.target.value || undefined)}
            />
          </label>
        </div>
      </section>

      <section className="panel space-y-4 p-5">
        <h2 className="font-display text-lg font-semibold">Conditions</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          <label className={labelCls}>
            <span>Water type</span>
            <select
              className={field}
              value={draft.waterType}
              onChange={(e) => set("waterType", e.target.value as WaterType)}
            >
              {WATER_TYPES.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </label>
          <label className={labelCls}>
            <span>Water clarity</span>
            <select
              className={field}
              value={draft.waterClarity ?? ""}
              onChange={(e) =>
                set("waterClarity", (e.target.value || undefined) as WaterClarity)
              }
            >
              <option value="">—</option>
              {CLARITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className={labelCls}>
            <span>Water temp (°F)</span>
            <input
              type="number"
              className={field}
              value={draft.waterTemp ?? ""}
              onChange={(e) => set("waterTemp", num(e.target.value))}
            />
          </label>
          <label className={labelCls}>
            <span>Weather</span>
            <input
              className={field}
              placeholder="Overcast, light wind"
              value={draft.weather ?? ""}
              onChange={(e) => set("weather", e.target.value || undefined)}
            />
          </label>
        </div>
      </section>

      <section className="panel space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">Catches</h2>
          <button
            type="button"
            onClick={addCatch}
            className="inline-flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-surface-2"
          >
            <Plus className="size-4" />
            Add catch
          </button>
        </div>

        {draft.catches.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No catches recorded — a blank day still counts as data.
          </p>
        ) : null}

        <div className="space-y-4">
          {draft.catches.map((c, i) => (
            <div key={c.id} className="rounded-2xl border border-border/70 bg-surface/60 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Catch {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeCatch(c.id)}
                  aria-label={`Remove catch ${i + 1}`}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                <label className={`${labelCls} sm:col-span-2`}>
                  <span>Species</span>
                  <input
                    className={field}
                    placeholder="Largemouth bass"
                    value={c.species}
                    onChange={(e) => setCatch(c.id, { species: e.target.value })}
                  />
                </label>
                <label className={labelCls}>
                  <span>Count</span>
                  <input
                    type="number"
                    min={1}
                    className={field}
                    value={c.count}
                    onChange={(e) => setCatch(c.id, { count: Number(e.target.value) || 1 })}
                  />
                </label>
                <label className={labelCls}>
                  <span>Length (in)</span>
                  <input
                    type="number"
                    step="0.1"
                    className={field}
                    value={c.length ?? ""}
                    onChange={(e) => setCatch(c.id, { length: num(e.target.value) })}
                  />
                </label>
                <label className={labelCls}>
                  <span>Weight (lb)</span>
                  <input
                    type="number"
                    step="0.1"
                    className={field}
                    value={c.weight ?? ""}
                    onChange={(e) => setCatch(c.id, { weight: num(e.target.value) })}
                  />
                </label>
                <label className={labelCls}>
                  <span>Lure / bait</span>
                  <input
                    className={field}
                    value={c.lure ?? ""}
                    onChange={(e) => setCatch(c.id, { lure: e.target.value || undefined })}
                  />
                </label>
                <label className={labelCls}>
                  <span>Rod</span>
                  <input
                    className={field}
                    value={c.rod ?? ""}
                    onChange={(e) => setCatch(c.id, { rod: e.target.value || undefined })}
                  />
                </label>
                <label className={labelCls}>
                  <span>Reel</span>
                  <input
                    className={field}
                    value={c.reel ?? ""}
                    onChange={(e) => setCatch(c.id, { reel: e.target.value || undefined })}
                  />
                </label>
                <label className={labelCls}>
                  <span>Technique</span>
                  <input
                    className={field}
                    placeholder="Slow roll"
                    value={c.technique ?? ""}
                    onChange={(e) =>
                      setCatch(c.id, { technique: e.target.value || undefined })
                    }
                  />
                </label>
                <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-muted-foreground sm:col-span-3">
                  <input
                    type="checkbox"
                    className="size-4 accent-[oklch(0.72_0.13_158)]"
                    checked={c.released}
                    onChange={(e) => setCatch(c.id, { released: e.target.checked })}
                  />
                  Released
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel space-y-4 p-5">
        <h2 className="font-display text-lg font-semibold">Journal</h2>
        <label className={labelCls}>
          <span>Notes</span>
          <textarea
            rows={3}
            className={field}
            value={draft.notes ?? ""}
            onChange={(e) => set("notes", e.target.value || undefined)}
          />
        </label>
        <label className={labelCls}>
          <span>Memorable moments</span>
          <textarea
            rows={2}
            className={field}
            value={draft.memorableMoments ?? ""}
            onChange={(e) => set("memorableMoments", e.target.value || undefined)}
          />
        </label>
        <label className={labelCls}>
          <span>Lessons learned</span>
          <textarea
            rows={2}
            className={field}
            value={draft.lessonsLearned ?? ""}
            onChange={(e) => set("lessonsLearned", e.target.value || undefined)}
          />
        </label>
      </section>

      {error ? (
        <p className="panel border-destructive/50 p-3 text-sm text-destructive">{error}</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          {submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
