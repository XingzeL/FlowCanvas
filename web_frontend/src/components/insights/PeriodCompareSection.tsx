import { useEffect, useMemo, useState } from "react";
import type { PeriodPayload } from "../../types";
import { fmt, fmtPct } from "../../utils/format";
import {
  comparePeriods,
  defaultPeriodKeys,
  type CompareMetricRow,
} from "../../utils/periodCompare";

type Props = {
  periods: PeriodPayload[];
};

function fmtValue(n: number, format: CompareMetricRow["format"]): string {
  if (format === "currency") return fmt(n);
  if (format === "pct") return `${n.toFixed(1)}%`;
  return String(n);
}

function fmtDelta(n: number, format: CompareMetricRow["format"]): string {
  if (format === "currency") {
    if (n === 0) return fmt(0);
    return `${n > 0 ? "+" : "-"}${fmt(Math.abs(n))}`;
  }
  if (format === "pct") {
    if (n === 0) return "0.0pp";
    return `${n > 0 ? "+" : ""}${n.toFixed(1)}pp`;
  }
  if (n === 0) return "0";
  return n > 0 ? `+${n}` : String(n);
}

function deltaTone(n: number): "up" | "down" | "" {
  if (n > 0) return "up";
  if (n < 0) return "down";
  return "";
}

function PeriodSelect({
  label,
  value,
  periods,
  excludeKey,
  onChange,
}: {
  label: string;
  value: string;
  periods: PeriodPayload[];
  excludeKey?: string;
  onChange: (key: string) => void;
}) {
  return (
    <label className="toolbar-field">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {periods.map((p) => (
          <option key={p.key} value={p.key} disabled={p.key === excludeKey}>
            {p.title} · {fmt(p.total)} · {p.txnCount} 笔
          </option>
        ))}
      </select>
    </label>
  );
}

export function PeriodCompareSection({ periods }: Props) {
  const defaults = useMemo(() => defaultPeriodKeys(periods), [periods]);
  const [keyA, setKeyA] = useState(() => defaults?.[0] ?? periods[0]?.key ?? "");
  const [keyB, setKeyB] = useState(() => defaults?.[1] ?? periods[1]?.key ?? "");

  useEffect(() => {
    if (!defaults) return;
    setKeyA(defaults[0]);
    setKeyB(defaults[1]);
  }, [defaults]);

  if (periods.length < 2) return null;

  const periodA = periods.find((p) => p.key === keyA);
  const periodB = periods.find((p) => p.key === keyB);
  if (!periodA || !periodB) return null;

  const rows = comparePeriods(periodA, periodB);

  return (
    <section className="section-block" id="compare">
      <h2 className="section-title">跨期对比</h2>
      <div className="dash-card">
        <div className="toolbar-row" style={{ marginBottom: 12 }}>
          <PeriodSelect
            label="区间 A"
            value={keyA}
            periods={periods}
            excludeKey={keyB}
            onChange={setKeyA}
          />
          <PeriodSelect
            label="区间 B"
            value={keyB}
            periods={periods}
            excludeKey={keyA}
            onChange={setKeyB}
          />
        </div>
        <p className="muted" style={{ margin: "0 0 12px" }}>
          {periodA.title} vs {periodB.title}
          {periodA.dateRange && periodB.dateRange
            ? ` · ${periodA.dateRange} / ${periodB.dateRange}`
            : ""}
        </p>
        <table className="data-table">
          <thead>
            <tr>
              <th>指标</th>
              <th className="num">A</th>
              <th className="num">B</th>
              <th className="num">差额</th>
              <th className="num">变化率</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const tone = deltaTone(row.delta);
              return (
                <tr key={row.key}>
                  <td>{row.label}</td>
                  <td className="num amount-cell">{fmtValue(row.valueA, row.format)}</td>
                  <td className="num amount-cell">{fmtValue(row.valueB, row.format)}</td>
                  <td className={`num amount-cell kpi-trend ${tone}`}>
                    {fmtDelta(row.delta, row.format)}
                  </td>
                  <td className={`num kpi-trend ${row.deltaPct != null ? deltaTone(row.deltaPct) : ""}`}>
                    {row.deltaPct != null ? fmtPct(row.deltaPct) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
