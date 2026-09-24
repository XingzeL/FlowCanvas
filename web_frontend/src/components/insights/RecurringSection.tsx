import { categoryBg, getCategoryColor } from "../../theme/categories";
import { fmt } from "../../utils/format";

export type RecurringItem = {
  label: string;
  category: string;
  amount: number;
  cadence: "monthly" | "quarterly";
  annualEst: number;
  confidence: "high" | "medium";
  lastDate: string;
  kind?: "subscription" | "investment";
};

const CADENCE_LABEL: Record<RecurringItem["cadence"], string> = {
  monthly: "月付",
  quarterly: "季付",
};

function KindBadge({ kind }: { kind: RecurringItem["kind"] }) {
  const investment = kind === "investment";
  return (
    <span
      className="recurring-kind"
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        color: investment ? "#047857" : "#475569",
        background: investment ? "rgba(5, 150, 105, 0.12)" : "rgba(100, 116, 139, 0.12)",
      }}
    >
      {investment ? "定投" : "订阅"}
    </span>
  );
}

function ConfidenceBadge({ confidence }: { confidence: RecurringItem["confidence"] }) {
  const high = confidence === "high";
  return (
    <span
      className="recurring-confidence"
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        color: high ? "#1D4ED8" : "#64748B",
        background: high ? "rgba(37, 99, 235, 0.12)" : "rgba(100, 116, 139, 0.12)",
      }}
    >
      {high ? "高" : "疑似"}
    </span>
  );
}

function CategoryPill({ name, index }: { name: string; index: number }) {
  const color = getCategoryColor(name, index);
  return (
    <span className="category-pill" style={{ color, background: categoryBg(name, index) }}>
      {name}
    </span>
  );
}

export function RecurringSection({ items }: { items: RecurringItem[] }) {
  if (!items.length) return null;

  const catIndex = new Map<string, number>();
  const totalAnnual = items.reduce((sum, item) => sum + item.annualEst, 0);

  return (
    <div className="dash-card" id="recurring">
      <h3 className="dash-card-title">固定 / 订阅 / 定投</h3>
      <p className="muted" style={{ margin: "0 0 12px", fontSize: 13 }}>
        识别到 {items.length} 项周期性扣费（含纯花销模式下剔除的基金定投），年化合计约{" "}
        {fmt(totalAnnual)}
      </p>
      <table className="data-table">
        <thead>
          <tr>
            <th>对象</th>
            <th>类别</th>
            <th>周期</th>
            <th className="num">单次金额</th>
            <th className="num">年化估算</th>
            <th>类型</th>
            <th>最近扣款</th>
            <th>置信度</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            if (!catIndex.has(item.category)) catIndex.set(item.category, catIndex.size);
            return (
              <tr key={`${item.label}-${item.lastDate}-${i}`}>
                <td>{item.label}</td>
                <td>
                  <CategoryPill name={item.category} index={catIndex.get(item.category)!} />
                </td>
                <td>{CADENCE_LABEL[item.cadence]}</td>
                <td className="num amount-cell">{fmt(item.amount)}</td>
                <td className="num amount-cell">{fmt(item.annualEst)}</td>
                <td>
                  <KindBadge kind={item.kind} />
                </td>
                <td>{item.lastDate}</td>
                <td>
                  <ConfidenceBadge confidence={item.confidence} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
