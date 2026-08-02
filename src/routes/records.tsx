import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/records")({
  head: () => ({
    meta: [
      { title: "Personal bests — CatchLog" },
      {
        name: "description",
        content:
          "Your biggest, longest and heaviest fish plus your best single trip.",
      },
      { property: "og:title", content: "Personal bests — CatchLog" },
      {
        property: "og:description",
        content: "Your biggest, longest and heaviest fish, tracked automatically.",
      },
    ],
  }),
  component: RecordsPage,
});

function RecordsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Personal bests</h1>
      <p className="panel p-6 text-sm text-muted-foreground">
        Records are derived from your logged trips — coming in milestone 3.
      </p>
    </div>
  );
}
