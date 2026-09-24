import { useMemo, useState } from "react";
import { fmt } from "../../utils/format";

export type SpendingDay = { date: string; amount: number; count: number };

type Props = {
  days: SpendingDay[];
  maxAmount: number;
};

const WEEKDAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"];

function heatColor(amount: number, maxAmount: number): string {
  if (amount <= 0 || maxAmount <= 0) return "var(--surface-muted)";
  const ratio = Math.min(amount / maxAmount, 1);
  const pct = Math.round(12 + ratio * 88);
  return `color-mix(in srgb, var(--chart-pure) ${pct}%, var(--surface-muted))`;
}

function monthKeys(days: SpendingDay[]): string[] {
  if (!days.length) return [];
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const start = new Date(`${sorted[0].date}T00:00:00`);
  const end = new Date(`${sorted[sorted.length - 1].date}T00:00:00`);
  const months: string[] = [];
  const cur = new Date(start.getFullYear(), start.getMonth(), 1);
  const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
  while (cur <= endMonth) {
    months.push(
      `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}`,
    );
    cur.setMonth(cur.getMonth() + 1);
  }
  return months;
}

function monthTitle(ym: string): string {
  const [y, m] = ym.split("-");
  return `${y}年${Number(m)}月`;
}

type Cell = { date: string | null; day: SpendingDay | null };

function buildMonthCells(ym: string, dayMap: Map<string, SpendingDay>): Cell[] {
  const [year, month] = ym.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: Cell[] = [];
  for (let i = 0; i < first.getDay(); i++) {
    cells.push({ date: null, day: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ date, day: dayMap.get(date) ?? null });
  }
  return cells;
}

export function HeatmapCalendar({ days, maxAmount }: Props) {
  const [hovered, setHovered] = useState<SpendingDay | null>(null);
  const dayMap = useMemo(
    () => new Map(days.map((d) => [d.date, d])),
    [days],
  );
  const months = useMemo(() => monthKeys(days), [days]);

  if (!days.length) return null;

  return (
    <div>
      <p className="heatmap-hover-bar muted" aria-live="polite">
        {hovered
          ? `${hovered.date} · ${fmt(hovered.amount)} · ${hovered.count} 笔`
          : "\u00A0"}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {months.map((ym) => {
          const cells = buildMonthCells(ym, dayMap);
          return (
            <div key={ym}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                {monthTitle(ym)}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 3,
                  marginBottom: 4,
                }}
              >
                {WEEKDAY_LABELS.map((label) => (
                  <div
                    key={label}
                    style={{
                      fontSize: 10,
                      color: "var(--text-muted)",
                      textAlign: "center",
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className="day-calendar" style={{ marginBottom: 0 }}>
                {cells.map((cell, i) =>
                  cell.date ? (
                    <button
                      key={i}
                      type="button"
                      className={`day-cell ${cell.day ? "has-data" : ""}`}
                      style={{
                        background: cell.day
                          ? heatColor(cell.day.amount, maxAmount)
                          : "var(--surface-muted)",
                        borderColor: cell.day
                          ? "color-mix(in srgb, var(--chart-pure) 40%, var(--border))"
                          : "var(--border)",
                      }}
                      onMouseEnter={() => cell.day && setHovered(cell.day)}
                      onMouseLeave={() => setHovered(null)}
                      title={
                        cell.day
                          ? `${cell.date} ${fmt(cell.day.amount)} · ${cell.day.count} 笔`
                          : cell.date
                      }
                    >
                      <span>{cell.date.slice(8)}</span>
                    </button>
                  ) : (
                    <div key={i} className="day-cell empty" />
                  ),
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
