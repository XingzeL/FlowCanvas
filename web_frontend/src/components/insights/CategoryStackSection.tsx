import { useState } from "react";
import {
  StackedBarChart,
  type CategoryTrend,
  type StackMode,
} from "../charts/StackedBarChart";

type Props = {
  categoryTrend: CategoryTrend;
};

const MODE_OPTIONS: { value: StackMode; label: string }[] = [
  { value: "absolute", label: "绝对值" },
  { value: "percent", label: "100%" },
];

export function CategoryStackSection({ categoryTrend }: Props) {
  const [mode, setMode] = useState<StackMode>("absolute");

  if (!categoryTrend.keys.length || !categoryTrend.series.length) return null;

  return (
    <div className="dash-card" id="catTrend">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <h3 className="dash-card-title" style={{ margin: 0 }}>分类趋势</h3>
        <div style={{ display: "flex", gap: 6 }}>
          {MODE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className="btn-secondary"
              style={
                mode === opt.value
                  ? {
                      borderColor: "var(--primary)",
                      color: "var(--primary)",
                      background: "var(--primary-soft)",
                    }
                  : undefined
              }
              onClick={() => setMode(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <p className="muted" style={{ margin: "0 0 12px" }}>
        各区间分类支出堆叠对比
        {mode === "percent" ? "（占比）" : "（金额）"}
      </p>
      <StackedBarChart data={categoryTrend} mode={mode} />
    </div>
  );
}
