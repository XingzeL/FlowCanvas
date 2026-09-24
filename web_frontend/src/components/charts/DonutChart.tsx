import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { fmt } from "../../utils/format";

export type DonutSlice = {
  name: string;
  value: number;
  color: string;
};

type Props = {
  data: DonutSlice[];
  centerLabel: string;
  centerValue: string;
  height?: number;
};

export function DonutChart({
  data,
  centerLabel,
  centerValue,
  height = 280,
}: Props) {
  if (!data.length) return null;

  return (
    <div
      className="donut-chart-wrap"
      style={{ position: "relative", width: "100%", maxWidth: 320, margin: "0 auto" }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="58%"
            outerRadius="82%"
            paddingAngle={2}
            stroke="var(--card-bg, #fff)"
            strokeWidth={2}
          >
            {data.map((slice) => (
              <Cell key={slice.name} fill={slice.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [fmt(value), name]}
            contentStyle={{
              borderRadius: 10,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div
        className="donut-chart-center"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{centerLabel}</div>
        <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{centerValue}</div>
      </div>
    </div>
  );
}
