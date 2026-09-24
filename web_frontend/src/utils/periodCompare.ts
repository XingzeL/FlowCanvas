import { sortCategoryNames } from "../theme/categories";
import type { PeriodPayload } from "../types";

export type CompareMetricRow = {
  key: string;
  label: string;
  valueA: number;
  valueB: number;
  delta: number;
  deltaPct: number | null;
  format: "currency" | "count" | "pct";
};

export function pctChange(from: number, to: number): number | null {
  if (from === 0) return to === 0 ? 0 : null;
  return ((to - from) / from) * 100;
}

export function defaultPeriodKeys(periods: PeriodPayload[]): [string, string] | null {
  if (periods.length < 2) return null;
  return [periods[periods.length - 2].key, periods[periods.length - 1].key];
}

export function comparePeriods(a: PeriodPayload, b: PeriodPayload): CompareMetricRow[] {
  const rows: CompareMetricRow[] = [
    {
      key: "total",
      label: "总支出",
      valueA: a.total,
      valueB: b.total,
      delta: b.total - a.total,
      deltaPct: pctChange(a.total, b.total),
      format: "currency",
    },
    {
      key: "txnCount",
      label: "笔数",
      valueA: a.txnCount,
      valueB: b.txnCount,
      delta: b.txnCount - a.txnCount,
      deltaPct: pctChange(a.txnCount, b.txnCount),
      format: "count",
    },
  ];

  const catA = new Map(a.categories.map((c) => [c.name, c]));
  const catB = new Map(b.categories.map((c) => [c.name, c]));
  const names = sortCategoryNames([...catA.keys(), ...catB.keys()]);

  for (const name of names) {
    const amountA = catA.get(name)?.amount ?? 0;
    const amountB = catB.get(name)?.amount ?? 0;
    rows.push({
      key: `${name}-amount`,
      label: `${name} · 金额`,
      valueA: amountA,
      valueB: amountB,
      delta: amountB - amountA,
      deltaPct: pctChange(amountA, amountB),
      format: "currency",
    });

    const pctA = catA.get(name)?.pct ?? 0;
    const pctB = catB.get(name)?.pct ?? 0;
    rows.push({
      key: `${name}-pct`,
      label: `${name} · 占比`,
      valueA: pctA,
      valueB: pctB,
      delta: pctB - pctA,
      deltaPct: null,
      format: "pct",
    });
  }

  return rows;
}
