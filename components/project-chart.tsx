"use client";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { trend } from "@/lib/example";
import type { Audit } from "@/lib/types";
export function HealthChart({
  period,
  audit,
  history,
}: {
  period: string;
  audit: Audit;
  history: Audit[];
}) {
  const days = parseInt(period, 10),
    origin = new URL(audit.url).origin;
  const snapshots = [
    ...new Map([...history, audit].map((a) => [a.id, a])).values(),
  ]
    .filter(
      (a) =>
        a.status === "completed" &&
        a.score !== null &&
        new URL(a.url).origin === origin &&
        a.config.device === audit.config.device &&
        Date.parse(audit.createdAt) - Date.parse(a.createdAt) <=
          days * 86400000,
    )
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const data = audit.synthetic
    ? trend.slice(days === 7 ? -3 : days === 14 ? -5 : 0)
    : snapshots.map((a) => ({
        date: new Date(a.createdAt).toLocaleString("en-GB", {
          timeZone: "Asia/Jerusalem",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        score: a.score,
        seo: a.scores.find((s) => s.category === "SEO")?.value ?? null,
      }));
  const categoryData = audit.scores
    .filter((s) => s.value !== null)
    .map((s) => ({
      name:
        s.category === "GEO readiness"
          ? "GEO"
          : s.category === "Accessibility"
            ? "Access."
            : s.category,
      value: s.value,
    }));
  const bars = !data.length;
  return (
    <div
      className="health-chart"
      role="img"
      aria-label={
        audit.synthetic
          ? "Illustrative audit trend"
          : bars
            ? "Current measured category scores"
            : `${data.length} observed audit snapshots for this website and device`
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        {bars ? (
          <BarChart
            data={categoryData}
            margin={{ top: 18, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="#e5ebdf" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#607252", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#607252", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            <Bar
              name="Category score"
              dataKey="value"
              fill="#608353"
              radius={[4, 4, 0, 0]}
              maxBarSize={46}
            />
          </BarChart>
        ) : (
          <AreaChart
            data={data}
            margin={{ top: 20, right: 15, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#e5ebdf"
              strokeDasharray="3 4"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              minTickGap={50}
              tick={{ fill: "#607252", fontSize: 11 }}
              dy={8}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#607252", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid #dfe6d6",
                borderRadius: 8,
                fontSize: 13,
              }}
            />
            <Area
              name="Audit score"
              type="linear"
              dataKey="score"
              stroke="#347657"
              strokeWidth={2.5}
              fill="#eaf1e4"
              dot={{
                r: data.length === 1 ? 7 : 4,
                fill: "#347657",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              activeDot={{ r: 6 }}
            />
            <Area
              name="SEO"
              type="linear"
              dataKey="seo"
              stroke="#9aaf82"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="transparent"
              dot={false}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
