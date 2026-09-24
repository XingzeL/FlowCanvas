import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getCategoryColor, sortCategoryNames } from "../../theme/categories";
import { fmt } from "../../utils/format";

export type CategoryTrendSeries = { name: string; amounts: number[] };
export type CategoryTrend = { keys: string[]; series: CategoryTrendSeries[] };
export type StackMode = "absolute" | "percent";

type Props = {
  data: CategoryTrend;
  mode: StackMode;
};

export function StackedBarChart({ data, mode }: Props) {
  const { keys, series } = data;
  const names = useMemo(() => sortCategoryNames(series.map((s) => s.name)), [series]);

  const chartData = useMemo(() => {
    return keys.map((key, i) => {
      const row: Record<string, string | number> = { key };
      const total = series.reduce((sum, s) => sum + s.amounts[i], 0);
      for (const s of series) {
        const value = s.amounts[i] ?? 0;
        row[s.name] =
          mode === "percent" && total > 0
            ? Math.round((value / total) * 1000) / 10
            : value;
      }
      return row;
    });
  }, [keys, series, mode]);

  if (!keys.length || !series.length) return null;

  const chartHeight = Math.max(420, 360 + keys.length * 12);

  return (
    <div className="category-stack-chart">
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={chartData}
          margin={{ top: 12, right: 12, left: 4, bottom: 56 }}
          barCategoryGap="18%"
        >
          <CartesianGrid stroke="var(--grid-line)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="key"
            angle={-35}
            textAnchor="end"
            height={72}
            interval={0}
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            width={56}
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (mode === "percent" ? `${v}%` : String(v))}
          />
          <Tooltip
            formatter={(v: number, name: string) => [
              mode === "percent" ? `${v.toFixed(1)}%` : fmt(v),
              name,
            ]}
            contentStyle={{
              borderRadius: 10,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow)",
            }}
          />
          {names.map((name, i) => (
            <Bar
              key={name}
              dataKey={name}
              name={name}
              stackId="stack"
              fill={getCategoryColor(name, i)}
              maxBarSize={48}
              radius={i === names.length - 1 ? [4, 4, 0, 0] : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <div className="category-stack-legend" aria-hidden>
        {names.map((name, i) => (
          <span key={name} className="category-stack-legend-item">
            <span
              className="category-stack-legend-dot"
              style={{ background: getCategoryColor(name, i) }}
            />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
