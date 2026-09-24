import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Bucket } from "../../types";
import { getBucketBarColor } from "../../theme/categories";
import { fmt } from "../../utils/format";

type Props = {
  buckets: Bucket[];
  txnCount?: number;
  total?: number;
};

export function AmountDistributionChart({ buckets, txnCount, total }: Props) {
  if (!buckets.length) return null;

  const summary =
    txnCount != null && total != null
      ? `共 ${txnCount} 笔，合计 ${fmt(total)}`
      : null;

  return (
    <div className="dash-card amount-distribution-section">
      <h3 className="dash-card-title">单笔金额区间分布（合并前 · 9 档）</h3>
      {summary && (
        <p className="muted amount-distribution-summary">
          区间左闭右开，单位：元。{summary}。
        </p>
      )}
      <div className="amount-distribution-charts">
        <div className="amount-dist-chart-cell">
          <h4 className="amount-dist-chart-label">笔数（笔）</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={buckets}
              margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
            >
              <CartesianGrid
                stroke="var(--grid-line)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(v: number, _n, item) => [
                  `${v} 笔`,
                  item.payload.label,
                ]}
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow)",
                }}
              />
              <Bar
                dataKey="count"
                name="笔数"
                radius={[4, 4, 0, 0]}
              >
                {buckets.map((b, i) => (
                  <Cell key={b.label} fill={getBucketBarColor(i)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="amount-dist-chart-cell">
          <h4 className="amount-dist-chart-label">金额合计（元）</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={buckets}
              margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
            >
              <CartesianGrid
                stroke="var(--grid-line)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))}
              />
              <Tooltip
                formatter={(v: number, _n, item) => [
                  fmt(v),
                  item.payload.label,
                ]}
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow)",
                }}
              />
              <Bar
                dataKey="amount"
                name="金额"
                radius={[4, 4, 0, 0]}
              >
                {buckets.map((b, i) => (
                  <Cell key={b.label} fill={getBucketBarColor(i)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
