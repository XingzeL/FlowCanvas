import { CalendarRange, Coins, Hash, TrendingUp, Wallet } from "lucide-react";
import type { ReportMeta, ReportTrends } from "../../types";
import { fmt, fmtPct } from "../../utils/format";

function TrendBadge({ value }: { value: number | null }) {
  if (value == null) return null;
  const up = value > 0;
  const down = value < 0;
  return (
    <span className={`kpi-trend ${up ? "up" : down ? "down" : ""}`}>
      {up ? "▲" : down ? "▼" : "—"} {fmtPct(value)} 较上期
    </span>
  );
}

type Props = {
  meta: ReportMeta;
  trends: ReportTrends;
};

export function KpiCards({ meta, trends }: Props) {
  const cards = [
    {
      icon: Wallet,
      label: "总支出",
      value: fmt(meta.total),
      trend: trends.totalPct,
    },
    {
      icon: Hash,
      label: "笔数",
      value: String(meta.txnCount),
      trend: trends.countPct,
    },
    {
      icon: TrendingUp,
      label: "区间均值",
      value: fmt(meta.periodAvg),
      trend: null,
    },
    {
      icon: CalendarRange,
      label: "最高区间",
      value: meta.maxPeriodLabel || "—",
      sub: meta.maxPeriodLabel ? fmt(meta.maxPeriodTotal) : undefined,
      trend: null,
    },
    {
      icon: Coins,
      label: `大额 ≥${meta.largeThreshold}`,
      value: `${meta.largeTxnCount} 笔`,
      sub: fmt(meta.largeTxnTotal),
      trend: null,
    },
  ];

  return (
    <section className="section-block" id="overview">
      <div className="kpi-grid">
        {cards.map((c) => (
          <div key={c.label} className="kpi-card">
            <div className="kpi-icon">
              <c.icon size={16} strokeWidth={2} />
            </div>
            <div className="kpi-label">{c.label}</div>
            <div className="kpi-value">{c.value}</div>
            {c.sub && <div className="kpi-sub">{c.sub}</div>}
            <TrendBadge value={c.trend} />
          </div>
        ))}
      </div>
    </section>
  );
}
