// Import / export panel.
//
// Everything lives in localStorage, so a JSON file is the only backup story.
// Export writes a download; import can either merge (skipping ids that already
// exist) or replace the whole log.

import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { useTrips } from "@/context/TripsContext";
import type { Trip } from "@/lib/types";
import { exportTripsJSON, newId, parseImportedJSON } from "@/utils/storage";

type Status = { kind: "ok" | "error"; message: string } | null;

/** Minimal shape check so a stray JSON file can't corrupt the log. */
function isTrip(value: unknown): value is Trip {
  const t = value as Partial<Trip> | null;
  return (
    !!t &&
    typeof t === "object" &&
    typeof t.date === "string" &&
    typeof t.location === "string" &&
    Array.isArray(t.catches)
  );
}

function normalise(trips: unknown[]): Trip[] {
  const now = new Date().toISOString();
  return trips.filter(isTrip).map((t) => ({
    ...t,
    id: t.id || newId(),
    createdAt: t.createdAt || now,
    updatedAt: t.updatedAt || now,
    catches: t.catches.map((c) => ({ ...c, id: c.id || newId() })),
  }));
}

export function DataTransfer() {
  const { trips, replaceAll } = useTrips();
  const [status, setStatus] = useState<Status>(null);
  const [mode, setMode] = useState<"merge" | "replace">("merge");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const blob = new Blob([exportTripsJSON(trips)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `catchlog-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus({
      kind: "ok",
      message: `Exported ${trips.length} trip${trips.length === 1 ? "" : "s"}.`,
    });
  };

  const handleFile = async (file: File) => {
    try {
      const incoming = normalise(parseImportedJSON(await file.text()));
      if (incoming.length === 0) {
        setStatus({ kind: "error", message: "No valid trips found in that file." });
        return;
      }
      if (mode === "replace") {
        replaceAll(incoming);
        setStatus({ kind: "ok", message: `Replaced log with ${incoming.length} trips.` });
      } else {
        const seen = new Set(trips.map((t) => t.id));
        const added = incoming.filter((t) => !seen.has(t.id));
        replaceAll(
          [...added, ...trips].sort((a, b) => b.date.localeCompare(a.date)),
        );
        setStatus({
          kind: "ok",
          message: `Added ${added.length} new trip${added.length === 1 ? "" : "s"} (${
            incoming.length - added.length
          } already in the log).`,
        });
      }
    } catch {
      setStatus({ kind: "error", message: "That file isn't a valid CatchLog export." });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <section className="panel space-y-4 p-5">
      <div>
        <h2 className="font-display text-lg font-semibold">Backup &amp; restore</h2>
        <p className="text-sm text-muted-foreground">
          Your log lives only in this browser. Export a JSON file to keep it safe or
          move it to another device.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleExport}
          disabled={trips.length === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          <Download className="size-4" />
          Export JSON
        </button>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/60"
        >
          <Upload className="size-4" />
          Import JSON
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-label="Import CatchLog JSON file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>On import</span>
          <select
            className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/25"
            value={mode}
            onChange={(e) => setMode(e.target.value as "merge" | "replace")}
          >
            <option value="merge">Merge with existing trips</option>
            <option value="replace">Replace everything</option>
          </select>
        </label>
      </div>

      {status ? (
        <p
          className={`text-sm ${
            status.kind === "ok" ? "text-primary" : "text-destructive"
          }`}
        >
          {status.message}
        </p>
      ) : null}
    </section>
  );
}
