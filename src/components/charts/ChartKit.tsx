// Chart.js wiring.
//
// Two constraints drive this file:
// 1. Charts must never render during SSR — chart.js needs a real <canvas>.
//    `mounted` gates the render so server HTML and first client paint match.
// 2. Colours come from the design tokens in styles.css, read once after mount
//    with getComputedStyle so light/dark themes stay in sync automatically.

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
);

export interface ChartTheme {
  palette: string[];
  grid: string;
  text: string;
}

const FALLBACK: ChartTheme = {
  palette: ["#4bb98a", "#e0a24a", "#5aa7d8", "#57bfc0", "#a58ad8"],
  grid: "rgba(255,255,255,0.08)",
  text: "rgba(255,255,255,0.7)",
};

function readTheme(): ChartTheme {
  if (typeof window === "undefined") return FALLBACK;
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) =>
    cs.getPropertyValue(name).trim() || fallback;
  return {
    palette: [
      v("--chart-1", FALLBACK.palette[0]!),
      v("--chart-2", FALLBACK.palette[1]!),
      v("--chart-3", FALLBACK.palette[2]!),
      v("--chart-4", FALLBACK.palette[3]!),
      v("--chart-5", FALLBACK.palette[4]!),
    ],
    grid: v("--border", FALLBACK.grid),
    text: v("--muted-foreground", FALLBACK.text),
  };
}

/** Returns null until mounted so callers can skip SSR rendering entirely. */
export function useChartTheme() {
  const [theme, setTheme] = useState<ChartTheme | null>(null);
  useEffect(() => setTheme(readTheme()), []);
  return theme;
}

function baseOptions(theme: ChartTheme, showLegend: boolean) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: "bottom",
        labels: { color: theme.text, boxWidth: 12, usePointStyle: true },
      },
    },
  };
}

function axisOptions(theme: ChartTheme) {
  const scale = {
    ticks: { color: theme.text },
    grid: { color: theme.grid },
    border: { color: theme.grid },
  };
  return { x: { ...scale, grid: { display: false } }, y: { ...scale, beginAtZero: true } };
}

export interface Datum {
  label: string;
  value: number;
}

/** Shared frame: heading, fixed height canvas area, empty fallback. */
export function ChartPanel({
  title,
  subtitle,
  data,
  children,
}: {
  title: string;
  subtitle?: string;
  data: Datum[];
  children: React.ReactNode;
}) {
  return (
    <section className="panel p-5">
      <header className="mb-4">
        <h2 className="font-display text-base font-semibold">{title}</h2>
        {subtitle ? (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </header>
      <div className="h-64">
        {data.length ? (
          children
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted-foreground">
            Not enough data yet.
          </div>
        )}
      </div>
    </section>
  );
}

export function BarChart({ data, label }: { data: Datum[]; label: string }) {
  const theme = useChartTheme();
  if (!theme) return null;
  return (
    <Bar
      data={{
        labels: data.map((d) => d.label),
        datasets: [
          {
            label,
            data: data.map((d) => d.value),
            backgroundColor: data.map(
              (_, i) => theme.palette[i % theme.palette.length]!,
            ),
            borderRadius: 8,
            maxBarThickness: 44,
          },
        ],
      }}
      options={
        {
          ...baseOptions(theme, false),
          scales: axisOptions(theme),
        } as never
      }
    />
  );
}

export function DoughnutChart({ data }: { data: Datum[] }) {
  const theme = useChartTheme();
  if (!theme) return null;
  return (
    <Doughnut
      data={{
        labels: data.map((d) => d.label),
        datasets: [
          {
            data: data.map((d) => d.value),
            backgroundColor: data.map(
              (_, i) => theme.palette[i % theme.palette.length]!,
            ),
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      }}
      options={{ ...baseOptions(theme, true), cutout: "62%" } as never}
    />
  );
}

export function LineChart({ data, label }: { data: Datum[]; label: string }) {
  const theme = useChartTheme();
  if (!theme) return null;
  return (
    <Line
      data={{
        labels: data.map((d) => d.label),
        datasets: [
          {
            label,
            data: data.map((d) => d.value),
            borderColor: theme.palette[0]!,
            backgroundColor: theme.palette[0]!,
            fill: false,
            tension: 0.35,
            pointRadius: 3,
          },
        ],
      }}
      options={
        {
          ...baseOptions(theme, false),
          scales: axisOptions(theme),
        } as never
      }
    />
  );
}
