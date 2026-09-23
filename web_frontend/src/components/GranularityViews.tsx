import { useMemo, useState } from "react";
import type { PeriodPayload } from "../types";
import { PeriodSection } from "./PeriodSection";

/** 周 / 3 天粒度：虚拟列表 + 默认只展开最近一块 */
export function VirtualPeriodList({
  periods,
  embedded = false,
}: {
  periods: PeriodPayload[];
  embedded?: boolean;
}) {
  const [expandedKey, setExpandedKey] = useState<string | null>(
    periods.length ? periods[periods.length - 1].key : null,
  );

  return (
    <div className={embedded ? "granularity-embedded" : "card"}>
      {!embedded && (
        <>
          <h2>小区间明细（{periods.length} 块）</h2>
          <p className="muted">默认展开最近一块；点击其他块标题可切换展开。</p>
        </>
      )}
      <div className="virtual-list">
        {periods.map((p) => (
          <PeriodSection
            key={p.key}
            period={p}
            open={expandedKey === p.key}
            onToggle={() => setExpandedKey(expandedKey === p.key ? null : p.key)}
          />
        ))}
      </div>
    </div>
  );
}

/** 日粒度：日历热力 + 点选单日展开 */
export function DayPeriodView({
  periods,
  embedded = false,
}: {
  periods: PeriodPayload[];
  embedded?: boolean;
}) {
  const byKey = useMemo(() => new Map(periods.map((p) => [p.key, p])), [periods]);
  const [selected, setSelected] = useState<string | null>(
    periods.length ? periods[periods.length - 1].key : null,
  );

  const dates = periods.map((p) => p.key).sort();
  const start = dates[0] ? new Date(dates[0]) : null;
  const end = dates[dates.length - 1] ? new Date(dates[dates.length - 1]) : null;

  const cells: { date: string | null; key: string | null }[] = [];
  if (start && end) {
    const pad = start.getDay();
    for (let i = 0; i < pad; i++) cells.push({ date: null, key: null });
    const cur = new Date(start);
    while (cur <= end) {
      const key = cur.toISOString().slice(0, 10);
      cells.push({ date: key, key: byKey.has(key) ? key : null });
      cur.setDate(cur.getDate() + 1);
    }
  }

  const selectedPeriod = selected ? byKey.get(selected) : undefined;

  return (
    <div className={embedded ? "granularity-embedded" : "card"}>
      {!embedded && (
        <>
          <h2>日粒度 · 日历点选</h2>
          <p className="muted">仅显示有消费的日子（{periods.length} 天）；点击高亮日期查看明细。</p>
        </>
      )}
      <div className="day-calendar">
        {cells.map((c, i) =>
          c.date ? (
            <button
              key={i}
              type="button"
              className={`day-cell ${c.key ? "has-data" : ""} ${selected === c.key ? "selected" : ""}`}
              disabled={!c.key}
              onClick={() => c.key && setSelected(c.key)}
            >
              <span>{c.date!.slice(8)}</span>
              {c.key && <span>{byKey.get(c.key)!.total.toFixed(0)}</span>}
            </button>
          ) : (
            <div key={i} className="day-cell empty" />
          ),
        )}
      </div>
      {selectedPeriod && <PeriodSection period={selectedPeriod} defaultOpen />}
    </div>
  );
}
