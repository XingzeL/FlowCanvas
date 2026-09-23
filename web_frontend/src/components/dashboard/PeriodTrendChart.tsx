import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PeriodTotal } from "../../types";
import { fmt } from "../../utils/format";

type Props = {
  data: PeriodTotal[];
  pureSpending: boolean;
};

export function PeriodTrendChart({ data, pureSpending }: Props) {
  if (!data.length) return null;

  const chartData = data.map((d) => ({
    label: d.label,
    totalAll: d.totalAll,
    totalPure: d.totalPure,
  }));

  return (
    <div className="dash-card">
      <h3 className="dash-card-title">区间支出趋势</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
          <CartesianGrid stroke="var(--grid-line)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            angle={-35}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v: number) => fmt(v)}
            contentStyle={{
              borderRadius: 10,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow)",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, color: "var(--text-muted)" }}
          />
          {pureSpending ? (
            <>
              <Bar
                dataKey="totalAll"
                name="总支出"
                fill="var(--chart-all)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="totalPure"
                name="纯花销"
                fill="var(--chart-pure)"
                radius={[4, 4, 0, 0]}
              />
            </>
          ) : (
            <Bar
              dataKey="totalPure"
              name="支出"
              fill="var(--chart-pure)"
              radius={[4, 4, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
