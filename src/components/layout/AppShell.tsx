import { Link } from "@tanstack/react-router";
import { BarChart3, Fish, Home, Plus, Trophy } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/trips", label: "Trips", icon: Fish },
  { to: "/stats", label: "Stats", icon: BarChart3 },
  { to: "/records", label: "Records", icon: Trophy },
] as const;

/** App chrome: sticky top nav on desktop, bottom bar on mobile, plus the FAB. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
              <Fish className="size-5" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Catch<span className="text-gradient">Log</span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 sm:flex">
            {nav.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                activeProps={{
                  className: "bg-secondary text-foreground",
                }}
                inactiveProps={{
                  className: "text-muted-foreground hover:text-foreground",
                }}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary/60"
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>

          <Link
            to="/trips/new"
            className="ml-auto hidden items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] sm:ml-2 sm:flex"
          >
            <Plus className="size-4" />
            Log trip
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6 sm:pb-16">
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/85 backdrop-blur-xl sm:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="flex flex-1 flex-col items-center gap-1 rounded-lg py-1 text-[11px] font-medium"
            >
              <Icon className="size-5" />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Floating action button */}
      <Link
        to="/trips/new"
        aria-label="Log a fishing trip"
        className="fixed bottom-20 right-5 z-40 grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-float)] transition-transform hover:scale-105 active:scale-95 sm:hidden"
      >
        <Plus className="size-6" />
      </Link>
    </div>
  );
}
