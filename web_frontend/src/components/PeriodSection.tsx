import { useState } from "react";
import type { PeriodPayload } from "../types";
import { fmt } from "../utils/format";
import {
  formatDetailLimitMeta,
  sliceDetailRows,
  type CategoryDetailLimit,
} from "../utils/categoryDetailLimit";

type Props = {
  period: PeriodPayload;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: () => void;
  detailLimit?: CategoryDetailLimit;
};

export function PeriodSection({
  period,
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
  detailLimit = 20,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const toggle = () => {
    if (onToggle) onToggle();
    else setInternalOpen(!internalOpen);
  };
  const topCats = period.categories
    .slice(0, 2)
    .map((c) => c.name)
    .join("+");
  const purePctText =
    period.purePct != null ? ` · 纯花销占比 ${period.purePct}%` : "";

  return (
    <div className="period-card">
      <div className="period-header" onClick={toggle}>
        <div>
          <strong>{period.title}</strong>
          <div className="muted">
            {period.txnCount} 笔{purePctText}
          </div>
        </div>
        <div className="period-header-right">
          <strong className="period-amount">{fmt(period.total)}</strong>
          <span className="period-chevron muted">{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <div className="period-body">
          <p className="muted">{period.subtitle}</p>
          <p className="muted">
            日均 {fmt(period.dailyAvg)} · 最高单笔 {fmt(period.maxTxn)} · 峰值 {period.peakNote}
            {period.grossTotal != null && period.grossTotal !== period.total
              ? ` · 总支出 ${fmt(period.grossTotal)}`
              : ""}
            {topCats ? ` · Top2 ${topCats} ${period.top2Pct}%` : ""}
          </p>
          <table className="data">
            <thead>
              <tr>
                <th>类别</th>
                <th className="num">金额</th>
                <th className="num">占比</th>
                <th className="num">笔数</th>
              </tr>
            </thead>
            <tbody>
              {period.categories.map((c) => (
                <tr key={c.name}>
                  <td>{c.name}</td>
                  <td className="num">{fmt(c.amount)}</td>
                  <td className="num">{c.pct}%</td>
                  <td className="num">{c.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {period.details.map((d) => {
            const cat = period.categories.find((c) => c.name === d.name);
            const totalRows = d.rows.length;
            const visibleRows = sliceDetailRows(d.rows, detailLimit);
            const amountLabel = cat ? fmt(cat.amount) : "—";
            const meta = formatDetailLimitMeta(visibleRows.length, totalRows, amountLabel);

            return (
              <div key={d.name} style={{ marginTop: 12 }}>
                <h3>{d.name}</h3>
                <p className="muted">{meta}</p>
                <table className="data">
                  <tbody>
                    {visibleRows.map((row, i) => (
                      <tr key={i}>
                        <td>{row[0]}</td>
                        <td className="num">{row[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
